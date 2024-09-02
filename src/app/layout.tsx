import Modal from '@/components/Modal';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DiscordProvider } from '@/contexts/DiscordContext';
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
        className={cn(
          'min-h-screen dark:bg-[#313338] font-sans antialiased',
          inter.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SessionProvider>
            <DiscordProvider>
              <Modal />
              <ModalProvider />
              {children}
            </DiscordProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
