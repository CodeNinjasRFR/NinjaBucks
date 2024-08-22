'use client'
import React, { useEffect, useState } from 'react';
import ButtonModal from './components/buttonModule';
import NewUserButton from './components/newNinjaButton';
import Login from './components/login';
import DeleteNinjaButton from './components/deleteNinjaButton';
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
  const [loggedIn, setLoggedIn] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filterText, setFilterText] = useState<string>(''); 
  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterText]);

  useEffect(() => {
    if (!modalOpen) {
      fetchUsers(); // Fetch users when the modal is closed
    }
  }, [modalOpen]);
  const handleLogin = (username: string) => {
    setLoggedIn(username);
  };
  const handleLogout = () => {
    setLoggedIn(null);
  }
  const fetchUsers = async () => {
    try {
        const response = await fetch(`/api/ninjas?page=${currentPage}&limit=${10}&filter=${encodeURIComponent(filterText)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setNinjas(data.data);
        setTotalPages(data.pagination.totalPages);
        console.log("totalPages"+totalPages);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
  const handleNinjaAdded = () => {
    fetchUsers();
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("changed")
    setFilterText(event.target.value);
    console.log(event.target.value)
    setCurrentPage(1);
  };
  return (
    <SnackbarProvider>
      {/* if not logged in render login component here, else render the rest of the page*/}
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex-col">
        <div className="flex justify-between items-center mb-4">
              {/* Left section with title and filter */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Ninja List</h1>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border px-4 py-2 rounded"
                  value={filterText}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Right section with buttons */}
              <div className="flex gap-4">
                <NewUserButton onNinjaAdded={handleNinjaAdded} />
                <DeleteNinjaButton onNinjaAdded={handleNinjaAdded} />
                <button
                  onClick={handleLogout}
                  className="bg-gray-500 text-white px-8 rounded h-9"
                >
                  Logout
                </button>
              </div>
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
          <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
        </div>
        {selectedNinja && (
          <ButtonModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            type={modalType}
            id={selectedNinja.id}
          />
        )}
      </main>)}
    </SnackbarProvider>
  );
}
