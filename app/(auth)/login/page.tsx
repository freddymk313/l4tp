"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Récupérer le rôle depuis Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "student";

      // Redirection selon le rôle
      router.push(
        role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"
      );
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[30%] items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold mb-4">Connexion</h1>
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg py-6"
      />
      <Input
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg py-6"
      />
      <Button
        onClick={handleLogin}
        disabled={loading}
        className="mt-4 w-full"
        size={"xl"}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>

      <p className="text-sm text-center mt-2">
        Vous n'avez pas de compte?{" "}
        <span className="text-primary">
          <Link href={"/register"}>S'inscrire</Link>
        </span>
      </p>
    </div>
  );
}
