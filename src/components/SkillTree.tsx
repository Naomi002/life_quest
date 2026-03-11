import { Sparkles, Lock, ArrowUp, Star } from 'lucide-react';
import { SkillNode } from '../store/gameStore';

interface SkillTreeProps {
  skills: SkillNode[];
  coins: number;
  level: number;
  onUpgradeSkill: (skillId: string) => void;
}

const branchColors: Record<string, string> = {
  knowledge: '#0a84ff',
  fitness: '#ff9f0a',
  creativity: '#bf5af2',
  social: '#ff2d78',
  productivity: '#00f0ff',
};

const branchIcons: Record<string, string> = {
  knowledge: '🧠',
  fitness: '💪',
  creativity: '🎨',
  social: '🤝',
  productivity: '⚡',
};

export function SkillTree({ skills, coins, level, onUpgradeSkill }: SkillTreeProps) {
  const branches = ['knowledge', 'fitness', 'creativity', 'social', 'productivity'];
  const totalUnlocked = skills.filter(s => s.level > 0).length;
  const costPerLevel = 50;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
            <Sparkles size={22} className="text-neon-gold" />
            Skill Tree
          </h2>
          <p className="text-sm text-gray-500 font-rajdhani mt-1">
            Invest coins to unlock powerful abilities • {totalUnlocked} skills active
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-neon-gold/20">
          <span className="text-neon-gold">🪙</span>
          <span className="font-orbitron text-sm text-neon-gold">{coins}</span>
          <span className="text-xs text-gray-500 font-rajdhani">coins</span>
        </div>
      </div>

      <div className="space-y-6">
        {branches.map(branch => {
          const branchSkills = skills.filter(s => s.branch === branch);
          const color = branchColors[branch];
          const icon = branchIcons[branch];

          return (
            <div key={branch} className="glass-card rounded-2xl border border-cyber-border overflow-hidden">
              {/* Branch Header */}
              <div className="p-4 border-b border-cyber-border/50 flex items-center gap-3" style={{ background: `linear-gradient(90deg, ${color}08, transparent)` }}>
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="font-orbitron text-sm font-bold capitalize" style={{ color }}>{branch}</h3>
                  <p className="text-[10px] text-gray-500 font-rajdhani">
                    {branchSkills.filter(s => s.level > 0).length}/{branchSkills.length} skills active
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branchSkills.map(skill => {
                  const isMaxed = skill.level >= skill.maxLevel;
                  const canAfford = coins >= costPerLevel;
                  const meetsLevel = level >= 3 * skill.level;
                  const requiresMet = !skill.requires || skills.find(s => s.id === skill.requires && s.level > 0);
                  const canUpgrade = !isMaxed && canAfford && meetsLevel && requiresMet;

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isMaxed
                          ? 'border-neon-gold/30 bg-neon-gold/[0.03]'
                          : skill.level > 0
                          ? `bg-white/[0.02]`
                          : 'border-cyber-border bg-white/[0.01]'
                      }`}
                      style={skill.level > 0 && !isMaxed ? { borderColor: `${color}30` } : {}}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {!requiresMet ? (
                            <Lock size={14} className="text-gray-600" />
                          ) : (
                            <Star size={14} style={{ color: skill.level > 0 ? color : '#4a4a5a' }} />
                          )}
                          <h4 className="font-rajdhani font-semibold text-sm">{skill.name}</h4>
                        </div>
                        <span className="font-orbitron text-[10px]" style={{ color: isMaxed ? '#ffd700' : color }}>
                          {skill.level}/{skill.maxLevel}
                        </span>
                      </div>

                      {/* Level Dots */}
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: skill.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all"
                            style={{
                              backgroundColor: i < skill.level ? color : '#1e1e2e',
                            }}
                          />
                        ))}
                      </div>

                      <p className="text-[11px] text-gray-500 font-rajdhani mb-3">{skill.desc}</p>

                      {isMaxed ? (
                        <div className="text-center py-1">
                          <span className="text-xs font-orbitron text-neon-gold">✨ MAXED</span>
                        </div>
                      ) : !requiresMet ? (
                        <div className="text-center py-1">
                          <span className="text-xs font-rajdhani text-gray-600">🔒 Requires: {skills.find(s => s.id === skill.requires)?.name}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => canUpgrade && onUpgradeSkill(skill.id)}
                          disabled={!canUpgrade}
                          className={`w-full py-1.5 rounded-lg text-xs font-rajdhani font-semibold transition-all flex items-center justify-center gap-1 ${
                            canUpgrade
                              ? 'hover:opacity-90 text-white'
                              : 'opacity-30 cursor-not-allowed text-gray-400'
                          }`}
                          style={canUpgrade ? { backgroundColor: `${color}30`, color } : { backgroundColor: '#1e1e2e' }}
                        >
                          <ArrowUp size={12} />
                          Upgrade ({costPerLevel} 🪙)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
