import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, Circle, ArrowLeftRight, Flame, ShieldAlert, 
  Sparkles, Coffee, UserCheck, Plus, Camera, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chore {
  id: string;
  title: string;
  category: 'blue' | 'pink' | 'neutral' | 'mental';
  points: number;
  assignedTo: 'shane' | 'lizzie' | 'unassigned';
  completedBy: 'shane' | 'lizzie' | null;
  completedAt: string | null;
}

interface Trade {
  id: string;
  offeredBy: 'shane' | 'lizzie';
  offering: string;
  requesting: string;
  status: 'pending' | 'accepted' | 'declined';
}

const INITIAL_CHORES: Chore[] = [
  // Blue Jobs
  { id: 'b1', title: 'Tuesday wheelie bins & recycling curb run', category: 'blue', points: 40, assignedTo: 'shane', completedBy: null, completedAt: null },
  { id: 'b2', title: 'Spider eviction & humane garden release', category: 'blue', points: 30, assignedTo: 'shane', completedBy: null, completedAt: null },
  { id: 'b3', title: 'Assemble flatpack shoe storage in hallway', category: 'blue', points: 80, assignedTo: 'shane', completedBy: null, completedAt: null },
  { id: 'b4', title: 'Unblock upstairs shower drain', category: 'blue', points: 60, assignedTo: 'shane', completedBy: null, completedAt: null },
  { id: 'b5', title: 'Screenwash top-up & clean both cars', category: 'blue', points: 70, assignedTo: 'shane', completedBy: null, completedAt: null },
  { id: 'b6', title: 'Debug living room smart TV & WiFi dropouts', category: 'blue', points: 40, assignedTo: 'shane', completedBy: null, completedAt: null },

  // Pink Jobs
  { id: 'p1', title: 'Sort, wash, dry & fold 3 laundry loads', category: 'pink', points: 60, assignedTo: 'lizzie', completedBy: null, completedAt: null },
  { id: 'p2', title: 'Strip & wrestle fresh duvet covers on all beds', category: 'pink', points: 50, assignedTo: 'lizzie', completedBy: null, completedAt: null },
  { id: 'p3', title: 'Iron school uniforms & prep sports kits', category: 'pink', points: 50, assignedTo: 'lizzie', completedBy: null, completedAt: null },
  { id: 'p4', title: 'Deep clean family bathroom & fresh towels', category: 'pink', points: 70, assignedTo: 'lizzie', completedBy: null, completedAt: null },
  { id: 'p5', title: 'Weekly grocery meal plan & fridge audit', category: 'pink', points: 50, assignedTo: 'lizzie', completedBy: null, completedAt: null },

  // Neutral Turf
  { id: 'n1', title: 'Empty & reload dishwasher after dinner', category: 'neutral', points: 25, assignedTo: 'unassigned', completedBy: null, completedAt: null },
  { id: 'n2', title: 'Clear 14 pairs of shoes & school bags from hallway', category: 'neutral', points: 20, assignedTo: 'unassigned', completedBy: null, completedAt: null },
  { id: 'n3', title: 'Evening kitchen counter wipe-down & bin liner reset', category: 'neutral', points: 25, assignedTo: 'unassigned', completedBy: null, completedAt: null },
  { id: 'n4', title: 'Kids evening bedtime routine & story duty', category: 'neutral', points: 40, assignedTo: 'unassigned', completedBy: null, completedAt: null },

  // Mental Load
  { id: 'm1', title: 'Mental Load: Book dentists & doctors for girls', category: 'mental', points: 60, assignedTo: 'lizzie', completedBy: 'lizzie', completedAt: '2026-10-15T14:00:00Z' },
  { id: 'm2', title: 'Mental Load: Remember school non-uniform day & dress code', category: 'mental', points: 50, assignedTo: 'unassigned', completedBy: null, completedAt: null },
  { id: 'm3', title: 'Mental Load: Notice loo roll / milk is low & restock', category: 'mental', points: 30, assignedTo: 'unassigned', completedBy: null, completedAt: null },
];

