import { useState } from "react";
import { Shield } from "lucide-react";
import ScannerForm from "@/components/scanner-form";
import ScanningAnimation from "@/components/scanning-animation";
import ResultsSection from "@/components/results-section";
import { SecurityAnalysisResponse } from "@shared/schema";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<SecurityAnalysisResponse | null>(null);

  const handleScanStart = () => {
    setIsScanning(true);
    setResults(null);
  };

  const handleScanComplete = (analysisResults: SecurityAnalysisResponse) => {
    setIsScanning(false);
    setResults(analysisResults);
  };

  const handleScanError = () => {
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">SolSecurity</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Analysis</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Support</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Is your wallet being{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              exploited?
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
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
        {results && !isScanning && <ResultsSection results={results} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="mb-2">© 2024 SolSecurity. Protecting Solana wallets from security threats.</p>
            <p className="text-sm">
              <i className="fas fa-info-circle mr-1"></i>
              This analysis is for informational purposes only. Always verify transactions independently.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
