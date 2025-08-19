import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import TRPCProvider from '@/components/provider/trpc-provider';
import AuthProvider from '@/components/provider/auth-provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Triangle',
  description: 'A video website by Next.js'
};

type RootLayoutProps = { children: React.ReactNode };

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
