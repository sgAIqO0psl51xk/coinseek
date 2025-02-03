"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MagicCard } from "@/components/ui/magic-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface AnalysisResponse {
  content?: string;
  error?: string;
}

// Add this helper function to parse the analysis text

export default function AnalyzePage() {
  const [contractAddress, setContractAddress] = useState("");
  const [ticker, setTicker] = useState("");
  const [reasoning, setReasoning] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [metadata, setMetadata] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const reasoningRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const [loadingDots, setLoadingDots] = useState('.');

  const loadingMessages = [
    "Checking onchain",
    "Checking Twitter",
    "Checking rug risk",
    "Generating analysis",
  ];

  useEffect(() => {
    if (!isAnalyzing) return;

    // Increased intervals for more realistic timing (in milliseconds)
    const stageIntervals = [3000, 6000, 9000, 12000]; // Each stage now takes 3 seconds
    let timeouts: NodeJS.Timeout[] = [];

    stageIntervals.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        setLoadingStage(index);
      }, delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [isAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      setError("Backend URL is not configured");
      setIsAnalyzing(false);
      return;
    }

    console.log(`Starting analysis for ${contractAddress}`);
    const url = `${backendUrl}/analyze?contract_address=${encodeURIComponent(
      contractAddress
    )}${ticker ? `&ticker=${encodeURIComponent(ticker.toUpperCase())}` : ""}`;
    const eventSource = new EventSource(url);

    // Add event listeners for specific event types
    eventSource.addEventListener('start', (event: MessageEvent) => {
      setAnalysis("");
    });

    eventSource.addEventListener('reasoning', (event: MessageEvent) => {
      try {
        const { content } = JSON.parse(event.data);
        setReasoning((prev) => prev + content);
        setLoadingStage(3); // Switch to "Generating analysis"
      } catch (error) {
        console.error("Failed to parse reasoning event:", error);
      }
    });

    eventSource.addEventListener("analysis", (event: MessageEvent) => {
      try {
        const { content } = JSON.parse(event.data);
        setAnalysis((prev) => prev + content);
      } catch (error) {
        console.error("Failed to parse analysis event:", error);
      }
    });

    eventSource.addEventListener("complete", (event: MessageEvent) => {
      console.log("Analysis completed");
      setIsAnalyzing(false);
      eventSource.close();
    });

    eventSource.addEventListener("done", (event: MessageEvent) => {
      console.log("Analysis done");
      setIsAnalyzing(false);
      eventSource.close();
    });

    eventSource.addEventListener("error", (event: Event) => {
      console.error("SSE Error event:", event);

      // Check if it's an EventSource error or a server-sent error
      if (event instanceof MessageEvent && event.data) {
        try {
          const { message } = JSON.parse(event.data);
          // Handle specific error cases
          if (message.includes("Wait") && message.includes("seconds")) {
            setError(`Rate limit reached. ${message}`);
          } else if (
            message.includes("Another request is already in progress")
          ) {
            setError(
              "You already have an analysis in progress. Please wait for it to complete."
            );
          } else if (message.includes("API key")) {
            setError(
              "Backend service configuration error. Please try again later."
            );
          } else if (message.includes("All providers failed")) {
            setError(
              "Analysis services are currently unavailable. Please try again later."
            );
          } else {
            setError(message || "An unexpected error occurred");
          }
        } catch (error) {
          setError("Failed to parse error message from server");
        }
      } else {
        // // Handle connection errors
        // const eventSource = event.target as EventSource;
        // if (eventSource.readyState === EventSource.CLOSED) {
        //   setError('Connection to analysis server was closed');
        // } else if (eventSource.readyState === EventSource.CONNECTING) {
        //   setError('Unable to connect to analysis server. Please try again later.');
        // } else {
        //   setError('Connection error occurred. Please try again.');
        // }
      }

      setIsAnalyzing(false);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [isAnalyzing, contractAddress, ticker]);

  // Add new useEffect for auto-scrolling
  useEffect(() => {
    if (reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [reasoning]);

  useEffect(() => {
    if (analysisRef.current) {
      analysisRef.current.scrollTop = analysisRef.current.scrollHeight;
    }
  }, [analysis]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setLoadingDots(dots => dots.length >= 3 ? '.' : dots + '.');
    }, 500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate input before starting analysis
    if (!contractAddress.trim()) {
      setError("Please enter a contract address");
      return;
    }

    setError(null);
    setAnalysis("");
    setReasoning("");
    setLoadingStage(0);
    setIsAnalyzing(true);
  }

  // Update the Button content in both form instances
  const buttonContent = isAnalyzing ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loadingMessages[loadingStage]}{loadingDots}
    </>
  ) : (
    "Analyze"
  );

  // Add function to clear error
  const clearError = () => setError(null);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Error Alert Dialog */}
      <AlertDialog open={!!error} onOpenChange={clearError}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={clearError}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analysis Results */}
      {reasoning && (
        <div className="flex-1 overflow-y-auto pb-24 transition-opacity duration-500 ease-in-out">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-8 mb-20 md:mb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-min">
                <MagicCard className="h-fit max-h-[calc(100vh-16rem)]">
                  <div className="p-6 space-y-4 h-full flex flex-col">
                    <h2 className="text-2xl font-semibold mx-auto">
                      Chain of Thought
                    </h2>
                    <div className="prose prose-invert max-w-none flex-1 min-h-0">
                      <div
                        ref={reasoningRef}
                        dir="rtl"
                        className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-background scrollbar-thumb-accent hover:scrollbar-thumb-accent/80 transition-colors"
                      >
                        <div dir="ltr">
                          <ReactMarkdown className="whitespace-pre-wrap font-mono font-light text-gray-300 text-sm pl-6">
                            {reasoning}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </MagicCard>
                <MagicCard className="h-fit max-h-[calc(100vh-16rem)]">
                  <div className="p-6 space-y-4 h-full flex flex-col">
                    <h2 className="text-2xl font-semibold mx-auto">Result</h2>
                    <div className="prose prose-invert max-w-none flex-1 min-h-0">
                      <div
                        ref={analysisRef}
                        className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-background scrollbar-thumb-accent hover:scrollbar-thumb-accent/80 transition-colors"
                      >
                        <ReactMarkdown className="whitespace-pre-wrap font-mono text-sm leading-relaxed pr-6">
                          {analysis}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </MagicCard>
              </div>

              {/* <MagicCard>
                <div className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold">Metadata</h2>
                  <div className="prose prose-invert max-w-none">
                    {metadata}
                  </div>
                </div>
              </MagicCard> */}
            </div>
          </div>
        </div>
      )}

      {/* Single Form with Dynamic Positioning */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          !reasoning && !isAnalyzing
            ? "relative flex-1 grid place-items-center p-4"
            : "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-50"
        }`}
        style={{
          transform: reasoning || isAnalyzing ? "none" : "translateY(0)",
          opacity: 1,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`w-full transition-all duration-500 ease-in-out ${
            !reasoning && !isAnalyzing ? "max-w-2xl" : "container mx-auto px-4 py-4"
          }`}
        >
          <div
            className={`transition-all duration-500 ease-in-out ${
              !reasoning && !isAnalyzing
                ? "opacity-100 max-h-[200px]"
                : "opacity-0 max-h-0"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src="/mario.png"
                  alt="logo"
                  className="w-6 h-6"
                  width={24}
                  height={24}
                />
                <h1 className="text-4xl font-bold tracking-tight">
                  Hi, I'm CoinSeek
                </h1>
              </div>
              <h3 className="text-gray-400">
                Try researching a token by typing the contract address and the
                ticker below
              </h3>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`transition-all duration-500 ease-in-out ${
              reasoning || isAnalyzing ? "max-w-7xl mx-auto" : ""
            } space-y-4`}
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="contract"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="Enter contract address"
                  required
                  className="h-12 text-lg"
                  disabled={isAnalyzing}
                />
              </div>
              <div className="w-48 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                  $
                </span>
                <Input
                  id="ticker"
                  value={ticker.replace("$", "").toUpperCase()}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\$/g, "")
                      .toUpperCase();
                    setTicker(`$${value}`);
                  }}
                  className="pl-6 h-12 text-lg"
                  placeholder="Enter ticker"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isAnalyzing}
              className="w-full h-12 rounded-xl bg-blue-500 text-white font-semibold text-md relative overflow-hidden"
            >
              <span className="inline-flex items-center transition-transform duration-200 ease-in-out">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="transition-opacity duration-200 ease-in-out">
                      {loadingMessages[loadingStage]}{loadingDots}
                    </span>
                  </>
                ) : (
                  "Analyze"
                )}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

