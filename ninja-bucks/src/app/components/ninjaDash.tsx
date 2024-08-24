import React, { useEffect, useState } from 'react';

interface NinjaDashProps {
  name: string;
  onLogout: () => void;
}

interface Transaction {
  date: string;
  amount: string;
  description: string;
}

interface NinjaInfo {
  bucks: number;
  location: string;
}

const NinjaDash: React.FC<NinjaDashProps> = ({ name, onLogout }) => {
  const [ninjaInfo, setNinjaInfo] = useState<NinjaInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder transaction history
  const transactionHistory: Transaction[] = [
    { date: '2024-08-01', amount: '+100', description: 'Added funds' },
    { date: '2024-08-05', amount: '-50', description: 'Purchase' },
    // Add more transactions as needed
  ];

  useEffect(() => {
    const fetchNinjaInfo = async () => {
      try {
        const response = await fetch('/api/ninjaInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: name }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: NinjaInfo = await response.json();
        setNinjaInfo(data);
      } catch (error) {
        setError('Failed to fetch ninja info');
        console.error('Error fetching ninja info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNinjaInfo();
  }, [name]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }


  if (!ninjaInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>No information available</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen p-6 bg-gray-100">
      {/* Left side with image */}
      <div className="flex-none w-1/3 pr-6">
        <img
          src="https://via.placeholder.com/300" // Replace with actual image URL
          alt={`${name} profile`}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Right side with details */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg relative">
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>

        <h2 className="text-3xl font-bold mb-4">{name}</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Balance</h3>
          <p className="text-lg text-gray-700">${ninjaInfo.bucks}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <p className="text-lg text-gray-700">{ninjaInfo.location}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
          <ul className="list-disc pl-5">
            {transactionHistory.map((transaction, index) => (
              <li key={index} className="mb-2">
                <p className="text-gray-800">
                  <strong>{transaction.date}:</strong> {transaction.amount} - {transaction.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NinjaDash;
