import React, { useState } from 'react';
import { 
  Users, Plus, Award, MessageSquare, Shield, HelpCircle, Send, CheckCircle, Flame, Star, Vote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Community {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  isPrivate: boolean;
  inviteCode: string;
  membersCount: number;
  stats: {
    contestsActive: number;
    weeklyPoolPoints: number;
    activityRate: string;
  };
  members: {
    name: string;
    avatar: string;
    level: number;
    streak: number;
    points: number;
    rank: number;
    badge: string;
  }[];
}

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'com-1',
    name: 'Wankhede Warriors',
    avatar: '🦁',
    banner: 'bg-gradient-to-r from-blue-700 to-indigo-805 bg-blue-700',
    isPrivate: false,
    inviteCode: 'WARRIOR11',
    membersCount: 142,
    stats: { contestsActive: 3, weeklyPoolPoints: 12450, activityRate: 'Weekly Active' },
    members: [
      { name: 'cvishesh47 (You)', avatar: '🏏', level: 15, streak: 4, points: 842, rank: 1, badge: 'Captain Master' },
      { name: 'Kunal_MI_99', avatar: '🏎️', level: 12, streak: 3, points: 810, rank: 2, badge: 'Differential Guru' },
      { name: 'Meera_CSK_Queen', avatar: '✨', level: 18, streak: 5, points: 795, rank: 3, badge: 'Strategic Master' },
      { name: 'Aarav_CricketGuru', avatar: '🎯', level: 14, streak: 1, points: 760, rank: 4, badge: 'Century Specialist' },
      { name: 'Rohan_StatsGamer', avatar: '📊', level: 10, streak: 0, points: 710, rank: 5, badge: 'Safe Picker' }
    ]
  },
  {
    id: 'com-2',
    name: 'IPL Agentic Syndicate',
    avatar: '🤖',
    banner: 'bg-gradient-to-r from-blue-600 to-indigo-900',
    isPrivate: true,
    inviteCode: 'AGENTXI2X',
    membersCount: 56,
    stats: { contestsActive: 1, weeklyPoolPoints: 6800, activityRate: 'Very High' },
    members: [
      { name: 'cvishesh47 (You)', avatar: '🏏', level: 15, streak: 4, points: 842, rank: 2, badge: 'Captain Master' },
      { name: 'Kabir_TheBrain', avatar: '🧠', level: 22, streak: 12, points: 915, rank: 1, badge: 'Matchup King' },
      { name: 'Rohan_StatsGamer', avatar: '📊', level: 10, streak: 0, points: 710, rank: 3, badge: 'Safe Picker' }
    ]
  }
];

