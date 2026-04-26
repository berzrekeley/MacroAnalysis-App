import React, { useState } from 'react';
import './App.css';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  Globe, 
  Building, 
  ShoppingCart, 
  Cpu, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Clock,
  Radio,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Network,
  ShieldAlert,
  BarChart,
  Code,
  Trophy,
  Zap,
  Award,
  Video
} from 'lucide-react';

// Data Models
const metricsData = [
  { title: "Buffett Indicator", value: "232%", status: "Extreme Risk - historic extreme", type: "extreme", icon: <TrendingUp size={20} /> },
  { title: "Fed Funds Rate", value: "3.50% - 3.75%", status: "Neutral - 99% chance of no change", type: "neutral", icon: <Building size={20} /> },
  { title: "10Y - 2Y Spread", value: "+0.51%", status: "Steepening - slower growth", type: "warning", icon: <Activity size={20} /> },
  { title: "10Y Treasury Rate", value: "4.30%", status: "High - energy-driven inflation", type: "warning", icon: <DollarSign size={20} /> },
  { title: "2Y Treasury Rate", value: "3.79%", status: "Elevated - higher-for-longer stance", type: "warning", icon: <DollarSign size={20} /> },
  { title: "Consumer Sentiment", value: "49.8", status: "Critical - record low", type: "extreme", icon: <AlertTriangle size={20} /> },
  { title: "Retail Sales (MoM)", value: "+1.7%", status: "Distorted - high gas prices", type: "warning", icon: <ShoppingCart size={20} /> },
  { title: "Leading Index (LEI)", value: "-0.1%", status: "Weakening - persistent headwinds", type: "warning", icon: <TrendingDown size={20} /> },
  { title: "Building Permits", value: "1.386M", status: "Soft - cooling residential activity", type: "warning", icon: <Building size={20} /> },
  { title: "Initial Jobless Claims", value: "214,000", status: "Stable - primary pillar of support", type: "neutral", icon: <Activity size={20} /> },
  { title: "Monthly ADP Employment", value: "+184,000", status: "Stable - private sector resilience", type: "neutral", icon: <Users size={20} /> },
];

const adpWeeklyData = [
  { week: "Apr 18", fullDate: "Apr 18, 2026", number: 45200, delta: 1200, deltaPct: 2.72 },
  { week: "Apr 11", fullDate: "Apr 11, 2026", number: 44000, delta: -2500, deltaPct: -5.37 },
  { week: "Apr 04", fullDate: "Apr 04, 2026", number: 46500, delta: 3500, deltaPct: 8.14 },
  { week: "Mar 28", fullDate: "Mar 28, 2026", number: 43000, delta: -1500, deltaPct: -3.37 },
  { week: "Mar 21", fullDate: "Mar 21, 2026", number: 44500, delta: -800, deltaPct: -1.76 },
  { week: "Mar 14", fullDate: "Mar 14, 2026", number: 45300, delta: 2300, deltaPct: 5.35 },
  { week: "Mar 07", fullDate: "Mar 07, 2026", number: 43000, delta: -4000, deltaPct: -8.51 },
  { week: "Feb 28", fullDate: "Feb 28, 2026", number: 47000, delta: 1500, deltaPct: 3.30 },
  { week: "Feb 21", fullDate: "Feb 21, 2026", number: 45500, delta: -2500, deltaPct: -5.21 },
  { week: "Feb 14", fullDate: "Feb 14, 2026", number: 48000, delta: 3000, deltaPct: 6.66 },
  { week: "Feb 07", fullDate: "Feb 07, 2026", number: 45000, delta: 1000, deltaPct: 2.27 },
  { week: "Jan 31", fullDate: "Jan 31, 2026", number: 44000, delta: -2200, deltaPct: -4.76 },
  { week: "Jan 24", fullDate: "Jan 24, 2026", number: 46200, delta: 1200, deltaPct: 2.66 },
  { week: "Jan 17", fullDate: "Jan 17, 2026", number: 45000, delta: -3500, deltaPct: -7.21 },
  { week: "Jan 10", fullDate: "Jan 10, 2026", number: 48500, delta: 2500, deltaPct: 5.43 },
  { week: "Jan 03", fullDate: "Jan 03, 2026", number: 46000, delta: 0, deltaPct: 0.00 },
];

