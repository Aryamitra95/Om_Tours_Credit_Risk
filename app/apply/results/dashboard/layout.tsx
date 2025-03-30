// app/apply/results/dashboard/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { account } from '@/app/lib/appwrite';
import { DashboardLayoutProps, handleLogout } from '@/app/lib/users';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        if (!user) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={async () => {
        await handleLogout();
        router.push('/login');
      }} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
