"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AnalysisResponse {
  content?: string;
  error?: string;
}

export default function AnalyzePage() {
  const [contractAddress, setContractAddress] = useState("");
  const [ticker, setTicker] = useState("");
  const [ analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isAnalyzing) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      setError('Backend URL is not configured');
      setIsAnalyzing(false);
      return;
    }

    console.log(`Starting analysis for ${contractAddress}`);
    const url = `${backendUrl}/analyze?contract_address=${encodeURIComponent(contractAddress)}${ticker ? `&ticker=${encodeURIComponent(ticker)}` : ''}`;
    const eventSource = new EventSource(url);

    // Add event listeners for specific event types
    eventSource.addEventListener('reasoning', (event: MessageEvent) => {
      console.log('Reasoning event received:', event.data);
      try {
        const { content } = JSON.parse(event.data);
        setAnalysis(prev => prev + content);
      } catch (error) {
        console.error('Failed to parse reasoning event:', error);
      }
    });

    eventSource.addEventListener('analysis', (event: MessageEvent) => {
      console.log('Analysis event received:', event.data);
      try {
        const { content } = JSON.parse(event.data);
        setAnalysis(prev => prev + content);
      } catch (error) {
        console.error('Failed to parse analysis event:', error);
      }
    });

    eventSource.addEventListener('complete', (event: MessageEvent) => {
      console.log('Analysis completed');
      setIsAnalyzing(false);
      eventSource.close();
    });

    eventSource.addEventListener('done', (event: MessageEvent) => {
      console.log('Analysis done');
      setIsAnalyzing(false);
      eventSource.close();
    });

    eventSource.addEventListener('error', (event: MessageEvent) => {
      console.error('SSE Error event:', event);
      try {
        const { message } = JSON.parse(event.data);
        setError(message);
      } catch (error) {
        setError('Connection error occurred');
      }
      setIsAnalyzing(false);
      eventSource.close();
    });

    // General error handling
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setError('Connection to analysis server failed');
      setIsAnalyzing(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isAnalyzing, contractAddress, ticker]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAnalysis("");
    setIsAnalyzing(true);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Token Analysis</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="contract" className="text-sm font-medium">
              Contract Address
            </label>
            <Input
              id="contract"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter contract address"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ticker" className="text-sm font-medium">
              Ticker
            </label>
            <Input
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Enter ticker (e.g. $BTC)"
              required
            />
          </div>

          <Button type="submit" disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Token"
            )}
          </Button>
        </form>

        {error && (
          <Card className="p-4 bg-destructive/10 text-destructive">
            {error}
          </Card>
        )}

        {analysis && (
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Analysis Results</h2>
            <div className="whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed rounded-lg">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