const sectorData = [
  { id: 'tech', name: "Technology", icon: <Cpu size={24} />, risk: "High", outlook: "Underweight", headwind: "Multiple contraction & AI CAPEX scrutiny", details: "The technology sector is undergoing a necessary but painful regime change, characterized primarily by valuation compression in B2B software, which is currently down 22.2% year-to-date. The previous narrative of unconditional growth has been replaced by an AI boom reality check. Enterprises are aggressively scrutinizing capital expenditures, shifting from speculative AI exploration to demanding tangible return on investment." },
  { id: 'energy', name: "Energy & Trans.", icon: <Globe size={24} />, risk: "Medium", outlook: "Neutral / Defensive", headwind: "Margin destruction from fuel costs", details: "This sector remains the epicenter of current macroeconomic stress. The prevailing $5.45/gallon diesel price has systematically dismantled operating margins across the logistics and transportation matrix. We are tracking a devastating 50% increase in freight fuel expenditures, which is cascading through the supply chain." },
  { id: 'banking', name: "Banking & Fin.", icon: <Building size={24} />, risk: "High", outlook: "Underweight", headwind: "Unrealized losses & duration mismatch", details: "Systemic vulnerabilities within regional and mid-tier banks remain an acute concern. As outlined in the FDIC 2026 Risk Review, the overhang of unrealized securities losses continues to impair balance sheet flexibility. The duration mismatch in a 'higher-for-longer' rate environment constrains lending capacity." },
  { id: 'realestate', name: "Real Estate", icon: <Building size={24} />, risk: "High", outlook: "Bearish", headwind: "Elevated rates & federal debt crowding out", details: "The commercial and residential real estate markets are being suffocated by the macro-level crowding-out effect of the $38 trillion federal debt. This dynamic exerts a $76,000 negative impact on the lifetime purchasing power of median borrowers, freezing transaction volumes and forcing a slow-motion capitulation in property valuations." },
  { id: 'consumer', name: "Consumer Disc.", icon: <ShoppingCart size={24} />, risk: "High", outlook: "Bearish", headwind: "Stagflationary pressure / Regressive tax", details: "The consumer discretionary sector is facing immediate stagflationary pressure. The surge in essential costs—primarily driven by fuel and energy—operates as a highly regressive tax on the lower and middle-income cohorts. Spending on durables, leisure, and discretionary retail is being systematically hollowed out." }
];

const probabilities = [
  { title: "Market Crash / Bear Market", prob: 45, color: "bg-red-500", desc: "Convergence of the extreme Buffett Indicator (232%), policy error forced by energy inflation, and labor market cracks." },
  { title: "Market Correction (10-20%)", prob: 35, color: "bg-amber-500", desc: "Path of least resistance if multiples revert to historical means, assuming labor holds but rates stay higher-for-longer." },
  { title: "Continuation of Bull Run", prob: 20, color: "bg-emerald-500", desc: "Requires immediate resolution to Middle East conflict, dropping energy prices, and flawless AI monetization execution." }
];

const aiHeadlines = [
  {
    category: "Major Company Moves & Partnerships",
    icon: <Network size={20} className="text-purple-400" />,
    items: [
      { title: "Google & Anthropic", desc: "Google plans to invest up to $40 billion in Anthropic, a deal that includes a massive five-gigawatt compute agreement for AI training." },
      { title: "OpenAI's 'Super App' Path", desc: "OpenAI has released GPT-5.5, signaling a move toward creating an all-encompassing AI 'super app'." },
      { title: "Snowflake & OpenAI", desc: "The two companies signed a $200 million deal to bring 'agentic AI'—autonomous bots that analyze corporate data and execute workflows—to enterprise customers." },
      { title: "Meta & Amazon", desc: "Meta has partnered with Amazon to use Graviton CPUs for its agentic workloads, diversifying its hardware away from purely GPU-based systems." },
      { title: "SpaceX & xAI", desc: "Elon Musk's xAI was reportedly merged into SpaceX, creating a combined entity valued at approximately $1.25 trillion. (Reuters)" }
    ]
  },
  {
    category: "Market & Infrastructure Headlines",
    icon: <Building size={20} className="text-blue-400" />,
    items: [
      { title: "Nvidia’s Milestone", desc: "Optimization about enterprise AI adoption pushed Nvidia's market capitalization past $5 trillion." },
      { title: "Chip Sector Growth", desc: "Intel shares surged 24% following an earnings report that projected significant revenue growth driven by AI demand." },
      { title: "Data Center Regulation", desc: "Maine's governor recently vetoed a first-of-its-kind state freeze on new data centers, reflecting the tension between local resource management and AI expansion. (Reuters)" }
    ]
  },
  {
    category: "Workforce & Social Impact",
    icon: <Users size={20} className="text-amber-400" />,
    items: [
      { title: "Structural Layoffs", desc: "Despite record spending on AI, major players like Meta are cutting 10% of their workforce, while Microsoft is offering employee buyouts to shift resources toward AI infrastructure." },
      { title: "The 'Talent War'", desc: "OpenAI is aggressively poaching top engineers and executives from traditional software firms like Salesforce and Palantir to help enterprise clients implement AI." },
      { title: "Public Sentiment", desc: "Recent reports suggest a growing 'public backlash' against AI, with Gen Z excitement for the technology dropping as concerns over job automation and 'propaganda' increase. (The Guardian)" }
    ]
  },
  {
    category: "Security & Emerging Risks",
    icon: <ShieldAlert size={20} className="text-red-400" />,
    items: [
      { title: "'Mythos' Leak", desc: "A high-level cybersecurity-focused model from Anthropic, called Mythos, was reportedly accessed by an unauthorized group. The model is capable of finding hundreds of bugs in browsers like Firefox." },
      { title: "China-US Tensions", desc: "The US State Department issued warnings regarding alleged AI thefts by Chinese firms, while Beijing has moved to restrict US investments in Chinese tech companies. (Reuters)" }
    ]
  }
];

