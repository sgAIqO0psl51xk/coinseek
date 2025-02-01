import Image from "next/image";
import { Spotlight } from "../components/ui/spotlight-new";
import { Navbar } from "@/components/navbar";

import { Card } from "../components/ui/card-hover-effect";
import { CardHoverEffectDemo } from "../components/hover-cards";
import { BentoGridDemo } from "../components/main-bento";
import HeroSection from "../components/hero-section";
import IconSection from "../components/icon-section";
import AccordionSection from "../components/accordion-section";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <div className="min-w-screen bg-white dark:bg-black relative overflow-hidden">
      <Navbar />
      {/* Static grid */}
      <div
        className="absolute inset-0 
        bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] 
        bg-[size:24px_24px] 
        md:bg-[size:36px_36px] 
        lg:bg-[size:48px_48px]"
      />

      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 
        animate-grid-line-flash
        bg-[linear-gradient(45deg,transparent_0%,transparent_40%,#fff4_45%,#fff4_55%,transparent_60%,transparent_100%)_0%_0_/_200%_200%]
        dark:bg-[linear-gradient(45deg,transparent_0%,transparent_40%,#fff2_45%,#fff2_55%,transparent_60%,transparent_100%)_0%_0_/_200%_200%]
        bg-[size:24px_24px] 
        md:bg-[size:36px_36px] 
        lg:bg-[size:48px_48px]
        [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      <div className="relative">
        <HeroSection />
        <IconSection />
        {/* <BentoGridDemo /> */}
        {/* <CardHoverEffectDemo /> */}
        <AccordionSection />
        <Footer />
      </div>
    </div>
  );
}
