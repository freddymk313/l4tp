"use client";
import { usePathname } from "next/navigation";
import { navLinkHome } from "@/constants";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { BriefcaseBusiness } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 py-4 md:py-6 transition-colors duration-300 ${
        isScrolled ? "bg-white text-black shadow-md" : "bg-background text-foreground"
      }`}
    >
      <div className="flex gap-4 lg:gap-6 items-center justify-between px-4 md:px-14 lg:px-20">
        <Link className="flex items-center gap-x-1 md:gap-x-2" href={"/"}>
          {/* <BriefcaseBusiness size={32} /> */}
          <h1 className="text-2xl md:text-3xl">
            <span className="font-bold">CV.</span> Service
          </h1>
        </Link>

        {/* Navigation */}
        <div className="md:flex md:gap-x-4">
          <ul className="hidden md:flex items-center gap-x-3">
            {navLinkHome.map((link, idx) => (
              <li
                key={idx}
                className={`hover:text-gray-600 ${
                  pathname === link.href ? "text-primary" : "text-gray-600"
                }`}
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton Créer un CV */}
        <div className="flex items-center gap-1">
          <Link href="/creer-cv">
            <Button size={"xl"}>Créer un CV</Button>
          </Link>
          <div className="flex md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
