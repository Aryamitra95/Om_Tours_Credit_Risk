import { account } from '@/app/lib/appwrite';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Verify the request is coming from your application
    const origin = request.headers.get('origin');
    if (origin && !origin.match(/yourdomain\.com$/)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    // Check for existing session
    const session = await account.getSession('current');
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    // Get user details
    const user = await account.get();
    
    if (!user) {
      // Clean up invalid session
      await account.deleteSession('current');
      return NextResponse.json(
        { error: 'Session verification failed' },
        { status: 401 }
      );
    }

    // Return minimal necessary user information
    const safeUserData = {
      id: user.$id,
      name: user.name,
      email: user.email,
      emailVerification: user.emailVerification,
      preferences: user.prefs,
      sessionCreated: session.$createdAt,
      sessionExpiry: session.expire
    };

    return NextResponse.json(safeUserData);

  } catch (error: any) {
    console.error('Session verification error:', error);
    
    // Handle specific Appwrite errors
    if (error.code === 401 || error.type === 'general_unauthorized_scope') {
      return NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    if (error.code === 429) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to verify session' },
      { status: error.code || 500 }
    );
  }
}