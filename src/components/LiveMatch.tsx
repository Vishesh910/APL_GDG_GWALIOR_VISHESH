import React, { useState, useEffect, useRef } from 'react';
import { MatchState } from '../types';
import { iplPlayers } from '../mockData';
import { 
  Play, Pause, RefreshCw, Cpu, Star, TrendingUp, HelpCircle, Swords, Award 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface LiveMatchProps {
  currentMatch: MatchState;
  setCurrentMatch: React.Dispatch<React.SetStateAction<MatchState>>;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
}

export default function LiveMatch({
  currentMatch,
  setCurrentMatch,
  isSimulating,
  setIsSimulating,
  simulationSpeed,
  setSimulationSpeed
}: LiveMatchProps) {
  
  const [commentaryLogs, setCommentaryLogs] = useState<{ id: string; text: string; runs: number; type: string }[]>([
    { id: '1', text: "Jasprit Bumrah to MS Dhoni, no run, blistering yorker squeezed out cleanly to mid-off.", runs: 0, type: 'normal' },
    { id: '2', text: "Jasprit Bumrah to MS Dhoni, SIX runs, Vintage helicopter shot launched straight into the Wankhede crowd!", runs: 6, type: 'boundary-six' },
    { id: '3', text: "Hardik Pandya to Shivam Dube, FOUR runs, elegant square cut paced perfectly past backward point.", runs: 4, type: 'boundary-four' },
  ]);

  const [tacticalInsight, setTacticalInsight] = useState<string>(
    "🎯 **Strategy Agent Bulletin**: Pitch dry crust is offering spin drift. Shivam Dube is successfully sweeping the spinners off their length. Bumrah represents MI's core defensive lever; if CSK plays him out, victory probability rises to 74%."
  );
  
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Simulated Momentum Graph Data
  const momentumData = [
    { over: 'Overs 1-5', MI: 45, CSK: 55 },
    { over: 'Overs 6-10', MI: 50, CSK: 50 },
    { over: 'Overs 11-14', MI: 60, CSK: 40 },
    { over: 'Overs 15-17', MI: 52, CSK: 48 },
  ];

  // Simulator interval
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      simulateNextBall();
    }, 4000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, currentMatch]);

  const triggerAILiveTactics = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentType: 'tactical',
          userPrompt: 'Review the current scorecard and suggest crucial tactical shifts for both captains immediately.',
          context: currentMatch
        })
      });
      const data = await res.json();
      if (data.success) {
        setTacticalInsight(data.text);
      }
    } catch (err) {
      setTimeout(() => {
        setTacticalInsight("🎯 **AI Tactical Forecast**: Leverage death overs with slower off-cutters outside off stump. CSK batters should rotate strike to exhaust MI's primary bowler Bumrah.");
      }, 1000);
    } finally {
      setIsAiLoading(false);
    }
  };

  const simulateNextBall = () => {
    setCurrentMatch(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as MatchState;
      let overs = next.teamBScore.overs;
      let oversInt = Math.floor(overs);
      let ballsInOver = Math.round((overs - oversInt) * 10);

      if (ballsInOver >= 6) {
        oversInt += 1;
        ballsInOver = 1;
      } else {
        ballsInOver += 1;
      }

      const nextOvers = parseFloat(`${oversInt}.${ballsInOver}`);

      if (nextOvers >= 20 || next.teamBScore.runs >= next.target!) {
        setIsSimulating(false);
        next.statusText = next.teamBScore.runs >= next.target! 
          ? `${next.teamB} WON BY ${10 - next.teamBScore.wickets} WICKETS!`
          : `${next.teamA} WON BY ${next.target! - 1 - next.teamBScore.runs} RUNS!`;
        return next;
      }

      // Outcome values
      let runs = 1;
      let isWicket = false;
      let type = 'normal';
      let text = '';

      const rand = Math.random();
      if (rand < 0.08) {
        runs = 6;
        type = 'boundary-six';
        text = `SIX runs! Shivam Dube launches the bowler miles over the deep square-leg fence!`;
      } else if (rand < 0.20) {
        runs = 4;
        type = 'boundary-four';
        text = `FOUR runs! MS Dhoni flashes at a wide delivery and cuts it past extra-cover point!`;
      } else if (rand < 0.28) {
        runs = 0;
        isWicket = true;
        type = 'wicket';
        text = `OUT! Clean bowled! The yorker drops in perfectly to rattle the wickets!`;
      } else if (rand < 0.60) {
        runs = 1;
        text = `Single run taken. Striker tucks it away to deep midwicket to rotate strike.`;
      } else {
        runs = 0;
        text = `No run. Bowler fires a sharp cutter, beaten on the outside edge.`;
      }

      next.teamBScore.runs += runs;
      if (isWicket) next.teamBScore.wickets += 1;
      next.teamBScore.overs = nextOvers;

      // Update striker runs
      const striker = next.batsmen.find(b => b.isOnStrike);
      if (striker) {
        striker.runs += runs;
        striker.balls += 1;
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;
        striker.strikeRate = Math.round((striker.runs / striker.balls) * 100);
      }

      // Rotate strike
      if (runs === 1 || runs === 3) {
        next.batsmen.forEach(b => b.isOnStrike = !b.isOnStrike);
      }

      // Add commentary log
      setCommentaryLogs(prevLogs => [
        { id: Date.now().toString(), text: `Over ${nextOvers}: ${text}`, runs, type },
        ...prevLogs.slice(0, 5)
      ]);

      // Adjust Win Prob slightly
      const probCSK = Math.max(10, Math.min(90, next.winProbability.CSK + (runs > 3 ? 5 : isWicket ? -10 : -1)));
      next.winProbability.CSK = Math.round(probCSK);
      next.winProbability.MI = 100 - next.winProbability.CSK;

      return next;
    });
  };

  return (
    <div className="space-y-6" id="live-scorecenter-dashboard">
      
      {/* Live Match Ribbon (Top Switcher Panel) */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 rounded-full bg-red-650 bg-red-500 animate-pulse" />
          <span className="font-mono text-xs font-black text-slate-800">LIVE SCORE CENTER — WANKHEDE STADIUM</span>
        </div>

        {/* Simulator controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-500 font-semibold">Feed Simulator:</span>
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`border px-3.5 py-1.5 rounded-xl font-bold uppercase transition flex items-center gap-1.5 ${
              isSimulating ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-blue-600" />}
            {isSimulating ? 'Pause feed' : 'Resume live'}
          </button>

          <div className="flex items-center space-x-1.5 bg-slate-50 p-0.5 border border-slate-200 rounded-lg">
            {[1, 2, 4].map((speed) => (
              <button 
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold ${
                  simulationSpeed === speed ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-150'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SCORECARD PANELS (7 cols) */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* Batting Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5.5 space-y-4.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-805 text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Swords className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                <span>Batting Board ({currentMatch.teamB})</span>
              </h3>
              <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-md">2nd Innings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#f8fafc]/90 text-[10px] uppercase font-mono text-slate-500 font-black border-b border-slate-200/50">
                  <tr>
                    <th className="p-3">Batter</th>
                    <th className="p-3 text-center">Runs</th>
                    <th className="p-3 text-center">Balls</th>
                    <th className="p-3 text-center">4s</th>
                    <th className="p-3 text-center">6s</th>
                    <th className="p-3 text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentMatch.batsmen.map((b, idx) => (
                    <tr key={idx} className={b.isOnStrike ? 'bg-blue-50/55' : 'hover:bg-slate-50/50'}>
                      <td className="p-3 flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-805 text-slate-800">{b.name}</span>
                        {b.isOnStrike && <span className="text-[10px] text-blue-600 font-mono font-extrabold animate-bounce">★</span>}
                      </td>
                      <td className="p-3 text-center font-mono font-black text-slate-800">{b.runs}</td>
                      <td className="p-3 text-center font-mono text-slate-500">{b.balls}</td>
                      <td className="p-3 text-center font-mono text-slate-550 text-slate-400">{b.fours}</td>
                      <td className="p-3 text-center font-mono text-slate-550 text-slate-400">{b.sixes}</td>
                      <td className="p-3 text-right font-mono font-black text-blue-600">{b.strikeRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bowling Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5.5 space-y-4.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-blue-600" />
                <span>Bowling Analytics ({currentMatch.teamA})</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#f8fafc]/90 text-[10px] uppercase font-mono text-slate-500 font-black border-b border-slate-200/50">
                  <tr>
                    <th className="p-3">Bowler</th>
                    <th className="p-3 text-center">Overs</th>
                    <th className="p-3 text-center">Med</th>
                    <th className="p-3 text-center">Runs</th>
                    <th className="p-3 text-center">Wkts</th>
                    <th className="p-3 text-right">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentMatch.bowlers.map((bowler, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-[#0f172a]">{bowler.name}</td>
                      <td className="p-3 text-center font-mono text-slate-600">{bowler.overs}</td>
                      <td className="p-3 text-center font-mono text-slate-400">{bowler.maidens}</td>
                      <td className="p-3 text-center font-mono text-[#0f172a]">{bowler.runs}</td>
                      <td className="p-3 text-center font-mono font-black text-red-650 text-red-600">{bowler.wickets}</td>
                      <td className="p-3 text-right font-mono text-blue-600 font-bold">{bowler.economy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Partnership Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">Active Partnership Tracker</span>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-extrabold text-slate-900">Shivam Dube</span> (24 balls)
                <span className="text-slate-400">&</span>
                <span className="font-extrabold text-slate-900">MS Dhoni</span> (6 balls)
              </div>

              <div className="text-right">
                <span className="text-slate-400 uppercase text-[9px] block font-bold">Accumulated Partnership</span>
                <span className="text-blue-600 font-black text-sm mt-0.5 block">54 runs (off 30 balls)</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT METRICS PANELS (5 cols) */}
        <div className="lg:col-span-5 space-y-7">
          
          {/* Victory outcome slider bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
            <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-wider block">Outcome Probability Curve</span>
            
            <div className="space-y-2 pt-1 font-mono text-xs text-slate-800 font-extrabold">
              <div className="flex justify-between text-[11px]">
                <span>CSK ({currentMatch.winProbability.CSK}%)</span>
                <span>MI ({currentMatch.winProbability.MI}%)</span>
              </div>

              {/* Progress split bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 flex">
                <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${currentMatch.winProbability.CSK}%` }} />
                <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${currentMatch.winProbability.MI}%` }} />
              </div>
            </div>
          </div>

          {/* Momentum graph chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase block">Match Momentum index</span>
            
            <div className="h-[140px] w-full bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={momentumData}>
                  <XAxis dataKey="over" stroke="#94a3b8" fontSize={8.5} />
                  <YAxis stroke="#94a3b8" fontSize={8.5} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                  <Line type="monotone" dataKey="CSK" stroke="#eab308" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="MI" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Strategy Insights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10.5px] font-mono font-black text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-blue-600 animate-pulse" /> Live AI Strategy Analysis
              </span>
              <button 
                onClick={triggerAILiveTactics}
                disabled={isAiLoading}
                className="text-[9.5px] uppercase font-mono font-black bg-blue-50 hover:bg-blue-105 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-lg px-2.5 py-1 flex items-center gap-1 transition"
              >
                <RefreshCw className={`h-2.5 w-2.5 ${isAiLoading ? 'animate-spin' : ''}`} /> Recorrelate
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/70 text-xs text-slate-600 leading-relaxed font-sans font-medium">
              <p className="whitespace-pre-wrap">{tacticalInsight}</p>
            </div>
          </div>

          {/* Commentary list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">Ball-by-Ball Live Commentary</span>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {commentaryLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-805 text-slate-800 flex items-center gap-2">
                    {log.type === 'boundary-six' && <span className="bg-amber-100 text-amber-700 text-[9.5px] font-mono px-2 py-0.5 rounded-md font-black">6 RUNS</span>}
                    {log.type === 'boundary-four' && <span className="bg-blue-100 text-blue-700 text-[9.5px] font-mono px-2 py-0.5 rounded-md font-black">4 RUNS</span>}
                    {log.type === 'wicket' && <span className="bg-rose-100 text-rose-700 text-[9.5px] font-mono px-2 py-0.5 rounded-md font-black">WICKET</span>}
                    <span className="leading-normal">{log.text}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
