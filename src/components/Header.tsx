import React from 'react';
import { 
  Home, Radio, BarChart2, Users, Tv, Shield, Cpu, User, Flame
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulating: boolean;
}

export default function Header({ activeTab, setActiveTab, isSimulating }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live-score', label: 'Live Score', icon: Radio },
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: Tv },
    { id: 'fantasy', label: 'Fantasy', icon: Shield },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Cpu },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Top Header - Desktop & Tablet Layout */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-[#0b1527] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          {/* Elite Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" id="header-logo-container" onClick={() => setActiveTab('home')}>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1852a4] p-0.5 shadow-[0_0_12px_rgba(24,82,164,0.5)] border border-white/20 select-none overflow-hidden">
              {/* Premium Vector IPL Silhouette */}
              <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="#1852a4" />
                {/* Curve swing path */}
                <path 
                  d="M16 35 C24 18, 42 16, 52 28 C56 34, 44 54, 35 68 C31 74, 29 77, 26 77 C25 77, 24 75, 25 72 C27 68, 38 46, 36 36 C34 32, 28 31, 16 35 Z" 
                  fill="white" 
                />
                {/* Batsman Head */}
                <circle cx="27" cy="37" r="3.2" fill="white" />
                {/* Bat line */}
                <path 
                  d="M29 37 L34 31 L32 29" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
                {/* Bold IPL Lettering */}
                <text 
                  x="51" 
                  y="59" 
                  fill="white" 
                  fontFamily="system-ui, -apple-system, sans-serif" 
                  fontWeight="900" 
                  fontSize="25" 
                  letterSpacing="-1.5"
                >
                  IPL
                </text>
                {/* Registered ® */}
                <text 
                  x="87" 
                  y="41" 
                  fill="white" 
                  fontFamily="sans-serif" 
                  fontWeight="bold" 
                  fontSize="7"
                >
                  ®
                </text>
              </svg>
              <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" id="active-indicator" />
            </div>
            <div className="leading-none">
              <h1 className="text-sm sm:text-base font-black tracking-tight uppercase text-white flex items-center gap-1">
                CRICVERSE <span className="text-blue-400">AI</span>
              </h1>
              <p className="text-[8px] text-blue-200/70 font-mono uppercase tracking-wider">Premium Soccer & Cricket Intel</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10 border-b-2 border-blue-400 rounded-b-none'
                      : 'text-slate-350 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-450' : 'text-slate-400'}`} />
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-300">
              <span className={`h-1.5 w-1.5 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isSimulating ? 'Live Feed' : 'Offline'}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-950 to-[#0e1e38] px-2.5 py-1 rounded-md border border-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
              <Flame className="h-3.5 w-3.5 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />
              <span>STREAK: 4 MATCHES</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Bottom Navigation - Mobile Devices Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b1527] border-t border-slate-800 px-2 py-2.5 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
                isActive ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[8.5px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
