import { TwitterIcon, GithubIcon } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="fixed bottom-4 right-4">
      <div className="flex items-center gap-4">
        <Link
          href="https://twitter.com/yourhandle"
          target="_blank"
          className="text-muted-foreground hover:text-primary"
          aria-label="Twitter"
        >
          <TwitterIcon className="h-8 w-8" />
        </Link>
        <Link
          href="https://github.com/yourhandle"
          target="_blank"
          className="text-muted-foreground hover:text-primary"
          aria-label="GitHub"
        >
          <GithubIcon className="h-8 w-8" />
        </Link>
      </div>
    </footer>
  );
}

export { Footer };
