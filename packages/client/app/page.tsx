"use client";

import Image from "next/image";

export default function Home() {
  return (
    // 1. تم تغيير main إلى div
    // 2. تم حذف max-w-3xl لتأخذ العرض الكامل
    // 3. تم حذف bg-white dark:bg-black لأن الخلفية محددة مسبقًا في الـ Layout
    <div className="flex w-full flex-col items-center pt-20 gap-6 alaign-center px-4 sm:px-6 lg:px-8 ">
      
      <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-slate-100 sm:text-6xl">
        Welcome to <span className="text-blue-600">Code <span className="text-orange-500">Hub</span></span>
      </h1>
      
      <p className="text-slate-400 text-lg text-center max-w-2xl">
        The developer community platform where you can share code, ask questions, and innovate.
      </p>

    </div>
  );
}