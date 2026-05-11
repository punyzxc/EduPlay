import React, { useMemo, useState } from 'react';
import { AVATAR_PRESETS } from '../data/avatars';
import { AvatarBadge, Button, Card } from '../components';
import { useGame } from '../context/GameContext';

interface RegistrationScreenProps {
  onAuthComplete: () => void;
}

type AuthTab = 'login' | 'register';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onAuthComplete }) => {
  const { registerUser, loginUser } = useGame();
  const [tab, setTab] = useState<AuthTab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: AVATAR_PRESETS[0].id,
  });

  const [loginForm, setLoginForm] = useState({
    identity: '',
    password: '',
  });

  const registerValidationError = useMemo(() => {
    if (!registerForm.username.trim()) return 'Введите username.';
    if (registerForm.username.trim().length < 3) return 'Username должен быть минимум 3 символа.';
    if (!registerForm.email.trim()) return 'Введите email.';
    if (!emailRegex.test(registerForm.email.trim())) return 'Некорректный email.';
    if (!registerForm.password) return 'Введите пароль.';
    if (registerForm.password.length < 6) return 'Пароль должен быть минимум 6 символов.';
    if (registerForm.password !== registerForm.confirmPassword) return 'Пароли не совпадают.';
    return '';
  }, [registerForm]);

  const loginValidationError = useMemo(() => {
    if (!loginForm.identity.trim()) return 'Введите email или username.';
    if (!loginForm.password.trim()) return 'Введите пароль.';
    return '';
  }, [loginForm]);

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (registerValidationError) {
      setError(registerValidationError);
      return;
    }

    setIsLoading(true);
    const result = await registerUser(
      registerForm.email.trim(),
      registerForm.username.trim(),
      registerForm.password,
      registerForm.avatar,
    );
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Не удалось создать аккаунт.');
      return;
    }

    onAuthComplete();
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (loginValidationError) {
      setError(loginValidationError);
      return;
    }

    setIsLoading(true);
    const result = await loginUser(loginForm.identity.trim(), loginForm.password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Не удалось войти.');
      return;
    }

    onAuthComplete();
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-sky-500/18 blur-3xl" />
        <div className="absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-emerald-500/12 blur-3xl" />
      </div>

      <div className="safe-top flex min-h-screen items-center justify-center px-4 pb-6 pt-3">
        <div className="w-full max-w-2xl">
          <Card variant="glass" size="lg" className="surface-glow">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold">
                  <span className="text-gradient">EduPlay Account</span>
                </h1>
                <p className="mt-1 text-sm text-slate-300">Вход в игровой профиль и синхронизацию результатов.</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-700 bg-slate-900/65 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError('');
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    tab === 'login' ? 'bg-sky-500/20 text-sky-100' : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Вход
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError('');
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    tab === 'register'
                      ? 'bg-emerald-500/20 text-emerald-100'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              {tab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Email или username</label>
                    <input
                      value={loginForm.identity}
                      onChange={(event) => setLoginForm((prev) => ({ ...prev, identity: event.target.value }))}
                      placeholder="username или email"
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Пароль</label>
                    <input
                      value={loginForm.password}
                      onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                      type="password"
                      placeholder="Введите пароль"
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" fullWidth size="lg" loading={isLoading} icon="🔓">
                    Войти
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Username</label>
                    <input
                      value={registerForm.username}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, username: event.target.value }))}
                      placeholder="Ваш username"
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Email</label>
                    <input
                      value={registerForm.email}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="name@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Пароль</label>
                      <input
                        value={registerForm.password}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                        type="password"
                        placeholder="Минимум 6 символов"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Подтверждение</label>
                      <input
                        value={registerForm.confirmPassword}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                        }
                        type="password"
                        placeholder="Повторите пароль"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Аватар</label>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {AVATAR_PRESETS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setRegisterForm((prev) => ({ ...prev, avatar: avatar.id }))}
                          className={`rounded-xl border p-1.5 transition ${
                            registerForm.avatar === avatar.id
                              ? 'border-sky-400 bg-sky-500/20'
                              : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                          }`}
                        >
                          <AvatarBadge avatarId={avatar.id} username={registerForm.username || 'EP'} size="md" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" fullWidth size="lg" variant="success" loading={isLoading} icon="✅">
                    Создать аккаунт
                  </Button>
                </form>
              )}

              {error && (
                <div className="rounded-xl border border-rose-500/50 bg-rose-500/12 p-3 text-sm font-semibold text-rose-200">
                  {error}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
