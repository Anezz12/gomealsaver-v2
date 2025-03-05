import type { Metadata } from 'next';
import './assets/styles/globals.css';
import Navbar from './components/Home/Navbar';
import AuthProvider from './(auth)/login/AuthProvider';

export const metadata: Metadata = {
  title: 'GoMealSaver-v2',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
