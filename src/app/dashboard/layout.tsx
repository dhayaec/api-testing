'use client';
import { signOut, useSession } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div>
      <nav className="navbar bg-base-200 shadow-md p-4">
        <div className="flex-1">
          <a className="text-xl font-semibold">Dashboard</a>
        </div>
        {session && (
          <div className="flex-none">
            <p className="mr-4">
              {session.user?.name} ({session.user?.email})
            </p>
            <button className="btn btn-secondary" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        )}
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
