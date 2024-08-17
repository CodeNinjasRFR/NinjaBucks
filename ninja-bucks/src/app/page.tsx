'use client'
import React, { useEffect, useState } from 'react';
import ButtonModal from './components/buttonModule';
import NewUserButton from './components/newNinjaButton';

import { SnackbarProvider } from "notistack";

interface Ninja {
  id: number;
  name: string;
  bucks: number;
  location: string;
}

export default function Home() {
  const [ninjas, setNinjas] = useState<Ninja[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedNinja, setSelectedNinja] = useState<Ninja | null>(null);
  const [modalType, setModalType] = useState<'add' | 'subtract'>('add');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      fetchUsers(); // Fetch users when the modal is closed
    }
  }, [modalOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/ninjas', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setNinjas(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const handleNinjaAdded = () => {
    fetchUsers();
  };
  return (
    <SnackbarProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex-col">
          <div className="flex gap-4">
            <h1 className="text-2xl font-bold mb-4">Ninja List</h1>
            <NewUserButton onNinjaAdded={handleNinjaAdded}/>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 w-full">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bucks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 w-full">
              {ninjas.map((ninja) => (
                <tr key={ninja.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ninja.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ninja.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ninja.bucks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ninja.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() => {
                          setSelectedNinja(ninja);
                          setModalOpen(true);
                          setModalType('add');
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setSelectedNinja(ninja);
                          setModalOpen(true);
                          setModalType('subtract');
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        -
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedNinja && (
          <ButtonModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            type={modalType}
            id={selectedNinja.id}
          />
        )}
      </main>
    </SnackbarProvider>
  );
}
