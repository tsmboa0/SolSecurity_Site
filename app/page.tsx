'use client'

import { useState } from 'react'
import ScannerForm from '@/components/scanner-form'
import ResultsSection from '@/components/results-section'
import ScanningAnimation from '@/components/scanning-animation'
import { SecurityAnalysisResponse } from '@/shared/schema'

export default function Home() {
  const [isScanning, setIsScanning] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<SecurityAnalysisResponse | null>(null)

  const handleScanStart = () => {
    setIsScanning(true)
    setAnalysisResults(null)
  }

  const handleScanComplete = (results: SecurityAnalysisResponse) => {
    setAnalysisResults(results)
    setIsScanning(false)
  }

  const handleScanError = () => {
    setIsScanning(false)
  }

  const handleNewScan = () => {
    setAnalysisResults(null)
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Solana Wallet Security Scanner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive security analysis for your Solana wallet. Detect address poisoning and account dusting attacks with advanced threat detection.
          </p>
        </header>

        {!isScanning && !analysisResults && (
          <ScannerForm 
            onScanStart={handleScanStart}
            onScanComplete={handleScanComplete}
            onScanError={handleScanError}
          />
        )}

        {isScanning && <ScanningAnimation />}

        {analysisResults && (
          <ResultsSection 
            results={analysisResults} 
            onNewScan={handleNewScan}
          />
        )}
      </div>
    </div>
  )
}