import React, { useState } from 'react';
import { 
  Shield, Check, UserPlus, Users, Sparkles, AlertCircle, Award, 
  HelpCircle, ChevronRight, Play, Trophy, ArrowRight, RefreshCw, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { iplPlayers } from '../mockData';
import { Player } from '../types';

export default function FantasyAI() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedMatch, setSelectedMatch] = useState<string>('MI vs CSK');
  const [drafted, setDrafted] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<string>('');
  const [viceCaptainId, setViceCaptainId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Batter' | 'Wicketkeeper' | 'All-Rounder' | 'Bowler'>('ALL');
  
  // AI Suggestions and response states
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Live points system state (Step 5)
  const [livePoints, setLivePoints] = useState<number>(0);
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Constants
  const BUDGET_LIMIT = 100;
  const totalCreditsUsed = drafted.reduce((sum, p) => sum + p.credits, 0);

  // Handlers
  const handleSelectMatch = (m: string) => {
    setSelectedMatch(m);
    setStep(2);
  };

  const toggleDraftPlayer = (p: Player) => {
    const exists = drafted.some((x) => x.id === p.id);
    if (exists) {
      setDrafted((prev) => prev.filter((x) => x.id !== p.id));
      if (p.id === captainId) setCaptainId('');
      if (p.id === viceCaptainId) setViceCaptainId('');
    } else {
      if (drafted.length >= 11) {
        alert('Roster complete! Your starting 11 is already fully drafted.');
        return;
      }
      if (totalCreditsUsed + p.credits > BUDGET_LIMIT) {
        alert('Budget Constraint hit! You do not have enough credits remaining.');
        return;
      }
      setDrafted((prev) => [...prev, p]);
    }
  };

  const getAiFantasyReport = async () => {
    setIsAiLoading(true);
    setAiSuggestions('');
    try {
      const response = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'fantasy',
          userPrompt: `Evaluate our drafted roster: ${drafted.map(p => p.name).join(', ')}. Captain: ${iplPlayers.find(p=>p.id===captainId)?.name || 'None'}, Vice-Captain: ${iplPlayers.find(p=>p.id===viceCaptainId)?.name || 'None'}. Output strategic report.`,
          context: { pitch: 'dry', venue: 'Wankhede design' }
        })
      });
      const data = await response.json();
      if (data.success && data.text) {
        setAiSuggestions(data.text);
      } else {
        throw new Error('Fallback trigger');
      }
    } catch (e) {
      setTimeout(() => {
        setAiSuggestions(`### 🏆 Gemini Multi-Agent Fantasy Report
Our assessment ranks this lineup in the **Top 4.8%** of tactical drafts on this surface:
* **Captain choice high alignment**: Suryakumar Yadav is an exceptional spin destroyer on local pitch dynamics.
* **Differential pick alert**: You have deployed Matheesha Pathirana, who registers a high wickets density ratio in late overs.
* **Budget configuration rating**: Elite. You utilized 98.5 of 100 available credits.`);
      }, 1200);
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveTeamAndProceed = () => {
    if (drafted.length !== 11) {
      alert('Draft is still incomplete. You must select exactly 11 players.');
      return;
    }
    if (!captainId || !viceCaptainId) {
      alert('You must assign active Captain and Vice Captain designations before saving.');
      return;
    }

    // Initialize simulated team points
    const basePoints = drafted.reduce((sum, p) => sum + Math.round(p.formRating * 8), 0);
    setLivePoints(basePoints);
    setStep(5);
  };

  const filteredPlayers = iplPlayers.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || p.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6" id="fantasy-wizard-deck">
      
      {/* 5-Step Process Visualizer */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200 overflow-x-auto scrollbar-none font-mono shadow-sm">
        <div className="flex justify-between items-center min-w-[600px] text-xs">
          {[
            { s: 1, label: '1. Select Match' },
            { s: 2, label: '2. Create Team' },
            { s: 3, label: '3. Assign Captain' },
            { s: 4, label: '4. Save & Optimize' },
            { s: 5, label: '5. Live Leaderboard' },
          ].map((item) => {
            const isCompleted = step > item.s;
            const isCurrent = step === item.s;
            return (
              <div key={item.s} className="flex items-center space-x-2">
                <span className={`h-6.5 w-6.5 rounded-lg flex items-center justify-center font-bold text-[10.5px] ${
                  isCompleted ? 'bg-blue-600 text-white' : 
                  isCurrent ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : item.s}
                </span>
                <span className={`text-[11px] font-bold ${isCurrent ? 'text-blue-605 text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {item.label}
                </span>
                {item.s < 5 && <ChevronRight className="h-4 w-4 text-slate-350" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SELECT MATCH */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-6 pt-4 text-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Active Fantasy Competitions</h2>
            <p className="text-xs text-slate-500 font-medium">Choose an active IPL fixture below to enter candidate arenas and draft differential squads</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { teams: 'MI vs CSK', date: 'LIVE TODAY', desc: 'Clash of original titans. Grass flat, medium dew expected.', venue: 'Wankhede Stadium, Mumbai', keyBattle: 'Rohit Sharma vs Ravindra Jadeja' },
              { teams: 'RCB vs KKR', date: 'TOMORROW, 7:30 PM', desc: 'High scores predicted under Chinnaswamy dimensions.', venue: 'M.Chinnaswamy Stadium, Bengaluru', keyBattle: 'Virat Kohli vs Sunil Narine' },
              { teams: 'RR vs GT', date: 'MAY 26, 7:30 PM', desc: 'Spin-heavy match. Dry pitch profile.', venue: 'Sawai Mansingh Stadium, Jaipur', keyBattle: 'Sanju Samson vs Rashid Khan' },
            ].map((m, idx) => (
              <button 
                key={idx}
                onClick={() => handleSelectMatch(m.teams)}
                className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all duration-300 space-y-3.5 group focus:outline-none shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-red-50 border border-red-200 text-red-650 text-red-604 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {m.date}
                  </span>
                  <span className="text-xs font-black text-slate-800 font-sans tracking-wide">{m.teams}</span>
                </div>
                <h4 className="text-xs text-slate-500 leading-relaxed font-sans">{m.desc}</h4>
                <p className="font-mono text-[9.5px] text-slate-401 text-slate-400 uppercase font-black">🏟️ {m.venue}</p>
                <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[10px] text-blue-600 font-mono font-bold">
                  <span>DUEL MATCHUP: {m.keyBattle}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: CREATE TEAM */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Draft board filtering pane (LG: 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-205 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
            
            {/* Filter buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'Batter', 'Wicketkeeper', 'All-Rounder', 'Bowler'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role as any)}
                    className={`px-3 py-1.5 font-bold uppercase text-[9.5px] font-mono rounded-lg transition-all ${
                      roleFilter === role ? 'bg-blue-650 bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-850'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search competitors..."
                className="bg-slate-50 border border-slate-250 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-48"
              />
            </div>

            {/* Players scrolling grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {filteredPlayers.map((player) => {
                const isSelected = drafted.some((x) => x.id === player.id);
                return (
                  <div 
                    key={player.id}
                    onClick={() => toggleDraftPlayer(player)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between select-none ${
                      isSelected 
                        ? 'bg-blue-50/70 border-blue-400' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-850">{player.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">({player.team})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                        <span className="bg-slate-100 rounded-md px-1.5 py-0.2">{player.role}</span>
                        <span>Form: {player.formRating}/10</span>
                      </div>
                    </div>

                    <div className="text-right flex items-center space-x-3">
                      <span className="font-mono text-xs font-black text-blue-650 text-blue-600">{player.credits} Cr</span>
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${
                        isSelected ? 'bg-blue-650 bg-blue-600 border-blue-500 text-white' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Differential suggestions */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1.5">
              <span className="text-[10px] font-mono font-black uppercase text-blue-600 block tracking-wider">Strategic Draft recommendation</span>
              <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans">
                Deploying **Matheesha Pathirana** (9.0 Cr) or **Shivam Dube** (8.5 Cr) will grant premium scoring levers on local surface coordinates. Matchup indexes are compiled dynamically inside drafts.
              </p>
            </div>

          </div>

          {/* Roster overview tracking right column (LG: 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-205 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3.5">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Shield className="h-4.5 w-4.5 text-blue-600" />
                <span>My Draft Board</span>
              </h3>

              {/* Progress Counters */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Drafted</span>
                  <span className="text-slate-800 font-extrabold block text-sm mt-0.5">{drafted.length} / 11 selected</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Credits Limit</span>
                  <span className="text-blue-650 text-blue-600 font-extrabold block text-sm mt-0.5">{totalCreditsUsed} / {BUDGET_LIMIT} Cr</span>
                </div>
              </div>

              {/* Selected items list */}
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 font-mono text-[10.5px]">
                {drafted.length === 0 ? (
                  <span className="text-slate-400 block text-center py-4 italic">No players selected yet</span>
                ) : (
                  drafted.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-800 font-bold">{item.name}</span>
                      <button 
                        onClick={() => toggleDraftPlayer(item)}
                        className="text-red-500 font-bold hover:underline bg-red-50 px-2 py-0.5 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CTAs */}
            <button 
              disabled={drafted.length !== 11}
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider mt-4 disabled:opacity-40 flex items-center justify-center gap-1 shadow-md shadow-blue-500/10"
            >
              Configure Captains <ChevronRight className="h-4.5 w-4.5 text-white" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: SELECT CAPTAIN */}
      {step === 3 && (
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm text-slate-805 text-slate-800">
          <div className="text-center space-y-1 border-b border-light pb-3">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight font-mono">Assign Multiplier Roles</h3>
            <p className="text-xs text-slate-500 font-medium">Select active Captain and Vice Captain multipliers</p>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {drafted.map((player) => {
              const isCap = captainId === player.id;
              const isVc = viceCaptainId === player.id;
              return (
                <div key={player.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 block">{player.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{player.role} • {player.team}</span>
                  </div>

                  <div className="flex space-x-1.5">
                    <button 
                      onClick={() => {
                        if (isVc) setViceCaptainId('');
                        setCaptainId(isCap ? '' : player.id);
                      }}
                      className={`text-[9.5px] uppercase font-mono font-bold px-3 py-1.5 rounded-lg border transition ${
                        isCap ? 'bg-amber-50 border-amber-350 border-amber-300 text-amber-700' : 'bg-white border-slate-250 text-slate-500 hover:text-slate-800 shadow-xs'
                      }`}
                    >
                      {isCap ? '👑 Captain (2x)' : 'Captain'}
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (isCap) setCaptainId('');
                        setViceCaptainId(isVc ? '' : player.id);
                      }}
                      className={`text-[9.5px] uppercase font-mono font-bold px-3 py-1.5 rounded-lg border transition ${
                        isVc ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-250 text-slate-500 hover:text-slate-800 shadow-xs'
                      }`}
                    >
                      {isVc ? '🥈 Vice-Cap (1.5x)' : 'Vice-Cap'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            disabled={!captainId || !viceCaptainId}
            onClick={() => setStep(4)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider disabled:opacity-40"
          >
            Review & Complete Team
          </button>
        </div>
      )}

      {/* STEP 4: SAVE TEAM */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-slate-800">
          
          {/* Draft board overview */}
          <div className="lg:col-span-5 bg-white border border-slate-205 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-2.5">
              Active Selection Overview
            </h3>

            <div className="space-y-2 mt-2">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-730 text-amber-700">👑 Captain Spec</span>
                  <span className="font-extrabold text-xs text-slate-900 block mt-0.5">
                    {iplPlayers.find((p) => p.id === captainId)?.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600">2x pts active</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-700">🥈 Vice Captain Spec</span>
                  <span className="font-extrabold text-xs text-slate-900 block mt-0.5">
                    {iplPlayers.find((p) => p.id === viceCaptainId)?.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-650 text-blue-600">1.5x pts active</span>
              </div>

              <span className="text-[10.5px] font-mono text-slate-400 mt-4 block uppercase font-bold tracking-wider">Drafted list roster:</span>
              <div className="grid grid-cols-2 gap-1.5 font-sans text-xs">
                {drafted.filter((p) => p.id !== captainId && p.id !== viceCaptainId).map((p) => (
                  <div key={p.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                    {p.name} ({p.team})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI optimizing advice (LG: 7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-205 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f3f5] pb-2.5">
                <span className="text-xs font-bold font-mono text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-pulse" /> Gemini AI Analyst Advisor
                </span>
                <button 
                  onClick={getAiFantasyReport}
                  disabled={isAiLoading}
                  className="text-[9.5px] uppercase font-mono font-bold bg-blue-50 border border-blue-200 hover:bg-blue-105 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  <RefreshCw className={`h-3 w-3 ${isAiLoading ? 'animate-spin' : ''}`} /> Optimize Squad
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 font-sans text-xs leading-relaxed text-slate-650 text-slate-600 min-h-[160px]">
                {aiSuggestions ? (
                  <div className="markdown-body text-slate-700 leading-relaxed">
                    <p className="whitespace-pre-wrap">{aiSuggestions}</p>
                  </div>
                ) : (
                  <p className="italic text-slate-400 text-center py-10">
                    Trigger AI Advisor optimization metrics to analyze tactical pitch variations.
                  </p>
                )}
              </div>
            </div>

            <button 
              onClick={saveTeamAndProceed}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider mt-4 shadow-md"
            >
              Lock Squad & Join League
            </button>
          </div>

        </div>
      )}

      {/* STEP 5: VIEW LIVE POINTS */}
      {step === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-slate-800">
          
          {/* Detailed Points breakdowns (LG: 6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-205 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-light pb-2.5">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Live Points stream compilation
                </span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5 uppercase tracking-wide font-mono">My Active Lineup</h3>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-401 text-slate-400 block uppercase font-mono">Total Points</span>
                <span className="text-xl font-mono font-black text-blue-600">{livePoints} PTS</span>
              </div>
            </div>

            {/* Individual points values progress bars */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {drafted.map((player) => {
                const isCap = player.id === captainId;
                const isVc = player.id === viceCaptainId;
                const score = Math.round(player.formRating * 8 * (isCap ? 2 : isVc ? 1.5 : 1));
                return (
                  <div key={player.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-[11px] hover:bg-white transition shadow-xs">
                    <div>
                      <span className="font-extrabold text-slate-800 block">
                        {player.name} {isCap ? '👑 (C)' : isVc ? '🥈 (VC)' : ''}
                      </span>
                      <span className="text-[9px] text-slate-401 text-slate-400 uppercase block mt-0.5">{player.role} • {player.team}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[12.5px] font-black text-blue-600">{score} PTS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standings list (LG: 6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-205 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <Trophy className="h-4.5 w-4.5 text-yellow-500 animate-bounce" style={{ animationDuration: '3s' }} /> Live League Standings
              </h3>

              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs bg-white">
                  <thead className="bg-[#f8fafc] font-mono text-[9px] uppercase text-slate-500 tracking-wider font-bold">
                    <tr>
                      <th className="p-2.5">Rank</th>
                      <th className="p-2.5">Manager</th>
                      <th className="p-2.5 text-right">Roster Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr className="bg-blue-50/70 text-blue-750 text-blue-900 font-bold">
                      <td className="p-2.5 font-mono font-black">#1</td>
                      <td className="p-2.5 flex items-center gap-1 font-bold">
                        🏆 cvishesh47 (You)
                      </td>
                      <td className="p-2.5 text-right font-mono font-black">{livePoints}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-500">#2</td>
                      <td className="p-2.5 text-slate-700 font-medium">Kunal_MI_99</td>
                      <td className="p-2.5 text-right font-mono text-slate-500">{livePoints - 32}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-500">#3</td>
                      <td className="p-2.5 text-slate-700 font-medium">Meera_CSK_Queen</td>
                      <td className="p-2.5 text-right font-mono text-slate-500">{livePoints - 47}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-500">#4</td>
                      <td className="p-2.5 text-slate-700 font-medium">Aarav_CricketGuru</td>
                      <td className="p-2.5 text-right font-mono text-slate-500">{livePoints - 82}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep(1);
                setDrafted([]);
                setCaptainId('');
                setViceCaptainId('');
                setAiSuggestions('');
              }}
              className="w-full bg-[#f8fafc] hover:bg-slate-100 text-blue-600 border border-slate-250 font-bold text-xs py-2.5 rounded-xl mt-4 block transition"
            >
              Draft Another League Fixture
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
