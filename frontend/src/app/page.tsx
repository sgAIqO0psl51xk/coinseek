import Image from "next/image";
import { Spotlight } from "../components/ui/spotlight-new";

import { Card } from "../components/ui/card-hover-effect";
import { CardHoverEffectDemo } from "../components/hover-cards";
import { BentoGridDemo } from "../components/main-bento";
import HeroSection from "../components/hero-section";
import IconSection from "../components/icon-section";
import AccordionSection from "../components/accordion-section";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <div className="min-w-screen">
      <HeroSection />
      <IconSection />
      <BentoGridDemo />
      {/* <CardHoverEffectDemo /> */}
      <AccordionSection />
      <Footer />
    </div>
  );
}
