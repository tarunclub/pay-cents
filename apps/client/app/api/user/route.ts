import { AUTH_PROVIDER } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(AUTH_PROVIDER);
    if (session?.user) {
      return NextResponse.json({
        user: session.user,
      });
    }
    return NextResponse.json({
      success: false,
    });
  } catch (error) {
    throw new Error('Error', error!);
  }
}
