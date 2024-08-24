'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the username is 'admin' and prompt for a password
    if (username === 'admin') {
      setIsPasswordRequired(true);
      return;
    }

    // Attempt to login the user
    try {
      const response = await fetch('/api/ninjaLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        onLogin(username);
        setError('');
      } else {
        setError('Failed to login');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication for admin
    if (password === 'CNDojo.123') {
      onLogin(username);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-4">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/background.jpg)' }}></div>

      {/* Title */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-7xl font-bold text-white">NINJA BUCKS</h1>
      </div>

      {/* Form and Image Container */}
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-between max-w-screen-lg w-full px-4">
          {/* Image */}
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <img
              src="/CodingNinja.png"
              alt="Description"
              width={500} // Adjust width as needed
              height={600} // Adjust height as needed
            />
          </div>

          {/* Login Form */}
          <div className="relative max-w-md w-full bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
            <form onSubmit={isPasswordRequired ? handleAdminLogin : handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {isPasswordRequired && (
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                style={{
                  background: 'linear-gradient(135deg, #F97316, #D946EF, #6D28D9)', // Reversed gradient
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #F97316, #D43F7B, #5B21B6)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #F97316, #D946EF, #6D28D9)'}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}
