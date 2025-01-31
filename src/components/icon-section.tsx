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
    <>
      <div className="mx-auto w-full max-w-6xl px-3 pb-24">
        <dl className="grid grid-cols-4 gap-10">
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
      </div>
    </>
  );
}
