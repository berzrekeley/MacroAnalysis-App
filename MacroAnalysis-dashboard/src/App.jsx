import React, { useState } from 'react';
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
  Radio
} from 'lucide-react';

import macroData from './data/macroData.json';

// Data Models
const getIcon = (title) => {
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
    default: return <Activity size={20} />;
  }
};

const metricsData = macroData.metrics.map(m => ({
  ...m,
  icon: getIcon(m.title)
}));

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
        <nav className="flex gap-2 p-1 bg-slate-800/50 rounded-lg w-fit border border-slate-700">
          {['overview', 'sectors', 'probabilities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab}
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

        </main>
      </div>
    </div>
  );
}