'use client';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    await signIn('credentials', {
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 shadow-xl p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-4"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
        />
        <button type="submit" className="btn btn-primary w-full">
          Sign In
        </button>
      </form>
    </div>
  );
}
