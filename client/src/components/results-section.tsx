import { motion } from "framer-motion";
import { Lightbulb, CheckCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnalysisCard from "@/components/analysis-card";
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
      {/* Scan Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 bg-card border border-border rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Security Analysis Complete</h2>
          <p className="text-muted-foreground">
            Scanned wallet: <span className="font-mono text-sm break-all">{results.walletAddress}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Analyzed on {new Date(results.analyzedAt).toLocaleDateString()} at {new Date(results.analyzedAt).toLocaleTimeString()}
          </p>
        </div>
        {onNewScan && (
          <Button
            onClick={onNewScan}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Scan New Address
          </Button>
        )}
      </div>

      {/* Analysis Results - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Address Poisoning Analysis */}
        <AnalysisCard
          title="Address Poisoning Analysis"
          description="Detection of malicious address manipulation"
          iconType="shield"
          data={results.addressPoisoning}
          additionalMetrics={[
            { label: "Transactions Analyzed", value: results.addressPoisoning.transactionCount },
            { label: "Fake Addresses", value: results.addressPoisoning.fakeAddresses.length.toString() },
            { label: "Mimicked Address", value: results.addressPoisoning.mimickedAddress ? "Detected" : "None" }
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
            { label: "Top Dusters", value: results.dusting.topDusterAddresses.length.toString() }
          ]}
        />
      </div>

      {/* Security Recommendations */}
      <Card className="bg-gradient-to-br from-muted/50 to-primary/5 rounded-2xl border border-border">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <Lightbulb className="text-warning w-5 h-5 mr-2" />
            Security Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Regular Security Scans</div>
                <div className="text-sm text-muted-foreground">Check your wallet monthly for new threats</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Verify Addresses</div>
                <div className="text-sm text-muted-foreground">Always double-check recipient addresses before sending</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Use Hardware Wallets</div>
                <div className="text-sm text-muted-foreground">Store large amounts in cold storage for maximum security</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
