'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/app/lib/appwrite';
import { ID } from 'appwrite';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Signup-specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');


  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');
        if (session) {
          
          router.push("/apply/results/dashboard")
        }
      } catch (error) {
       console.log('No valid session found')
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'signup') {
        // Create account
        await account.create(
          ID.unique(),
          email,
          password,
          `${firstName} ${lastName}`
        );
        
        // Update preferences
        await account.updatePrefs({
          firstName,
          lastName,
          state,
          city,
          country
        });
      }

      // Create session and verify it
      const session = await account.createEmailPasswordSession(email, password);
      
      if (!session) {
        throw new Error('Session creation failed');
      }

      // Verify session is active
      const currentSession = await account.get();
      if (!currentSession) {
        throw new Error('No active session');
      }

      // Store session token securely
      document.cookie = `appwrite-session=${session.secret}; path=/; secure; samesite=strict`;

      // Redirect to dashboard
      router.push('/apply/results/dashboard');

    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Handle specific error cases
      if (err.type === 'user_invalid_credentials') {
        setError('Invalid email or password');
      } else if (err.message.includes('No active session')) {
        setError('Session expired. Please login again.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center text-black">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h1>
      
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-1 text-black">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-gray-500"
                  required
                  placeholder='Enter firstname'
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 text-black">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-gray-500"
                  required
                  placeholder='Enter lastname'
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="state" className="block mb-1 text-black">State</label>
                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-gray-500"
                  required
                  placeholder='Enter the state of residence'
                  
                />
              </div>
              
              <div>
              <label htmlFor="city" className="block mb-1 text-black">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border rounded text-gray-500"
                required
                placeholder='Enter your city'
              />
            </div>
            </div>
            <div>
                <label htmlFor="country" className="block mb-1 text-black">Country</label>
                <input
            id="country"
            type="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-500"
            required
            placeholder='Enter your country'
          />
              </div>
            
           
          </>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 text-black">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-500"
            required
            placeholder="Your email address"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-black">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-500"
            required
            minLength={8}
            placeholder='Enter your password'
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center">
        {type === 'login' ? (
          <p className='text-gray-500'>
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        ) : (
          <p className='text-gray-500'>
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
