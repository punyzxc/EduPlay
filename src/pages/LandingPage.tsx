import React, { useEffect, useRef, useState } from 'react';
import { Button, Card } from '../components';

interface LandingPageProps {
  onStart: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface IconProps {
  className?: string;
}

const RocketIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 17c-1.5 0-3 1.2-3.2 2.9L3.5 21l1.1-.3C6.4 20.3 7.8 18.7 8 17c.2-1.5-.5-2.9-1.8-3.6L5 13l-.4 1.2C4 15.5 4.7 17 6 17.7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14 5 19M11 13l2.5-2.5a8.7 8.7 0 0 0 2.3-3.9L17 3l-3.5 1.2a8.7 8.7 0 0 0-3.9 2.3L7 9l4 4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="14.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const TrophyIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M8 4h8v3a4 4 0 1 1-8 0V4Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 6H5a2 2 0 0 0 2 2M16 6h3a2 2 0 0 1-2 2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 11v4M9 19h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10 15h4a1 1 0 0 1 1 1v1H9v-1a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const AchievementIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9.2 13.2 8 21l4-2.2L16 21l-1.2-7.8" stroke="currentColor" strokeWidth="1.6" />
    <path d="m10.6 9 1.1 1.1L14 7.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PhoneIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="7" y="2.5" width="10" height="19" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.5 5h3M11 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LearningIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 6.5 12 3l8 3.5L12 10 4 6.5Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 10.5v5.2c0 .7.4 1.3 1 1.6l5 2.2 5-2.2c.6-.3 1-.9 1-1.6v-5.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const AndroidIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M7 9h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="m8 7 1.4-2M16 7l-1.4-2M9 12v3M15 12v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 9a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="10" cy="8.5" r=".6" fill="currentColor" />
    <circle cx="14" cy="8.5" r=".6" fill="currentColor" />
  </svg>
);

const AppleIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M15.7 8.4c-.8-.8-1.3-2-1.1-3.2-1.1.1-2.3.8-3 1.7-.7.8-1.3 2-1 3.2m5.1 2.2c.8-1 2-1.4 3.1-1.2-.3-1-.9-1.8-1.7-2.4-.8-.6-1.9-.9-3-.9-1.1 0-2.1.4-3 1.1-.8.6-1.3 1.4-1.6 2.3-.4 1-.4 2.2 0 3.6.4 1.4 1 2.6 1.7 3.5.7.9 1.7 1.8 2.9 1.8.5 0 1-.1 1.5-.3.5-.2 1-.3 1.5-.3s1 .1 1.6.3c.6.2 1.1.3 1.6.3.8 0 1.6-.5 2.3-1.4.7-.9 1.3-2 1.7-3.2-1.1-.5-2-1.1-2.6-2-.7-.9-.8-2.1-.4-3.2Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const TelegramIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M21 4.6 17.8 20a1 1 0 0 1-1.4.7l-4.4-2.6-2.2 2.1a.8.8 0 0 1-1.3-.5l.2-3.3L17.6 8c.4-.3 0-.9-.4-.6l-11 7-4.6-1.5a1 1 0 0 1 0-1.9L19.6 4a1 1 0 0 1 1.4.6Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const InstagramIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="16.8" cy="7.4" r="1" fill="currentColor" />
  </svg>
);

const CallIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M20.6 16.3v2.9a1.8 1.8 0 0 1-2 1.8A16.3 16.3 0 0 1 3 5.4a1.8 1.8 0 0 1 1.8-2h3a1.8 1.8 0 0 1 1.8 1.5c.1 1 .4 1.9.8 2.8a1.8 1.8 0 0 1-.4 2l-1.2 1.2a13 13 0 0 0 4.2 4.2l1.2-1.2a1.8 1.8 0 0 1 2-.4c.9.4 1.8.7 2.8.8a1.8 1.8 0 0 1 1.6 1.8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const featureCards = [
  {
    title: 'Викторины',
    description: 'История Казахстана, английский и информатика в удобных игровых сессиях.',
    icon: RocketIcon,
  },
  {
    title: 'Лидерборд',
    description: 'Сравнивай результаты за день и поднимайся в топ среди других игроков.',
    icon: TrophyIcon,
  },
  {
    title: 'Система достижений',
    description: 'Открывай награды за точность, скорость и игровые серии без ошибок.',
    icon: AchievementIcon,
  },
  {
    title: 'Web App',
    description: 'Устанавливай EduPlay на главный экран и запускай как нативное приложение.',
    icon: PhoneIcon,
  },
  {
    title: 'Обучение через игру',
    description: 'Прокачивай знания и память через короткие раунды с понятной аналитикой.',
    icon: LearningIcon,
  },
];