const aiModels = [
  { model: "GPT-5.5", developer: "OpenAI", trait: "Foundation for upcoming 'super app'" },
  { model: "Gemini 3.1 Pro", developer: "Google", trait: "Current top pick in several performance leaderboards" },
  { model: "Claude Opus 4.6", developer: "Anthropic", trait: "High-performance enterprise-ready model" },
  { model: "DeepSeek V4", developer: "DeepSeek", trait: "New-generation model 'closing the gap' with frontier systems" }
];

const reasoningBenchmarks = [
  { model: "Gemini 3.1 Pro", gpqa: "94.3%", hle: "45.8%", mensa: "143" },
  { model: "Claude Opus 4.7", gpqa: "94.2%", hle: "41.2% (est.)", mensa: "144" },
  { model: "GPT-5.5", gpqa: "93.6%", hle: "41.4%", mensa: "145" },
  { model: "Grok-4.20", gpqa: "91.5% (est.)", hle: "—", mensa: "145" }
];

const codingPerformance = [
  { metric: "SWE-Bench (Agentic Coding)", desc: "Claude Opus 4.7 leads with 87.6%, followed by Claude Sonnet 4.5 at 82% and GPT 5.2 at 80%." },
  { metric: "AIME 2025 (High School Math)", desc: "Both Gemini 3 Pro and GPT 5.2 have reached 100% saturation, making this benchmark less useful for distinguishing top-tier performance." }
];

const chatbotArena = [
  { model: "Gemini 3.1 Pro", elo: "1505 Elo" },
  { model: "Claude Opus 4.7", elo: "1504 Elo" },
  { model: "Claude Opus 4.6 (Thinking)", elo: "1503 Elo" },
  { model: "Grok-4.20", elo: "1496 Elo" }
];

const hardwareInference = [
  { title: "Throughput Record (AMD)", desc: "Crossed the 1-million-tokens-per-second threshold at multinode scale using its latest hardware and software optimizations." },
  { title: "Memory Efficiency (Google)", desc: "TurboQuant technology demonstrated a 6x reduction in KV cache memory and up to an 8x speedup on NVIDIA H100 GPUs without accuracy loss." }
];

