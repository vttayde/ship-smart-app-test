import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, MockUser } from '@/lib/mock-db';

// Simple mock password verify (since bcrypt not available in mock mode)
function verifyPassword(raw: string, stored: string) {
  // stored format: 'mock$' + original
  if (stored.startsWith('mock$')) return stored === 'mock$' + raw;
  // fallback plain text comparison
  return stored === raw;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

  // Find user in mock database
  const user: MockUser | null = findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
  const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
