import Modal from '@/components/Modal';
import { ThemeProvider } from '@/components/ThemeProvider';
import ModalProvider from '@/contexts/ModalProvider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord++',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn('min-h-screen font-sans antialiased', inter.className)}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SessionProvider>
            <Modal />
            <ModalProvider />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
