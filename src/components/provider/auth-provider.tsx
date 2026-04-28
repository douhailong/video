'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }: ChildrenProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
