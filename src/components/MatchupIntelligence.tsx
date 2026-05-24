import React, { useState } from 'react';
import { 
  Swords, MapPin, TrendingUp, Award, Sparkles, Target, Users, Cpu, Star, Activity, BarChart2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { iplPlayers } from '../mockData';
import { Player } from '../types';

export default function MatchupIntelligence() {
  const [selectedTab, setSelectedTab] = useState<'team-compare' | 'player-battle'>('team-compare');
  
  // Team comparison states
  const [teamA, setTeamA] = useState('CSK');
  const [teamB, setTeamB] = useState('MI');

  // Player matchup states
  const [selectedBatter, setSelectedBatter] = useState('Shivam Dube');
  const [selectedBowler, setSelectedBowler] = useState('Jasprit Bumrah');
  const [aiInsightOverridden, setAiInsightOverridden] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const teamList = ['CSK', 'MI', 'RCB', 'KKR', 'GT', 'RR'];

  // Mock team matrix database
  const teamMetrics: { [key: string]: { batting: number; bowling: number; powerplay: number; deathOvers: number; tossAdv: number; winPct: number } } = {
    CSK: { batting: 88, bowling: 84, powerplay: 82, deathOvers: 91, tossAdv: 56, winPct: 54 },
    MI: { batting: 85, bowling: 89, powerplay: 88, deathOvers: 86, tossAdv: 51, winPct: 52 },
    RCB: { batting: 90, bowling: 78, powerplay: 85, deathOvers: 76, tossAdv: 48, winPct: 45 },
    KKR: { batting: 86, bowling: 87, powerplay: 84, deathOvers: 82, tossAdv: 53, winPct: 50 },
    GT: { batting: 82, bowling: 85, powerplay: 80, deathOvers: 88, tossAdv: 55, winPct: 48 },
    RR: { batting: 84, bowling: 88, powerplay: 83, deathOvers: 84, tossAdv: 52, winPct: 51 },
  };

  const getCombinedStats = (bName: string, bldName: string) => {
    if (bName === 'Shivam Dube' && bldName === 'Jasprit Bumrah') {
      return {
        runs: 42,
        balls: 28,
        dismissals: 2,
        strikeRate: 150.0,
        average: 21.0,
        dotBallPct: 35,
        boundaryPct: 22,
        venueTrend: 'Wankhede short leg yields high boundary index',
        domesticMatchup: 'SMAT: Dube scoring at 138 SR vs Bumrah archetype',
        aiInsight: 'Shivam Dube targets Bumrah’s full-length deliveries by standing deep inside the crease, driving aggressively. Bumrah counters with heavy backoff length cutters.'
      };
    }
    return {
      runs: 35,
      balls: 24,
      dismissals: 1,
      strikeRate: 145.8,
      average: 35.0,
      dotBallPct: 38,
      boundaryPct: 18,
      venueTrend: 'High boundary density under stadium lights',
      domesticMatchup: 'Ranji Derby: Batter averages 44.5 vs same bowling length',
      aiInsight: `${bName} maintains a steady defensive stance, rotating strike at a 118 SR. ${bldName} exploits off-stump avenues with late swing.`
    };
  };

  const triggerAIInsight = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'tactical',
          userPrompt: `Evaluate player face-off in detail: BATTER: ${selectedBatter} vs BOWLER: ${selectedBowler}. Provide detailed recommendations.`,
          context: { batter: selectedBatter, bowler: selectedBowler }
        })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setAiInsightOverridden(data.text);
      }
    } catch (e) {
      setTimeout(() => {
        setAiInsightOverridden("🎯 **Gemini Tactical Verdict**: Bowler holds the matchup edge at 58% due to superior delivery consistency in the corridor of uncertainty. Recommend batter plays defensively in Powerplay.");
      }, 1200);
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentMatchup = getCombinedStats(selectedBatter, selectedBowler);

  return (
    <div className="space-y-6" id="stadium-green-analysis-deck">
      
      {/* Stadium Visual Header */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0c3123] p-5 md:p-6 shadow-xl">
        {/* Lawn/field glow layout effect */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold bg-[#14532d] border border-[#22c55e]/30 text-[#4ade80] px-2.5 py-0.5 rounded-full uppercase tracking-widest inline-block">
              Stadium Pitch Grounder
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Franchise & Duel Analysis
            </h2>
            <p className="text-xs text-emerald-250/80 text-emerald-100">
              Query deep-pitch head-to-head parameters, powerplay scores, and batter/bowler historical match factors on grass-turf grounds.
            </p>
          </div>

          {/* Stadium Tab Selector */}
          <div className="flex space-x-1.5 p-1 bg-[#091f16] rounded-xl border border-emerald-800/40">
            <button
              onClick={() => setSelectedTab('team-compare')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 ${
                selectedTab === 'team-compare'
                  ? 'bg-[#22c55e] text-[#091f16] font-black shadow-md'
                  : 'text-emerald-300 hover:text-white hover:bg-[#123e2c]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>FRANCHISE MATRIX</span>
            </button>
            <button
              onClick={() => setSelectedTab('player-battle')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 ${
                selectedTab === 'player-battle'
                  ? 'bg-[#22c55e] text-[#091f16] font-black shadow-md'
                  : 'text-emerald-300 hover:text-white hover:bg-[#123e2c]'
              }`}
            >
              <Swords className="h-4 w-4" />
              <span>1V1 DUELS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE PAGE SWITCHER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab === 'team-compare' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="team-selector-hub">
              
              {/* Franchise Config Selector */}
              <div className="lg:col-span-4 bg-[#0d281e] border border-emerald-800/25 rounded-2xl p-5 space-y-4 shadow-lg">
                <span className="text-[10px] font-mono font-black text-[#22c55e] uppercase tracking-widest block">Franchise selection</span>
                
                <div className="space-y-4 font-mono text-xs text-white">
                  <div className="space-y-2">
                    <label className="text-emerald-300 block uppercase font-bold text-[9px] tracking-wider">Select Team A</label>
                    <select 
                      value={teamA}
                      onChange={(e) => setTeamA(e.target.value)}
                      className="w-full bg-[#091f16] border border-emerald-800/40 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#22c55e] text-emerald-50"
                    >
                      {teamList.map(t => (
                        <option key={t} value={t} className="bg-[#091f16]">{t} Franchise</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center font-black text-emerald-500 text-xs py-1">VS</div>

                  <div className="space-y-2">
                    <label className="text-emerald-300 block uppercase font-bold text-[9px] tracking-wider">Select Team B</label>
                    <select 
                      value={teamB}
                      onChange={(e) => setTeamB(e.target.value)}
                      className="w-full bg-[#091f16] border border-emerald-800/40 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#22c55e] text-emerald-50"
                    >
                      {teamList.map(t => (
                        <option key={t} value={t} className="bg-[#091f16]">{t} Franchise</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-[#123e2c] pt-4 text-[11px] text-emerald-200/70 leading-relaxed">
                  <p>🏏 **Form Note**: Pitch statistics auto-reflect boundary density metrics and player field strengths.</p>
                </div>
              </div>

              {/* Statistical franchise metrics panel (LG: 8 cols) */}
              <div className="lg:col-span-8 bg-[#0d281e] border border-emerald-800/25 rounded-2xl p-5 space-y-5 shadow-lg">
                <div className="flex justify-between items-center border-b border-emerald-800/20 pb-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">FRANCHISE POWER COMPARISON</h3>
                  <span className="text-[10px] text-emerald-300 font-mono uppercase font-bold bg-[#14532d] px-2.5 py-0.5 rounded-md">{teamA} vs {teamB}</span>
                </div>

                {/* H2H Grid board */}
                <div className="grid grid-cols-3 gap-2 text-center bg-[#091f16] p-4 rounded-xl border border-emerald-800/35 font-mono text-xs">
                  <div>
                    <span className="text-emerald-400 text-[9px] block uppercase font-bold">{teamA} wins</span>
                    <span className="text-white font-black text-base block mt-0.5">18 Games</span>
                  </div>
                  <div className="flex items-center justify-center font-black text-emerald-500 tracking-wider">HISTORIC H2H</div>
                  <div>
                    <span className="text-emerald-400 text-[9px] block uppercase font-bold">{teamB} wins</span>
                    <span className="text-[#22c55e] font-black text-base block mt-0.5">16 Games</span>
                  </div>
                </div>

                {/* Progress bars of parameters */}
                <div className="space-y-4 pt-2">
                  {[
                    { label: 'Overall Batting Index', metricA: teamMetrics[teamA]?.batting || 80, metricB: teamMetrics[teamB]?.batting || 80 },
                    { label: 'Franchise Bowling Index', metricA: teamMetrics[teamA]?.bowling || 80, metricB: teamMetrics[teamB]?.bowling || 80 },
                    { label: 'Powerplay Strike Rates', metricA: teamMetrics[teamA]?.powerplay || 80, metricB: teamMetrics[teamB]?.powerplay || 80 },
                    { label: 'Death Overs Economical Index', metricA: teamMetrics[teamA]?.deathOvers || 80, metricB: teamMetrics[teamB]?.deathOvers || 80 },
                    { label: 'Pitch Toss Success Index', metricA: teamMetrics[teamA]?.tossAdv || 50, metricB: teamMetrics[teamB]?.tossAdv || 50 },
                    { label: 'Overall Season Defending %', metricA: teamMetrics[teamA]?.winPct || 50, metricB: teamMetrics[teamB]?.winPct || 50 },
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-emerald-100">
                        <span className="font-bold text-emerald-400">{stat.metricA}% ({teamA})</span>
                        <span className="font-sans font-bold text-white">{stat.label}</span>
                        <span className="font-bold text-[#22c55e]">{stat.metricB}% ({teamB})</span>
                      </div>
                      
                      <div className="h-3 w-full bg-[#091f16] border border-emerald-800/30 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${stat.metricA}%` }} />
                        <div className="bg-[#22c55e] h-full transition-all duration-300" style={{ width: `${stat.metricB}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            /* PLAYER BATTLES COLS */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="player-battle-hub">
              
              {/* Dropdowns lists */}
              <div className="lg:col-span-4 bg-[#0d281e] border border-emerald-800/25 rounded-2xl p-5 space-y-4 shadow-lg">
                <span className="text-[10px] font-mono font-black text-[#22c55e] uppercase tracking-widest block">Encounter Selection</span>
                
                <div className="space-y-4 font-mono text-xs text-white">
                  <div className="space-y-2">
                    <label className="text-emerald-300 block uppercase font-bold text-[9px] tracking-wider">BATTER</label>
                    <select 
                      value={selectedBatter}
                      onChange={(e) => setSelectedBatter(e.target.value)}
                      className="w-full bg-[#091f16] border border-emerald-800/40 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#22c55e]"
                    >
                      {['Shivam Dube', 'Suryakumar Yadav', 'Virat Kohli', 'Rohit Sharma', 'Rishabh Pant'].map(b => (
                        <option key={b} value={b} className="bg-[#091f16]">{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center font-bold text-emerald-500 text-[10px] py-1">VS</div>

                  <div className="space-y-2">
                    <label className="text-emerald-300 block uppercase font-bold text-[9px] tracking-wider">BOWLER</label>
                    <select 
                      value={selectedBowler}
                      onChange={(e) => setSelectedBowler(e.target.value)}
                      className="w-full bg-[#091f16] border border-emerald-800/40 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#22c55e]"
                    >
                      {['Jasprit Bumrah', 'Ravindra Jadeja', 'Rashid Khan', 'Yuzvendra Chahal', 'Mitchell Starc'].map(b => (
                        <option key={b} value={b} className="bg-[#091f16]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-emerald-800/30 pt-4">
                  <button 
                    onClick={triggerAIInsight}
                    disabled={isAiLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-[#091f16] font-black py-3 rounded-xl text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Cpu className={`h-4 w-4 ${isAiLoading ? 'animate-spin' : ''}`} />
                    <span>Generate Cognitive Analysis</span>
                  </button>
                </div>
              </div>

              {/* Roster records display */}
              <div className="lg:col-span-8 bg-[#0d281e] border border-emerald-800/25 rounded-2xl p-5 space-y-5 shadow-lg">
                <div className="flex justify-between items-center border-b border-emerald-800/25 pb-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">1v1 Historic Parameters</h3>
                  <span className="text-[10px] text-emerald-300 font-mono font-bold bg-[#14532d] px-2.5 py-0.5 rounded-md uppercase">{selectedBatter} vs {selectedBowler}</span>
                </div>

                {/* Score indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono text-center text-xs">
                  <div className="bg-[#091f16] p-4 rounded-xl border border-emerald-800/35 text-white">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block">Runs Scored</span>
                    <span className="text-lg font-black mt-1.5 block">{currentMatchup.runs} runs</span>
                  </div>

                  <div className="bg-[#091f16] p-4 rounded-xl border border-emerald-800/35 text-white">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block">Balls Faced</span>
                    <span className="text-lg font-black mt-1.5 block">{currentMatchup.balls} balls</span>
                  </div>

                  <div className="bg-[#091f16] p-4 rounded-xl border border-emerald-800/35 text-white">
                    <span className="text-rose-400 text-[10px] uppercase font-bold block">Dismissals</span>
                    <span className="text-rose-400 text-lg font-black mt-1.5 block">{currentMatchup.dismissals} outs</span>
                  </div>

                  <div className="bg-[#091f16] p-4 rounded-xl border border-emerald-800/35 text-white">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block">Batter SR</span>
                    <span className="text-[#22c55e] text-lg font-black mt-1.5 block">{currentMatchup.strikeRate}</span>
                  </div>
                </div>

                {/* Extended meta ratios */}
                <div className="grid grid-cols-2 gap-4 font-mono text-xs text-center text-emerald-100">
                  <div className="bg-[#091f16] p-3 rounded-xl border border-emerald-800/25">
                    <span>Dot Ball Percentage: <strong className="text-white text-sm ml-1">{currentMatchup.dotBallPct}%</strong></span>
                  </div>
                  <div className="bg-[#091f16] p-3 rounded-xl border border-emerald-800/25">
                    <span>Boundary Index Ratio: <strong className="text-[#22c55e] text-sm ml-1">{currentMatchup.boundaryPct}%</strong></span>
                  </div>
                </div>

                {/* Venues and Cross-leagues parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#091f16] p-4 rounded-xl border border-emerald-800/30 space-y-1">
                    <span className="text-[10px] font-mono font-black text-[#22c55e] uppercase tracking-widest block">Stadium/Pitch Impact</span>
                    <p className="text-emerald-100 text-[11px] leading-relaxed">{currentMatchup.venueTrend}</p>
                  </div>

                  <div className="bg-[#091f16] p-4 rounded-xl border border-emerald-800/30 space-y-1">
                    <span className="text-[10px] font-mono font-black text-[#22c55e] uppercase tracking-widest block">Dynamic Domestic History</span>
                    <p className="text-emerald-100 text-[11px] leading-relaxed">{currentMatchup.domesticMatchup}</p>
                  </div>
                </div>

                {/* AI report panel */}
                <div className="bg-[#14532d]/45 border border-[#22c55e]/30 rounded-xl p-4.5 space-y-2">
                  <span className="text-[10px] font-mono font-black text-emerald-300 uppercase tracking-widest block flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-[#22c55e]" /> GERMINATOR EXPERT DUEL REPORT
                  </span>
                  <p className="text-[11.5px] text-emerald-100 leading-relaxed font-sans">
                    {aiInsightOverridden ? aiInsightOverridden : currentMatchup.aiInsight}
                  </p>
                </div>

              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
