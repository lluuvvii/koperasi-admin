'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CircularProgress from '@mui/material/CircularProgress';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (status === 'unauthenticated' && pathname !== '/login') {
  //     router.push('/login');
  //   }
  // }, [status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // if (!session && pathname !== '/login') {
  //   return null;
  // }

  // if (pathname === '/login') {
  //   return <>{children}</>;
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}