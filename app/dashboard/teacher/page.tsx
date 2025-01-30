"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
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

    const fetchAssignments = async () => {
      try {
        const assignmentsSnapshot = await getDocs(collection(db, "assignments"));
        const assignmentsData = assignmentsSnapshot.docs.map((doc) => doc.data());
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des devoirs:", error);
      }
    };

    fetchUserData();
    fetchAssignments();
  }, [router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!userData) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord - Enseignant</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="mb-4">
          <strong>Email :</strong> {userData.email}
        </div>
        <div className="mb-4">
          <strong>Rôle :</strong> {userData.role}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Devoirs Créés</h2>
        {assignments.length === 0 ? (
          <div>Aucun devoir trouvé.</div>
        ) : (
          assignments.map((assignment, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p>{assignment.description}</p>
              <Button
                onClick={() => router.push(`/dashboard/teacher/assignments/${assignment.id}`)}
                className="w-full mt-2"
              >
                Voir le devoir
              </Button>
            </div>
          ))
        )}

        <Button
          onClick={() => router.push("/dashboard/teacher/assignments/create")}
          className="mt-4 w-full"
        >
          Créer un nouveau devoir
        </Button>
      </div>
    </div>
  );
}
