import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { TRPCProvider } from '@/components/provider/trpc-provider';
import { AuthProvider } from '@/components/provider/auth-provider';
import { ThemeProvider } from '@/components/provider/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { title: 'YouTube clone' };

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <TRPCProvider>
            <AuthProvider>{children}</AuthProvider>
          </TRPCProvider>
          <Toaster position='bottom-center' invert />
        </ThemeProvider>
      </body>
    </html>
  );
}
