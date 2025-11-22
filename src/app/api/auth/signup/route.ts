import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, MockUser } from '@/lib/mock-db';

function hashPassword(raw: string) {
  return 'mock$' + raw;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
  const existingUser: MockUser | null = findUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash password
  const hashedPassword = hashPassword(password);

    // Create new user
    const newUser = createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || ''
    });

    // Return user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
