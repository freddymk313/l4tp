"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Par défaut étudiant
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = (value: any) => {
    setRole(value);
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Ajouter l'utilisateur à Firestore avec son prénom et son nom
      await setDoc(doc(db, "users", user.uid), {
        prenom: firstName,
        nom: lastName,
        email,
        role,
      });

      // Rediriger après l'inscription
      router.push(
        role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"
      );
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[30%] items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold mb-4">Inscription</h1>

      <Input
        placeholder="Prénom"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="rounded-lg py-6"
      />

      <Input
        placeholder="Nom"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="rounded-lg py-6"
      />

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

      {/* Sélection du rôle */}
      <Select onValueChange={handleRoleChange} value={role}>
        <SelectTrigger className="py-6 rounded-lg">
          <SelectValue placeholder="Sélectionnez un rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Étudiant</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={handleRegister}
        disabled={loading}
        className="mt-4 w-full"
        size={"xl"}
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </Button>

      <p className="text-sm text-center mt-2">
        Vous avez un compte?{" "}
        <span className="text-primary">
          <Link href={"/login"}>Connexion</Link>
        </span>
      </p>
    </div>
  );
}
