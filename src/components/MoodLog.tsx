import { Smile, Plus } from 'lucide-react';
import { useState } from 'react';

interface MoodLogProps {
  moodLog: { date: string; mood: number; note: string }[];
  onAddMood: (mood: number, note: string) => void;
}

const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤩'];
const moodColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4'];
const moodLabels = ['Terrible', 'Bad', 'Meh', 'Okay', 'Good', 'Great', 'Amazing'];

export function MoodLog({ moodLog, onAddMood }: MoodLogProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState(4);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onAddMood(selectedMood, note);
    setNote('');
    setShowForm(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = moodLog.find(m => m.date === today);
  const recentMoods = [...moodLog].reverse().slice(0, 14);

  // Average mood
  const avgMood = moodLog.length > 0
    ? moodLog.reduce((sum, m) => sum + m.mood, 0) / moodLog.length
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
            <Smile size={22} className="text-neon-green" />
            Mood Tracker
          </h2>
          <p className="text-sm text-gray-500 font-rajdhani mt-1">
            Track your emotional journey • {moodLog.length} entries
          </p>
        </div>
        {!todayEntry && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-cyan text-white text-sm font-rajdhani font-semibold hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Log Today's Mood
          </button>
        )}
      </div>

      {/* Add Mood Form */}
      {showForm && (
        <div className="glass-card rounded-2xl border border-neon-green/20 p-6 animate-slide-up">
          <h3 className="font-orbitron text-sm font-semibold text-neon-green mb-4">How are you feeling?</h3>
          
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {moodEmojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setSelectedMood(i)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                  selectedMood === i
                    ? 'ring-2 scale-110'
                    : 'opacity-50 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: `${moodColors[i]}15`,
                  boxShadow: selectedMood === i ? `0 0 0 2px ${moodColors[i]}` : 'none',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          <p className="text-center font-rajdhani font-semibold mb-4" style={{ color: moodColors[selectedMood] }}>
            {moodLabels[selectedMood]}
          </p>

          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What's on your mind? (optional)"
            rows={3}
            className="w-full bg-cyber-dark border border-cyber-border rounded-xl px-4 py-3 text-sm font-rajdhani focus:outline-none focus:border-neon-green/50 resize-none mb-4"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-neon-cyan text-white text-sm font-rajdhani font-semibold hover:opacity-90 transition-all"
            >
              Save Entry
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl border border-cyber-border text-gray-400 text-sm font-rajdhani hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Today's Mood */}
      {todayEntry && (
        <div className="glass-card rounded-2xl border border-neon-green/20 p-5 flex items-center gap-4">
          <div className="text-4xl">{moodEmojis[todayEntry.mood]}</div>
          <div>
            <p className="font-rajdhani font-semibold" style={{ color: moodColors[todayEntry.mood] }}>
              Today: {moodLabels[todayEntry.mood]}
            </p>
            {todayEntry.note && <p className="text-sm text-gray-400 font-rajdhani mt-1">{todayEntry.note}</p>}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl border border-cyber-border p-4 text-center">
          <p className="text-3xl mb-1">{moodLog.length > 0 ? moodEmojis[Math.round(avgMood)] : '❓'}</p>
          <p className="text-xs text-gray-500 font-rajdhani uppercase">Avg Mood</p>
        </div>
        <div className="glass-card rounded-xl border border-cyber-border p-4 text-center">
          <p className="font-orbitron text-xl font-bold text-neon-green">{moodLog.length}</p>
          <p className="text-xs text-gray-500 font-rajdhani uppercase">Total Entries</p>
        </div>
        <div className="glass-card rounded-xl border border-cyber-border p-4 text-center">
          <p className="font-orbitron text-xl font-bold text-neon-cyan">
            {moodLog.filter(m => m.mood >= 4).length}
          </p>
          <p className="text-xs text-gray-500 font-rajdhani uppercase">Good Days</p>
        </div>
      </div>

      {/* Mood History */}
      {recentMoods.length > 0 && (
        <div className="glass-card rounded-2xl border border-cyber-border p-5">
          <h3 className="font-orbitron text-xs text-gray-400 uppercase tracking-widest mb-4">Recent Moods</h3>
          
          {/* Mini Chart */}
          <div className="flex items-end gap-1 h-24 mb-4">
            {recentMoods.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${((m.mood + 1) / 7) * 100}%`,
                    backgroundColor: moodColors[m.mood],
                    opacity: 0.7,
                    minHeight: '4px',
                  }}
                />
              </div>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentMoods.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <span className="text-lg">{moodEmojis[m.mood]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-rajdhani text-gray-400">{m.date}</p>
                  {m.note && <p className="text-xs text-gray-500 font-rajdhani truncate">{m.note}</p>}
                </div>
                <span className="text-[10px] font-orbitron" style={{ color: moodColors[m.mood] }}>
                  {moodLabels[m.mood]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
