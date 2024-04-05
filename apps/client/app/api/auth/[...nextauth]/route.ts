import { AUTH_PROVIDER } from '@/lib/auth';
import NextAuth from 'next-auth/next';

const handler = NextAuth(AUTH_PROVIDER);

export { handler as GET, handler as POST };
