import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'xp' | 'coin' | 'level' | 'achievement' | 'boss' | 'streak';
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const typeStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  xp: { bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30', text: 'text-neon-cyan', icon: '⚡' },
  coin: { bg: 'bg-neon-gold/10', border: 'border-neon-gold/30', text: 'text-neon-gold', icon: '🪙' },
  level: { bg: 'bg-neon-purple/10', border: 'border-neon-purple/30', text: 'text-neon-purple', icon: '🎉' },
  achievement: { bg: 'bg-neon-green/10', border: 'border-neon-green/30', text: 'text-neon-green', icon: '🏆' },
  boss: { bg: 'bg-neon-pink/10', border: 'border-neon-pink/30', text: 'text-neon-pink', icon: '⚔️' },
  streak: { bg: 'bg-neon-orange/10', border: 'border-neon-orange/30', text: 'text-neon-orange', icon: '🔥' },
};

export function Notifications({ notifications, onDismiss }: NotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(n => (
        <NotificationToast key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function NotificationToast({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const style = typeStyles[notification.type] || typeStyles.xp;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-xl px-4 py-3 backdrop-blur-xl transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{style.icon}</span>
        <p className={`text-sm font-rajdhani font-semibold ${style.text}`}>
          {notification.message}
        </p>
      </div>
    </div>
  );
}