const aiScorecardData = [
  { rank: 1, model: "Claude Mythos (Preview)", developer: "Anthropic", coding: 99, writing: 88, uiux: 85, arch: 98, sec: 100 },
  { rank: 2, model: "Claude Opus 4.7", developer: "Anthropic", coding: 94, writing: 98, uiux: 88, arch: 96, sec: 92 },
  { rank: 3, model: "Gemini 3.1 Pro", developer: "Google", coding: 89, writing: 90, uiux: 99, arch: 90, sec: 88 },
  { rank: 4, model: "GPT-5.5", developer: "OpenAI", coding: 93, writing: 91, uiux: 90, arch: 95, sec: 90 },
  { rank: 5, model: "GPT-5.4 Pro", developer: "OpenAI", coding: 90, writing: 92, uiux: 88, arch: 89, sec: 87 },
  { rank: 6, model: "Claude Opus 4.6", developer: "Anthropic", coding: 88, writing: 96, uiux: 82, arch: 91, sec: 85 },
  { rank: 7, model: "Grok 4.20 (Expert)", developer: "xAI", coding: 87, writing: 85, uiux: 84, arch: 86, sec: 82 },
  { rank: 8, model: "DeepSeek V3.2", developer: "DeepSeek", coding: 85, writing: 82, uiux: 75, arch: 84, sec: 80 },
  { rank: 9, model: "GLM-5.1", developer: "Zhipu AI", coding: 84, writing: 80, uiux: 78, arch: 82, sec: 78 },
  { rank: 10, model: "Kimi K2 Thinking", developer: "Moonshot", coding: 83, writing: 86, uiux: 76, arch: 80, sec: 75 },
];

const videoModelsData = [
  { rank: 1, model: "Grok Imagine Video", developer: "xAI", genScore: 98, motion: 97, prompt: 94, bestFor: "Short, cinematic clips & social media viral content" },
  { rank: 2, model: "Veo 3.1", developer: "Google", genScore: 96, motion: 95, prompt: 98, bestFor: "High-fidelity 4K production & spatial audio sync" },
  { rank: 3, model: "Runway Gen-4.5", developer: "Runway", genScore: 94, motion: 92, prompt: 96, bestFor: "Professional VFX & granular creative control" },
  { rank: 4, model: "Sora 2 Pro", developer: "OpenAI", genScore: 92, motion: 93, prompt: 91, bestFor: "Long-form clips (up to 25s) & narrative consistency" },
  { rank: 5, model: "Wan 2.6", developer: "Alibaba", genScore: 89, motion: 88, prompt: 85, bestFor: "Open-source development & fast iteration" },
  { rank: 6, model: "Kling 3.0", developer: "Kuaishou", genScore: 88, motion: 85, prompt: 87, bestFor: "High frame rate (60fps) & action sequences" },
];

// Components
const MetricCard = ({ metric }) => {
  const borderColors = {
    extreme: "border-l-red-500",
    warning: "border-l-amber-500",
    neutral: "border-l-slate-500"
  };
  const iconColors = {
    extreme: "text-red-400",
    warning: "text-amber-400",
    neutral: "text-slate-400"
  };

  return (
    <div className={`bg-slate-800 p-4 rounded-lg border-l-4 ${borderColors[metric.type]} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default group`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.title}</h3>
        <span className={`${iconColors[metric.type]} group-hover:scale-110 transition-transform duration-300`}>
          {metric.icon}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
      <div className="text-xs text-slate-400">{metric.status}</div>
    </div>
  );
};

