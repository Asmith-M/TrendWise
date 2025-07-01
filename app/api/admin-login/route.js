import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set a simple cookie for admin session (expires in 1 day)
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