export default function Communities() {
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [activeComId, setActiveComId] = useState<string>('com-1');
  const [comTab, setComTab] = useState<'fantasy' | 'leaderboard' | 'chat' | 'members' | 'matchactivity'>('chat');
  
  // Create state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createIsPrivate, setCreateIsPrivate] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Active chat state
  const [chatText, setChatText] = useState('');
  const [chatLogs, setChatLogs] = useState<{ sender: string; avatar: string; text: string; time: string; isYou?: boolean }[]>([
    { sender: 'Kunal_MI_99', avatar: '🏎️', text: 'Hardik is switching bowlers fast today. Need Bumrah back!', time: '15:18' },
    { sender: 'Meera_CSK_Queen', avatar: '✨', text: 'Jadeja is executing those tight angles perfectly on this pitch.', time: '15:20' },
    { sender: 'cvishesh47 (You)', avatar: '🏏', text: 'Agreed, spin is achieving a solid 1.8 degrees of lateral deflection. Dube must attack soon!', time: '15:21', isYou: true },
  ]);

  // Poll Activity State
  const [poll, setPoll] = useState({
    voted: false,
    option: '',
    votes: { A: 42, B: 58, C: 19 }
  });

  const activeCom = communities.find(c => c.id === activeComId) || communities[0];

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    const newCom: Community = {
      id: 'com-' + Date.now(),
      name: createName,
      isPrivate: createIsPrivate,
      avatar: '🏆',
      banner: 'bg-gradient-to-r from-blue-600 to-indigo-805',
      inviteCode: 'JOIN' + Math.floor(Math.random() * 90000 + 10000),
      membersCount: 1,
      stats: { contestsActive: 0, weeklyPoolPoints: 0, activityRate: 'Just Created' },
      members: [
        { name: 'cvishesh47 (You)', avatar: '🏏', level: 15, streak: 4, points: 0, rank: 1, badge: 'Captain Master' }
      ]
    };

    setCommunities(prev => [...prev, newCom]);
    setActiveComId(newCom.id);
    setCreateName('');
    setIsCreateOpen(false);
    triggerNotification(`Created "${newCom.name}" Successfully!`);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    
    triggerNotification('Simulating code validation ... Community joined!');
    setJoinCodeInput('');
  };

  const triggerNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    setChatLogs(prev => [
      ...prev,
      {
        sender: 'cvishesh47 (You)',
        avatar: '🏏',
        text: chatText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isYou: true
      }
    ]);
    setChatText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[520px]" id="communities-section">
      
      {/* Toast alert helper */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-blue-650 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl border border-blue-400 shadow-lg font-mono uppercase tracking-wider"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: Groups Navigation (Discord-style channels sidebar, bg-[#e9ecef]) */}
      <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-slate-250 bg-[#e9ecef] p-4.5 space-y-4 shadow-sm text-slate-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2.5">
            <h3 className="text-[10px] font-black font-mono tracking-widest uppercase text-slate-500">Leagues Directory</h3>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="text-[9.5px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
            >
              <Plus className="h-3 w-3" /> Create
            </button>
          </div>

          {/* Create community form overlay block */}
          {isCreateOpen && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-300 space-y-3 shadow-md">
              <span className="text-[10px] font-mono font-bold text-slate-700 block uppercase">Create Community League</span>
              <form onSubmit={handleCreateCommunity} className="space-y-2.5">
                <input 
                  type="text" 
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="League Name... (e.g. Mumbai Kings)"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                
                <label className="flex items-center gap-2 text-[10px] text-slate-500">
                  <input 
                    type="checkbox" 
                    checked={createIsPrivate}
                    onChange={(e) => setCreateIsPrivate(e.target.checked)}
                    className="rounded bg-slate-50 border-slate-305 text-blue-600 focus:ring-0"
                  />
                  Private League (Invite code required)
                </label>

                <div className="flex gap-1.5 justify-end pt-1">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateOpen(false)}
                    className="text-[9px] uppercase font-bold text-slate-400 hover:text-slate-655 transition px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-[9px] uppercase font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Channels list rail */}
          <div className="space-y-1.5">
            {communities.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveComId(c.id); setComTab('chat'); }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                  activeComId === c.id 
                    ? 'bg-white border-blue-200 text-blue-700 shadow-sm' 
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="h-7 w-7 rounded bg-white flex items-center justify-center text-xs border border-slate-205 shadow-xs">
                    {c.avatar}
                  </div>
                  <div>
                    <span className="font-extrabold text-[11.5px] block truncate">{c.name}</span>
                    <span className="text-[9.5px] text-slate-401 font-mono font-bold text-slate-450">{c.membersCount} competitors</span>
                  </div>
                </div>
                {c.isPrivate && (
                  <span className="text-[7.5px] font-mono border border-indigo-200 text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-bold uppercase">
                    Code
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Invite Code block footer */}
        <div className="border-t border-slate-300 pt-3.5">
          <span className="text-[10px] font-black font-mono tracking-wider uppercase text-slate-500 block mb-2">Join community code</span>
          <form onSubmit={handleJoinByCode} className="flex gap-2">
            <input 
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              placeholder="e.g. WARRIOR11"
              className="flex-grow bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase font-mono text-white transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Discord Lobby focus workspace (bg-white / f1f3f5) */}
      <div className="lg:col-span-8 bg-white border border-slate-250 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm">
        
        {/* Lobby Banner */}
        <div className={`p-5.5 relative ${activeCom.banner} text-white`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[8.5px] uppercase font-mono bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                <Users className="h-3 w-3" /> Community Lobby
              </div>
              <h2 className="text-xl font-black mt-2 leading-none uppercase tracking-tight">{activeCom.name}</h2>
              <p className="text-[10px] font-mono text-white/80 mt-1.5">LOBBY INVITE CODE: {activeCom.inviteCode}</p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-mono block text-white/70">Weekly Prize Pool</span>
              <span className="text-lg font-black font-mono text-amber-300">{activeCom.stats.weeklyPoolPoints} PTS</span>
            </div>
          </div>
        </div>

        {/* Discord Sub Tabs */}
        <div className="flex bg-[#f1f3f5] border-b border-slate-200 px-3 py-1 font-sans">
          {[
            { id: 'chat', label: '# chat-feed', icon: MessageSquare },
            { id: 'fantasy', label: '🛡️ differential-picks', icon: Shield },
            { id: 'leaderboard', label: '🏆 standings', icon: Award },
            { id: 'members', label: '👥 rivals', icon: Users },
            { id: 'matchactivity', label: '🗳️ live-trivia', icon: Vote },
          ].map((tab) => {
            const isTabActive = comTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setComTab(tab.id as any)}
                className={`py-2 px-3 flex items-center gap-1 font-black uppercase text-[10px] tracking-wider transition-all border-b-2 ${
                  isTabActive ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center content space */}
        <div className="flex-grow p-5 text-slate-800 min-h-[300px]">
          
          {/* TAB: CHAT FEED */}
          {comTab === 'chat' && (
            <div className="flex flex-col justify-between h-full space-y-4">
              <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
                {chatLogs.map((log, idx) => (
                  <div key={idx} className={`flex items-start gap-2.5 ${log.isYou ? 'flex-row-reverse' : ''}`}>
                    <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-sm shadow-xs select-none">
                      {log.avatar}
                    </div>
                    <div className="max-w-[80%]">
                      <div className={`p-3 rounded-xl text-xs border ${log.isYou ? 'bg-blue-50 border-blue-105 text-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-4 justify-between border-b pb-1 mb-1 border-slate-205">
                          <span className="font-extrabold text-[10px] text-slate-700">{log.sender}</span>
                          <span className="text-[8.5px] font-mono text-slate-400">{log.time}</span>
                        </div>
                        <p className="text-slate-700 font-sans leading-relaxed text-left">{log.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Send a message to this community..."
                  className="flex-grow bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit" 
                  className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB: FANTASY ROSTER */}
          {comTab === 'fantasy' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-605 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-slate-900 block uppercase">Draft Coordination Panel</span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Review and draft differential roster units before locking matches inside CricVerse Community.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono font-black uppercase text-slate-400">Current Differential Recommendations</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-1">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-800">Matheesha Pathirana</span>
                      <span className="text-[9px] bg-blue-100 text-blue-750 font-black font-mono px-2 py-0.5 rounded">9.0 Cr</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">Wickets guarantee at death overs. Chosen by only 14% of Wankhede rivals.</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-800">Shivam Dube</span>
                      <span className="text-[9px] bg-blue-100 text-blue-750 font-black font-mono px-2 py-0.5 rounded">8.5 Cr</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">Ideal spinner destroyer in middle overs. Potential for high multiplier bonus.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LEADERBOARD */}
          {comTab === 'leaderboard' && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs bg-white">
                  <thead className="bg-slate-50 font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Competing Manager</th>
                      <th className="p-3 text-center">Streak</th>
                      <th className="p-3 text-right">Accumulated Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCom.members.map((member, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-black text-slate-400">#{index+1}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base select-none">{member.avatar}</span>
                            <div>
                              <span className="font-extrabold text-slate-800 block">{member.name}</span>
                              <span className="text-[9px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">{member.badge}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono font-black text-amber-500">
                          {member.streak > 0 ? `🔥 ${member.streak}d` : '-'}
                        </td>
                        <td className="p-3 text-right font-mono font-black text-blue-600">{member.points} PTS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MEMBERS */}
          {comTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeCom.members.map((m, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg select-none">{m.avatar}</span>
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 block">{m.name}</span>
                      <span className="text-[9.5px] text-slate-500 font-mono">Manager Lv.{m.level}</span>
                    </div>
                  </div>

                  <span className="text-[8.5px] border border-blue-200 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg font-bold font-mono">
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB: LIVE TRIVIA POLL */}
          {comTab === 'matchactivity' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 text-slate-800">
                <span className="text-[9.5px] font-mono font-black text-[#1852a4] uppercase tracking-widest block flex items-center gap-1.5">
                  <Vote className="h-4 w-4 text-blue-600 animate-pulse" /> Daily voting poll
                </span>
                <span className="text-xs font-black text-slate-800 block">How many runs will MS Dhoni score in the final over?</span>
                
                {poll.voted ? (
                  <div className="space-y-2 pt-1 font-mono text-[10.5px]">
                    <div className="bg-blue-50 border border-blue-200 p-2 rounded flex justify-between">
                      <span className="text-blue-700 font-bold">A. 0 - 10 runs</span>
                      <span className="text-slate-500 font-bold">{poll.votes.A} votes ({Math.round(poll.votes.A / (poll.votes.A + poll.votes.B + poll.votes.C) * 100)}%)</span>
                    </div>
                    <div className="p-2 rounded border border-slate-200 flex justify-between bg-white">
                      <span>B. 11 - 20 runs</span>
                      <span className="text-slate-500">{poll.votes.B} votes</span>
                    </div>
                    <div className="p-2 rounded border border-slate-200 flex justify-between bg-white">
                      <span>C. 21+ runs 🔥</span>
                      <span className="text-slate-500">{poll.votes.C} votes</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <button 
                      onClick={() => setPoll({ voted: true, option: 'A', votes: { A: 43, B: 58, C: 19 } })}
                      className="text-left text-xs bg-white border border-slate-250 rounded p-2.5 hover:border-blue-400/30 transition hover:bg-slate-50"
                    >
                      A. 0 - 10 runs
                    </button>
                    <button 
                      onClick={() => setPoll({ voted: true, option: 'B', votes: { A: 42, B: 59, C: 19 } })}
                      className="text-left text-xs bg-white border border-slate-250 rounded p-2.5 hover:border-blue-400/30 transition hover:bg-slate-50"
                    >
                      B. 11 - 20 runs
                    </button>
                    <button 
                      onClick={() => setPoll({ voted: true, option: 'C', votes: { A: 42, B: 58, C: 20 } })}
                      className="text-left text-xs bg-white border border-slate-250 rounded p-2.5 hover:border-blue-400/30 transition hover:bg-slate-50"
                    >
                      C. 21+ runs 🔥
                    </button>
                  </div>
                )}
              </div>

              {/* CAST MVP */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-600 font-black block uppercase">Cast match MVP prediction</span>
                  <p className="text-[11.5px] text-slate-500 mt-2 leading-relaxed">
                    Vote for the ultimate Match MVP and win streak points multipliers inside CricVerse leagues!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono pt-4">
                  {['Ruturaj Gaikwad', 'Jasprit Bumrah', 'Shivam Dube', 'Suryakumar Yadav'].map((name, i) => (
                    <button 
                      key={i}
                      onClick={() => triggerNotification(`Voted ${name} as MVP!`)}
                      className="text-[10.5px] p-2 bg-white border border-slate-250 rounded hover:border-blue-400/30 text-slate-700 hover:text-slate-900 transition font-bold"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
