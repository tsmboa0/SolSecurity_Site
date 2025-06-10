import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/query-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'SolSecurity - Solana Wallet Security Scanner',
  description: 'Protect your Solana assets with advanced security analysis. Our platform detects address poisoning and account dusting attacks to keep your wallet safe from malicious actors.',
  keywords: ['Solana', 'wallet', 'security', 'blockchain', 'crypto', 'scanner'],
  openGraph: {
    title: 'SolSecurity - Solana Wallet Security Scanner',
    description: 'Protect your Solana assets with advanced security analysis. Our platform detects address poisoning and account dusting attacks.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SolSecurity - Solana Wallet Security Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolSecurity - Solana Wallet Security Scanner',
    description: 'Protect your Solana assets with advanced security analysis. Our platform detects address poisoning and account dusting attacks.',
    images: ['/og-image.png'],
    creator: '@your_twitter_handle',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}