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

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (registerValidationError) {
      setError(registerValidationError);
      return;
    }

    setIsLoading(true);
    const result = registerUser(
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

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (loginValidationError) {
      setError(loginValidationError);
      return;
    }

    setIsLoading(true);
    const result = loginUser(loginForm.identity.trim(), loginForm.password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Не удалось войти.');
      return;
    }

    onAuthComplete();
  };

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30';

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-success-500/20 blur-3xl" />
      </div>

      <div className="flex-1 px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <Card variant="gradient" size="lg" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-cyan-300">
                EduPlay Account
              </h1>
              <p className="text-slate-300">Регистрация и вход работают офлайн на вашем устройстве.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-900/70 p-1">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === 'login'
                    ? 'bg-primary-500/20 text-primary-200'
                    : 'text-slate-300 hover:text-slate-100'
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
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === 'register'
                    ? 'bg-success-500/20 text-success-200'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Регистрация
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Email или username</label>
                  <input
                    className={inputClass}
                    value={loginForm.identity}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, identity: event.target.value }))}
                    placeholder="username или email"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Пароль</label>
                  <input
                    className={inputClass}
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
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Username</label>
                  <input
                    className={inputClass}
                    value={registerForm.username}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, username: event.target.value }))
                    }
                    placeholder="Ваш username"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Email</label>
                  <input
                    className={inputClass}
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="name@email.com"
                    autoComplete="email"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Пароль</label>
                    <input
                      className={inputClass}
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      type="password"
                      placeholder="Минимум 6 символов"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Подтверждение</label>
                    <input
                      className={inputClass}
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
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Выбор аватара</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {AVATAR_PRESETS.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setRegisterForm((prev) => ({ ...prev, avatar: avatar.id }))}
                        className={`rounded-xl border p-1.5 transition ${
                          registerForm.avatar === avatar.id
                            ? 'border-primary-400 bg-primary-500/20'
                            : 'border-slate-700 hover:border-slate-500'
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
              <div className="rounded-lg border border-danger-500/50 bg-danger-500/10 p-3 text-sm font-semibold text-danger-300">
                {error}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
