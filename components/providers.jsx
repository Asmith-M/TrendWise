'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}