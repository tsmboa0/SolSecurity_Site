import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Wallet, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { walletAddressSchema, type WalletAddressInput, type SecurityAnalysisResponse } from "@shared/schema";

interface ScannerFormProps {
  onScanStart: () => void;
  onScanComplete: (results: SecurityAnalysisResponse) => void;
  onScanError: () => void;
}

export default function ScannerForm({ onScanStart, onScanComplete, onScanError }: ScannerFormProps) {
  const { toast } = useToast();
  
  const form = useForm<WalletAddressInput>({
    resolver: zodResolver(walletAddressSchema),
    defaultValues: {
      address: "",
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: WalletAddressInput) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json() as Promise<SecurityAnalysisResponse>;
    },
    onMutate: () => {
      onScanStart();
    },
    onSuccess: (data) => {
      onScanComplete(data);
      toast({
        title: "Analysis Complete",
        description: "Your wallet security analysis is ready.",
      });
    },
    onError: (error) => {
      onScanError();
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze wallet. Please try again.",
      });
    },
  });

  const onSubmit = (data: WalletAddressInput) => {
    analyzeMutation.mutate(data);
  };

  return (
    <Card className="bg-card border border-border rounded-2xl shadow-lg mb-6 sm:mb-8">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="walletAddress" className="text-sm font-medium text-foreground">
                      Solana Wallet Address
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="walletAddress"
                          placeholder="Enter your Solana wallet address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
                          className="w-full px-4 py-3 pr-12 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-mono placeholder:text-xs sm:placeholder:text-sm"
                          disabled={analyzeMutation.isPending}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Wallet className="text-muted-foreground w-5 h-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                      <Info className="w-3 h-3" />
                      <span>Analysis typically takes 10-30 seconds depending on transaction history</span>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={analyzeMutation.isPending}
                className="w-full bg-gradient-to-r from-[hsl(var(--solana-green))] to-[hsl(var(--solana-purple))] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Wallet Security
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
