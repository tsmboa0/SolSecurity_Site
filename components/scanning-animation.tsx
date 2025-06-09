import { useState, useEffect } from "react";
import { Shield, CheckCircle, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const scanningSteps = [
  { text: "Connecting to Solana network", delay: 0 },
  { text: "Fetching transaction history", delay: 1000 },
  { text: "Analyzing address patterns", delay: 2500 },
  { text: "Detecting poisoning attempts", delay: 4000 },
  { text: "Scanning for dust transactions", delay: 5500 },
  { text: "Generating security report", delay: 7000 }
];

export default function ScanningAnimation() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 8000; // 8 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on progress
      const stepIndex = Math.floor((newProgress / 100) * scanningSteps.length);
      setCurrentStep(Math.min(stepIndex, scanningSteps.length - 1));

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
  }, []);

  return (
    <Card className="bg-card border border-border rounded-2xl shadow-lg mb-6 sm:mb-8">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <motion.div 
            className="relative w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-border rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"></div>
            <Shield className="text-primary absolute inset-0 w-6 h-6 m-auto" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing Wallet Security</h3>
          <p className="text-muted-foreground mb-4">Scanning for address poisoning and account dusting attacks...</p>
          
          <div className="w-full mb-6">
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-3">
            {scanningSteps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center space-x-2 px-2"
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.5,
                  scale: index === currentStep ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Circle className="w-4 h-4 text-primary flex-shrink-0" />
                  </motion.div>
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className={`text-xs sm:text-sm text-center ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
