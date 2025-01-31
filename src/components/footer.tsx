import { TwitterIcon } from "lucide-react";

import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl flex flex-col gap-4 py-8 px-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-semibold">
          YourLogo
        </Link>

        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/privacy" className="hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms
          </Link>
        </nav>

        <Link
          href="https://twitter.com/yourhandle"
          target="_blank"
          className="text-muted-foreground hover:text-primary"
        >
          <TwitterIcon className="h-5 w-5" />
          <span className="sr-only">X</span>
        </Link>
      </div>
    </footer>
  );
}

export { Footer };
