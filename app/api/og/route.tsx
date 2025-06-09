import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address');
    const riskScore = searchParams.get('riskScore');
    const riskLevel = searchParams.get('riskLevel');

    if (!walletAddress || !riskScore || !riskLevel) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e293b',
              padding: '40px',
              borderRadius: '20px',
              border: '2px solid #3b82f6',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px',
              }}
            >
              SolSecurity Scan Results
            </h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <p
                style={{
                  fontSize: '32px',
                  color: '#94a3b8',
                }}
              >
                Wallet: {shortAddress}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: riskLevel === 'HIGH RISK' ? '#ef4444' : 
                           riskLevel === 'MEDIUM RISK' ? '#f59e0b' : 
                           '#22c55e',
                  }}
                >
                  {riskLevel}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#94a3b8',
                  }}
                >
                  (Score: {riskScore})
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error: any) {
    console.log(`${error.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 