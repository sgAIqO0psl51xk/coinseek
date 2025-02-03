import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Container from "../components/global/container";
import Icons from "../components/global/icons";
import { Button } from "./ui/button";
import { OrbitingCircles } from "./ui/orbiting-circles";

const Hero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full py-20 -mt-12">
      <div className="absolute flex lg:hidden size-40 rounded-full bg-blue-500 blur-[10rem] top-0 left-1/2 -translate-x-1/2 -z-10"></div>
      <div className="flex flex-col items-center justify-center gap-y-8 relative">
        <Container className="hidden lg:flex absolute inset-0 top-0 mb-auto flex-col items-center justify-center w-full min-h-screen -z-10">
          <OrbitingCircles speed={0.5} radius={300}>
            <Icons.circle1 className="size-4 text-foreground/70" />
            <Icons.circle2 className="size-1 text-foreground/80" />
          </OrbitingCircles>
          <OrbitingCircles speed={0.25} radius={400}>
            <Icons.circle2 className="size-1 text-foreground/50" />
            <Icons.circle1 className="size-4 text-foreground/60" />
            <Icons.circle2 className="size-1 text-foreground/90" />
          </OrbitingCircles>
          <OrbitingCircles speed={0.1} radius={500}>
            <Icons.circle2 className="size-1 text-foreground/50" />
            <Icons.circle2 className="size-1 text-foreground/90" />
            <Icons.circle1 className="size-4 text-foreground/60" />
            <Icons.circle2 className="size-1 text-foreground/90" />
          </OrbitingCircles>
        </Container>
        <div className="flex flex-col items-center justify-center text-center gap-y-4 bg-background/0">
          <Container delay={0.15}>
            <h1 className="text-4xl md:text-4xl lg:text-7xl font-bold text-center !leading-tight max-w-4xl mx-auto">
              Due diligence {"\n"}
              <span className="text-blue-500">on-chain</span> powered by{" "}
              <span className="text-blue-500">AGI.</span>
            </h1>
          </Container>
          <Container delay={0.2}>
            <p className="max-w-xl mx-auto mt-2 text-base lg:text-lg text-center text-muted-foreground">
              Your AI-powered trading companion. Deep analysis of social
              signals, holder behavior, and community metrics for better trading
              decisions.
            </p>
          </Container>
          <Container delay={0.25} className="z-20">
            <div className="flex items-center justify-center mt-6 gap-x-4">
              <Link href="/cot" className="flex items-center gap-2 group">
                <Button size="lg">
                  Try It Now
                  <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </Link>
            </div>
          </Container>
          <Container delay={0.3} className="relative">
            <div className="relative rounded-xl lg:rounded-[32px] border border-border p-2 backdrop-blur-lg mt-10 max-w-6xl mx-auto">
              <div className="absolute top-1/8 left-1/2 -z-10 bg-gradient-to-r from-sky-500 to-blue-600 w-1/2 lg:w-3/4 -translate-x-1/2 h-1/4 -translate-y-1/2 inset-0 blur-[4rem] lg:blur-[10rem] animate-image-glow"></div>
              <div className="hidden lg:block absolute -top-1/8 left-1/2 -z-20 bg-blue-600 w-1/4 -translate-x-1/2 h-1/4 -translate-y-1/2 inset-0 blur-[10rem] animate-image-glow"></div>
              <div className="rounded-lg lg:rounded-[22px] border border-border bg-background">
                <video
                  src="/media/demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg lg:rounded-[20px] w-full h-auto"
                />
              </div>
            </div>
            <div className="bg-gradient-to-t from-background to-transparent absolute bottom-0 inset-x-0 w-full h-1/2"></div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Hero;
