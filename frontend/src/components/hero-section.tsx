import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center w-full py-12 md:py-12 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Lorem ipsum
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Voluptatibus est rem recusandae earum, ad, omnis atque consequatur
            minus, beatae placeat illum reprehenderit quaerat tenetur itaque
            praesentium. Beatae repellendus dolore voluptates.
          </p>
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/cot">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
