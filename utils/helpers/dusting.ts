import axios from 'axios';
import dotenv from 'dotenv';
import { KNOWN_DUSTING_WALLETS, DUSTING_SQL } from '../constants';

dotenv.config();

const FLIPSIDE_API_KEY = process.env.FLIPSIDE_API_KEY;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const flipside = axios.create({
  baseURL: 'https://api-v2.flipsidecrypto.xyz',
  headers: {
    Authorization: `Bearer ${FLIPSIDE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export async function getDusterWallets(): Promise<string[]> {
  if (!FLIPSIDE_API_KEY) {
    console.warn('FLIPSIDE_API_KEY not set, using fallback wallets');
    return KNOWN_DUSTING_WALLETS;
  }

  try {
    console.log('Submitting query to Flipside...');
    const submitRes = await flipside.post('/queries', {
      sql: DUSTING_SQL,
      ttlMinutes: 10,
      cache: true,
    });

    const queryId = submitRes.data.queryId;

    const timeout = 60000;
    const interval = 2000;
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const statusRes = await flipside.get(`/queries/${queryId}`);
      const status = statusRes.data.status;

      if (status === 'FINISHED') break;
      if (['FAILED', 'CANCELLED'].includes(status)) {
        throw new Error(`Query failed with status: ${status}`);
      }

      console.log(`Query status: ${status}. Waiting...`);
      await new Promise((res) => setTimeout(res, interval));
    }

    console.log('Query complete. Fetching results...');
    const resultsRes = await flipside.get(`/queries/${queryId}/results`);
    const records = resultsRes.data.records || [];

    const dusterWallets = records.map((r: any) => r.DUSTER_WALLET);
    console.log(`Found ${dusterWallets.length} potential dusting wallets`);

    return dusterWallets;
  } catch (err) {
    console.error(`Error querying Flipside API: ${err}`);
    return KNOWN_DUSTING_WALLETS;
  }
}

export async function getWalletTransactions(
  walletAddress: string,
  heliusApiKey: string = HELIUS_API_KEY!,
  limit: number = 100
) {
  if (!heliusApiKey) throw new Error('HELIUS_API_KEY not found');

  const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions`;
  const params = {
    'api-key': heliusApiKey,
    limit,
    type: 'TRANSFER',
  };

  const response = await axios.get(url, { params });
  if (response.status !== 200) {
    throw new Error(`Helius error: ${response.statusText}`);
  }

  const transfers: {
    tx_id: string;
    from: string;
    to: string;
    amount: string;
  }[] = [];

  console.log(`Helius API dusting length: ${response.data.length}`);

  for (const tx of response.data) {
    const txId = tx.signature;
    for (const transfer of tx.nativeTransfers || []) {
      if (transfer.toUserAccount.toLowerCase() === walletAddress.toLowerCase()) {
        transfers.push({
          tx_id: txId,
          from: transfer.fromUserAccount,
          to: transfer.toUserAccount,
          amount: transfer.amount,
        });
      }
    }
  }

  console.log(`Received transfers length: ${transfers.length}`);

  return transfers;
}

function deduplicateDustSenders(senders: string[]) {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const sender of senders) {
    if (!seen.has(sender)) {
      seen.add(sender);
      deduped.push(sender);
    }
  }

  return deduped;
}

export async function checkWalletDusting(
  walletAddress: string,
  heliusApiKey: string = HELIUS_API_KEY!,
  txLimit = 100
) {
  console.log(`Checking wallet dusting for ${walletAddress}`);

  const results: Record<string, any> = {
    score: 0,
    total_transactions_analyzed: 0,
    dusting_count: 0,
    top_duster_addresses: [],
    summary: '',
  };

  const recentTransfers = await getWalletTransactions(walletAddress, heliusApiKey, txLimit);

  if (!recentTransfers || !recentTransfers.length) {
    console.log('No recent transactions found.');
    return {};
  }
  console.log(`Found ${recentTransfers.length} recent transactions`);

  const dusterWallets = await getDusterWallets();

  let dustingCount = 0;

  results.total_transactions_analyzed = recentTransfers.length;

  const topDusterAddresses = [];
  for (const tx of recentTransfers) {
    const sender = tx.from;
    const isDusting = dusterWallets.includes(sender);

    if (isDusting) {
      dustingCount++;
      topDusterAddresses.push(sender);
    }

    console.log(`${tx.from.slice(0, 12)}...${tx.from.slice(-8)}: ${isDusting ? '🚨 DUSTING' : '✅ clean'}`);
  }

  results.top_duster_addresses = deduplicateDustSenders(topDusterAddresses);
  results.dusting_count = dustingCount;
  results.score = dustingCount / recentTransfers.length;
  results.summary = `Found ${dustingCount} dusting txs from ${recentTransfers.length} incoming txs`;

  console.log(`Dusting analysis results: ${JSON.stringify(results)}`);
  return results;
}
