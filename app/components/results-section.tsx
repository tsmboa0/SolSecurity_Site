import { motion } from "framer-motion";
import { Lightbulb, CheckCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnalysisCard from "@/components/analysis-card";
import ShareButton from "@/components/share-button";
import DonationSection from "@/components/donation-section";
import { SecurityAnalysisResponse } from "@shared/schema";

interface ResultsSectionProps {
  results: SecurityAnalysisResponse;
  onNewScan?: () => void;
}

export default function ResultsSection({ results, onNewScan }: ResultsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Scan Summary Header - Mobile Responsive */}
      <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6 bg-card border border-border rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 leading-tight">Security Analysis Complete</h2>
            <div className="space-y-1">
              <p className="text-sm sm:text-base text-muted-foreground">
                Scanned wallet:
              </p>
              <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
                <span className="font-mono text-xs sm:text-sm break-all text-foreground">{results.walletAddress}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Analyzed on {new Date(results.analyzedAt).toLocaleDateString()} at {new Date(results.analyzedAt).toLocaleTimeString()}
            </p>
          </div>
          {onNewScan && (
            <Button
              onClick={onNewScan}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Scan New Address
            </Button>
          )}
        </div>
      </div>

      {/* Analysis Results - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Address Poisoning Analysis */}
        <AnalysisCard
          title="Address Poisoning Analysis"
          description="Detection of malicious address manipulation"
          iconType="shield"
          data={results.poisoning}
          additionalMetrics={[
            { label: "Transactions Analyzed", value: results.poisoning.transactionCount },
            { label: "Fake Addresses", value: results.poisoning.fakeAddresses?.length?.toString() || "0" },
            { label: "Mimicked Addresses", value: Array.isArray(results.poisoning.mimickedAddress) ? results.poisoning.mimickedAddress.length.toString() : (results.poisoning.mimickedAddress ? "1" : "0") }
          ]}
        />

        {/* Account Dusting Analysis */}
        <AnalysisCard
          title="Account Dusting Analysis"
          description="Detection of small token transfers for tracking"
          iconType="coins"
          data={results.dusting}
          additionalMetrics={[
            { label: "Transactions Analyzed", value: results.dusting.transactionCount },
            { label: "Dust Transactions", value: results.dusting.dustTransactionCount },
            { label: "Top Dusters", value: results.dusting.topDusterAddresses?.length?.toString() || "0" }
          ]}
        />
      </div>

      {/* Security Recommendations */}
      <Card className="bg-gradient-to-br from-muted/50 to-primary/5 rounded-2xl border border-border">
        <CardContent className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-4 flex items-center">
            <Lightbulb className="text-warning w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Security Recommendations
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm sm:text-base">Regular Security Scans</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Check your wallet monthly for new threats</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm sm:text-base">Verify Addresses</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Always double-check recipient addresses before sending</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm sm:text-base">Use Hardware Wallets</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Store large amounts in cold storage for maximum security</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Button */}
      <ShareButton 
        walletAddress={results.walletAddress} 
        overallRiskScore={results.overallRiskScore} 
      />

      {/* Donation Section */}
      <DonationSection />
    </motion.div>
  );
}
