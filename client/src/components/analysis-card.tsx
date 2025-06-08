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
          "bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300",
          isHighRisk && "border-danger shadow-danger/20",
          isMediumRisk && "border-warning shadow-warning/20",
          !isHighRisk && !isMediumRisk && "border-success shadow-success/20"
        )}
      >
        <CardContent className="p-0">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                isHighRisk && "bg-danger/10 text-danger",
                isMediumRisk && "bg-warning/10 text-warning",
                !isHighRisk && !isMediumRisk && "bg-success/10 text-success"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="text-slate-600">{description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1 text-slate-900">{data.riskScore}</div>
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

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {additionalMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Analysis Summary</h4>
            <p className="text-slate-700 text-sm">{data.summary}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
