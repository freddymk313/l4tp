"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assurez-vous d'avoir un composant Avatar pour afficher l'image du profil
import { FileText, LayoutDashboard, LogOut, User } from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Navigation à gauche */}
      <div className="w-20 bg-white text-white p-4 flex flex-col justify-between">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-foreground">
            <h1 className="text-xl font-bold mt-2">
              L4<span className="text-primary">TP</span>
            </h1>
          </div>

          <div className="flex flex-col space-y-4">
            <Link href="/dashboard/student" className="text-foreground">
              <LayoutDashboard className="text-xl" />
            </Link>
            <Link
              href="/dashboard/student/assignments"
              className="text-foreground"
            >
              <FileText className="text-xl" />
            </Link>
            <Link href="/dashboard/student/profile" className="text-foreground">
              <User className="text-xl" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Section en haut avec le nom de l'app et le profil */}
        <div className="flex items-center justify-end bg-white text-foreground py-7 shadow-md px-4">
          <div className="flex items-center space-x-4">
            <div className="*text-sm">{auth.currentUser?.email}</div>
            <div className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="text-xl" />
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <div className="flex-1 p-6 bg-gray-100">{children}</div>
      </div>
    </div>
  );
}
