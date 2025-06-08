import { motion } from "framer-motion";
import { Lightbulb, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisCard from "@/components/analysis-card";
import { SecurityAnalysisResponse } from "@shared/schema";

interface ResultsSectionProps {
  results: SecurityAnalysisResponse;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
            { label: "Suspicious Patterns", value: results.addressPoisoning.suspiciousCount || "0" },
            { label: "Last Activity", value: results.addressPoisoning.lastActivity }
          ]}
        />

        {/* Account Dusting Analysis */}
        <AnalysisCard
          title="Account Dusting Analysis"
          description="Detection of small token transfers for tracking"
          iconType="coins"
          data={results.dusting}
          additionalMetrics={[
            { label: "Token Transfers", value: results.dusting.tokenTransfers || "0" },
            { label: "Dust Transactions", value: results.dusting.dustCount || "0" },
            { label: "Risk Level", value: results.dusting.riskLevel || "LOW" }
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
