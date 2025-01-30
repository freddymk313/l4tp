"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { User, FileText } from "lucide-react"; // Ajout d'icônes

export default function StudentProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifie l'état de l'utilisateur connecté
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        router.push("/login"); // Rediriger l'utilisateur vers la page de connexion s'il n'est pas connecté
        return;
      }

      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("Utilisateur non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center">Chargement...</div>;
  }

  if (!userData) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 *min-h-screen">
      {/* Informations personnelles */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <User className="mr-2" /> Informations personnelles
        </h2>
        <div className="mb-4">
          <strong className="text-gray-700">Email :</strong> {userData.email}
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Rôle :</strong> {userData.role}
        </div>
      </div>
    </div>
  );
}
