'use client'
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

interface NewUserButtonProps {
  onNinjaAdded: () => void;
}

const DeleteNinjaButton: React.FC<NewUserButtonProps> = ({ onNinjaAdded }) => {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const snackbar = useSnackbar();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const response = await fetch('/api/deleteNinja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, reason }),
    });
    if (response.status === 200) {
      snackbar.enqueueSnackbar('User deleted successfully', { variant: 'success', autoHideDuration: 3000 });
      onNinjaAdded(); // Trigger refresh in parent component
    } else {
        const result = await response.json(); // Parse the JSON response

        snackbar.enqueueSnackbar(result.error, { variant: 'error', autoHideDuration: 3000 });
    }

    setName('');
    setReason('');
    setModalOpen(false); // Optionally close the modal after submit
  };

  return (
    <>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-500 text-white px-8 py-2 rounded w-48 h-9"
          >
            Delete Ninja
          </button>
        </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Existing Ninja</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Confirm Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteNinjaButton;
