import { account } from '@/app/lib/appwrite';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  try {
    // Check if user is already logged in
    const session = await account.get();
    
    if (session) {
      // Redirect to dashboard if authenticated
      redirect('/dashboard');
    }
  } catch (error) {
    // Ignore error - user is not logged in
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center text-black">Welcome to Form App</h1>
        <p className="text-center text-gray-600">
          A secure form submission application powered by Next.js and Appwrite
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="px-4 py-2 font-medium text-center text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </Link>
          
          <Link
            href="/signup"
            className="px-4 py-2 font-medium text-center text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Create Account
          </Link>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Features:</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Secure authentication</li>
            <li>Multiple form submissions</li>
            <li>Submission history</li>
            <li>Responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
