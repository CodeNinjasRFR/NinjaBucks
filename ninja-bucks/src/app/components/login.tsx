'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import CodeNinjaImage from '../../../public/codingNinja.png';

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

    if (username === 'admin') {
      setIsPasswordRequired(true);
      return;
    }

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
            <Image
              src={CodeNinjaImage}
              alt="Description"
              width={500} // Adjust width as needed
              height={600} // Adjust height as needed
            />
          </div>

          {/* Login Form */}
          <div className="relative max-w-md w-full bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
            <form onSubmit={isPasswordRequired ? handleAdminLogin : handleLogin}>
              <div className="mb-6">
                <div className="flex items-center">
                  <label htmlFor="username" className="block text-sm font-medium text-white flex items-center">
                    Username
                    {/* Tooltip Icon */}
                    <div className="relative ml-2 flex items-center group">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm.5 17h-1v-9h1v9zm-.5-12c.466 0 .845.378.845.845 0 .466-.379.844-.845.844-.466 0-.845-.378-.845-.844 0-.467.379-.845.845-.845z" stroke='white'/>
                    </svg>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Ninjas - your username is just your first and last name 
                        <br/>
                        Ex - John Doe
                      </div>
                    </div>
                  </label>
                </div>
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
