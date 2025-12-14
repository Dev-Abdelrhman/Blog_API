"use client";

import Link from "next/link";
import { Search, Bell, User, Menu, Cpu } from "lucide-react"; 

function Header() {
  return (
    // 1. قمنا بإزالة الـ border-b التقليدي من هنا
    <header className="sticky top-0 z-50 w-full bg-[#030712] text-slate-100 shadow-xl">
      
      
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 justify-between relative">
        <div className="relative hidden md:flex items-center justify-center w-10 h-10 ">
             <Cpu className="w-8 h-8 text-orange-500" />
             <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full"></div>
        </div>
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button className="md:hidden text-slate-400 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center gap-1 font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity">
            <span className="text-blue-600">Code</span>
            <span className="text-orange-500">Hub</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="w-full max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search components, code..." 
              className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="md:hidden text-slate-400 hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          <button className="relative text-slate-400 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#030712]"></span>
          </button>
          
          {/* Avatar with Gradient Border (كما طلبت سابقًا للأيقونة) */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <User className="h-5 w-5 text-slate-300" /> 
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
        Gradient Bottom Border Line
        هذا هو السطر الذي يصنع البوردر المتدرج للهيدر
        ========================================
      */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 to-orange-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
    </header>
  );
}

export default Header;