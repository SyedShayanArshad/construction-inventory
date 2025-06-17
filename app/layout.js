import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from './components/Sidebar';
import MobileNavigation from './components/MobileNavigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Construction Inventory Management",
  description: "Inventory management system for construction materials businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`} suppressHydrationWarning
      >
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Sidebar />
          <main className="flex-1 w-full md:pl-64 pb-20 md:pb-6">
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>
          <MobileNavigation />
        </div>
      </body>
    </html>
  );
}
