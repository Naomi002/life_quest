import { Trophy, Lock } from 'lucide-react';
import { Achievement } from '../store/gameStore';

interface AchievementsProps {
  achievements: Achievement[];
}



export function Achievements({ achievements }: AchievementsProps) {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
          <Trophy size={22} className="text-neon-gold" />
          Achievements
        </h2>
        <p className="text-sm text-gray-500 font-rajdhani mt-1">
          {unlocked.length} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl border border-neon-gold/20 p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-rajdhani text-gray-400">Collection Progress</span>
          <span className="font-orbitron text-neon-gold">{Math.round((unlocked.length / achievements.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-cyber-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-gold to-neon-orange rounded-full transition-all duration-700"
            style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="font-orbitron text-xs text-neon-green uppercase tracking-widest mb-3">✨ Unlocked</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlocked.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="font-orbitron text-xs text-gray-600 uppercase tracking-widest mb-3">🔒 Locked</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {locked.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`glass-card rounded-xl border p-4 transition-all ${
        achievement.unlocked
          ? `bg-rarity-${achievement.rarity}`
          : 'border-cyber-border opacity-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          achievement.unlocked ? 'bg-white/5' : 'bg-cyber-dark'
        }`}>
          {achievement.unlocked ? achievement.icon : <Lock size={18} className="text-gray-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-rajdhani font-semibold text-sm">{achievement.title}</h4>
          <p className="text-[11px] text-gray-500 font-rajdhani">{achievement.desc}</p>
          <span className={`text-[10px] font-orbitron uppercase rarity-${achievement.rarity}`}>
            {achievement.rarity}
          </span>
        </div>
      </div>
    </div>
  );
}
