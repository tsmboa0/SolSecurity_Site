import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DonationSection() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Test Solana address for donations
  const donationAddress = "Dbh6kfHKPm7E94ci9HeVt3nj2NLa5Syk2pzEHsG6GGon";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(donationAddress);
      setCopied(true);
      toast({
        title: "Address Copied!",
        description: "Donation address copied to clipboard",
      });
      
      // Reset copy state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30 rounded-2xl">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full p-3">
                <Heart className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Support Our Mission
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Help us keep the Solana ecosystem safe by supporting our security research and platform development. 
              Your donations help us maintain and improve our threat detection capabilities.
            </p>

            <div className="bg-muted/30 rounded-xl p-4 sm:p-6 mb-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">Donate SOL to:</div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="bg-background/50 rounded-lg p-3 flex-1 w-full sm:w-auto">
                  <code className="text-xs sm:text-sm font-mono text-foreground break-all leading-relaxed">
                    {donationAddress}
                  </code>
                </div>
                <Button
                  onClick={handleCopyAddress}
                  variant="outline"
                  size="sm"
                  className={`border-purple-500/50 hover:bg-purple-500/20 w-full sm:w-auto transition-all duration-300 ${
                    copied ? 'bg-green-500/20 border-green-500/50' : ''
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>🔒 This is a secure Solana wallet address</p>
              <p>💎 All donations help improve security features for the community</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}