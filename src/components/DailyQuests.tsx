import { CheckCircle2, Circle, Sparkles, Plus, Trash2, RotateCcw } from 'lucide-react';
import { Quest, getRandomDailyQuest } from '../store/gameStore';
import { useState } from 'react';

interface DailyQuestsProps {
  quests: Quest[];
  comboMultiplier: number;
  onToggleQuest: (questId: string) => void;
  onAddQuest: (quest: Quest) => void;
  onRemoveQuest: (questId: string) => void;
  onResetDay: () => void;
}

const typeIcons: Record<string, string> = {
  health: '❤️',
  knowledge: '🧠',
  fitness: '💪',
  happiness: '😊',
  social: '🤝',
};

const typeColors: Record<string, string> = {
  health: '#ff2d78',
  knowledge: '#0a84ff',
  fitness: '#ff9f0a',
  happiness: '#30d158',
  social: '#bf5af2',
};

const difficultyColors: Record<string, string> = {
  easy: '#30d158',
  medium: '#ff9f0a',
  hard: '#ff2d78',
  legendary: '#ffd700',
};

export function DailyQuests({ quests, comboMultiplier, onToggleQuest, onAddQuest, onRemoveQuest, onResetDay }: DailyQuestsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<Quest['type']>('knowledge');
  const [newDifficulty, setNewDifficulty] = useState<Quest['difficulty']>('medium');

  const dailyQuests = quests.filter(q => q.category === 'daily');
  const completed = dailyQuests.filter(q => q.isDone).length;
  const totalXP = dailyQuests.reduce((sum, q) => sum + q.xp, 0);
  const earnedXP = dailyQuests.filter(q => q.isDone).reduce((sum, q) => sum + q.xp, 0);

  const handleAddCustomQuest = () => {
    if (!newTitle.trim()) return;
    const xpMap = { easy: 20, medium: 40, hard: 60, legendary: 100 };
    const coinMap = { easy: 5, medium: 12, hard: 20, legendary: 40 };
    const quest: Quest = {
      id: `custom_${Date.now()}`,
      title: newTitle,
      desc: newDesc || 'Custom quest',
      xp: xpMap[newDifficulty],
      coins: coinMap[newDifficulty],
      isDone: false,
      type: newType,
      category: 'daily',
      difficulty: newDifficulty,
    };
    onAddQuest(quest);
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleRandomQuest = () => {
    const quest = getRandomDailyQuest();
    onAddQuest(quest);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
            <Sparkles size={22} className="text-neon-cyan" />
            Daily Quests
          </h2>
          <p className="text-sm text-gray-500 font-rajdhani mt-1">
            Complete quests to earn XP, coins, and stat boosts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRandomQuest}
            className="px-3 py-2 rounded-xl glass-card border border-neon-gold/30 text-neon-gold text-sm font-rajdhani font-semibold hover:bg-neon-gold/10 transition-all flex items-center gap-2"
          >
            🎲 Random Quest
          </button>
          <button
            onClick={onResetDay}
            className="px-3 py-2 rounded-xl glass-card border border-cyber-border text-gray-400 text-sm font-rajdhani font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} /> New Day
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl border border-cyber-border p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="font-rajdhani text-sm text-gray-400">Daily Progress</span>
          <span className="font-orbitron text-sm text-neon-cyan">{completed}/{dailyQuests.length}</span>
        </div>
        <div className="h-3 bg-cyber-dark rounded-full overflow-hidden mb-3">
          <div
            className="h-full xp-bar rounded-full transition-all duration-700"
            style={{ width: `${(completed / Math.max(dailyQuests.length, 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 font-rajdhani">
          <span>XP Earned: <span className="text-neon-cyan font-semibold">{earnedXP}</span> / {totalXP}</span>
          <span>Combo: <span className="text-neon-gold font-semibold">{comboMultiplier.toFixed(1)}x</span></span>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {dailyQuests.map((quest, index) => (
          <div
            key={quest.id}
            className={`quest-card glass-card rounded-xl border transition-all duration-300 cursor-pointer ${
              quest.isDone
                ? 'border-neon-green/20 bg-neon-green/[0.03]'
                : 'border-cyber-border hover:border-neon-cyan/20'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onToggleQuest(quest.id)}
          >
            <div className="p-4 flex items-center gap-4">
              {/* Checkbox */}
              <div className="flex-shrink-0">
                {quest.isDone ? (
                  <CheckCircle2 size={24} className="text-neon-green" />
                ) : (
                  <Circle size={24} className="text-gray-600 hover:text-neon-cyan transition-colors" />
                )}
              </div>

              {/* Type Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${typeColors[quest.type]}10` }}
              >
                {typeIcons[quest.type]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`font-rajdhani font-semibold ${quest.isDone ? 'line-through text-gray-500' : ''}`}>
                    {quest.title}
                  </h4>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-orbitron uppercase"
                    style={{
                      color: difficultyColors[quest.difficulty],
                      backgroundColor: `${difficultyColors[quest.difficulty]}15`,
                    }}
                  >
                    {quest.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-rajdhani truncate">{quest.desc}</p>
              </div>

              {/* Rewards */}
              <div className="flex-shrink-0 text-right">
                {quest.isDone ? (
                  <span className="text-xs text-neon-green font-orbitron">✓ DONE</span>
                ) : (
                  <div>
                    <p className="text-sm font-orbitron text-neon-cyan">+{Math.floor(quest.xp * comboMultiplier)} XP</p>
                    <p className="text-xs text-neon-gold font-rajdhani">+{quest.coins} 🪙</p>
                  </div>
                )}
              </div>

              {/* Delete custom quests */}
              {quest.id.startsWith('custom_') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveQuest(quest.id);
                  }}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Quest */}
      {showAddForm ? (
        <div className="glass-card rounded-2xl border border-neon-cyan/20 p-5 space-y-4 animate-slide-up">
          <h4 className="font-orbitron text-sm font-semibold text-neon-cyan">Create Custom Quest</h4>
          <input
            type="text"
            placeholder="Quest Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-cyber-dark border border-cyber-border rounded-xl px-4 py-2.5 text-sm font-rajdhani focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full bg-cyber-dark border border-cyber-border rounded-xl px-4 py-2.5 text-sm font-rajdhani focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
          <div className="flex gap-3 flex-wrap">
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as Quest['type'])}
              className="bg-cyber-dark border border-cyber-border rounded-xl px-3 py-2 text-sm font-rajdhani focus:outline-none focus:border-neon-cyan/50"
            >
              <option value="health">❤️ Health</option>
              <option value="knowledge">🧠 Knowledge</option>
              <option value="fitness">💪 Fitness</option>
              <option value="happiness">😊 Happiness</option>
              <option value="social">🤝 Social</option>
            </select>
            <select
              value={newDifficulty}
              onChange={e => setNewDifficulty(e.target.value as Quest['difficulty'])}
              className="bg-cyber-dark border border-cyber-border rounded-xl px-3 py-2 text-sm font-rajdhani focus:outline-none focus:border-neon-cyan/50"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddCustomQuest}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-rajdhani font-semibold hover:opacity-90 transition-opacity"
            >
              Add Quest
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-cyber-border text-gray-400 text-sm font-rajdhani hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-cyber-border text-gray-500 text-sm font-rajdhani hover:border-neon-cyan/30 hover:text-neon-cyan transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Custom Quest
        </button>
      )}
    </div>
  );
}
