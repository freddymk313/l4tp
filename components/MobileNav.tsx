"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BriefcaseBusiness, MenuIcon } from "lucide-react";
import { useState } from "react";
import { navLinkHome } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname= usePathname()

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon className="cursor-pointer" size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0 bg-white">
          <div className="space-y-4 py-2">
            <div className="px-3 py-2">
              <div>
              <Link className="flex items-center gap-x-1 md:gap-x-2" href={"/"}>
                {/* <BriefcaseBusiness size={32} /> */}
                  <h1 className="text-2xl md:text-3xl mt-1"><span className="font-bold">CV.</span> Service</h1>
              </Link>
              </div>

              <div className="mt-6">
                <ul className="space-y-2">
                  {navLinkHome.map((link, idx) => (
                    <li
                      key={idx}
                      className="w-full"
                    >
                      <Link href={link.href}
                        className={`block p-1.5 px-5 rounded-full ${
                          pathname === link.href ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                        }`}
                      >{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
