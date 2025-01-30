import Image from "next/image";
import { Spotlight } from "../components/ui/spotlight-new";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card-hover-effect";
import { CardHoverEffectDemo } from "@/components/hover-cards";
import { BentoGridDemo } from "@/components/main-bento";
import HeroSection from "@/components/hero-section";
import IconSection from "@/components/icon-section";

export default function Home() {
  return (
    <div className="min-w-screen">
      <HeroSection />
      <IconSection />
      <BentoGridDemo />
      {/* <CardHoverEffectDemo /> */}
      <div className="mx-20 py-24">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
