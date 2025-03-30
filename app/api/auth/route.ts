import { account } from '@/app/lib/appwrite';
import { NextResponse } from 'next/server';
import { ID } from 'appwrite';

export async function POST(request: Request) {
  try {
    // Validate request content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json' },
        { status: 415 }
      );
    }

    // Parse and validate request body
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password must be strings' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create session
    const session = await account.createEmailPasswordSession(email, password);
    
    // Verify the session was created successfully
    if (!session || !session.userId) {
      throw new Error('Session creation failed');
    }

    // Get user details to verify
    const user = await account.get();
    if (!user) {
      await account.deleteSession('current');
      throw new Error('User verification failed');
    }

    // Return successful response without sensitive data
    return NextResponse.json({
      userId: session.userId,
      sessionId: session.$id,
      email: user.email,
      name: user.name,
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific Appwrite errors
    if (error.type === 'user_invalid_credentials') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (error.code === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: error.code || 500 }
    );
  }
}