import { Swords, Shield, Zap } from 'lucide-react';
import { BossBattle } from '../store/gameStore';

interface BossBattlesProps {
  bosses: BossBattle[];
  onAttackBoss: (bossId: string, damage: number) => void;
}

export function BossBattlesView({ bosses, onAttackBoss }: BossBattlesProps) {
  const defeated = bosses.filter(b => b.defeated).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
          <Swords size={22} className="text-neon-pink" />
          Boss Battles
        </h2>
        <p className="text-sm text-gray-500 font-rajdhani mt-1">
          Conquer life's greatest challenges • {defeated}/{bosses.length} defeated
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bosses.map((boss) => {
          const hpPercent = (boss.hp / boss.maxHp) * 100;
          const isLow = hpPercent < 30;
          const isMid = hpPercent < 60;

          return (
            <div
              key={boss.id}
              className={`glass-card rounded-2xl border overflow-hidden relative ${
                boss.defeated ? 'border-neon-green/20 opacity-60' : 'border-neon-pink/20'
              }`}
            >
              {boss.defeated && (
                <div className="absolute inset-0 bg-neon-green/5 flex items-center justify-center z-10">
                  <span className="text-4xl">⚔️</span>
                </div>
              )}

              {/* Boss Header */}
              <div className="p-5 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-neon-pink/5 rounded-full blur-2xl" />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-pink/10 to-neon-orange/10 flex items-center justify-center text-3xl border border-neon-pink/20">
                    {boss.icon}
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold">{boss.name}</h3>
                    <p className="text-xs text-gray-500 font-rajdhani">{boss.desc}</p>
                  </div>
                </div>

                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-rajdhani text-gray-400 flex items-center gap-1">
                      <Shield size={12} /> Boss HP
                    </span>
                    <span className={`font-orbitron ${isLow ? 'text-neon-green' : isMid ? 'text-neon-orange' : 'text-neon-pink'}`}>
                      {boss.hp} / {boss.maxHp}
                    </span>
                  </div>
                  <div className="h-4 bg-cyber-dark rounded-full overflow-hidden border border-cyber-border">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLow ? 'bg-gradient-to-r from-neon-green to-green-400' :
                        isMid ? 'bg-gradient-to-r from-neon-orange to-yellow-400' :
                        'bg-gradient-to-r from-neon-pink to-red-400'
                      } ${!boss.defeated && isLow ? 'animate-pulse' : ''}`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex gap-3 mb-4">
                  <span className="px-2 py-1 rounded-lg bg-neon-cyan/10 text-neon-cyan text-xs font-orbitron">
                    +{boss.xpReward} XP
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-neon-gold/10 text-neon-gold text-xs font-orbitron">
                    +{boss.coinReward} 🪙
                  </span>
                </div>

                {/* Attack Buttons */}
                {!boss.defeated && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAttackBoss(boss.id, 10)}
                      className="flex-1 py-2.5 rounded-xl bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-rajdhani font-semibold hover:bg-neon-pink/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Swords size={14} /> Quick Strike (-10)
                    </button>
                    <button
                      onClick={() => onAttackBoss(boss.id, 25)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink/20 to-neon-orange/20 border border-neon-pink/20 text-white text-sm font-rajdhani font-semibold hover:from-neon-pink/30 hover:to-neon-orange/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={14} /> Power Attack (-25)
                    </button>
                  </div>
                )}

                {boss.defeated && (
                  <div className="text-center py-2">
                    <p className="font-orbitron text-sm text-neon-green font-bold">⚔️ DEFEATED ⚔️</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="glass-card rounded-2xl border border-cyber-border p-5">
        <p className="text-xs text-gray-500 font-rajdhani mb-2 uppercase tracking-wider">💡 Pro Tip</p>
        <p className="text-sm text-gray-300 font-rajdhani">
          Boss battles represent your biggest life challenges. Attack bosses by completing preparation quests 
          and building up your stats. Each attack represents real progress toward conquering your goal!
        </p>
      </div>
    </div>
  );
}
