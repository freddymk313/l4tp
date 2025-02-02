'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Assignment {
  id: string;
  title: string;
  description: string;
  studentName?: string;
  submittedAt?: { toDate: () => Date };
  link?: string;
}

export default function TeacherSubmittedAssignments() {
  const [submittedAssignments, setSubmittedAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      try {
        const assignmentsRef = collection(db, 'tps_submissions');
        // const q = query(assignmentsRef, where('status', '==', 'deposé'));
        const querySnapshot = await getDocs(assignmentsRef);

        const fetchedAssignments: Assignment[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Assignment[];

        setSubmittedAssignments(fetchedAssignments);
      } catch (error) {
        console.error('Erreur lors de la récupération des TP déposés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedAssignments();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">TP déposés par les étudiants</h1>
      
      {submittedAssignments.length === 0 ? (
        <p className="text-gray-500">Aucun TP déposé pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {submittedAssignments.map(tp => (
            <li key={tp.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">👤 Étudiant : {tp.studentName || 'Anonyme'}</p>
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{tp.title}</h2>
              <p className="text-gray-600">{tp.description}</p>

              {tp.link && (
                <a href={tp.link} target="_blank" className="text-green-500 block mt-2 hover:underline">
                  {tp.link}
                </a>
              )}

              <p className="text-sm text-gray-500 mt-2">
                📅 Déposé le : {tp.submittedAt?.toDate ? new Date(tp.submittedAt.toDate()).toLocaleDateString() : 'Date inconnue'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
