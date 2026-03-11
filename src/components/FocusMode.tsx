import { Timer, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface FocusModeProps {
  focusSessions: number;
  onCompleteFocus: () => void;
}

export function FocusMode({ focusSessions, onCompleteFocus }: FocusModeProps) {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            onCompleteFocus();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onCompleteFocus, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - (timeLeft / (duration * 60));
  const circumference = 2 * Math.PI * 140;

  const handleStart = () => {
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (mins: number) => {
    if (isRunning) return;
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsComplete(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-orbitron text-xl font-bold flex items-center gap-2">
          <Timer size={22} className="text-neon-cyan" />
          Focus Mode
        </h2>
        <p className="text-sm text-gray-500 font-rajdhani mt-1">
          Pomodoro-style focus sessions • {focusSessions} sessions completed
        </p>
      </div>

      {/* Timer */}
      <div className="glass-card rounded-2xl border border-cyber-border p-8 flex flex-col items-center">
        {/* Duration Selector */}
        <div className="flex gap-2 mb-8">
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => handleDurationChange(mins)}
              className={`px-4 py-2 rounded-xl text-sm font-rajdhani font-semibold transition-all ${
                duration === mins
                  ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30'
                  : 'glass-card border border-cyber-border text-gray-400 hover:text-gray-200'
              }`}
              disabled={isRunning}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Circular Timer */}
        <div className="relative w-72 h-72 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            {/* Background circle */}
            <circle cx="150" cy="150" r="140" fill="none" stroke="#1e1e2e" strokeWidth="6" />
            {/* Progress circle */}
            <circle
              cx="150" cy="150" r="140" fill="none"
              stroke="url(#focusGrad)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-1000"
            />
            {/* Glow effect */}
            <circle
              cx="150" cy="150" r="140" fill="none"
              stroke="url(#focusGrad)" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-1000"
              filter="url(#glow)"
            />
            <defs>
              <linearGradient id="focusGrad">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#bf5af2" />
                <stop offset="100%" stopColor="#ff2d78" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <div className="text-center animate-slide-up">
                <CheckCircle size={40} className="text-neon-green mx-auto mb-2" />
                <p className="font-orbitron text-lg text-neon-green">Complete!</p>
                <p className="text-sm text-gray-400 font-rajdhani">+40 XP Earned</p>
              </div>
            ) : (
              <>
                <span className="font-orbitron text-5xl font-bold tracking-wider">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-500 font-rajdhani mt-2 uppercase tracking-widest">
                  {isRunning ? 'Focusing...' : 'Ready'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-rajdhani font-semibold hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Play size={18} /> {timeLeft < duration * 60 ? 'Resume' : 'Start Focus'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 rounded-xl bg-neon-orange/15 border border-neon-orange/30 text-neon-orange font-rajdhani font-semibold hover:bg-neon-orange/20 transition-all flex items-center gap-2"
            >
              <Pause size={18} /> Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl glass-card border border-cyber-border text-gray-400 hover:text-white transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Sessions" value={`${focusSessions}`} color="#00f0ff" />
        <StatBox label="Total Focus" value={`${Math.round(focusSessions * duration / 60)}h`} color="#bf5af2" />
        <StatBox label="XP Earned" value={`${focusSessions * 40}`} color="#30d158" />
        <StatBox label="Streak Bonus" value={`${Math.min(focusSessions, 10)}x`} color="#ff9f0a" />
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-card rounded-xl border border-cyber-border p-4 text-center">
      <p className="font-orbitron text-lg font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-gray-500 font-rajdhani uppercase tracking-wider">{label}</p>
    </div>
  );
}
