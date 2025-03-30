'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/app/lib/appwrite';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        setLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}