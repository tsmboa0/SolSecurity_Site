import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  NATIVE_DUST_THRESHOLD: 0.00001,
  TOKEN_DUST_THRESHOLD: 0.01,
  MIN_TRANSACTION_HISTORY: 100,
};

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

function createHttpClient(): AxiosInstance {
  return axios.create({
    timeout: 60000,
    httpsAgent: new (require('https').Agent)({ keepAlive: true }),
  });
}

export async function getWalletTransactions(walletAddress: string, limit: number = 100) {
  const client = createHttpClient();
  const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions`;
  const params = {
    'api-key': HELIUS_API_KEY,
    limit,
    type: 'TRANSFER',
  };

  try {
    const response = await client.get(url, { params });
    const transactions = response.data;

    if (!Array.isArray(transactions)) {
      throw new Error('Expected list of transactions from Helius API');
    }

    const transfers: any[] = [];

    for (const tx of transactions) {

      for (const transfer of tx.nativeTransfers || []) {
        if (
          typeof transfer === 'object' &&
          (transfer.fromUserAccount === walletAddress || transfer.toUserAccount === walletAddress)
        ) {
          transfers.push({
            from: transfer.fromUserAccount,
            to: transfer.toUserAccount,
            amount: Number(transfer.amount) / 1_000_000_000,
            type: 'native',
          });
        }
      }

      for (const transfer of tx.tokenTransfers || []) {
        if (
          typeof transfer === 'object' &&
          (transfer.fromUserAccount === walletAddress || transfer.toUserAccount === walletAddress)
        ) {
          transfers.push({
            from: transfer.fromUserAccount,
            to: transfer.toUserAccount,
            amount: Number(transfer.tokenAmount),
            type: 'token',
          });
        }
      }
    }

    return transfers;
  } catch (error) {
    throw new Error(`Helius error when fetching wallet transactions: ${error}`);
  }
}

export function extractSendersAndRecipients(transfers: any[], walletAddress: string) {
  const recipients: string[] = [];
  const sendersDetails: any[] = [];

  for (const transfer of transfers) {
    if (transfer.from === walletAddress) {
      recipients.push(transfer.to);
    } else {
      sendersDetails.push({
        address: transfer.from,
        amount: transfer.amount,
        type: transfer.type,
      });
    }
  }

  return {
    senders: sendersDetails,
    recipients,
  };
}

export function detectPoisonedSenders(senders: any[], receivers: string[]) {
  const poisonedSenders: any[] = [];
  const mimickedAddresses: string[] = [];

  for (const sender of senders) {
    const sAddr = sender.address.toLowerCase();
    const sFirst4 = sAddr.slice(0, 4);
    const sLast4 = sAddr.slice(-4);
    

    for (const rAddr of receivers) {
      if (sAddr === rAddr.toLowerCase()) continue;

      const rFirst4 = rAddr.slice(0, 4).toLowerCase();
      const rLast4 = rAddr.slice(-4).toLowerCase();

      if (sFirst4 === rFirst4 || sLast4 === rLast4) {
        console.log(`pushing poisoned sender: ${sender.address}`);
        poisonedSenders.push(sender);
        mimickedAddresses.push(rAddr);
      }
    }
  }

  return {
    poisonedSenders,
    mimickedAddresses,
  };
}

export function detectDustSenders(poisonedSenders: any[]) {
  return poisonedSenders.filter((sender) => {
    return (
      (sender.type === 'native' && sender.amount <= CONFIG.NATIVE_DUST_THRESHOLD) ||
      (sender.type === 'token' && sender.amount <= CONFIG.TOKEN_DUST_THRESHOLD)
    );
  });
}

export function deduplicateMimickedAddresses(addresses: string[]) {
  return Array.from(new Set(addresses));
}

export function deduplicatePoisonedSenders(senders: string[]) {
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

export async function checkWalletPoisoning(walletAddress: string) {
  console.log(`Checking wallet poisoning for ${walletAddress}`);
  const results: any = {
    summary: '',
    score: 0,
    total_transactions_analyzed: 0,
    confirmed_poisoning_attempts: 0,
    poisoned_addresses: [],
    mimicked_addresses: [],
  };

  try {
    const recentTransfers = await getWalletTransactions(
      walletAddress,
      CONFIG.MIN_TRANSACTION_HISTORY
    );

    if (!recentTransfers || recentTransfers.length === 0) {
      results.summary = 'No frequent transaction found to analyze';
      return results;
    }

    results.total_transactions_analyzed = recentTransfers.length;
    const extracted = extractSendersAndRecipients(recentTransfers, walletAddress);

    const { senders, recipients } = extracted;
    const poisoningResults = detectPoisonedSenders(senders, recipients);

    const poisonedAddresses = poisoningResults.poisonedSenders.map((sender: any) => sender.address);
    const poisoned = deduplicatePoisonedSenders(poisonedAddresses);

    const mimicked = deduplicateMimickedAddresses(poisoningResults.mimickedAddresses);

    results.confirmed_poisoning_attempts = poisoningResults.poisonedSenders.length;
    results.mimicked_addresses = mimicked;
    results.poisoned_addresses = poisoned;

    results.summary = `Found ${poisoningResults.poisonedSenders.length} confirmed poisoning attacks and ${poisoned.length} dusting attacks after analyzing ${recentTransfers.length} latest transactions`;
    results.score = mimicked.length / poisoned.length;

    console.log(`Poisoning analysis results: ${JSON.stringify(results)}`);

    return results;
  } catch (err) {
    console.log(`Error analyzing wallet: ${(err as any).message}`);
    return {
      status: 'error',
      summary: `Error analyzing wallet: ${(err as any).message}`,
    };
  }
}
