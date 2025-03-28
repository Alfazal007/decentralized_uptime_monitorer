import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import UserProvider from './context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MonitorPro - Website Monitoring Platform',
    description: 'Monitor your websites with real-time insights and alerts',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <UserProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </UserProvider>
            </body>
        </html>
    );
}
