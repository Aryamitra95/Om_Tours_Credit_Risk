import AuthForm from '@/app/components/AuthForm';
import { redirect } from 'next/navigation';
import { account } from '@/app/lib/appwrite';

export default async function LoginPage() {
  try {
    const session = await account.get();
    if (session) {
      redirect('/dashboard');
    }
  } catch (error) {
    console.log('No active session');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="login" />
    </div>
  );
}