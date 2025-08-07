import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "../components/Sidebar";
import MobileNavigation from "../components/MobileNavigation";
import { Toaster } from "react-hot-toast";
import { ModeToggle } from "../components/ModeToggle";
export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className=" w-full md:pl-64 pb-20 md:pb-6">
        <div className="flex justify-end pt-4 px-6 md:pt-6">
          <ModeToggle />
        </div>
        <div className="">{children}</div>
      </main>
      <MobileNavigation />
    <Toaster position="top-right" />  
    </div>
    
  );
}
