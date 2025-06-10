import { motion } from "framer-motion";
import { Share, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ShareButtonProps {
  walletAddress: string;
  overallRiskScore: number;
}

export default function ShareButton({ walletAddress, overallRiskScore }: ShareButtonProps) {
  const getRiskLevel = () => {
    if (overallRiskScore >= 50) return "HIGH RISK";
    if (overallRiskScore >= 30) return "MEDIUM RISK";
    return "LOW RISK";
  };

  const handleShareToX = () => {
    const riskLevel = getRiskLevel();
    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    
    const tweetText = `Just scanned my Solana wallet (${shortAddress}) for security threats! 🔍\n\nRisk Level: ${riskLevel}\n\nProtect your crypto from address poisoning & dusting attacks 🛡️\n\nTry it yourself 👇`;
    
    // Ensure we're using the full URL including protocol
    const baseUrl = window.location.origin;
    const url = encodeURIComponent(`${baseUrl}/?preview=true`);
    const text = encodeURIComponent(tweetText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30 rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full p-3">
                <Share className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              Share Your Security Scan
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Help others protect their Solana wallets by sharing your security scan results
            </p>

            <Button
              onClick={handleShareToX}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Share on X (Twitter)
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}