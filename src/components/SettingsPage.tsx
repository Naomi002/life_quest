import { Settings, Save, RotateCcw, Download, Upload, Trash2 } from 'lucide-react';
import { GameState, getDefaultState, saveGameState } from '../store/gameStore';
import { useState } from 'react';

interface SettingsProps {
  state: GameState;
  onUpdateState: (state: GameState) => void;
}

export function SettingsPage({ state, onUpdateState }: SettingsProps) {
  const [heroName, setHeroName] = useState(state.heroName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const newState = { ...state, heroName };
    onUpdateState(newState);
    saveGameState(newState);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const fresh = getDefaultState();
    onUpdateState(fresh);
    saveGameState(fresh);
    setHeroName(fresh.heroName);
    setShowResetConfirm(false);
  };

  const handleExport = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifequest_save_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          const defaults = getDefaultState();
          const merged = { ...defaults, ...imported };
          onUpdateState(merged);
          saveGameState(merged);
          setHeroName(merged.heroName);
        } catch {
          alert('Invalid save file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
          <Settings size={22} className="text-gray-400" />
          Settings
        </h2>
        <p className="text-sm text-gray-500 font-rajdhani mt-1">
          Customize your LifeQuest experience
        </p>
      </div>

      {/* Profile Settings */}
      <div className="glass-card rounded-2xl border border-cyber-border p-6 space-y-5">
        <h3 className="font-orbitron text-sm font-semibold text-neon-cyan">Profile</h3>
        
        <div>
          <label className="text-xs text-gray-500 font-rajdhani uppercase tracking-wider mb-1 block">Hero Name</label>
          <input
            type="text"
            value={heroName}
            onChange={e => setHeroName(e.target.value)}
            className="w-full bg-cyber-dark border border-cyber-border rounded-xl px-4 py-3 text-sm font-rajdhani focus:outline-none focus:border-neon-cyan/50 transition-colors"
            maxLength={20}
          />
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-rajdhani font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-2xl border border-cyber-border p-6 space-y-4">
        <h3 className="font-orbitron text-sm font-semibold text-neon-cyan">Data Management</h3>
        
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl glass-card border border-neon-green/20 text-neon-green text-sm font-rajdhani font-semibold hover:bg-neon-green/10 transition-all flex items-center gap-2"
          >
            <Download size={14} /> Export Save
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2.5 rounded-xl glass-card border border-neon-blue/20 text-neon-blue text-sm font-rajdhani font-semibold hover:bg-neon-blue/10 transition-all flex items-center gap-2"
          >
            <Upload size={14} /> Import Save
          </button>
        </div>
      </div>

      {/* Game Stats */}
      <div className="glass-card rounded-2xl border border-cyber-border p-6">
        <h3 className="font-orbitron text-sm font-semibold text-neon-cyan mb-4">Game Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatRow label="Level" value={`${state.level}`} />
          <StatRow label="Total XP" value={`${state.totalXp}`} />
          <StatRow label="Coins" value={`${state.coins}`} />
          <StatRow label="Best Streak" value={`${state.bestStreak} days`} />
          <StatRow label="Quests Completed" value={`${state.totalQuestsCompleted}`} />
          <StatRow label="Focus Sessions" value={`${state.focusSessions}`} />
          <StatRow label="Achievements" value={`${state.achievements.filter(a => a.unlocked).length}/${state.achievements.length}`} />
          <StatRow label="Skills Active" value={`${state.skills.filter(s => s.level > 0).length}`} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl border border-red-900/30 p-6">
        <h3 className="font-orbitron text-sm font-semibold text-red-400 mb-3">⚠️ Danger Zone</h3>
        
        {showResetConfirm ? (
          <div className="space-y-3 animate-slide-up">
            <p className="text-sm text-red-300 font-rajdhani">
              This will permanently delete ALL your progress. Are you absolutely sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-rajdhani font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-cyber-border text-gray-400 text-sm font-rajdhani hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl border border-red-900/50 text-red-400 text-sm font-rajdhani font-semibold hover:bg-red-900/10 transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reset All Progress
          </button>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-cyber-border/50">
      <span className="text-xs text-gray-500 font-rajdhani">{label}</span>
      <span className="font-orbitron text-xs text-white">{value}</span>
    </div>
  );
}
