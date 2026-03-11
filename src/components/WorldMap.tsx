import { Map } from 'lucide-react';
import { GameState } from '../store/gameStore';

interface WorldMapProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

const regions = [
  {
    id: 'study',
    name: 'Study City',
    icon: '📚',
    desc: 'Center of knowledge and learning',
    stat: 'knowledge',
    color: '#0a84ff',
    quests: ['Complete courses', 'Read books', 'Learn new skills'],
    x: 25,
    y: 20,
    size: 'lg',
  },
  {
    id: 'fitness',
    name: 'Fitness Mountains',
    icon: '🏔️',
    desc: 'Where physical power is forged',
    stat: 'fitness',
    color: '#ff9f0a',
    quests: ['Daily exercise', 'Fitness challenges', 'Sports activities'],
    x: 65,
    y: 15,
    size: 'lg',
  },
  {
    id: 'career',
    name: 'Career Kingdom',
    icon: '🏰',
    desc: 'Build your professional empire',
    stat: 'knowledge',
    color: '#bf5af2',
    quests: ['Work projects', 'Networking', 'Skill building'],
    x: 15,
    y: 55,
    size: 'md',
  },
  {
    id: 'adventure',
    name: 'Adventure Island',
    icon: '🏝️',
    desc: 'Discover new experiences',
    stat: 'happiness',
    color: '#30d158',
    quests: ['Try new things', 'Travel', 'Explore hobbies'],
    x: 75,
    y: 50,
    size: 'md',
  },
  {
    id: 'social',
    name: 'Social Village',
    icon: '🏘️',
    desc: 'Strengthen your connections',
    stat: 'social',
    color: '#ff2d78',
    quests: ['Meet friends', 'Help others', 'Join communities'],
    x: 45,
    y: 70,
    size: 'md',
  },
  {
    id: 'mindfulness',
    name: 'Zen Temple',
    icon: '🏯',
    desc: 'Find inner peace and balance',
    stat: 'happiness',
    color: '#5ac8fa',
    quests: ['Meditation', 'Journaling', 'Self-reflection'],
    x: 45,
    y: 35,
    size: 'sm',
  },
];

export function WorldMap({ state, onNavigate }: WorldMapProps) {
  const getStatValue = (stat: string) => {
    return (state.stats as Record<string, number>)[stat] || 10;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
          <Map size={22} className="text-neon-green" />
          World Map
        </h2>
        <p className="text-sm text-gray-500 font-rajdhani mt-1">
          Explore different life regions and conquer quests in each area
        </p>
      </div>

      {/* Map View */}
      <div className="glass-card rounded-2xl border border-cyber-border p-4 relative overflow-hidden min-h-[500px]">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <line x1="25%" y1="25%" x2="45%" y2="38%" stroke="#1e1e2e" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="65%" y1="20%" x2="45%" y2="38%" stroke="#1e1e2e" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="45%" y1="38%" x2="45%" y2="72%" stroke="#1e1e2e" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="15%" y1="58%" x2="45%" y2="72%" stroke="#1e1e2e" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="75%" y1="53%" x2="45%" y2="72%" stroke="#1e1e2e" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Regions */}
        {regions.map(region => {
          const statVal = getStatValue(region.stat);
          const progress = Math.min(statVal / 50, 1);

          return (
            <div
              key={region.id}
              className="world-region absolute"
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            >
              <div
                className="glass-card rounded-2xl border p-4 text-center min-w-[140px]"
                style={{ borderColor: `${region.color}30` }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${region.color}15` }}
                >
                  {region.icon}
                </div>
                <h4 className="font-orbitron text-[11px] font-bold mb-1" style={{ color: region.color }}>
                  {region.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-rajdhani mb-2">{region.desc}</p>
                {/* Progress */}
                <div className="h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%`, backgroundColor: region.color }}
                  />
                </div>
                <p className="text-[9px] text-gray-600 font-rajdhani mt-1">{Math.round(progress * 100)}% explored</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Region Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map(region => (
          <div
            key={region.id}
            className="glass-card rounded-xl border border-cyber-border p-4 hover:border-opacity-50 transition-all cursor-pointer"
            style={{ borderColor: `${region.color}15` }}
            onClick={() => onNavigate('quests')}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{region.icon}</span>
              <div>
                <h4 className="font-rajdhani font-semibold text-sm" style={{ color: region.color }}>{region.name}</h4>
                <p className="text-[10px] text-gray-500 font-rajdhani">Stat: {region.stat}</p>
              </div>
            </div>
            <div className="space-y-1">
              {region.quests.map((q, i) => (
                <p key={i} className="text-xs text-gray-400 font-rajdhani flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: region.color }} />
                  {q}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
