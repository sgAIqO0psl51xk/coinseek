"use client";
import {
  RiLinksLine,
  RiPlugLine,
  RiShieldKeyholeLine,
  RiStackLine,
} from "@remixicon/react";

const features = [
  {
    name: "AI-Powered Token Research",
    description:
      "Our chain of thought AI analyzes social signals, on-chain data, and market sentiment to find potential moonshots.",
    icon: RiStackLine,
  },
  {
    name: "Degen Mode Activated",
    description:
      "Configure risk levels and let our AI hunt for low-cap gems and upcoming token launches in true degen fashion.",
    icon: RiPlugLine,
  },
  {
    name: "Multi-Chain Coverage",
    description:
      "Track potential plays across major chains including Ethereum, Solana, BSC, and emerging L2 networks.",
    icon: RiLinksLine,
  },
  {
    name: "DYOR Automation",
    description:
      "Automated due diligence checks for contract security, liquidity locks, and team wallet analysis.",
    icon: RiShieldKeyholeLine,
  },
];

export default function IconSection() {
  return (
    <section
      id="icon-section"
      className="mx-auto min-h-[100vh] w-full max-w-6xl px-3 pb-24"
    >
      <dl className="grid grid-cols-4 gap-10 pt-4">
        {features.map((item) => (
          <div
            key={item.name}
            className="col-span-full sm:col-span-2 lg:col-span-1"
          >
            <div className="w-fit rounded-lg p-2 shadow-md shadow-gray-300/30 ring-1 ring-white/5 dark:shadow-gray-300/30 dark:ring-white/5">
              <item.icon
                aria-hidden="true"
                className="size-6 text-gray-400 dark:text-gray-300"
              />
            </div>
            <dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">
              {item.name}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>

      {/* Video Section */}
      <div
        id="demo-video"
        className="mx-auto mt-32 max-w-4xl aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
      >
        <div className="relative h-full w-full">
          {/* Placeholder - Replace src with your actual placeholder image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-white/10 p-4 backdrop-blur">
                <svg
                  className="size-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Click to play demo video
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
