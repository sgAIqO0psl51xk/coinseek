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
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isAnalyzing) return;

    let url = `/api/analyze?contractAddress=${encodeURIComponent(contractAddress)}`;
    if (ticker !== "")
        url += `&ticker=${encodeURIComponent(ticker)}`
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const obj = JSON.parse(
          event.data
        );
        const data = JSON.parse(obj.content);

        if (data.type === "done") {
          setIsAnalyzing(false);
          eventSource.close();
          return;
        }

        if (data.error) {
          setError(data.error);
          setIsAnalyzing(false);
          eventSource.close();
          return;
        }

        if (data.type === "analysis" || data.type === "reasoning") {
          setAnalysis((prev) => prev + data.content);
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
        setError("Error parsing analysis data");
        setIsAnalyzing(false);
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setError("Connection error occurred");
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
              placeholder="(Optional) Enter ticker (e.g. $BTC)"
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
