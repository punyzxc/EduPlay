import React from 'react';

type NavScreen = 'main' | 'leaderboard' | 'profile';

interface BottomNavProps {
  active: NavScreen;
  onChange: (screen: NavScreen) => void;
}

const tabs: Array<{ id: NavScreen; label: string; icon: React.ReactNode }> = [
  {
    id: 'main',
    label: 'Игра',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 12.5 12 5l8 7.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'leaderboard',
    label: 'Топ',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M5 20V11m7 9V4m7 16v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 20c1-3.5 3.5-5 7-5s6 1.5 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ active, onChange }) => {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 px-4 pb-3 sm:hidden">
      <nav className="glass-lg mx-auto flex max-w-md items-center justify-between rounded-[1.4rem] px-2 py-2 shadow-soft-card">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                'btn-interactive flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all',
                isActive
                  ? 'bg-sky-500/20 text-sky-200'
                  : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{tab.icon}</span>
              <span className="mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
