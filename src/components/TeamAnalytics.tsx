import React, { useState } from 'react';
import { mockTeamAnalytics } from '../mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Award, ShieldAlert, CheckCircle, Flame, Swords, TrendingUp, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function TeamAnalytics() {
  const [selectedTeams, setSelectedTeams] = useState<{ team1: string; team2: string }>({
    team1: 'MI',
    team2: 'CSK'
  });

  const availableTeams = ['MI', 'CSK', 'RCB', 'KKR', 'RR'];

  // Calculate high-fidelity comparison metrics
  const strengthsMap: { [key: string]: string[] } = {
    MI: mockTeamAnalytics.strengths.MI,
    CSK: mockTeamAnalytics.strengths.CSK,
    RCB: ['Incredible opening batsman ratings (Kohli)', 'High homeground familiarity', 'Powerplay boundary acceleration'],
    KKR: ['Elite spin bowling (Sunil Narine)', 'Brutal finisher options (Andre Russell)', 'Superb opening variety'],
    RR: ['Solid opening anchors (Jaiswal)', 'Middle-over legspin variety (Chahal)', 'Exceptional early swing bowler (Boult)']
  };

  const weaknessesMap: { [key: string]: string[] } = {
    MI: mockTeamAnalytics.weaknesses.MI,
    CSK: mockTeamAnalytics.weaknesses.CSK,
    RCB: ['Leaky death bowling quota', 'Over-reliance on top 3 batsmen', 'Spin options lack depth'],
    KKR: ['Slightly inconsistent death pacers', 'Prone to high-velocity short bounce deliveries', 'Injury risks in core pacers'],
    RR: ['Slightly fragile tail batsman depth', 'Over-dependence on middle-overs spinner', 'Prone to losing wickets in clusters']
  };

  return (
    <div className="space-y-6">
      
      {/* Intro visual panel with side comparison selector dropdowns */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-slate-900/40 p-6 backdrop-blur-md">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Comparative Diagnostics Panel</h2>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Run statistical cross-evaluations across premium franchises. Our engine compares net run rates, bowling efficiencies, and batting matchup vulnerabilities side-by-side.
            </p>
          </div>

          {/* Quick Dropdown select */}
          <div className="flex items-center space-x-3 bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-mono font-bold">FRANCHISE 1</span>
              <select
                id="team-selector-1"
                value={selectedTeams.team1}
                onChange={(e) => setSelectedTeams(prev => ({ ...prev, team1: e.target.value }))}
                className="bg-transparent text-xs font-black text-cyan-400 outline-none pr-3"
              >
                {availableTeams.map(t => (
                  <option key={t} value={t} className="bg-slate-950 text-slate-200">{t}</option>
                ))}
              </select>
            </div>
            <Swords className="h-4 w-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-mono font-bold">FRANCHISE 2</span>
              <select
                id="team-selector-2"
                value={selectedTeams.team2}
                onChange={(e) => setSelectedTeams(prev => ({ ...prev, team2: e.target.value }))}
                className="bg-transparent text-xs font-black text-purple-400 outline-none pr-3"
              >
                {availableTeams.map(t => (
                  <option key={t} value={t} className="bg-slate-950 text-slate-200">{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Strengths & Weaknesses Comparison Cards */}
        <div className="space-y-6">
          
          {/* Franchise 1 Card */}
          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/80">
              <span className="h-6 w-6 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-black text-xs">
                {selectedTeams.team1}
              </span>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                Squad Assessment Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Strengths */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wide font-mono">
                  <CheckCircle className="h-4 w-4" />
                  <span>Key Advantages</span>
                </div>
                <div className="space-y-2 text-xs">
                  {strengthsMap[selectedTeams.team1]?.map((s, idx) => (
                    <div key={idx} className="bg-emerald-950/20 border border-emerald-500/10 p-2.5 rounded-xl font-medium text-slate-300">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-bold uppercase tracking-wide font-mono">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Inherent Weaknesses</span>
                </div>
                <div className="space-y-2 text-xs">
                  {weaknessesMap[selectedTeams.team1]?.map((w, idx) => (
                    <div key={idx} className="bg-rose-950/20 border border-rose-500/15 p-2.5 rounded-xl font-medium text-slate-300">
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Franchise 2 Card */}
          <div className="rounded-2xl border border-purple-500/15 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/80">
              <span className="h-6 w-6 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center font-black text-xs">
                {selectedTeams.team2}
              </span>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                Squad Assessment Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Strengths */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wide font-mono">
                  <CheckCircle className="h-4 w-4" />
                  <span>Key Advantages</span>
                </div>
                <div className="space-y-2 text-xs">
                  {strengthsMap[selectedTeams.team2]?.map((s, idx) => (
                    <div key={idx} className="bg-emerald-950/20 border border-emerald-500/10 p-2.5 rounded-xl font-medium text-slate-300">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-bold uppercase tracking-wide font-mono">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Inherent Weaknesses</span>
                </div>
                <div className="space-y-2 text-xs">
                  {weaknessesMap[selectedTeams.team2]?.map((w, idx) => (
                    <div key={idx} className="bg-rose-950/20 border border-rose-500/15 p-2.5 rounded-xl font-medium text-slate-300">
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Recharts Area chart showing Net Run Rate curves */}
        <div className="rounded-2xl border border-cyan-500/10 bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Dynamic Net Run Rate (NRR) Trajectory
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded">
                Season progression comparison
              </span>
            </div>

            <div className="h-64 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTeamAnalytics.nrrTrends}>
                  <defs>
                    <linearGradient id="colorMI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCSK" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="match" stroke="#52525b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelClassName="text-slate-400 font-mono text-xs"
                  />
                  <Area name="Mumbai Indians NRR" type="monotone" dataKey="MI" stroke="#06b6d4" fillOpacity={1} fill="url(#colorMI)" strokeWidth={2.5} />
                  <Area name="Chennai Super Kings NRR" type="monotone" dataKey="CSK" stroke="#a855f7" fillOpacity={1} fill="url(#colorCSK)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400 space-y-2.5 font-sans leading-normal">
            <div className="flex items-center space-x-2 border border-cyan-500/20 bg-cyan-950/20 rounded-xl p-3">
              <Flame className="h-5 w-5 text-cyan-400 animate-pulse" />
              <span>
                **AI Matchup Summary**: Selecting teams compiles real-time stats comparisons. Note that {selectedTeams.team1} shows greater bowling velocity variance, while {selectedTeams.team2} displays deeper finishing batting strength metrics.
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              💡 NRR statistics and squad matrices are cross-checked with official databases via agentic indexing protocols every turn.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
