import { NAV_LINKS } from "../constants/links";
import Link from "next/link";
import Wrapper from "../components/global/wrapper";
import { Button } from "./ui/button";
import MobileMenu from "./mobile-menu";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="sticky top-0 w-full h-16 bg-background/80 backdrop-blur-sm z-50">
      <Wrapper className="h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 uppercase tracking-widest"
            >
              <span className="text-xl font-semibold hidden lg:block">C</span>
              <Image
                src="/mario.png"
                alt="logo"
                className="w-6 h-6 -ml-[6px] -mr-[5px] rotate-12"
                width={24}
                height={24}
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
            <Link href="/start" className="hidden lg:block">
              <Button variant="blue">Get Started</Button>
            </Link>
            <MobileMenu />
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;
