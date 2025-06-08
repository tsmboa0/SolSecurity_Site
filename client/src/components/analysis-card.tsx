import { motion } from "framer-motion";
import { Shield, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnalysisResult } from "@shared/schema";

interface Metric {
  label: string;
  value: string;
}

interface AnalysisCardProps {
  title: string;
  description: string;
  iconType: "shield" | "coins";
  data: AnalysisResult;
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={cn(
          "bg-card rounded-2xl shadow-lg border-2 transition-all duration-300",
          isHighRisk && "border-red-500 shadow-red-500/30 bg-red-950/10",
          isMediumRisk && "border-orange-500 shadow-orange-500/30 bg-orange-950/10",
          !isHighRisk && !isMediumRisk && "border-green-500 shadow-green-500/30 bg-green-950/10"
        )}
      >
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                isHighRisk && "bg-danger/10 text-danger",
                isMediumRisk && "bg-warning/10 text-warning",
                !isHighRisk && !isMediumRisk && "bg-success/10 text-success"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="text-xl sm:text-2xl font-bold mb-1 text-foreground">{data.riskScore}</div>
              <div className={cn(
                "text-sm font-medium",
                isHighRisk && "text-danger",
                isMediumRisk && "text-warning",
                !isHighRisk && !isMediumRisk && "text-success"
              )}>
                {data.status}
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

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Analysis Summary</h4>
            <p className="text-muted-foreground text-sm">{data.summary}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
