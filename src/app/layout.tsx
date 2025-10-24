import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';

import { TRPCProvider } from '@/components/provider/trpc-provider';
import { AuthProvider } from '@/components/provider/auth-provider';
import { ThemeProvider } from '@/components/provider/theme-provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <TRPCProvider>
            <AuthProvider>{children}</AuthProvider>
          </TRPCProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const metadata: Metadata = { title: 'YouTube clone' };
