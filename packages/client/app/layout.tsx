import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// تأكد من أن مسار الهيدر صحيح (غالبًا قمت بحفظه باسم Header.tsx)
import Header from "@/components/Header"; 
import Sidebar from "@/components/ui/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Hub",
  description: "A developer community platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* خلفية الصفحة بالكامل سوداء */}
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#030712] text-slate-200 min-h-screen flex flex-col font-sans antialiased`}>
        
        {/* 1. إضافة الهيدر هنا ليكون في أعلى الصفحة بكامل العرض */}
        <Header />

        {/* حاوية للمحتوى والسايدبار بحد أقصى للعرض */}
        <div className="flex flex-1 max-w-[1469px] mx-auto w-full">
          
          {/* السايدبار ثابت على اليسار */}
          <Sidebar />            
            
          {/* المحتوى الرئيسي */}
          <main className=" p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 w">
              {children}
          </main>
        </div>
      </body>
    </html>
  );
}