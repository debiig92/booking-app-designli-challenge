import { Suspense } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';
export const metadata = { title: 'Bookings', description: 'Demo' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>   <body className="min-h-screen bg-gray-50 text-gray-900"><Suspense>{children}</Suspense></body> </UserProvider>
    </html>
  );
}
