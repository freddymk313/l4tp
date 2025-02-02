'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: any;
  status: string;
}

export default function AssignmentDetails() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAssignment = async () => {
      try {
        const assignmentId = Array.isArray(id) ? id[0] : id;
        const docRef = doc(db, 'tps', assignmentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAssignment({
            id: docSnap.id,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            status: data.status,
          });
        } else {
          console.log('Aucun devoir trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du devoir:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  if (loading) return <div className='text-center text-gray-500'>Chargement...</div>;
  if (!assignment) return <div className='text-center text-red-500'>Devoir introuvable.</div>;

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6'>
      <h1 className='text-2xl font-bold text-gray-800'>{assignment.title}</h1>
      <p className='text-gray-600 mt-2'>{assignment.description}</p>

      <div className='mt-4'>
        <p className='text-sm text-gray-500'>📅 Date limite: {new Date(assignment.dueDate.toDate()).toLocaleDateString()}</p>
        <p className='text-sm text-gray-500'>🚀 Statut: <span className='font-medium'>{assignment.status}</span></p>
      </div>

      <div className='mt-6 flex gap-4'>
        <Link href='/dashboard/teacher/assignments'>
          <span className='text-blue-500 hover:underline cursor-pointer'>⬅ Retour</span>
        </Link>
      </div>
    </div>
  );
}
