import { 
  Swords, LayoutDashboard, Target, Trophy, Map, Shield, 
  Sparkles, Settings, Zap, ScrollText, Timer, Smile, Menu, X
} from 'lucide-react';
import { useState } from 'react';

type Page = 'dashboard' | 'quests' | 'lifeQuests' | 'bossBattles' | 'skillTree' | 'worldMap' | 'achievements' | 'focus' | 'mood' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  level: number;
  heroName: string;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'quests', label: 'Daily Quests', icon: <ScrollText size={20} /> },
  { id: 'lifeQuests', label: 'Life Quests', icon: <Target size={20} /> },
  { id: 'bossBattles', label: 'Boss Battles', icon: <Swords size={20} /> },
  { id: 'skillTree', label: 'Skill Tree', icon: <Sparkles size={20} /> },
  { id: 'worldMap', label: 'World Map', icon: <Map size={20} /> },
  { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} /> },
  { id: 'focus', label: 'Focus Mode', icon: <Timer size={20} /> },
  { id: 'mood', label: 'Mood Log', icon: <Smile size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export function Sidebar({ currentPage, onNavigate, level, heroName }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg glass-card border border-cyber-border"
      >
        {mobileOpen ? <X size={20} className="text-neon-cyan" /> : <Menu size={20} className="text-neon-cyan" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 glass-card border-r border-cyber-border z-40 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-5 border-b border-cyber-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-orbitron text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                LifeQuest
              </h1>
              <p className="text-[10px] text-gray-500 font-rajdhani tracking-widest uppercase">Level Up Your Life</p>
            </div>
          </div>
        </div>

        {/* Hero Mini Profile */}
        <div className="p-4 mx-3 mt-3 rounded-xl bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 border border-cyber-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-sm font-bold">
              {heroName.charAt(0)}
            </div>
            <div>
              <p className="font-rajdhani font-semibold text-sm">{heroName}</p>
              <p className="text-[10px] text-neon-cyan font-orbitron">LVL {level}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                currentPage === item.id
                  ? 'active text-neon-cyan'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              {item.icon}
              <span className="font-rajdhani">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-border">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Shield size={14} />
            <span className="font-rajdhani">v1.0 — Your Quest Awaits</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export type { Page };
