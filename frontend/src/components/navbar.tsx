import { NAV_LINKS } from "../constants/links";
import Link from "next/link";
import Wrapper from "../components/global/wrapper";
import { Button } from "./ui/button";
import MobileMenu from "./mobile-menu";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 w-full h-16 bg-background/80 backdrop-blur-sm z-50">
      <Wrapper className="h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 uppercase tracking-widest group"
            >
              <span className="text-xl font-semibold hidden lg:block">C</span>
              <Image
                src="/mario.png"
                alt="logo"
                className="w-6 h-6 flex-shrink-0 group-hover:animate-spin-slow"
                width={24}
                height={24}
                priority
              />
              <span className="text-xl font-semibold hidden lg:block">
                inSeek
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link, index) => (
                <li key={index} className="text-sm font-medium -1 link">
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/CoinseekAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/sgAIqO0psl51xk/coinseek"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            {/* <MobileMenu /> */}
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;
