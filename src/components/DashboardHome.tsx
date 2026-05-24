import React from 'react';
import { MatchState } from '../types';
import { teamStandings, upcomingMatches, trendingNews } from '../mockData';
import { 
  Radio, BarChart2, Users, Tv, Shield, Cpu, User, ArrowUpRight, Sparkles, Trophy, Calendar, Award, TrendingUp, HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardHomeProps {
  currentMatch: MatchState;
  goToLiveMatch: () => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardHome({ currentMatch, goToLiveMatch, setActiveTab }: DashboardHomeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 0.05, staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
      id="cricverse-saas-deck"
    >
      {/* Editorial Premium Hero Banner */}
      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden rounded-2xl border border-blue-105 bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        id="hero-banner"
      >
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-50 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 rounded-full bg-blue-55 bg-blue-50 border border-blue-100 px-3 py-1 text-[10.5px] font-bold text-blue-600 uppercase tracking-wider font-mono">
              <Sparkles className="h-3.5 w-3.5 text-blue-55 text-blue-600 animate-pulse" />
              <span>CricVerse Cognitive Intelligence Centre</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight leading-none uppercase">
              CricVerse AI
            </h2>
            <p className="max-w-xl text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              Experience responsive live scoreboards, cooperative fan leagues, real-time match projections, and optimized fantasy lineups generated via Gemini cognitive model engines.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('fantasy')}
              className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <Shield className="h-4 w-4" />
              <span>Build Fantasy Team</span>
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className="flex items-center space-x-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 px-4.5 py-3 text-xs font-bold uppercase transition"
            >
              <Tv className="h-4 w-4 text-slate-600" />
              <span>Watch Room Lounge</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout: Featured Match Box & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT COLUMN (8 cols): Featured match & navigation grids */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Featured Live Match Box */}
          <motion.div 
            variants={itemVariants} 
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.02)]"
            id="featured-live-match-box"
          >
            {/* Header of live box */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 font-mono">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600">LIVE IPL ACTION</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Wankhede Stadium • Match #48</span>
            </div>

            {/* Main live score display */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center">
                {/* Team A Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-4xl filter drop-shadow-sm select-none">{currentMatch.teamALogo}</div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">{currentMatch.teamA}</h3>
                    <p className="text-[10px] text-slate-405 font-mono font-bold uppercase tracking-wider text-slate-400">Batting First</p>
                  </div>
                </div>

                {/* Score Divider badge */}
                <div className="text-[10px] font-black text-slate-400 bg-slate-100 rounded-full px-3 py-1 font-mono">VS</div>

                {/* Team B Info */}
                <div className="flex items-center space-x-4 text-right flex-row-reverse">
                  <div className="text-4xl filter drop-shadow-sm select-none ml-4">{currentMatch.teamBLogo}</div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">{currentMatch.teamB}</h3>
                    <p className="text-[10px] text-slate-405 font-mono font-bold uppercase tracking-wider text-slate-400">Target Chase</p>
                  </div>
                </div>
              </div>

              {/* Graphical Run rates & scores */}
              <div className="border-t border-slate-100 pt-6 flex justify-between items-center font-mono">
                <div>
                  <div className="text-3xl font-black text-slate-800 tracking-tight">
                    {currentMatch.teamAScore.runs}/{currentMatch.teamAScore.wickets}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-0.5">{currentMatch.teamAScore.overs} Overs</div>
                </div>

                {/* Win Probabilities Bar */}
                <div className="flex-1 max-w-[200px] mx-4 text-center hidden sm:block">
                  <div className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">IPL Win Index</div>
                  
                  {/* Custom progress slider bar representation */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex my-2">
                    <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${currentMatch.winProbability[currentMatch.teamA]}%` }} />
                    <div className="bg-blue-500 h-full transition-all duration-305" style={{ width: `${currentMatch.winProbability[currentMatch.teamB]}%` }} />
                  </div>
                  <div className="text-[10.5px] text-blue-600 font-black">
                    {currentMatch.teamB} {currentMatch.winProbability[currentMatch.teamB]}% • {currentMatch.teamA} {currentMatch.winProbability[currentMatch.teamA]}%
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-blue-600 tracking-tight">
                    {currentMatch.teamBScore.runs}/{currentMatch.teamBScore.wickets}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold mt-0.5">{currentMatch.teamBScore.overs} Overs</div>
                </div>
              </div>

              {/* Bottom State readout & commentary preview */}
              <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-700">{currentMatch.statusText}</span>
                </div>
                <button
                  onClick={goToLiveMatch}
                  className="font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1 self-start md:self-auto"
                >
                  <span>Open Live Score Cast</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Navigation Cards Header & Grid */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-[11px] font-black font-mono tracking-widest text-slate-400 uppercase">CricVerse Services</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'live-score', label: 'Live Scorecast', desc: 'Realtime updates & stats', icon: Radio, color: 'bg-red-50 text-red-600 border-red-100' },
                { id: 'analysis', label: 'Match Intelligence', desc: '1v1 player battle reports', icon: BarChart2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { id: 'communities', label: 'Fan Communities', desc: 'Social chat & poll trivia', icon: Users, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { id: 'rooms', label: 'Watch Lounges', desc: 'Sync streaming watchparty', icon: Tv, color: 'bg-slate-100 text-slate-700 border-slate-200' },
                { id: 'fantasy', label: 'Cognitive Fantasy', desc: 'Differential XI lineups', icon: Shield, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { id: 'ai-assistant', label: 'Conversational Bot', desc: 'Instant cricket statistics', icon: Cpu, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { id: 'profile', label: 'Rivalry Profile', desc: 'Badges & career stats', icon: User, color: 'bg-pink-50 text-pink-600 border-pink-100' },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveTab(card.id)}
                    className="group text-left bg-white hover:bg-slate-50 border border-slate-200 p-4.5 rounded-2xl transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md focus:outline-none flex flex-col justify-between"
                  >
                    <div>
                      <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${card.color} transition-transform group-hover:scale-105`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-800 block mt-3.5 group-hover:text-blue-600 transition truncate">{card.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-snug font-medium">{card.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN (4 cols): AI match reports, Trending News */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Top AI Insights & Insights preview */}
          <motion.div 
            variants={itemVariants} 
            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
            id="ai-insights-panel"
          >
            <div className="flex items-center justify-between border-b border-slate-105 pb-3">
              <h3 className="text-xs font-black font-mono tracking-wider text-blue-600 uppercase flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-blue-600" /> AI Matches Insights
              </h3>
              <span className="text-[8.5px] font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">Realtime Feed</span>
            </div>
            
            <div className="space-y-3.5 font-sans">
              {trendingNews.map((news) => (
                <div key={news.id} className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 space-y-1.5 transition">
                  <span 
                    className="text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer block leading-snug"
                    onClick={() => setActiveTab('live-score')}
                  >
                    {news.title}
                  </span>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pt-1 font-bold">
                    <span>{news.time}</span>
                    <span className="text-blue-600 uppercase tracking-wider">{news.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active League Statistics capsule */}
          <motion.div 
            variants={itemVariants} 
            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
            id="active-league-highlights"
          >
            <h3 className="text-xs font-black font-mono text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="h-4.5 w-4.5 text-amber-500" /> League Leaderboard
            </h3>

            <div className="bg-slate-50/85 p-4 rounded-xl border border-slate-100 text-xs space-y-3">
              <div>
                <span className="font-extrabold text-slate-800 uppercase text-[11px] block text-blue-600">Mumbai Elite League</span>
                <span className="text-[9.5px] text-slate-400 font-bold block mt-0.5">FANTASY COMMUNITY RIVALRIES</span>
              </div>
              
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-slate-500 font-medium">My Ranking Position</span>
                  <span className="text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md">#1 of 142 Rivals</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-slate-500 font-medium">Accumulated Score</span>
                  <span className="text-blue-600 font-extrabold">842.50 PTS</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-sans">
                  <span className="text-slate-500 font-medium">Daily differential streak</span>
                  <span className="text-amber-600 font-extrabold">4/4 Completed</span>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('communities')}
                className="w-full text-center text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline mt-3 pt-3 border-t border-slate-100 block transition"
              >
                Enter Communities Lounge
              </button>
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
}
