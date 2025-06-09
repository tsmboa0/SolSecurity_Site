'use client'

import { useState, useEffect } from "react"
import { Shield, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import ScannerForm from "@/components/scanner-form"
import ScanningAnimation from "@/components/scanning-animation"
import ResultsSection from "@/components/results-section"
import { SecurityAnalysisResponse } from "@shared/schema"

export default function Home() {
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<SecurityAnalysisResponse | null>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the theme UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleScanStart = () => {
    setIsScanning(true)
    setResults(null)
  }

  const handleScanComplete = (analysisResults: SecurityAnalysisResponse) => {
    setIsScanning(false)
    setResults(analysisResults)
  }

  const handleScanError = () => {
    setIsScanning(false)
  }

  const handleNewScan = () => {
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">SolSecurity</span>
            </div>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Is your wallet being{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
              exploited?
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
            Protect your Solana assets with advanced security analysis. Our platform detects 
            address poisoning and account dusting attacks to keep your wallet safe from malicious actors.
          </p>
        </div>

        {/* Scanner Form */}
        {!isScanning && !results && (
          <ScannerForm onScanStart={handleScanStart} onScanComplete={handleScanComplete} onScanError={handleScanError} />
        )}

        {/* Scanning Animation */}
        {isScanning && <ScanningAnimation />}

        {/* Results Section */}
        {results && !isScanning && <ResultsSection results={results} onNewScan={handleNewScan} />}
      </main>

      {/* Footer */}
      <footer className="bg-card dark:bg-card light:bg-white border-t border-border dark:border-border light:border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2 text-sm sm:text-base">© 2024 SolSecurity. Protecting Solana wallets from security threats.</p>
            <p className="text-xs sm:text-sm">
              This analysis is for informational purposes only. Always verify transactions independently.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}