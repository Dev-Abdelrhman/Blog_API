"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Globe,       
  Sparkles,    
  Tags, 
  Mountain,    
  MessageSquare, 
  Users, 
  Building2,   
  FileText,
  LucideIcon // استيراد النوع للأيقونات
} from "lucide-react";

// 1. تعريف واجهة للخصائص لحل مشكلة any
interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isSpecial?: boolean;
  badge?: string | number;
}

const NavItem = ({ href, icon: Icon, label, isActive, isSpecial, badge }: NavItemProps) => {
  return (
    <Link 
      href={href} 
      className={`
        group flex items-center justify-between px-3 py-2 text-sm transition-all duration-200
        ${isActive 
          ? "bg-slate-900 border-r-[3px] border-orange-500 text-slate-100 font-bold" 
          : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border-r-[3px] border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-[18px] h-[18px] ${isSpecial ? "text-orange-500" : "opacity-70 group-hover:opacity-100"}`} />
        <span>{label}</span>
      </div>

      {badge && (
        <span className="text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-md shadow-sm shadow-blue-900/20">
          {badge}
        </span>
      )}
    </Link>
  );
};

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[180px]  hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 border-r border-slate-800 bg-[#030712] pt-8 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
      
      <nav className="flex flex-col gap-0.5 w-full">
        
        {/* --- HOME --- */}
        <NavItem href="/" icon={Home} label="Home" isActive={pathname === "/"} />

        {/* --- PUBLIC --- */}
        <div className="mt-6 mb-2 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          Public
        </div>

        <NavItem href="/questions" icon={Globe} label="Questions" isActive={pathname === "/questions"} />
        <NavItem href="/tags" icon={Tags} label="Tags" isActive={pathname === "/tags"} />
        <NavItem href="/users" icon={Users} label="Users" isActive={pathname === "/users"} />
        <NavItem href="/companies" icon={Building2} label="Companies" isActive={pathname === "/companies"} />

        {/* --- LABS (AI & Chat) --- */}
        <div className="mt-6 mb-2 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          Labs
        </div>
        
        <NavItem 
            href="/ai-assist" 
            icon={Sparkles} 
            label="AI Assist" 
            isSpecial={true} 
            badge="New" 
            isActive={pathname === "/ai-assist"} 
        />
        
        <NavItem 
            href="/chat" 
            icon={MessageSquare} 
            label="Discussions" 
            isSpecial={true} 
            isActive={pathname === "/chat"} 
        />

        {/* --- COLLECTIVES --- */}
        <div className="mt-6 mb-2 px-1 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          Collectives
        </div>
        
        <NavItem href="/explore" icon={Mountain} label="Explore" isActive={pathname === "/explore"} />
        
        {/* --- COMMUNITY --- */}
        <div className="mt-6 mb-2 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            Community
        </div>
        <NavItem href="/teams" icon={FileText} label="Teams" isActive={pathname === "/teams"} />

      </nav>
    </aside>
  );
}

export default Sidebar;