const INITIAL_TRADES: Trade[] = [
  {
    id: 't1',
    offeredBy: 'shane',
    offering: 'Clean both cars inside & out + fix squeaky wardrobe door',
    requesting: 'Fold and put away all laundry for the next 7 days',
    status: 'pending'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<'shane' | 'lizzie'>('shane');
  const [activeTab, setActiveTab] = useState<'all' | 'blue' | 'pink' | 'neutral' | 'mental'>('all');
  const [chores, setChores] = useState<Chore[]>(() => {
    const saved = localStorage.getItem('pink_blue_chores');
    return saved ? JSON.parse(saved) : INITIAL_CHORES;
  });
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('pink_blue_trades');
    return saved ? JSON.parse(saved) : INITIAL_TRADES;
  });

  useEffect(() => {
    localStorage.setItem('pink_blue_chores', JSON.stringify(chores));
  }, [chores]);

  useEffect(() => {
    localStorage.setItem('pink_blue_trades', JSON.stringify(trades));
  }, [trades]);

  const shaneScore = chores
    .filter(c => c.completedBy === 'shane')
    .reduce((sum, c) => sum + c.points, 420); // base points for banter

  const lizzieScore = chores
    .filter(c => c.completedBy === 'lizzie')
    .reduce((sum, c) => sum + c.points, 480); // base points for banter

  const totalPoints = shaneScore + lizzieScore;
  const shanePercent = totalPoints > 0 ? Math.round((shaneScore / totalPoints) * 100) : 50;

  const toggleChore = (id: string) => {
    setChores(prev => prev.map(c => {
      if (c.id === id) {
        const isDone = c.completedBy !== null;
        if (!isDone) {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { y: 0.75 },
            colors: currentUser === 'shane' ? ['#38bdf8', '#818cf8'] : ['#f472b6', '#fb7185']
          });
          return { ...c, completedBy: currentUser, completedAt: new Date().toISOString() };
        } else {
          return { ...c, completedBy: null, completedAt: null };
        }
      }
      return c;
    }));
  };

  const handleAcceptTrade = (id: string) => {
    setTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'accepted' } : t));
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const filteredChores = chores.filter(c => {
    if (activeTab === 'all') return true;
    return c.category === activeTab;
  });

  // Beth AI referee snark
  const getRefereeQuote = () => {
    const diff = lizzieScore - shaneScore;
    if (diff > 50) return "Shane, Lizzie is currently leading by " + diff + " points. The wheelie bins are getting nervous. Sunday coffee in bed is slipping away.";
    if (diff > 0) return "Lizzie holds a slim " + diff + "-point lead. One car wash or flatpack assembly could swing the entire household balance of power.";
    if (diff === 0) return "Dead heat. Perfect domestic equilibrium. Whoever empties the dishwasher next claims the crown.";
    return "Shane has miraculously taken the lead by " + Math.abs(diff) + " points! Lizzie, emergency laundry deployment advised.";
  };

  return (
    <div class="min-h-screen bg-[#0b0e14] text-[#f1f5f9] flex flex-col max-w-md mx-auto border-x border-white/[0.08] relative">
      
      {/* Top Header / Profile Bar */}
      <header class="p-4 bg-[#141923] border-b border-white/[0.08] sticky top-0 z-30 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <span class="text-2xl">🏠</span>
          <div>
            <h1 class="text-base font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
              Pink & Blue <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">HOUSEHOLD OS</span>
            </h1>
            <p class="text-[11px] text-slate-400">Shane & Lizzie's Domestic HQ</p>
          </div>
        </div>

        {/* User Switcher */}
        <div class="flex bg-black/40 p-1 rounded-xl border border-white/[0.08]">
          <button 
            onClick={() => setCurrentUser('shane')}
            class={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              currentUser === 'shane' ? 'bg-[#38bdf8] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🧔🏻 Shane</span>
          </button>
          <button 
            onClick={() => setCurrentUser('lizzie')}
            class={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              currentUser === 'lizzie' ? 'bg-[#f472b6] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👩🏼 Lizzie</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main class="flex-1 p-4 space-y-4 overflow-y-auto pb-24">

        {/* The Live Scoreboard */}
        <section class="p-4 rounded-2xl bg-[#141923] border border-white/[0.08] space-y-3 relative overflow-hidden shadow-lg">
          <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span class="flex items-center gap-1">🏆 Weekly Scoreboard</span>
            <span class="text-[10px] text-amber-400 font-normal">Resets Sun 20:00</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <div class="w-10 h-10 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-lg">
                🧔🏻
              </div>
              <div>
                <span class="text-[11px] text-slate-400 block font-medium">Shane</span>
                <span class="text-xl font-bold font-mono text-[#38bdf8]">{shaneScore} <span class="text-xs font-normal">pts</span></span>
              </div>
            </div>

            <div class="text-slate-600 font-bold text-sm">VS</div>

            <div class="flex items-center space-x-2.5 text-right">
              <div>
                <span class="text-[11px] text-slate-400 block font-medium">Lizzie</span>
                <span class="text-xl font-bold font-mono text-[#f472b6]">{lizzieScore} <span class="text-xs font-normal">pts</span></span>
              </div>
              <div class="w-10 h-10 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 flex items-center justify-center text-lg">
                👩🏼
              </div>
            </div>
          </div>

          {/* Tug-of-War Progress Bar */}
          <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-white/[0.05]">
            <div 
              class="h-full rounded-l-full bg-gradient-to-r from-sky-500 to-[#38bdf8] transition-all duration-500" 
              style={{ width: `${shanePercent}%` }}
            />
            <div 
              class="h-full rounded-r-full bg-gradient-to-r from-pink-400 to-[#f472b6] transition-all duration-500" 
              style={{ width: `${100 - shanePercent}%` }}
            />
          </div>
        </section>

        {/* Beth AI Referee Commentary */}
        <section class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-xs">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-sm">
            🐝
          </div>
          <div>
            <div class="text-amber-400 font-bold text-[11px] uppercase tracking-wider">Beth · Domestic Referee</div>
            <p class="text-slate-300 leading-relaxed mt-0.5 italic text-[11px]">
              "{getRefereeQuote()}"
            </p>
          </div>
        </section>

        {/* Weekly Stakes Card */}
        <section class="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 flex items-center justify-between text-xs shadow-sm">
          <div class="flex items-center space-x-2.5">
            <span class="text-xl">☕️</span>
            <div>
              <span class="text-[10px] text-indigo-300 uppercase tracking-wider font-bold block">This Week's Stakes</span>
              <span class="text-xs font-semibold text-white">Sunday Lie-In & Flat White in Bed</span>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">Locked In</span>
        </section>

        {/* Category Filter Pills */}
        <div class="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Jobs' },
            { id: 'blue', label: '🟦 Blue' },
            { id: 'pink', label: '🟪 Pink' },
            { id: 'neutral', label: '⬜️ Neutral' },
            { id: 'mental', label: '🧠 Mental Load' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              class={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'bg-[#141923] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chores Feed */}
        <div class="space-y-2">
          {filteredChores.map(chore => {
            const isDone = chore.completedBy !== null;
            return (
              <div 
                key={chore.id}
                onClick={() => toggleChore(chore.id)}
                class={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                  isDone 
                    ? 'bg-[#141923]/40 border-white/[0.04] opacity-60' 
                    : 'bg-[#141923] border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div class="flex items-center space-x-3 pr-2 overflow-hidden">
                  <button class="shrink-0 text-slate-500 group-hover:text-white transition">
                    {isDone ? (
                      <CheckCircle2 class="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle class="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                  <div class="truncate">
                    <div class="flex items-center gap-1.5">
                      <span class={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        chore.category === 'blue' ? 'bg-[#38bdf8]/15 text-[#38bdf8]' :
                        chore.category === 'pink' ? 'bg-[#f472b6]/15 text-[#f472b6]' :
                        chore.category === 'mental' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-slate-700/30 text-slate-400'
                      }`}>
                        {chore.category.toUpperCase()}
                      </span>
                      <span class={`text-xs font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {chore.title}
                      </span>
                    </div>
                    {isDone ? (
                      <span class="text-[10px] text-emerald-400 mt-0.5 block">
                        ✓ Completed by {chore.completedBy === 'shane' ? 'Shane 🧔🏻' : 'Lizzie 👩🏼'} (+{chore.points} pts)
                      </span>
                    ) : (
                      <span class="text-[10px] text-slate-500 mt-0.5 block">
                        Worth +{chore.points} pts · {chore.assignedTo === 'unassigned' ? 'Unassigned (Anyone can claim)' : `Assigned to ${chore.assignedTo}`}
                      </span>
                    )}
                  </div>
                </div>

                <span class={`font-mono text-xs font-bold shrink-0 ${isDone ? 'text-slate-600' : 'text-amber-400'}`}>
                  +{chore.points}
                </span>
              </div>
            );
          })}
        </div>

        {/* The Swapsies Market */}
        <section class="p-4 rounded-2xl bg-[#141923] border border-white/[0.08] space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300">
            <span class="flex items-center gap-1.5"><ArrowLeftRight class="w-4 h-4 text-indigo-400" /> The "Swapsies" Market</span>
            <span class="text-[10px] text-slate-500">Live Barter</span>
          </div>

          {trades.map(trade => (
            <div key={trade.id} class="p-3 rounded-xl bg-black/30 border border-white/[0.06] space-y-2 text-xs">
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <span>Offered by <strong class="text-white capitalize">{trade.offeredBy}</strong></span>
                <span class={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  trade.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {trade.status.toUpperCase()}
                </span>
              </div>
              <div class="text-[11px] space-y-1">
                <div><span class="text-slate-500">Offering:</span> <span class="text-slate-200">{trade.offering}</span></div>
                <div><span class="text-slate-500">In Exchange:</span> <span class="text-slate-200 font-medium text-amber-300">{trade.requesting}</span></div>
              </div>
              {trade.status === 'pending' && currentUser !== trade.offeredBy && (
                <button 
                  onClick={() => handleAcceptTrade(trade.id)}
                  class="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-1.5 rounded-lg transition"
                >
                  Accept Trade 🤝
                </button>
              )}
            </div>
          ))}
        </section>

      </main>

      {/* Floating Action / Camera Snap Bar */}
      <footer class="p-3.5 bg-[#141923]/90 backdrop-blur-md border-t border-white/[0.08] fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-300 text-[11px]">Active as <strong>{currentUser === 'shane' ? 'Shane' : 'Lizzie'}</strong></span>
        </div>
        <button 
          onClick={() => alert("Photo verification: Snap a photo of the completed chore to claim your points!")}
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition shadow-sm"
        >
          <Camera class="w-3.5 h-3.5 text-slate-950" />
          <span>Done & Dusted</span>
        </button>
      </footer>

    </div>
  );
}
