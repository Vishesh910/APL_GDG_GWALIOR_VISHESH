import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Video, Mic, MicOff, VideoOff, Send, Share2, Play, Pause, 
  MessageSquare, Radio, HelpCircle, Flame, Plus, Check, Tv, LogOut, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatchState } from '../types';

interface Participant {
  name: string;
  avatar: string;
  isMuted: boolean;
  isCameraOn: boolean;
  isHost: boolean;
}

interface Room {
  id: string;
  name: string;
  match: string;
  inviteCode: string;
  host: string;
  participants: Participant[];
}

interface WatchPartyLoungeProps {
  currentMatch: MatchState;
}

export default function WatchPartyLounge({ currentMatch }: WatchPartyLoungeProps) {
  // Rooms registry
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "ROOM-1",
      name: "Wankhede Premium Box 🎟️",
      match: "MI vs CSK",
      inviteCode: "IPL-WARRIOR-47",
      host: "cvishesh47 (You)",
      participants: [
        { name: "cvishesh47 (You)", avatar: "🏏", isMuted: false, isCameraOn: true, isHost: true },
        { name: "Meera_CSK", avatar: "✨", isMuted: false, isCameraOn: true, isHost: false },
        { name: "Kunal_MI_99", avatar: "🏎️", isMuted: true, isCameraOn: false, isHost: false },
        { name: "Amit_Kohli_Fan", avatar: "👑", isMuted: false, isCameraOn: false, isHost: false },
      ]
    }
  ]);

  const [activeRoomId, setActiveRoomId] = useState<string | null>("ROOM-1");
  const [createMode, setCreateMode] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinCode, setJoinedCode] = useState("");
  
  // Local Media controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isPlayingStream, setIsPlayingStream] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Chat message logs
  const [chatInput, setChatInput] = useState("");
  const [chatLogs, setChatLogs] = useState<{ sender: string; avatar: string; text: string; time: string }[]>([
    { sender: "Meera_CSK", avatar: "✨", text: "Welcome people! This run chase is going right down to the wire!", time: "15:20" },
    { sender: "Kunal_MI_99", avatar: "🏎️", text: "Bumrah is bowling the 18th. If he gets Dube out here, MI seals the series.", time: "15:21" },
  ]);

  // Simulated visual noise in stream
  const [streamCanvasNoise, setStreamCanvasNoise] = useState(0);

  useEffect(() => {
    if (!isPlayingStream) return;
    const interval = setInterval(() => {
      setStreamCanvasNoise(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlayingStream]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const rCode = "CSK-MI-" + Math.floor(Math.random() * 899 + 100);
    const newRoom: Room = {
      id: "ROOM-" + Date.now(),
      name: newRoomName,
      match: "MI vs CSK",
      inviteCode: rCode,
      host: "cvishesh47 (You)",
      participants: [
        { name: "cvishesh47 (You)", avatar: "🏏", isMuted: isMuted, isCameraOn: isCameraOn, isHost: true }
      ]
    };

    setRooms(prev => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
    setNewRoomName("");
    setCreateMode(false);
  };

  const handleJoinById = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    // Simulate joining
    const target = rooms.find(r => r.inviteCode.toLowerCase() === joinCode.toLowerCase().trim());
    if (target) {
      setActiveRoomId(target.id);
      setJoinedCode("");
    } else {
      // Setup a generated dynamic join room
      const customRoom: Room = {
        id: "ROOM-JOIN-" + Date.now(),
        name: `Invited Lounge Room (${joinCode.toUpperCase()})`,
        match: "MI vs CSK",
        inviteCode: joinCode.toUpperCase(),
        host: "Rival Manager",
        participants: [
          { name: "cvishesh47 (You)", avatar: "🏏", isMuted: isMuted, isCameraOn: isCameraOn, isHost: false },
          { name: "Match Inviter", avatar: "🤖", isMuted: false, isCameraOn: true, isHost: true }
        ]
      };
      setRooms(prev => [...prev, customRoom]);
      setActiveRoomId(customRoom.id);
      setJoinedCode("");
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const handleSendGroupChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatLogs(prev => [
      ...prev,
      {
        sender: "cvishesh47 (You)",
        avatar: "🏏",
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput("");
  };

  const shareRoomId = () => {
    if (!activeRoom) return;
    navigator.clipboard.writeText(activeRoom.inviteCode);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReaction = (emoji: string) => {
    setChatLogs(prev => [
      ...prev,
      {
        sender: "cvishesh47 (You)",
        avatar: "🏏",
        text: `*sent reaction bubble: ${emoji}*`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6" id="watchparty-lounges">
      
      {/* HEADER CONTROLLER FOR ROOM DIRECTORY OR ACTIVE SHOW */}
      {!activeRoomId ? (
        <div className="max-w-md mx-auto space-y-6 pt-10 text-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase">Watch Party Lounges</h2>
            <p className="text-xs text-slate-500 font-medium">Stream matches and compare statistics live inside immersive watch rooms</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            {/* Joined list */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Available Rooms</span>
              {rooms.map((r) => (
                <div key={r.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-205 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 block">{r.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Host: {r.host} • {r.participants.length} online</span>
                  </div>
                  <button 
                    onClick={() => setActiveRoomId(r.id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition"
                  >
                    Enter Room
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-3 font-sans">
              <button 
                onClick={() => setCreateMode(!createMode)}
                className="p-3 text-center bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-250 text-xs font-bold text-blue-600"
              >
                + Create Room
              </button>

              <form onSubmit={handleJoinById} className="flex gap-1.5">
                <input 
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinedCode(e.target.value)}
                  placeholder="ID... (IPL-WAR)"
                  className="bg-slate-50 border border-slate-250 rounded-lg px-2 text-xs w-2/3 focus:outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white font-bold text-xs rounded-lg px-2 flex-grow">
                  Join
                </button>
              </form>
            </div>

            {createMode && (
              <form onSubmit={handleCreateRoom} className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Create lobby</span>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter Room Name... (e.g. CSK Fanatic Club)"
                    className="flex-grow bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 text-xs text-slate-805 placeholder-slate-400 focus:outline-none"
                  />
                  <button type="submit" className="bg-blue-600 text-white font-bold text-xs rounded px-3.5 py-1.5">
                    Launch
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      ) : (
        /* ACTUAL WATCH ROOM: IMMERSIVE DARK/THEATER LAYOUT */
        <div className="flex flex-col h-full space-y-4" id="lobby-active-view">
          
          {/* Header metadata bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div>
              <span className="text-[9px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-bold uppercase">
                ● WATCH PARTY ID: {activeRoom?.inviteCode}
              </span>
              <h2 className="text-base font-black text-slate-100 mt-1.5 uppercase tracking-tight">
                {activeRoom?.name}
              </h2>
            </div>
            
            <button 
              onClick={() => setActiveRoomId(null)}
              className="text-[10px] text-red-400 hover:text-red-300 transition flex items-center gap-1 bg-red-500/15 border border-red-500/20 rounded-lg px-2.5 py-1.5 font-mono uppercase font-black"
            >
              <LogOut className="h-3.5 w-3.5" /> Back to Lobby
            </button>
          </div>

          {/* 3-COLUMN LAYOUT IMMERSIVE PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[460px]">
            
            {/* COLUMN 1 (LG: 5 cols): LEFT Match Video Stream Player */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden p-3.5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5 font-mono text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Tv className="h-3 w-3 text-blue-450 text-blue-400 animate-pulse" /> Stadium Feed Simulator
                </span>
                <span className="text-emerald-500 font-bold">1440p High Bitrate</span>
              </div>

              {/* Simulated Stadium Video Player */}
              <div className="relative aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 to-black pointer-events-none" />
                
                {isPlayingStream ? (
                  <div className="relative text-center text-slate-105 z-10 p-4 space-y-2 select-none animate-pulse">
                    <span className="text-5xl">🏟️</span>
                    <h4 className="text-xs font-black font-mono tracking-wide text-white uppercase mt-2">
                      Live Video Broadcast Active
                    </h4>
                    <p className="text-[10px] text-slate-400 font-sans max-w-xs mx-auto leading-relaxed">
                      Wankhede camera feed pipeline stabilized.
                    </p>
                    {/* Running canvas noise line */}
                    <div className="flex justify-center space-x-1.5 pt-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${streamCanvasNoise === 0 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${streamCanvasNoise === 1 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${streamCanvasNoise === 2 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                      <span className={`w-1.5 h-1.5 rounded-full ${streamCanvasNoise === 3 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 z-10">
                    <span className="text-4xl block">⏸️</span>
                    <span className="text-xs font-mono block mt-2 uppercase tracking-wider font-extrabold text-slate-500">Stream Simulation Paused</span>
                  </div>
                )}

                {/* Overlay Play/Pause triggers */}
                <button 
                  onClick={() => setIsPlayingStream(!isPlayingStream)}
                  className="absolute bottom-2.5 left-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-white transition z-20"
                >
                  {isPlayingStream ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </button>
              </div>

              {/* Pitch Info Card */}
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 space-y-1.5 mt-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Surface Condition</span>
                  <span className="font-extrabold text-slate-100 uppercase font-mono">Grass flat / Dry spinners</span>
                </div>
                <div className="flex justify-between">
                  <span>Stadium Wind Vector</span>
                  <span className="font-extrabold text-slate-100 uppercase font-mono">14km/h North East</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2 (LG: 4 cols): CENTER Score updates & AI Tactical Insights */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-4 shadow-lg">
              
              {/* Scorecard Widget Block */}
              <div className="space-y-2.5 border-b border-slate-900 pb-3">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block font-black">Lobby Arena Feed</span>
                
                <div className="flex justify-between items-center bg-slate-920 bg-slate-900 p-3 rounded-xl border border-slate-850">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🔵</span>
                    <span className="font-black text-sm text-slate-200">MI</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-black text-sm text-slate-100 block">{currentMatch.teamAScore.runs}/{currentMatch.teamAScore.wickets}</span>
                    <span className="text-[10px] text-slate-500 block">({currentMatch.teamAScore.overs} ov)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-blue-400/5 p-3 rounded-xl border border-blue-500/15">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🟡</span>
                    <span className="font-black text-sm text-blue-450 text-blue-400">CSK</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-black text-sm text-blue-300 block">{currentMatch.teamBScore.runs}/{currentMatch.teamBScore.wickets}</span>
                    <span className="text-[10px] text-blue-450 block">({currentMatch.teamBScore.overs} ov)</span>
                  </div>
                </div>

                <div className="text-[10.5px] font-mono font-black text-slate-300 text-center uppercase tracking-wide bg-slate-900 p-2 rounded-lg border border-slate-850">
                  🏏 CSK require 27 from 16 balls to win
                </div>
              </div>

              {/* AI Real-time Tactical Insights */}
              <div className="flex-grow flex flex-col justify-between space-y-3.5 pt-1">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest block">Lounge Advisory Engine</span>
                  
                  <div className="bg-blue-950/20 border border-blue-510 border-blue-500/10 rounded-xl p-3.5 text-[11px] text-blue-300 leading-relaxed font-sans font-medium">
                    "🎯 **Matchup Priority Alert**: Bowler Bumrah is maintaining a length ratio of 6.2m, completely shutting down Dube's pull avenues over deep mid-wicket. Strategy Agent recommends Jadeja rotates strike to force bowler length displacement."
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-855 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Current Victory projections</span>
                  <span className="text-blue-400 font-bold font-mono">MI: 68% • CSK: 32%</span>
                </div>
              </div>

            </div>

            {/* COLUMN 3 (LG: 3 cols): RIGHT Participants, Chat, and Reactions */}
            <div className="lg:col-span-3 flex flex-col justify-between bg-slate-950 border border-slate-850 rounded-2xl p-3.5 space-y-3 shadow-lg">
              
              {/* online participants container */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-black uppercase text-slate-505 text-slate-550 block">Lounge Watchers ({activeRoom?.participants.length})</span>
                
                <div className="flex -space-x-1.5 overflow-hidden">
                  {activeRoom?.participants.map((m, i) => (
                    <div 
                      key={i} 
                      title={`${m.name} ${m.isMuted ? '(Muted)' : ''}`}
                      className="h-8 w-8 rounded-full bg-slate-900 border border-slate-950 flex items-center justify-center text-xs relative"
                    >
                      <span className="select-none">{m.avatar}</span>
                      <span className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full ${m.isMuted ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse'}`} />
                    </div>
                  ))}
                  <button className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>

              {/* Chat frame */}
              <div className="flex-grow flex flex-col justify-between space-y-2 mt-1">
                <div className="h-[180px] overflow-y-auto space-y-2 pr-1 font-sans text-[11px]">
                  {chatLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-850">
                      <span className="font-extrabold text-blue-400 block text-[10px]">{log.sender}</span>
                      <span className="text-slate-200 block transition mt-0.5">{log.text}</span>
                    </div>
                  ))}
                </div>

                {/* Micro Reactions Bar */}
                <div className="flex justify-between items-center bg-slate-900 border border-slate-850 p-1 rounded-xl">
                  {['🔥', '👏', '😮', '👑', '🏏'].map((e) => (
                    <button 
                      key={e}
                      onClick={() => handleReaction(e)}
                      className="text-xs hover:scale-130 transition py-0.5 px-2 focus:outline-none"
                    >
                      {e}
                    </button>
                  ))}
                </div>

                {/* Send chat */}
                <form onSubmit={handleSendGroupChat} className="flex gap-1.5">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Talk in Lobby..."
                    className="flex-grow bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded px-2.5 py-1.5 text-[11px]">
                    Send
                  </button>
                </form>
              </div>

            </div>

          </div>

          {/* BOTTOM: MIC, CAMERA, LEAVE ROOM, SHARE ROOM CONTROLS TOOLBAR */}
          <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono shadow-md">
            <div className="flex items-center space-x-3">
              {/* Mic toggle */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold uppercase transition ${
                  isMuted 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15' 
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
                }`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isMuted ? 'Muted' : 'Mic Active'}</span>
              </button>

              {/* Camera toggle */}
              <button 
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold uppercase transition ${
                  !isCameraOn 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15' 
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
                }`}
              >
                {!isCameraOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                <span>{isCameraOn ? 'Cam Active' : 'Cam Off'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2.5">
              {/* Share Room Button */}
              <button 
                onClick={shareRoomId}
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-350 hover:text-white px-3.5 py-2 rounded-xl transition"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5 text-blue-400" />}
                <span>{copiedLink ? 'Copied code!' : 'Share Room ID'}</span>
              </button>

              {/* Leave Room Button */}
              <button 
                onClick={() => setActiveRoomId(null)}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-black transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
