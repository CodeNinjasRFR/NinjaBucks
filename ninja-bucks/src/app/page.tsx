'use client'
import Image from "next/image";
import React, { useEffect, useState } from 'react';
interface Ninja {
  id: number;
  name: string;
  bucks: number;
  location:string;
  // Add other properties as per your user object schema
}
export default function Home() {
  const [ninjas, setNinjas] = useState<Ninja[]>([]);

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/ninjas',{
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json()
      console.log(data)
      setNinjas(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex-col">
      <h1 className="text-2xl font-bold mb-4">Ninja List</h1>
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
                  <button
                    onClick={() => console.log(ninja)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
