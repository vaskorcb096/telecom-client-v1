"use client";

import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopNavbar from "@/components/navbar/TopNavbar";
import MobileNavbar from "@/components/navbar/MobileNavbar";
import Script from "next/script";

export default async function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className="max-w-[1440px] mx-auto">
        <Providers>
          {!pathname.includes("/auth/sign-in") && (
            <div>
              <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:flex-col md:w-[256px]">
                <Sidebar />
              </div>

              <div className="md:pl-[256px]">
                <div className="sticky top-0 pt-5 pb-7 bg-white md:mx-auto px-4 md:px-8">
                  <TopNavbar />
                </div>
              </div>
            </div>
          )}
          <div
            className={!pathname.includes("/auth/sign-in") && "md:pl-[256px]"}
          >
            <div className="md:px-8">
              <div className="px-4 md:px-0 pb-24 sm:pb-0">{children}</div>

              {!pathname.includes("/auth/sign-in") && (
                <div className="fixed z-20 bottom-0 w-full py-5 bg-neutral-100 md:hidden mobile-navbar-shadow">
                  <MobileNavbar />
                </div>
              )}
            </div>
          </div>

          <Toaster position="top-right" reverseOrder={false} />
        </Providers>
      </body>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.1/html2pdf.bundle.min.js"></Script>
    </html>
  );
}
