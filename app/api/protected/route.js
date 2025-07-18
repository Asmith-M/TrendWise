import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: 'This is protected data!',
    user: session.user
  });
}