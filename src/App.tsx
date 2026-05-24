import React, { useState } from 'react';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import LiveMatch from './components/LiveMatch';
import MatchupIntelligence from './components/MatchupIntelligence';
import Communities from './components/Communities';
import WatchPartyLounge from './components/WatchPartyLounge';
import FantasyAI from './components/FantasyAI';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';

import { featuredMatches } from './mockData';
import { MatchState } from './types';
import { Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentMatch, setCurrentMatch] = useState<MatchState>(featuredMatches[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(true); // active background counts
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardHome
            currentMatch={currentMatch}
            goToLiveMatch={() => setActiveTab('live-score')}
            setActiveTab={setActiveTab}
          />
        );
      case 'live-score':
        return (
          <LiveMatch
            currentMatch={currentMatch}
            setCurrentMatch={setCurrentMatch}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            simulationSpeed={simulationSpeed}
            setSimulationSpeed={setSimulationSpeed}
          />
        );
      case 'analysis':
        return <MatchupIntelligence />;
      case 'communities':
        return <Communities />;
      case 'rooms':
        return <WatchPartyLounge currentMatch={currentMatch} />;
      case 'fantasy':
        return <FantasyAI />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <DashboardHome
            currentMatch={currentMatch}
            goToLiveMatch={() => setActiveTab('live-score')}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  const getThemeConfig = () => {
    switch (activeTab) {
      case 'analysis':
        return {
          bg: 'bg-[#0b291e] text-emerald-50',
          gradient: (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <div className="absolute top-[5%] left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px]" />
              <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-green-600/5 blur-[120px]" />
              <div className="absolute inset-0 bg-[radial-gradient(#14532d_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            </div>
          ),
          footerBorder: 'border-emerald-800/30',
          footerBg: 'bg-[#061711]/90'
        };
      case 'rooms':
        return {
          bg: 'bg-[#070b13] text-slate-100',
          gradient: (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <div className="absolute top-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
              <div className="absolute bottom-[20%] right-[5%] h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
            </div>
          ),
          footerBorder: 'border-slate-800',
          footerBg: 'bg-[#04060b]/90'
        };
      default:
        // CricVerse AI Light Theme
        return {
          bg: 'bg-[#f4f7fa] text-slate-900',
          gradient: (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[130px]" />
              <div className="absolute bottom-1/4 right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-[120px]" />
            </div>
          ),
          footerBorder: 'border-slate-200',
          footerBg: 'bg-white/80'
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col justify-between antialiased transition-colors duration-300 selection:bg-blue-500/20 selection:text-[#1852a4]`}>
      {/* Dynamic Background layer */}
      {theme.gradient}

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navigation Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} isSimulating={isSimulating} />

        {/* Primary Page Canvas */}
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer block */}
      <footer className={`relative z-10 border-t ${theme.footerBorder} ${theme.footerBg} backdrop-blur-md py-6 transition-all duration-300 pb-20 md:pb-6`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-mono text-[10px] tracking-widest font-bold">CRICVERSE AI PLATFORM • COGNITIVE CORE v3.0</span>
          </div>
          <div className="font-medium text-center md:text-right">
            Designed with Premium Apple-SaaS Aesthetics. Powered by real-time multi-agent cricket analytics.
          </div>
        </div>
      </footer>
    </div>
  );
}
