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

      {/* Security Recommendations */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
        <CardContent className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Lightbulb className="text-yellow-500 w-5 h-5 mr-2" />
            Security Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-slate-900">Regular Security Scans</div>
                <div className="text-sm text-slate-600">Check your wallet monthly for new threats</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-slate-900">Verify Addresses</div>
                <div className="text-sm text-slate-600">Always double-check recipient addresses before sending</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-success w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-slate-900">Use Hardware Wallets</div>
                <div className="text-sm text-slate-600">Store large amounts in cold storage for maximum security</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
