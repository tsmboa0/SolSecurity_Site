import { useState } from "react";
import { Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import ScannerForm from "@/components/scanner-form";
import ScanningAnimation from "@/components/scanning-animation";
import ResultsSection from "@/components/results-section";
import { SecurityAnalysisResponse } from "@shared/schema";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<SecurityAnalysisResponse | null>(null);
  const { theme, toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-background dark:bg-background light:bg-slate-50 transition-colors">
      {/* Header */}
      <header className="bg-card dark:bg-card light:bg-white shadow-sm border-b border-border dark:border-border light:border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--solana-green))] to-[hsl(var(--solana-purple))] rounded-lg flex items-center justify-center">
                <Shield className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-foreground dark:text-foreground light:text-slate-900">SolSecurity</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Analysis</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</a>
              </nav>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Is your wallet being{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--solana-green))] to-[hsl(var(--solana-purple))]">
              exploited?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
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
  );
}