const SectorAccordion = ({ sector }) => {
  const [isOpen, setIsOpen] = useState(false);

  const riskColors = {
    High: "text-red-400 bg-red-400/10 border-red-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-700 rounded-lg text-cyan-400">
            {sector.icon}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-white">{sector.name}</h3>
            <p className="text-sm text-slate-400 hidden md:block">{sector.headwind}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskColors[sector.risk]}`}>
            {sector.risk} Risk
          </span>
          {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-4 pt-0 border-t border-slate-700/50 text-slate-300 text-sm leading-relaxed bg-slate-800/30">
          <p className="mb-2 md:hidden block font-semibold text-slate-400">Headwind: {sector.headwind}</p>
          {sector.details}
          <div className="mt-3 inline-block px-2 py-1 bg-slate-900 rounded text-xs font-mono text-cyan-400">
            Outlook: {sector.outlook}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [adpTimeFrame, setAdpTimeFrame] = useState('YTD');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="text-cyan-400 animate-pulse" size={18} />
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Live Briefing</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">MARKET STATE BRIEFING</h1>
            <p className="text-slate-400 text-sm mt-1">Lead Market Analyst Executive Overview</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <Clock size={20} className="text-slate-400" />
              April 24, 2026
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">CONFIDENTIAL REPORT</div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex gap-2 p-1 bg-slate-800/50 rounded-lg w-fit border border-slate-700 overflow-x-auto max-w-full">
          {['overview', 'sectors', 'probabilities', 'ai', 'comparisons'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              } ${tab === 'ai' || tab === 'comparisons' ? 'uppercase' : 'capitalize'}`}
            >
              {tab === 'ai' ? 'AI Summary' : tab === 'comparisons' ? 'Model Comparisons' : tab}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <div className="col-span-1 lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                  <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                    <Activity size={20} className="text-cyan-400"/> Executive Summary
                  </h2>
                  <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
                    <p>The current macroeconomic environment is characterized by an extreme valuation paradigm that leaves equity markets highly vulnerable to exogenous shocks and shifting monetary policy. Despite clear signals of economic deceleration, risk assets have continued to price in an improbable scenario of flawless execution, ignoring mounting structural headwinds. We are operating in a climate where historical safety margins have evaporated, demanding a rigorous defensive posture and active risk mitigation across all asset classes.</p>
                    <p>Compounding this precarious domestic setup is the escalating geopolitical instability, most notably the Strait of Hormuz standoff. The disruption of global energy supply lines has injected an immediate inflationary impulse into the system, complicating the Federal Reserve's path forward and acting as a direct tax on the consumer. The convergence of these energy shocks with already stretched equity multiples creates a brittle market structure where any catalyst could trigger a rapid and severe repricing of risk.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-cyan-400"/> Economic & Market Dashboard
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {metricsData.map((metric, idx) => (
                      <MetricCard key={idx} metric={metric} />
                    ))}
                  </div>

                  {/* ADP Weekly Employment Tracker - Interactive Chart */}
                  <div className="mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-700 pb-2 gap-4">
                      <h3 className="text-md font-bold text-slate-300 flex items-center gap-2">
                        <Users size={18} className="text-cyan-400"/> ADP Weekly Employment Tracker
                      </h3>
                      <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 w-fit">
                        {['1M', '3M', 'YTD'].map(tf => (
                          <button
                            key={tf}
                            onClick={() => setAdpTimeFrame(tf)}
                            className={`px-4 py-1 text-xs font-semibold rounded-md transition-colors ${adpTimeFrame === tf ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
                      
                      <div className="h-64 relative pt-4 pb-8 pl-8 sm:pl-12">
                        {(() => {
                          // Filter data based on selected timeframe
                          let filtered = adpWeeklyData;
                          if (adpTimeFrame === '1M') filtered = adpWeeklyData.slice(0, 4);
                          if (adpTimeFrame === '3M') filtered = adpWeeklyData.slice(0, 12);
                          
                          // Reverse so it reads chronologically from left to right
                          const chartData = [...filtered].reverse();

                          // Dynamically calculate Y-axis bounds based on visible data
                          const numbers = chartData.map(d => d.number);
                          const minVal = Math.floor(Math.min(...numbers) / 1000) * 1000 - 1000;
                          const maxVal = Math.ceil(Math.max(...numbers) / 1000) * 1000 + 1000;
                          const range = maxVal - minVal;
                          const midVal = minVal + (range / 2);

                          const getCoords = (val, idx) => {
                            // If there's only 1 point, center it. Otherwise scale.
                            const x = chartData.length > 1 ? (idx / (chartData.length - 1)) * 100 : 50;
                            const y = 100 - (((val - minVal) / range) * 100);
                            return { x, y };
                          };

                          const polylinePoints = chartData.map((d, i) => {
                            const { x, y } = getCoords(d.number, i);
                            return `${x},${y}`;
                          }).join(' ');

                          const polygonPoints = `0,100 ${polylinePoints} 100,100`;

                          return (
                            <>
                              {/* Dynamic Y-axis Grid Lines */}
                              <div className="absolute top-4 bottom-8 left-0 right-0 flex flex-col justify-between pointer-events-none text-xs text-slate-500 z-0">
                                <div className="border-b border-slate-700/50 w-full flex items-center -mt-2"><span className="bg-slate-800 pr-2 relative -left-8 sm:-left-12 w-8 sm:w-12 text-right">{(maxVal/1000).toFixed(0)}k</span></div>
                                <div className="border-b border-slate-700/50 w-full flex items-center -mt-2"><span className="bg-slate-800 pr-2 relative -left-8 sm:-left-12 w-8 sm:w-12 text-right">{(midVal/1000).toFixed(1).replace('.0', '')}k</span></div>
                                <div className="border-b border-slate-700/50 w-full flex items-center -mt-2"><span className="bg-slate-800 pr-2 relative -left-8 sm:-left-12 w-8 sm:w-12 text-right">{(minVal/1000).toFixed(0)}k</span></div>
                              </div>

                              {/* Line Chart Container */}
                              <div className="absolute top-4 bottom-8 left-12 sm:left-16 right-4 z-10 transition-all duration-500">
                                {/* SVG Line and Fill */}
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                                  <defs>
                                    <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4"/>
                                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
                                    </linearGradient>
                                  </defs>
                                  <polygon points={polygonPoints} fill="url(#lineGradient)" className="transition-all duration-500" />
                                  <polyline points={polylinePoints} fill="none" stroke="#22d3ee" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="transition-all duration-500" />
                                </svg>

                                {/* Interactive Data Points */}
                                {chartData.map((data, idx) => {
                                  const { x, y } = getCoords(data.number, idx);
                                  const isPositive = data.delta > 0;
                                  const isNegative = data.delta < 0;

                                  return (
                                    <div 
                                      key={`point-${data.week}`} 
                                      className="absolute group w-4 h-4 -ml-2 -mt-2 flex items-center justify-center cursor-pointer z-20 transition-all duration-500"
                                      style={{ left: `${x}%`, top: `${y}%` }}
                                    >
                                      {/* Point Dot */}
                                      <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-white group-hover:scale-150 transition-all shadow-[0_0_8px_rgba(34,211,238,0.8)] border border-slate-900"></div>

                                      {/* Hover Tooltip */}
                                      <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 border border-slate-600 p-3 rounded-lg shadow-xl w-48 pointer-events-none origin-bottom z-30 -translate-x-1/2 left-1/2">
                                        <div className="text-xs text-slate-400 mb-1">{data.fullDate}</div>
                                        <div className="text-xl font-bold text-white mb-1">{data.number.toLocaleString()}</div>
                                        <div className="text-sm font-medium flex items-center gap-1">
                                          {isPositive && <span className="text-emerald-400 flex items-center"><ArrowUpRight size={14}/> +{data.delta.toLocaleString()}</span>}
                                          {isNegative && <span className="text-amber-400 flex items-center"><ArrowDownRight size={14}/> {data.delta.toLocaleString()}</span>}
                                          {data.delta === 0 && <span className="text-slate-400">0</span>}
                                          
                                          <span className="text-slate-500 ml-1">
                                            ({data.deltaPct > 0 ? '+' : ''}{data.deltaPct}%)
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* X-axis Labels */}
                                <div className="absolute -bottom-8 left-0 right-0 h-8">
                                  {chartData.map((data, idx) => {
                                    const { x } = getCoords(data.number, idx);
                                    return (
                                      <div 
                                        key={`label-${data.week}`}
                                        className={`absolute text-[10px] sm:text-xs text-slate-400 whitespace-nowrap font-medium -translate-x-1/2 transition-all duration-500 ${chartData.length > 8 && idx % 2 !== 0 ? 'hidden md:block' : ''}`}
                                        style={{ left: `${x}%`, bottom: '0' }}
                                      >
                                        {data.week}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                    </div>
                  </div>
                </section>
              </div>

              <div className="col-span-1 lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-150 fill-mode-both">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                  <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                    <AlertCircle size={20} className="text-cyan-400"/> Daily Headlines
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse"></span>
                      <p className="text-sm text-slate-300"><strong className="text-white block mb-1">Iran Ceasefire Gamble:</strong> Markets brace for impact as diplomatic back-channels attempt to broker a fragile truce, with crude oil volatility spiking on conflicting regional reports.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                      <p className="text-sm text-slate-300"><strong className="text-white block mb-1">Strait of Hormuz Status:</strong> Naval standoff persists, severely restricting global shipping lanes and cementing a structural risk premium into global supply chains.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <p className="text-sm text-slate-300"><strong className="text-white block mb-1">Tech Multiples Compress:</strong> Nasdaq futures slide as the broader technology sector's P/E multiple falls to 23x, signaling an end to the unconditional AI premium.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* SECTORS TAB */}
          {activeTab === 'sectors' && (
            <div className="col-span-1 lg:col-span-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
                  <Building size={24} className="text-cyan-400"/> Major Sector Risk Analysis
                </h2>
                <div className="flex flex-col gap-4">
                  {sectorData.map((sector) => (
                    <SectorAccordion key={sector.id} sector={sector} />
                  ))}
                </div>
              </div>

              {/* Comparative Table */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg overflow-x-auto">
                <h3 className="text-lg font-bold text-white mb-4">Comparative Sector Risk Matrix</h3>
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-700 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-0">Sector</th>
                      <th className="p-4">Risk Level</th>
                      <th className="p-4">Primary Headwind</th>
                      <th className="p-4 pr-0 text-right">Market Outlook</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {sectorData.map((sector) => (
                      <tr key={sector.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="p-4 pl-0 font-medium text-white flex items-center gap-2">
                          <span className="text-cyan-400 hidden sm:block">{sector.icon}</span>
                          {sector.name}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            sector.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                            sector.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {sector.risk}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{sector.headwind}</td>
                        <td className="p-4 pr-0 text-right font-mono font-semibold text-slate-400">{sector.outlook}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROBABILITIES TAB */}
          {activeTab === 'probabilities' && (
            <div className="col-span-1 lg:col-span-8 lg:col-start-3 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-700 pb-2 flex items-center gap-2">
                  <Activity size={28} className="text-cyan-400"/> Market State Probability Model
                </h2>
                
                <div className="space-y-8">
                  {probabilities.map((prob, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{prob.title}</h3>
                        <span className="text-2xl font-black text-white">{prob.prob}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-4 mb-3 overflow-hidden border border-slate-700">
                        <div 
                          className={`h-4 rounded-full ${prob.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${prob.prob}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400 pl-2 border-l-2 border-slate-700 bg-slate-800/50 p-2 rounded-r">
                        <span className="font-semibold text-slate-300">Rationale:</span> {prob.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI INTELLIGENCE TAB */}
          {activeTab === 'ai' && (
            <div className="col-span-1 lg:col-span-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-700 pb-4 gap-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Bot size={28} className="text-purple-400"/> Daily AI Summary Brief
                  </h2>
                  <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    Updated Daily
                  </div>
                </div>

                {/* Headlines Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {aiHeadlines.map((section, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl p-5 md:p-6 border border-slate-700/50 shadow-inner">
                      <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-3 border-b border-slate-700/50 pb-2">
                        {section.icon} {section.category}
                      </h3>
                      <ul className="space-y-4">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-sm">
                            <strong className="text-slate-200 block mb-1 text-base">{item.title}</strong>
                            <span className="text-slate-400 leading-relaxed">{item.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Benchmarks Table */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Cpu size={20} className="text-cyan-400"/> Key Products & Benchmarks
                  </h3>
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-700 text-sm font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/80">
                          <th className="p-4">Model</th>
                          <th className="p-4">Developer</th>
                          <th className="p-4">Notable Trait</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {aiModels.map((model, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                            <td className="p-4 font-bold text-purple-400">{model.model}</td>
                            <td className="p-4 text-white font-medium">{model.developer}</td>
                            <td className="p-4 text-slate-400">{model.trait}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Advanced AI Benchmarks & Infrastructure Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* General & Reasoning */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                      <BarChart size={18} className="text-blue-400"/> Top General & Reasoning Benchmarks
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">The most cited benchmarks for high-level reasoning currently include GPQA Diamond and Humanity's Last Exam.</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/80">
                            <th className="p-3 pl-2">Model</th>
                            <th className="p-3">GPQA Diamond</th>
                            <th className="p-3">HLE</th>
                            <th className="p-3 pr-2 text-right">Mensa (IQ)</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          {reasoningBenchmarks.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                              <td className="p-3 pl-2 font-bold text-white">{row.model}</td>
                              <td className="p-3 text-emerald-400">{row.gpqa}</td>
                              <td className="p-3 text-amber-400">{row.hle}</td>
                              <td className="p-3 pr-2 font-mono text-cyan-400 text-right">{row.mensa}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Human Preference (Chatbot Arena) */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                      <Trophy size={18} className="text-yellow-400"/> Human Preference (Chatbot Arena)
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">The LMSYS Chatbot Arena remains the definitive source for how users perceive model quality in real-world chat.</p>
                    <div className="space-y-3">
                      {chatbotArena.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-bold w-4">{idx + 1}.</span>
                            <span className="text-white font-medium text-sm">{item.model}</span>
                          </div>
                          <span className="text-yellow-400 font-bold font-mono text-sm">{item.elo}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coding & Agentic Performance */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                      <Code size={18} className="text-emerald-400"/> Coding & Agentic Performance
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">For software engineering and autonomous task execution, Claude Opus 4.7 currently holds a slight edge over its competitors.</p>
                    <ul className="space-y-4">
                      {codingPerformance.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          <strong className="text-slate-200 block mb-1">{item.metric}</strong>
                          <span className="text-slate-400 leading-relaxed block">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hardware & Inference Speed */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                      <Zap size={18} className="text-amber-500"/> Hardware & Inference Speed
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">The latest MLPerf Inference v6.0 results released in April 2026 highlight a massive jump in efficiency.</p>
                    <ul className="space-y-4">
                      {hardwareInference.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          <strong className="text-slate-200 block mb-1">{item.title}</strong>
                          <span className="text-slate-400 leading-relaxed block">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* COMPARISONS TAB */}
          {activeTab === 'comparisons' && (
            <div className="col-span-1 lg:col-span-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-700 pb-4 gap-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Award size={28} className="text-emerald-400"/> Top 10 AI Models: Performance Scorecard
                  </h2>
                  <div className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    April 2026 Updated
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-6 max-w-4xl leading-relaxed">
                  The scores combine <strong className="text-slate-300">SWE-bench Verified</strong> (Coding), <strong className="text-slate-300">EQ-Bench</strong> (Writing), <strong className="text-slate-300">Cybench</strong> (Security), and qualitative expert reviews for Architecture/Design.
                </p>

                <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden overflow-x-auto shadow-inner">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/80">
                        <th className="p-4 w-16 text-center">Rank</th>
                        <th className="p-4">Model & Developer</th>
                        <th className="p-4 text-center">Coding</th>
                        <th className="p-4 text-center">Writing</th>
                        <th className="p-4 text-center">UI/UX Design</th>
                        <th className="p-4 text-center">Architecture</th>
                        <th className="p-4 text-center">Security</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {aiScorecardData.map((row) => {
                        const getScoreColor = (score) => {
                          if (score >= 95) return "text-emerald-400 font-bold bg-emerald-400/10 border-emerald-400/20";
                          if (score >= 90) return "text-cyan-400 font-bold bg-cyan-400/10 border-cyan-400/20";
                          if (score >= 85) return "text-amber-400 font-medium bg-amber-400/10 border-amber-400/20";
                          return "text-slate-300 bg-slate-800 border-slate-700";
                        };

                        return (
                          <tr key={row.rank} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                            <td className="p-4 text-center font-bold text-slate-500">{row.rank}</td>
                            <td className="p-4">
                              <div className="font-bold text-white text-base">{row.model}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{row.developer}</div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.coding)}`}>{row.coding}/100</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.writing)}`}>{row.writing}/100</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.uiux)}`}>{row.uiux}/100</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.arch)}`}>{row.arch}/100</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.sec)}`}>{row.sec}/100</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* VIDEO GENERATION MODELS */}
                <div className="mt-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-700 pb-4 gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Video size={28} className="text-pink-400"/> Top Video Generation Models
                    </h2>
                  </div>

                  <p className="text-sm text-slate-400 mb-6 max-w-4xl leading-relaxed">
                    Scores are based on the latest <strong className="text-slate-300">Video Arena Elo</strong> ratings and qualitative benchmarks for motion consistency and physics adherence.
                  </p>

                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden overflow-x-auto shadow-inner">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/80">
                          <th className="p-4 w-16 text-center">Rank</th>
                          <th className="p-4">Model & Developer</th>
                          <th className="p-4 text-center">Video Gen Score</th>
                          <th className="p-4 text-center">Motion Consistency</th>
                          <th className="p-4 text-center">Prompt Adherence</th>
                          <th className="p-4">Best For</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {videoModelsData.map((row) => {
                          const getScoreColor = (score) => {
                            if (score >= 95) return "text-emerald-400 font-bold bg-emerald-400/10 border-emerald-400/20";
                            if (score >= 90) return "text-cyan-400 font-bold bg-cyan-400/10 border-cyan-400/20";
                            if (score >= 85) return "text-amber-400 font-medium bg-amber-400/10 border-amber-400/20";
                            return "text-slate-300 bg-slate-800 border-slate-700";
                          };

                          return (
                            <tr key={row.rank} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                              <td className="p-4 text-center font-bold text-slate-500">{row.rank}</td>
                              <td className="p-4 whitespace-nowrap">
                                <div className="font-bold text-white text-base">{row.model}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{row.developer}</div>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.genScore)}`}>{row.genScore}/100</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.motion)}`}>{row.motion}/100</span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs border ${getScoreColor(row.prompt)}`}>{row.prompt}/100</span>
                              </td>
                              <td className="p-4 text-slate-300">
                                {row.bestFor}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}