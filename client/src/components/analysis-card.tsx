import { motion } from "framer-motion";
import { Shield, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddressPoisoningResult, AccountDustingResult } from "@shared/schema";

interface Metric {
  label: string;
  value: string;
}

interface AnalysisCardProps {
  title: string;
  description: string;
  iconType: "shield" | "coins";
  data: AddressPoisoningResult | AccountDustingResult;
  additionalMetrics: Metric[];
}

export default function AnalysisCard({ title, description, iconType, data, additionalMetrics }: AnalysisCardProps) {
  const riskScore = parseInt(data.riskScore.split('/')[0]);
  const isHighRisk = riskScore >= 50;
  const isMediumRisk = riskScore >= 30 && riskScore < 50;
  
  const getRiskColor = () => {
    if (isHighRisk) return "danger";
    if (isMediumRisk) return "warning";
    return "success";
  };

  const riskColor = getRiskColor();
  const Icon = iconType === "shield" ? Shield : Coins;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isHighRisk ? [1, 1.01, 1] : 1
      }}
      transition={{ 
        duration: 0.5,
        scale: isHighRisk ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
      }}
    >
      <Card 
        className={cn(
          "bg-card rounded-2xl shadow-lg border-2 transition-all duration-500 relative overflow-hidden",
          isHighRisk && "border-red-500 shadow-red-500/50 bg-red-950/20 ring-2 ring-red-500/30",
          isMediumRisk && "border-orange-500 shadow-orange-500/40 bg-orange-950/15 ring-1 ring-orange-500/20",
          !isHighRisk && !isMediumRisk && "border-green-500 shadow-green-500/40 bg-green-950/15 ring-1 ring-green-500/20"
        )}
      >
        {/* High Risk Warning Strip */}
        {isHighRisk && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
        )}
        
        <CardContent className="p-4 sm:p-6 lg:p-8 relative">
          {/* High Risk Warning Badge */}
          {isHighRisk && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              ⚠️ DANGER
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                isHighRisk && "bg-red-500/20 text-red-400",
                isMediumRisk && "bg-orange-500/20 text-orange-400",
                !isHighRisk && !isMediumRisk && "bg-green-500/20 text-green-400"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className={cn(
                "text-xl sm:text-2xl font-bold mb-1",
                isHighRisk && "text-red-400",
                isMediumRisk && "text-orange-400", 
                !isHighRisk && !isMediumRisk && "text-green-400"
              )}>{data.riskScore}</div>
              <div className={cn(
                "text-sm font-bold px-2 py-1 rounded-full border",
                isHighRisk && "text-red-300 border-red-500 bg-red-500/20",
                isMediumRisk && "text-orange-300 border-orange-500 bg-orange-500/20",
                !isHighRisk && !isMediumRisk && "text-green-300 border-green-500 bg-green-500/20"
              )}>
                {isHighRisk && "🚨 "}{isMediumRisk && "⚠️ "}{!isHighRisk && !isMediumRisk && "✅ "}{data.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {additionalMetrics.map((metric, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                <div className="text-lg sm:text-2xl font-bold text-foreground">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Detailed Information */}
          {"fakeAddresses" in data && data.fakeAddresses.length > 0 && (
            <div className="bg-red-950/30 border border-red-500/50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-300 mb-2">🚨 Fake Addresses Detected</h4>
              <div className="space-y-2">
                {data.fakeAddresses.map((address, index) => (
                  <div key={index} className="bg-red-900/20 rounded p-2">
                    <span className="text-xs text-red-200 font-mono break-all">{address}</span>
                  </div>
                ))}
              </div>
              {data.mimickedAddress && (
                <div className="mt-3">
                  <p className="text-xs text-red-300 mb-1">Mimicked Address:</p>
                  <div className="bg-red-900/20 rounded p-2">
                    <span className="text-xs text-red-200 font-mono break-all">{data.mimickedAddress}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {"topDusterAddresses" in data && data.topDusterAddresses.length > 0 && (
            <div className="bg-orange-950/30 border border-orange-500/50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-orange-300 mb-2">⚠️ Top Duster Addresses</h4>
              <div className="space-y-2">
                {data.topDusterAddresses.map((address, index) => (
                  <div key={index} className="bg-orange-900/20 rounded p-2">
                    <span className="text-xs text-orange-200 font-mono break-all">{address}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={cn(
            "rounded-lg p-4 border",
            isHighRisk && "bg-red-950/30 border-red-500/50",
            isMediumRisk && "bg-orange-950/30 border-orange-500/50",
            !isHighRisk && !isMediumRisk && "bg-green-950/30 border-green-500/50"
          )}>
            <h4 className="font-semibold text-foreground mb-2">Analysis Summary</h4>
            <p className={cn(
              "text-sm",
              isHighRisk && "text-red-200",
              isMediumRisk && "text-orange-200",
              !isHighRisk && !isMediumRisk && "text-green-200"
            )}>{data.summary}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