const developers = ['Актанов Д.', 'Ашенов К.', 'Тарасов С.'];

const contacts = [
  {
    label: 'Telegram',
    value: '@UbitsaNoobov666',
    href: 'https://t.me/UbitsaNoobov666',
    icon: TelegramIcon,
    tone: 'text-sky-200 border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/18',
  },
  {
    label: 'Instagram',
    value: 'whoami_asd',
    href: 'https://www.instagram.com/whoami_asd',
    icon: InstagramIcon,
    tone: 'text-pink-200 border-pink-400/40 bg-pink-500/10 hover:bg-pink-500/18',
  },
  {
    label: 'Телефон',
    value: '+7 777 228 13 37',
    href: 'tel:+77772281337',
    icon: CallIcon,
    tone: 'text-emerald-200 border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/18',
  },
];

const desktopParticles = [
  { left: '7%', top: '22%', duration: '10.8s', delay: '0.5s' },
  { left: '18%', top: '40%', duration: '12.4s', delay: '1.7s' },
  { left: '26%', top: '66%', duration: '13.2s', delay: '0.2s' },
  { left: '35%', top: '18%', duration: '11.6s', delay: '2.3s' },
  { left: '44%', top: '53%', duration: '14s', delay: '1.1s' },
  { left: '53%', top: '74%', duration: '12.6s', delay: '2.6s' },
  { left: '62%', top: '26%', duration: '11.9s', delay: '0.9s' },
  { left: '70%', top: '58%', duration: '13.7s', delay: '1.9s' },
  { left: '79%', top: '34%', duration: '12.1s', delay: '0.4s' },
  { left: '88%', top: '70%', duration: '14.3s', delay: '2.9s' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const installRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installed'>('idle');

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ((window.navigator as Navigator & { standalone?: boolean }).standalone ?? false);
    if (standalone) {
      setInstallStatus('installed');
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallStatus('installed');
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallStatus('installed');
      }
      setDeferredPrompt(null);
      return;
    }
    installRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-shell relative isolate min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-80 w-80 animate-pulseSoft rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-16 top-1/4 h-72 w-72 animate-pulseSoft rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-pulseSoft rounded-full bg-emerald-500/14 blur-3xl" />
      </div>
      <div className="desktop-atmosphere">
        <div className="desktop-grid-overlay" />
        <div className="desktop-light-beam desktop-light-beam-left" />
        <div className="desktop-light-beam desktop-light-beam-right" />
        <div className="desktop-orb desktop-orb-a" />
        <div className="desktop-orb desktop-orb-b" />
        <div className="desktop-orb desktop-orb-c" />
        <div className="desktop-shape desktop-shape-a" />
        <div className="desktop-shape desktop-shape-b" />
        {desktopParticles.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className="desktop-particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="safe-top safe-bottom relative z-10">
        <header className="sticky top-0 z-20 border-b border-slate-700/40 bg-slate-950/60 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="glass flex h-10 w-10 items-center justify-center rounded-2xl border-sky-400/30 text-sky-200">
                <RocketIcon />
              </div>
              <div>
                <p className="text-base font-bold text-slate-100">EduPlay</p>
                <p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Smart Quiz Platform</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:text-sky-200"
            >
              Контакты
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl space-y-7 px-4 pb-10 pt-4 sm:space-y-8 sm:px-6">
          <section className="animate-slideDown">
            <Card variant="glass" size="lg" className="surface-glow overflow-hidden">
              <div className="relative space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  PWA + Mobile First
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-extrabold leading-tight text-slate-50 sm:text-4xl md:text-5xl">
                    Учёба как игра, <span className="text-gradient">результаты как в приложении</span>
                  </h1>
                  <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                    EduPlay - образовательный проект для геймификации обучения школьников. Проходи викторины,
                    зарабатывай очки, открывай достижения и соревнуйся в рейтинге каждый день.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <Button onClick={onStart} size="lg" icon={<RocketIcon className="h-4 w-4" />} fullWidth>
                    Начать
                  </Button>
                  <Button
                    onClick={handleInstall}
                    size="lg"
                    variant="outline"
                    icon={<PhoneIcon className="h-4 w-4" />}
                    fullWidth
                  >
                    {installStatus === 'installed' ? 'Приложение установлено' : 'Установить приложение'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-center sm:grid-cols-4">
                  {[
                    ['120+', 'Вопросов'],
                    ['3', 'Категории'],
                    ['10', 'Вопросов за раунд'],
                    ['5с', 'Обновление топа'],
                  ].map(([value, label]) => (
                    <div key={label} className="surface-subtle rounded-2xl px-3 py-2.5">
                      <p className="text-lg font-extrabold text-slate-100">{value}</p>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section className="animate-slideUp space-y-3">
            <div className="px-1">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Преимущества</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">Почему выбирают EduPlay</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map(({ title, description, icon: Icon }) => (
                <Card
                  key={title}
                  variant="default"
                  size="md"
                  className="group border-slate-700/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-500"
                >
                  <div className="space-y-3">
                    <div className="inline-flex rounded-2xl border border-sky-400/35 bg-sky-500/10 p-2.5 text-sky-200 transition group-hover:border-sky-300/60 group-hover:bg-sky-500/18">
                      <Icon />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-100">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">{description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section ref={installRef} className="animate-slideUp space-y-3">
            <div className="px-1">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Web App Install</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">Как установить EduPlay</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Card variant="glass" size="md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-100">
                    <AndroidIcon />
                    <p className="text-lg font-bold">Android</p>
                  </div>
                  <ol className="space-y-2 text-sm text-slate-300">
                    <li className="surface-subtle rounded-xl px-3 py-2">1. Открыть сайт EduPlay в Chrome</li>
                    <li className="surface-subtle rounded-xl px-3 py-2">2. Нажать на меню ⋮</li>
                    <li className="surface-subtle rounded-xl px-3 py-2">3. Выбрать “Добавить на главный экран”</li>
                  </ol>
                </div>
              </Card>
              <Card variant="glass" size="md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-100">
                    <AppleIcon />
                    <p className="text-lg font-bold">iPhone</p>
                  </div>
                  <ol className="space-y-2 text-sm text-slate-300">
                    <li className="surface-subtle rounded-xl px-3 py-2">1. Открыть EduPlay в Safari</li>
                    <li className="surface-subtle rounded-xl px-3 py-2">2. Нажать кнопку Share</li>
                    <li className="surface-subtle rounded-xl px-3 py-2">3. Выбрать “Add to Home Screen”</li>
                  </ol>
                </div>
              </Card>
            </div>
          </section>

          <section className="animate-slideUp space-y-3">
            <div className="px-1">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Разработчики</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">Команда EduPlay</h2>
            </div>
            <Card variant="subtle" size="md">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {developers.map((name) => (
                  <div key={name} className="glass rounded-2xl px-4 py-3 text-center">
                    <p className="text-sm font-semibold text-slate-100 sm:text-base">{name}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section ref={contactRef} className="animate-slideUp space-y-3">
            <div className="px-1">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Контакты</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">Связаться с нами</h2>
            </div>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {contacts.map(({ label, value, href, icon: Icon, tone }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className={`btn-interactive rounded-2xl border px-4 py-3.5 transition-all duration-200 active:scale-[0.99] ${tone}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/45">
                      <Icon />
                    </span>
                    <span className="text-left">
                      <span className="block text-[11px] uppercase tracking-[0.12em] text-slate-300">{label}</span>
                      <span className="block text-sm font-semibold">{value}</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </main>

        <footer className="px-4 pb-6 pt-2 text-center sm:px-6">
          <p className="text-xs tracking-[0.14em] text-slate-500">ООО "ТмывДенег"</p>
        </footer>
      </div>
    </div>
  );
};
