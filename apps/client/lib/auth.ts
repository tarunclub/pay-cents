import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './db';

export const AUTH_PROVIDER = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'phone', type: 'text', placeholder: '' },
        password: { label: 'password', type: 'password', placeholder: '' },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findFirst({
          where: {
            number: credentials.number,
          },
        });

        if (user) {
          const comparePassword = await bcrypt.compare(
            user.password,
            credentials.password
          );

          if (!comparePassword) {
            throw new Error('Wrong password');
          }

          return {
            id: user.id,
            phone: user.number,
            name: user.name,
          };
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const newUser = await prisma.user.create({
          data: {
            name: `${credentials.phone}`,
            number: credentials.phone,
            password: hashedPassword,
          },
        });

        return {
          name: newUser.name,
          phone: newUser.number,
          id: newUser.id,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
