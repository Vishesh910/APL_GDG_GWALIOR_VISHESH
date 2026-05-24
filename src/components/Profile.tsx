import React from 'react';
import { Award, Zap, Flame, Trophy, Calendar, Star, CircleUser, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  badge: string;
  unlocked: boolean;
  dateStr?: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'Captain Master', desc: 'Select a captain that earns 100+ points in a single match.', badge: '👑', unlocked: true, dateStr: 'May 18, 2026', rarity: 'Rare' },
  { id: 'ach-2', title: 'Differential Guru', desc: 'Select a wildcard picker chosen by under 10% of rivals who scores big.', badge: '🔮', unlocked: true, dateStr: 'May 20, 2026', rarity: 'Legendary' },
  { id: 'ach-3', title: 'Century Milestone', desc: 'Achieve a personal single-match fantasy score above 120 points.', badge: '💯', unlocked: true, dateStr: 'May 22, 2026', rarity: 'Common' },
  { id: 'ach-4', title: 'Banter Boss', desc: 'Participate and get voted active talker in 5 watch rooms chats.', badge: '🔥', unlocked: false, rarity: 'Common' },
  { id: 'ach-5', title: 'Matchup Strategist', desc: 'Win 3 consecutive player head-to-head battles on Analysis Board.', badge: '🎯', unlocked: false, rarity: 'Rare' },
];

const HISTORY_DATA = [
  { match: 'MI vs CSK', rating: 780 },
  { match: 'RCB vs KKR', rating: 810 },
  { match: 'RR vs GT', rating: 795 },
  { match: 'CSK vs KKR', rating: 842 },
];

export default function Profile() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-12"
      id="profile-section"
    >
      {/* Top Banner Profile Summary */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                🏏
              </div>
              <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-black text-xs h-6 w-6 rounded-full flex items-center justify-center border border-slate-900 font-mono">
                15
              </span>
            </div>
            
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
                <span>cvishesh47</span>
                <span className="text-[10px] bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Manager Elite
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">cvishesh47@gmail.com • Registered Fan</p>
              
              {/* Level XP bar */}
              <div className="mt-3.5 flex items-center gap-3">
                <div className="w-44 bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full" style={{ width: '72%' }} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">XP: 2,450 / 3,000 to Level 16</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 min-w-[100px] text-center">
              <span className="text-[10.5px] uppercase font-mono text-slate-400 font-bold block">Streak Status</span>
              <span className="text-2xl font-mono font-black text-amber-500 mt-1.5 flex items-center justify-center gap-1">
                <Flame className="h-5 w-5 text-amber-500 inline fill-amber-500" />
                4 Days
              </span>
            </div>
            
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 min-w-[100px] text-center">
              <span className="text-[10.5px] uppercase font-mono text-slate-400 font-bold block">Fantasy Points</span>
              <span className="text-2xl font-mono font-black text-cyan-400 mt-1.5 flex items-center justify-center gap-1">
                <Trophy className="h-5 w-5 text-cyan-400 inline" />
                842 pts
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Unlocked Achievements List */}
        <motion.div variants={itemVariants} className="lg:col-span-7 bg-slate-900/10 border border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-cyan-400" />
              <span>Unlocked Milestones & Badges</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {ACHIEVEMENTS.filter(a => a.unlocked).length} of {ACHIEVEMENTS.length} completed
            </span>
          </div>

          <div className="space-y-3.5">
            {ACHIEVEMENTS.map((ach) => (
              <div 
                key={ach.id} 
                className={`flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl border transition ${
                  ach.unlocked 
                    ? 'bg-slate-950/60 border-slate-850 hover:border-cyan-500/15' 
                    : 'bg-slate-950/20 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center text-xl select-none ${
                    ach.unlocked ? 'bg-gradient-to-br from-cyan-400/15 to-purple-500/15 border border-cyan-400/20' : 'bg-slate-900 border border-slate-800'
                  }`}>
                    {ach.badge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{ach.title}</span>
                      <span className={`text-[8.5px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        ach.rarity === 'Legendary' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        ach.rarity === 'Rare' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {ach.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{ach.desc}</p>
                  </div>
                </div>

                <div className="text-right mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 font-mono text-[10px] text-slate-500">
                  {ach.unlocked ? (
                    <span className="text-cyan-400 font-semibold uppercase">Unlocked {ach.dateStr}</span>
                  ) : (
                    <span className="text-slate-600 uppercase">Locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tactical Rating Progress Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-5 bg-slate-900/10 border border-white/5 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-purple-400" />
              <span>Fantasy Rating Trend</span>
            </h3>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 h-[180px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORY_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="profilePoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="match" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis domain={[700, 860]} stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                  itemStyle={{ color: '#00D4FF', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="rating" stroke="#00D4FF" strokeWidth={1.5} fillOpacity={1} fill="url(#profilePoints)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats table */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">Active Rooms</span>
              <span className="text-slate-100 font-bold block mt-1">12 Rooms joined</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">Community Rank</span>
              <span className="text-emerald-400 font-bold block mt-1">Top 3.2% global</span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
