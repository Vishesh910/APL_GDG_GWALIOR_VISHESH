import React, { useState } from 'react';
import {
  Cpu, MessageSquare, Sparkles, Send, Play, HelpCircle,
  Zap, Award, Volume2, ShieldCheck, TrendingUp, Tv,
  Languages, BookOpen, Users, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Definitions for the Agent nodes in the Multi-Agent pipeline
interface AgentNode {
  id: string;
  name: string;
  role: string;
  icon: any;
  color: string;
}

const AGENT_NODES: AgentNode[] = [
  { id: 'stats', name: 'Stats Agent', role: 'Live Score & NRR ingestion', icon: TrendingUp, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'strategy', name: 'Strategy Agent', role: 'Matchups & field placements', icon: ShieldCheck, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'prediction', name: 'Prediction Agent', role: 'Win probability modeling', icon: Cpu, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { id: 'commentary', name: 'Commentary Agent', role: 'Bilingual Shayari comments', icon: Volume2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'fantasy', name: 'Fantasy Agent', role: 'Optimized draft suggestions', icon: Award, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'conversational', name: 'Conversational Agent', role: 'ChatGPT Cricket Core', icon: MessageSquare, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

export default function AIAnalyst() {
  const [activeMode, setActiveMode] = useState<'beginner' | 'casual' | 'expert'>('beginner');
  const [pipelineActiveStep, setPipelineActiveStep] = useState<number>(-1);
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [orchestratedResponses, setOrchestratedResponses] = useState<{ [key: string]: string }>({});
  
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [jargonAnswer, setJargonAnswer] = useState<string>(
    "Welcome to the Explainer Desk! Pick an interactive cricket question chip below to solve complex IPL terminologies or type a custom prompt."
  );
  
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [hindiAudioCommentary, setHindiAudioCommentary] = useState<string>('');
  const [isGeneratingHindi, setIsGeneratingHindi] = useState<boolean>(false);

  // Suggested Jargon Explanations
  const jargonPresets = [
    {
      q: "Explain match like I'm beginner",
      ans: "👶🏼 **Cricket Simplified**: Think of it as a tactical battle of 'run capture'. One team runs as fast as possible to build a high score, while the other puts up special defenders (fielders and batters) and throws balls to trap them. In IPL, each team gets exactly 20 overs (120 balls). Whoever scores more runs wins!"
    },
    {
      q: "Why is Net Run Rate (NRR) crucial?",
      ans: "📊 **Net Run Rate (NRR) Demystified**: NRR is basically the league's tie-breaker calculator! It's defined as the average runs your team scores per over, MINUS the average runs your team concedes per over. If two teams have equal points, the team that finished games faster or won by larger margins climbs higher!"
    },
    {
      q: "Why is strike rotation important?",
      ans: "🏏 **Strike Rotation Mechanics**: Moving from one end of the pitch to the other (getting a single run) changes who faces the next ball. This is highly effective because: 1) it offsets the bowler's plans, 2) it prevents bowlers from setting tight traps, and 3) it shares physical fatigue between batters!"
    },
    {
      q: "Why are yorkers extremely effective?",
      ans: "🎯 **The Yorker Trap**: A yorker is pitched directly on the batter's toes. Because it lands so deep, the bat cannot sweep or lift the ball into the air without risking getting clean-bowled or trapped Leg-Before-Wicket (LBW). It's the ultimate defense in death overs!"
    }
  ];

  // Quick Commentary Soundboard presets
  const commentaryPresets = [
    {
      title: "Dhoni Helicopter Shot! 🚁",
      scen: "Retro helicopter strike over long-on with immense power",
      comment: "धोनी हेलीकॉप्टर टेक ऑफ! ओहोहो! महेंद्र सिंह धोनी ने अपने चिर-परिचित अंदाज़ में पूरी ताक़त झोंकते हुए, गेंदबाज़ की यॉर्कर को कलाई के झटके से सीधा दर्शकों के पास पहुँचा दिया है! यह खेल नहीं, साक्षात क्रिकेट की जादूगरी है! पूरा स्टेडियम महेंद्र सिंह के नाम से गूँज रहा है!"
    },
    {
      title: "Bumrah Toe-Crusher Yorker! 🎯",
      scen: "Searing 148km/h inswinging yorker defeating opening batter",
      comment: "अंगूठा तोड़ यॉर्कर! बुमराह की रफ़्तार का कोई जवाब नहीं! गेंद हवा में लहराती हुई अंदर आई, बल्लेबाज़ बल्ला घुमाने की सोच ही रहा था कि गेंद गिल्लियाँ ले उड़ गई! मध्य स्टंप ज़मीन पर गिर कर कह रहा है कि बुमराह दुनिया के सबसे घातक योद्धा हैं!"
    },
    {
      title: "Suryakumar 360 Sweep! 🌀",
      scen: "Unorthodox scoop over fine leg boundary off express bowler",
      comment: "सूर्यकुमार यादव का जादुई शॉट! अजब-गज़ब खेल! ऑफ़-स्टंप के बाहर की गेंद को घुटने के बल बैठकर फाइन लेग के ऊपर से सीधा छह रनों के लिए उड़ा दिया! क्या रचनाकार हैं ये! गेंदबाज़ सर पकड़ कर बैठ गया है, मैदान पर सिर्फ सूर्या का साम्राज्य है!"
    },
    {
      title: "Super Boundary Line Catch! 👐🏼",
      scen: "Athletic catch and release on boundary to secure crucial wicket",
      comment: "अविश्वसनीय कैच! बाउन्ड्री लाइन पर करिश्मा! खिलाड़ी ने पहले छक्के को रोका, हवा में गेंद हवा में उछाली, बाउंड्री के बाहर पैर छूने से बचे और वापस आकर गोता लगाकर गेंद को कैच कर लिया! लाजवाब फुर्ती, इस विकेट ने तो पूरे मैच का पासा ही पलट दिया है!"
    }
  ];

  // Fire multi-agent pipeline orchestrator simulation
  const handleTriggerPipeline = async () => {
    setIsOrchestrating(true);
    setPipelineActiveStep(0);
    setOrchestratedResponses({});

    // Sequential timing simulation for UX glow lines representing data transmission 
    const stepDuration = 1000;

    for (let i = 0; i < AGENT_NODES.length; i++) {
      setPipelineActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }

    try {
      // Call actual orchestrated endpoint
      const res = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: "Analyze current game conditions and fantasy prospects to explain everything simply.",
          pitchType: "Flat",
          riskProfile: "Balanced",
          favoriteTeam: "CSK"
        })
      });
      const data = await res.json();
      
      const parsed: { [key: string]: string } = {};
      if (data.success && data.pipeline) {
        data.pipeline.forEach((node: any) => {
          parsed[node.id] = node.text;
        });
      }
      setOrchestratedResponses(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrchestrating(false);
    }
  };

  // Custom question explainer query
  const handleCustomQuestion = async (qText: string) => {
    if (!qText.trim()) return;
    setIsReplying(true);
    setJargonAnswer('');
    
    try {
      const res = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'conversation',
          userPrompt: `Active Mode: ${activeMode}. Explain simply: ${qText}`,
        })
      });
      const data = await res.json();
      setJargonAnswer(data.text);
    } catch (err) {
      setJargonAnswer("Error connecting to explainer agent. Sticking with simple offline concept indexes.");
    } finally {
      setIsReplying(false);
    }
  };

  // Custom emotional Hindi commentary generator
  const handleGenerateHindiCom = async (promptDescr: string) => {
    setIsGeneratingHindi(true);
    setHindiAudioCommentary('');
    try {
      const res = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'commentary',
          userPrompt: `Generate intensely exciting and emotional traditional Hindi cricket commentary for: ${promptDescr}`
        })
      });
      const data = await res.json();
      setHindiAudioCommentary(data.text);
    } catch (err) {
      setHindiAudioCommentary("क्रेज़ी मैच की स्थिति! बुमराह ने डाला गज़ब का यॉर्कर, बल्लेबाज़ पूरी तरह से चकित हो गया!");
    } finally {
      setIsGeneratingHindi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial Overview banner */}
      <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/40 p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Multi-Agent Cricket Intelligence Labs</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Interact with our true multi-agent pipeline ecosystem. Coordinate Stats, Strategy, Prediction, Commentary, and Fantasy agent modules under a unified pipeline or consult our bilingual Jargon Explainer desk.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (COL-SPAN 7): MULTI-AGENT ARCHITECTURE PIPELINE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span>Multi-Agent Orchestrator Pipeline</span>
              </span>
              <button
                id="orchestrate-pipeline-btn"
                onClick={handleTriggerPipeline}
                disabled={isOrchestrating}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{isOrchestrating ? 'Pipeline Executing...' : 'Trigger Agent Consensus'}</span>
              </button>
            </div>

            {/* Pipeline Step Visualizer */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
              {AGENT_NODES.map((node, idx) => {
                const NodeIcon = node.icon;
                const isActive = pipelineActiveStep === idx;
                const isPassed = pipelineActiveStep > idx;
                const completedText = orchestratedResponses[node.id];

                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-32 ${
                      isActive 
                        ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/25' 
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-slate-800/80 bg-slate-950/40 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">NODE 0{idx+1}</span>
                        {isPassed && <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">{node.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 font-sans leading-tight">{node.role}</p>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className={`p-1.5 rounded-lg border ${node.color}`}>
                        <NodeIcon className="h-4 w-4" />
                      </div>
                      <span className="text-[8px] font-mono text-slate-450 uppercase">
                        {isActive ? 'calculating' : isPassed ? 'resolved' : 'queued'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Orchestration step summaries */}
            <div className="mt-6 rounded-xl bg-slate-950/60 border border-slate-850 p-4 min-h-[160px] text-xs space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 font-mono tracking-wider pb-2 border-b border-slate-900/60 uppercase">
                Consensus Output Feed
              </h3>
              
              {pipelineActiveStep === -1 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500">
                  <Play className="h-6 w-6 text-slate-600 mb-2 animate-bounce" />
                  <p className="font-mono">Click "Trigger Agent Consensus" to watch the 6-agent committee debate match telemetry step-by-step!</p>
                </div>
              ) : (
                <div className="space-y-4 font-sans text-slate-300 leading-relaxed">
                  {AGENT_NODES.map((node, idx) => {
                    if (pipelineActiveStep < idx) return null;
                    const responseText = orchestratedResponses[node.id] || "Retrieving computed parameters from committee...";
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-slate-900/30 border border-slate-850/80"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1 pb-1 border-b border-slate-850">
                          <span className="text-yellow-400 font-bold uppercase">{node.name} Node Output</span>
                          <span className="text-slate-500">Success Code 200</span>
                        </div>
                        <p className="text-slate-305 text-[11px] font-medium leading-normal whitespace-pre-wrap">{responseText}</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (COL-SPAN 5): AI MATCH EXPLAINER & BILINGUAL JARGON Solver */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FEATURE 3: AI MATCH EXPLAINER */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Bilingual Jargon Explainer
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-black">
                Glossary Solver
              </span>
            </div>

            {/* Beginner / Casual Mode selector */}
            <div className="flex border border-slate-800 rounded-lg p-0.5 bg-slate-950 text-xs">
              {(['beginner', 'casual', 'expert'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMode(m)}
                  className={`flex-1 py-1.5 text-center font-bold capitalize rounded transition ${activeMode === m ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {m === 'beginner' ? 'Beginner 👶🏼' : m === 'casual' ? 'Casual 🍿' : 'Expert 🎯'}
                </button>
              ))}
            </div>

            {/* Interactive Question Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {jargonPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setJargonAnswer(item.ans);
                  }}
                  className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 text-[10px] text-slate-350 px-2.5 py-1.5 rounded-full transition font-mono whitespace-nowrap"
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* Response Display */}
            <div className="rounded-xl bg-slate-955 bg-slate-950 border border-slate-850 p-4 text-[11px] min-h-[140px] leading-relaxed flex flex-col justify-between">
              <div>
                <div className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-black mb-1.5">
                  Explanation Matrix ({activeMode} mode)
                </div>
                <div className="text-slate-300 font-medium whitespace-pre-wrap">
                  {isReplying ? (
                    <div className="flex items-center space-x-2 text-slate-400 font-mono py-4">
                      <div className="h-4 w-4 rounded-full border border-t-2 border-cyan-400 animate-spin" />
                      <span>Explaining concepts like I'm human...</span>
                    </div>
                  ) : (
                    jargonAnswer
                  )}
                </div>
              </div>
              <div className="text-[9px] text-slate-500 border-t border-slate-900 mt-2 pt-2.5 font-mono">
                💡 explanations simplify dense cricket metrics (e.g. yorker speeds, NRR calculators, pitch metrics) into clear beginner vectors.
              </div>
            </div>

            {/* Custom search box query */}
            <div className="flex space-x-2 pt-1">
              <input
                id="explainer-custom-input"
                type="text"
                placeholder="Ask e.g. 'Why are spinners effective?' or 'What is a maiden over?'"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomQuestion((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500/50 transition font-medium"
              />
              <button
                id="explainer-custom-btn"
                onClick={() => {
                  const el = document.getElementById('explainer-custom-input') as HTMLInputElement;
                  if (el) {
                    handleCustomQuestion(el.value);
                    el.value = '';
                  }
                }}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:bg-slate-700 text-white font-bold px-3 text-xs rounded-xl transition flex items-center justify-center shadow-md pb-0.5"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* EMOTIONAL HINDI COMMENTARY DESK */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center space-x-2">
                <Languages className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Hindi Emotional Commentary
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded font-black uppercase">
                शायरी मोड
              </span>
            </div>

            {/* Soundboard Preset Grid */}
            <div className="grid grid-cols-2 gap-2">
              {commentaryPresets.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHindiAudioCommentary(pr.comment);
                  }}
                  className="text-left bg-slate-950/80 border border-slate-800 hover:border-amber-400/40 hover:bg-slate-900 p-2.5 rounded-xl transition group flex flex-col justify-between"
                >
                  <span className="text-[10px] font-extrabold text-slate-200 group-hover:text-amber-300 transition line-clamp-1">{pr.title}</span>
                  <span className="text-[8px] text-slate-500 mt-1 truncate">{pr.scen}</span>
                </button>
              ))}
            </div>

            {/* Simulated Live commentary readout */}
            <div className="rounded-xl border border-slate-850 bg-slate-950/80 p-4 min-h-[150px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1.5 opacity-10">
                <Volume2 className="h-20 w-20 text-white" />
              </div>

              <div>
                <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-black mb-1.5 block">
                  Simulated Hindi Broadcast feeds
                </span>

                <div className="text-xs text-amber-300 font-sans leading-relaxed">
                  {isGeneratingHindi ? (
                    <div className="flex items-center space-x-2 text-slate-400 font-mono py-4">
                      <div className="h-4 w-4 rounded-full border border-t-2 border-amber-400 animate-spin" />
                      <span>Shayari coms loading...</span>
                    </div>
                  ) : hindiAudioCommentary ? (
                    <p className="font-semibold">{hindiAudioCommentary}</p>
                  ) : (
                    <p className="text-slate-500 italic">Select a scenario above to test emotional commentary or type a custom match situation in the input field below.</p>
                  )}
                </div>
              </div>

              {hindiAudioCommentary && (
                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                  <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Voice Synthesizer Ready
                  </span>
                  <button
                    onClick={() => {
                      // simple audio alert simulation
                      alert("Voice-ready synthesiser simulated! This emotional Hindi audio payload has been queued on Cloud Run Clusters.");
                    }}
                    className="text-[9.5px] bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 rounded px-2 py-1 font-mono hover:text-white transition"
                  >
                    Play Audio Feed
                  </button>
                </div>
              )}
            </div>

            {/* Custom scenario Hindi injection */}
            <div className="flex space-x-2 pt-1">
              <input
                id="hindi-custom-input"
                type="text"
                placeholder="Type e.g. 'Kohli hitting cover drive' to generate Shayari comments"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGenerateHindiCom((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400/40 transition font-medium"
              />
              <button
                id="hindi-custom-btn"
                onClick={() => {
                  const el = document.getElementById('hindi-custom-input') as HTMLInputElement;
                  if (el) {
                    handleGenerateHindiCom(el.value);
                    el.value = '';
                  }
                }}
                className="bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-400 font-bold px-4 text-xs rounded-xl transition flex items-center justify-center shadow-md pb-0.5"
              >
                <span>Shayari</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
