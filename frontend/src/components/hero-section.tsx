"use client";
import React from "react";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="flex min-h-[100vh] items-center justify-center w-full py-12 md:py-12 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center mt-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl opacity-0 animate-fade-in">
            welcome to solseek :)
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 pb-10 opacity-0 animate-fade-in animation-delay-200">
            never get rugged again
          </p>
          <Link
            href="/cot"
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-6 text-base sm:text-lg md:text-xl font-semibold tracking-wider text-white bg-black border-2 border-white rounded-full hover:bg-black/80 transform-gpu transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 opacity-0 animate-fade-in [animation-fill-mode:forwards] animation-delay-400"
          >
            Research Tokens Now
          </Link>

          <div className="w-full">
            <div className="flex flex-col items-center mt-52">
              <button
                onClick={() => {
                  document.getElementById("icon-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="flex flex-col items-center cursor-pointer opacity-0 animate-fade-in animation-delay-600"
                aria-label="scroll to icon section"
              >
                <svg
                  className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-bounce"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400 my-2">
                  scroll for more
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
