import Link from "next/link";

export function Navbar() {
  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 w-full p-4 pl-6 z-50">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">LOGO</span>
        </Link>
      </nav>
    </div>
  );
}
