import { useState } from 'react';
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

import macroData from './data/macroData.json';

// Helper to map icons to data which can't be stored in JSON
const getMetricIcon = (title) => {
  switch (title) {
    case "Buffett Indicator": return <TrendingUp size={20} />;
    case "Fed Funds Rate": return <Building size={20} />;
    case "10Y - 2Y Spread": return <Activity size={20} />;
    case "10Y Treasury Rate": return <DollarSign size={20} />;
    case "2Y Treasury Rate": return <DollarSign size={20} />;
    case "Consumer Sentiment": return <AlertTriangle size={20} />;
    case "Retail Sales (MoM)": return <ShoppingCart size={20} />;
    case "Leading Index (LEI)": return <TrendingDown size={20} />;
    case "Building Permits": return <Building size={20} />;
    case "Initial Jobless Claims": return <Activity size={20} />;
    case "Monthly ADP Employment": return <Users size={20} />;
    default: return <Activity size={20} />;
  }
};

const getSectorIcon = (id) => {
  switch (id) {
    case 'tech': return <Cpu size={24} />;
    case 'energy': return <Globe size={24} />;
    case 'banking': return <Building size={24} />;
    case 'realestate': return <Building size={24} />;
    case 'consumer': return <ShoppingCart size={24} />;
    default: return <Building size={24} />;
  }
};

const getAiCategoryIcon = (category) => {
  if (category.includes('Moves')) return <Network size={20} className="text-purple-400" />;
  if (category.includes('Market')) return <Building size={20} className="text-blue-400" />;
  if (category.includes('Workforce')) return <Users size={20} className="text-amber-400" />;
  if (category.includes('Security')) return <ShieldAlert size={20} className="text-red-400" />;
  return <Bot size={20} className="text-purple-400" />;
};

// Components
const MetricCard = ({ metric }) => {
  const borderColors = {
    extreme: "border-l-red-500",
    warning: "border-l-amber-500",
    neutral: "border-l-slate-500",
    info: "border-l-blue-500"
  };
  const iconColors = {
    extreme: "text-red-400",
    warning: "text-amber-400",
    neutral: "text-slate-400",
    info: "text-blue-400"
  };

  return (
    <div className={`bg-slate-800 p-4 rounded-lg border-l-4 ${borderColors[metric.type] || 'border-l-slate-500'} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default group`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.title}</h3>
        <span className={`${iconColors[metric.type] || 'text-slate-400'} group-hover:scale-110 transition-transform duration-300`}>
          {getMetricIcon(metric.title)}
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
            {getSectorIcon(sector.id)}
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
      
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
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

  const headlineColors = {
    extreme: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500"
  };

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
              {macroData.lastUpdated}
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
                    {macroData.executiveSummary.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-cyan-400"/> Economic & Market Dashboard
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {macroData.metrics.map((metric, idx) => (
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
                          let filtered = macroData.adpWeeklyData;
                          if (adpTimeFrame === '1M') filtered = macroData.adpWeeklyData.slice(0, 4);
                          if (adpTimeFrame === '3M') filtered = macroData.adpWeeklyData.slice(0, 12);
                          
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
                    {macroData.dailyHeadlines.map((headline, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className={`w-2 h-2 rounded-full ${headlineColors[headline.type] || 'bg-blue-500'} mt-2 shrink-0 ${headline.type === 'extreme' ? 'animate-pulse' : ''}`}></span>
                        <p className="text-sm text-slate-300"><strong className="text-white block mb-1">{headline.title}:</strong> {headline.summary || headline.desc}</p>
                      </li>
                    ))}
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
                  {macroData.sectorData.map((sector) => (
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
                    {macroData.sectorData.map((sector) => (
                      <tr key={sector.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="p-4 pl-0 font-medium text-white flex items-center gap-2">
                          <span className="text-cyan-400 hidden sm:block">{getSectorIcon(sector.id)}</span>
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
                  {macroData.probabilities.map((prob, idx) => (
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
                  {macroData.aiHeadlines.map((section, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl p-5 md:p-6 border border-slate-700/50 shadow-inner">
                      <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-3 border-b border-slate-700/50 pb-2">
                        {getAiCategoryIcon(section.category)} {section.category}
                      </h3>
                      <ul className="space-y-4">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-sm">
                            <div className="flex justify-between items-start mb-1">
                              <strong className="text-slate-200 text-base">{item.title}</strong>
                              {item.url && (
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors shrink-0 ml-2"
                                >
                                  Read <ArrowUpRight size={14} />
                                </a>
                              )}
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                              {item.summary || item.desc}
                            </p>
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
                        {macroData.aiModels.map((model, idx) => (
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
                          {macroData.reasoningBenchmarks.map((row, idx) => (
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
                      {macroData.chatbotArena.map((item, idx) => (
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
                      {macroData.codingPerformance.map((item, idx) => (
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
                      {macroData.hardwareInference.map((item, idx) => (
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
                      {macroData.aiScorecardData.map((row) => {
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
                        {macroData.videoModelsData.map((row) => {
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
