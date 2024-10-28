'use client';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 shadow-xl p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary w-full">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
