import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../components/global/container";
import { Button } from "./ui/button";
import Ripple from "./ui/ripple";

const MetaIcon = () => (
  <div className="relative">
    <Image
      src="https://artificialanalysis.ai/img/logos/meta_small.svg"
      alt="Meta"
      height={20}
      width={20}
    />
    <div className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -rotate-45 bg-foreground" />
  </div>
);

const MistralIcon = () => (
  <div className="relative">
    <Image
      src="https://artificialanalysis.ai/img/logos/mistral_small.png"
      alt="Mistral"
      height={20}
      width={20}
    />
    <div className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -rotate-45 bg-foreground" />
  </div>
);

const OpenAIIcon = () => (
  <div className="relative">
    <Image
      src="https://artificialanalysis.ai/img/logos/openai_small.svg"
      alt="OpenAI"
      height={20}
      width={20}
    />
    <div className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -rotate-45 bg-foreground" />
  </div>
);

const GoogleIcon = () => (
  <div className="relative">
    <Image
      src="https://artificialanalysis.ai/img/logos/google_small.svg"
      alt="Google"
      height={20}
      width={20}
    />
    <div className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -rotate-45 bg-foreground" />
  </div>
);

const AnthropicIcon = () => (
  <div className="relative">
    <Image
      src="https://custom.typingmind.com/assets/models/claude.webp"
      alt="Anthropic"
      height={20}
      width={20}
    />
    <div className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -rotate-45 bg-foreground" />
  </div>
);

const AzureIcon = (
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => (
  <div className="relative">
    <Image
      src="https://custom.typingmind.com/assets/models/azureopenai.png"
      alt="Azure"
      {...props}
      height={20}
      width={20}
    />
    <div className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -rotate-45 bg-foreground" />
  </div>
);

const MODEL_ICONS = [
  {
    icon: AnthropicIcon,
    position: "left-3",
    size: "small",
    iconSize: "small",
    className: "hidden lg:flex",
  },
  { icon: OpenAIIcon, position: "left-2", size: "medium", iconSize: "medium" },
  { icon: MetaIcon, position: "left-1", size: "large", iconSize: "large" },
  { icon: MistralIcon, position: "right-1", size: "large", iconSize: "large" },
  { icon: GoogleIcon, position: "right-2", size: "medium", iconSize: "medium" },
  {
    icon: AzureIcon,
    position: "right-3",
    size: "small",
    iconSize: "small",
    className: "hidden lg:flex",
  },
];

const Integration = () => {
  const getPositionClasses = (position: string) => {
    switch (position) {
      case "left-3":
        return "-translate-x-[285px]";
      case "left-2":
        return "-translate-x-[210px]";
      case "left-1":
        return "-translate-x-[125px]";
      case "right-1":
        return "translate-x-[125px]";
      case "right-2":
        return "translate-x-[210px]";
      case "right-3":
        return "translate-x-[285px]";
      default:
        return "";
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "size-20";
      case "medium":
        return "size-16";
      case "small":
        return "size-12";
      default:
        return "size-20";
    }
  };

  const getIconSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "size-10";
      case "medium":
        return "size-7";
      case "small":
        return "size-5";
      default:
        return "size-10";
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full py-10 lg:py-20"
      id="the-model"
    >
      <Container className="relative">
        <div className="relative flex flex-col lg:hidden items-center justify-center overflow-visible min-h-[400px]">
          <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-3/5 h-14 lg:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full -rotate-12 blur-[6.5rem] -z-10"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[600px]">
              <Ripple
                mainCircleSize={80}
                numCircles={3}
                className="absolute inset-0"
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center gap-6 mt-[60px]">
            <div className="flex items-center justify-center group">
              <Image
                src="https://custom.typingmind.com/assets/models/deepseek.png"
                alt="DeepSeek"
                width={60}
                height={60}
                className="size-16 group-hover:scale-110 transition-all duration-500"
              />
            </div>

            <div className="relative flex justify-center gap-3 flex-wrap">
              {MODEL_ICONS.filter((icon) => !icon.className).map(
                (platform, index) => (
                  <div
                    key={index}
                    className={cn(
                      "z-20 p-2 rounded-full flex items-center justify-center bg-gradient-to-b from-foreground/5 to-transparent shadow-xl shadow-black/10 backdrop-blur-lg transition-all duration-300 hover:scale-110",
                      getSizeClasses(platform.size)
                    )}
                  >
                    <platform.icon
                      className={cn(
                        "size-auto relative",
                        getIconSizeClasses(platform.iconSize),
                        "transition-all duration-300"
                      )}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Container>

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto lg:absolute lg:top-1/4 inset-x-0 mt-8 lg:mt-0">
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-heading font-semibold !leading-snug">
          Say goodbye to rug pulls
        </h2>
      </div>
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto lg:absolute lg:bottom-1/4 inset-x-0 z-20 mt-6 lg:mt-0">
        <Link href="/cot">
          <Button size="lg">
            Say Hello to CoinSeek
            <ArrowRightIcon className="size-4" />
          </Button>
        </Link>
      </div>

      <Container delay={0.3}>
        <div className="relative hidden lg:flex items-center justify-center overflow-visible">
          <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-3/5 h-14 lg:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full -rotate-12 blur-[6.5rem] -z-10"></div>

          <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-visible">
            <Ripple />
          </div>

          <div className="absolute z-20 flex items-center justify-center group">
            <Image
              src="https://custom.typingmind.com/assets/models/deepseek.png"
              alt="DeepSeek"
              width={100}
              height={100}
              className="size-24 group-hover:scale-110 transition-all duration-500"
            />
          </div>

          {MODEL_ICONS.map((platform, index) => (
            <div
              key={index}
              className={cn(
                "absolute z-20 size-16 p-3 rounded-full flex items-center justify-center bg-gradient-to-b from-foreground/5 to-transparent shadow-xl shadow-black/10 backdrop-blur-lg transition-all duration-300 hover:scale-110",
                getPositionClasses(platform.position),
                getSizeClasses(platform.size),
                platform.className
              )}
            >
              <platform.icon
                className={cn(
                  "size-auto relative",
                  getIconSizeClasses(platform.iconSize),
                  "transition-all duration-300"
                )}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Integration;
