import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      // issuer: 'https://accounts.google.com'
      // clientId: process.env.AUTH_GOOGLE_ID!,
      // clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
    GitHub({
      issuer: 'https://github.com/login/oauth'
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token?.id as string;
      return session;
    }
  }
});
