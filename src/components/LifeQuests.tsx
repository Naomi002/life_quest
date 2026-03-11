import { Target, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { Quest } from '../store/gameStore';
import { useState } from 'react';

interface LifeQuestsProps {
  quests: Quest[];
  onToggleQuest: (questId: string) => void;
  onToggleSubTask: (questId: string, taskIndex: number) => void;
}

const typeColors: Record<string, string> = {
  health: '#ff2d78',
  knowledge: '#0a84ff',
  fitness: '#ff9f0a',
  happiness: '#30d158',
  social: '#bf5af2',
};

export function LifeQuests({ quests, onToggleQuest, onToggleSubTask }: LifeQuestsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const mainQuests = quests.filter(q => q.category === 'main');
  const completed = mainQuests.filter(q => q.isDone).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
          <Target size={22} className="text-neon-purple" />
          Life Quests
        </h2>
        <p className="text-sm text-gray-500 font-rajdhani mt-1">
          Epic long-term goals that shape your destiny • {completed}/{mainQuests.length} completed
        </p>
      </div>

      <div className="space-y-4">
        {mainQuests.map((quest, index) => {
          const isExpanded = expandedId === quest.id;
          const subProgress = quest.subTasks
            ? quest.subTasks.filter(t => t.done).length / quest.subTasks.length
            : quest.isDone ? 1 : 0;
          const color = typeColors[quest.type] || '#00f0ff';

          return (
            <div
              key={quest.id}
              className={`glass-card rounded-2xl border overflow-hidden transition-all duration-300 ${
                quest.isDone ? 'border-neon-green/20' : 'border-cyber-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div
                className="p-5 cursor-pointer flex items-center gap-4"
                onClick={() => setExpandedId(isExpanded ? null : quest.id)}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}
                >
                  {quest.isDone ? '✅' : quest.type === 'knowledge' ? '📚' : quest.type === 'fitness' ? '🏋️' : quest.type === 'social' ? '🌐' : quest.type === 'happiness' ? '📝' : '❤️'}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-rajdhani font-bold text-lg ${quest.isDone ? 'text-gray-500 line-through' : ''}`}>
                    {quest.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-rajdhani mb-2">{quest.desc}</p>
                  {/* Progress bar */}
                  <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subProgress * 100}%`, backgroundColor: color }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 font-rajdhani mt-1">{Math.round(subProgress * 100)}% complete</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="font-orbitron text-sm text-neon-cyan">+{quest.xp} XP</p>
                  <p className="text-xs text-neon-gold font-rajdhani">+{quest.coins} 🪙</p>
                  {isExpanded ? <ChevronUp size={16} className="text-gray-500 mt-1 ml-auto" /> : <ChevronDown size={16} className="text-gray-500 mt-1 ml-auto" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-cyber-border/50 pt-4 animate-slide-up">
                  {quest.subTasks && quest.subTasks.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-500 font-rajdhani uppercase tracking-wider mb-2">Sub-Tasks</p>
                      {quest.subTasks.map((task, i) => (
                        <button
                          key={i}
                          onClick={() => onToggleSubTask(quest.id, i)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            task.done ? 'bg-neon-green/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                        >
                          {task.done ? (
                            <CheckCircle2 size={18} className="text-neon-green flex-shrink-0" />
                          ) : (
                            <Circle size={18} className="text-gray-600 flex-shrink-0" />
                          )}
                          <span className={`text-sm font-rajdhani ${task.done ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <button
                    onClick={() => onToggleQuest(quest.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-rajdhani font-semibold transition-all ${
                      quest.isDone
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90'
                    }`}
                  >
                    {quest.isDone ? 'Mark as Incomplete' : 'Complete Quest'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
