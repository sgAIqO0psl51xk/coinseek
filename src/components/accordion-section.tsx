import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React from "react";

const AccordionSection = () => {
  return (
    <div className="mx-20 py-24">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            What is AI-powered crypto analysis?
          </AccordionTrigger>
          <AccordionContent>
            Our platform uses advanced artificial intelligence to analyze market
            trends, social sentiment, and on-chain data in real-time. This helps
            identify potential investment opportunities before they become
            mainstream, giving our users a competitive edge in the market.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How does the risk management system work?
          </AccordionTrigger>
          <AccordionContent>
            Users can customize their risk tolerance levels from conservative to
            aggressive. Our AI then filters and ranks opportunities accordingly,
            factoring in metrics like market cap, liquidity, volatility, and
            smart contract security scores to match your risk preference.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Which blockchains do you support?</AccordionTrigger>
          <AccordionContent>
            We currently support major networks including Ethereum, Solana, BSC,
            Arbitrum, Optimism, and other emerging L2 solutions. Our platform
            automatically monitors these chains for new opportunities and
            potential risks.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            How do you ensure security for users?
          </AccordionTrigger>
          <AccordionContent>
            We implement multiple security measures including automated smart
            contract audits, liquidity analysis, and wallet tracking for
            suspicious activities. Our platform is read-only and never requires
            access to your private keys or funds.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionSection;
