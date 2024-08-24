'use client'
import React, { useState } from 'react';

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

      if (response.status==200) {
        const data = await response.json();
        console.log(data)
        onLogin(username)
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={isPasswordRequired ? handleAdminLogin : handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
