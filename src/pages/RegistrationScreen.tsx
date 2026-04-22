import React, { useState } from 'react';
import { Card, Button } from '../components';

interface RegistrationScreenProps {
  onRegistrationComplete: (userData: { email: string; login: string; password: string }) => void;
  onBack: () => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onRegistrationComplete,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email не может быть пустым';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // Login validation
    if (!login.trim()) {
      newErrors.login = 'Логин не может быть пустым';
    } else if (login.length < 3) {
      newErrors.login = 'Логин должен содержать минимум 3 символа';
    } else if (login.length > 20) {
      newErrors.login = 'Логин не должен превышать 20 символов';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(login)) {
      newErrors.login = 'Логин может содержать только буквы, цифры, _ и -';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Пароль не может быть пустым';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    } else if (password.length > 50) {
      newErrors.password = 'Пароль не должен превышать 50 символов';
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onRegistrationComplete({
        email: email.trim(),
        login: login.trim(),
        password,
      });
      setIsLoading(false);
    }, 500);
  };

  const inputClass =
    'w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all placeholder-slate-500';

  const errorClass = 'text-danger-400 text-xs font-semibold mt-1 flex items-center gap-1';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-5">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-success-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={onBack}
            className="mb-8 text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2 font-semibold"
          >
            ← Вернуться назад
          </button>

          {/* Registration Card */}
          <Card variant="gradient" size="md" className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-success-400 font-display">
                Регистрация
              </h1>
              <p className="text-slate-300">Создайте аккаунт для начала</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  📧 Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={`${inputClass} ${errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className={errorClass}>
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Login Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  👤 Логин (Никнейм)
                </label>
                <input
                  type="text"
                  placeholder="your_login"
                  value={login}
                  onChange={(e) => {
                    setLogin(e.target.value);
                    if (errors.login) {
                      setErrors({ ...errors, login: '' });
                    }
                  }}
                  className={`${inputClass} ${errors.login ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30' : ''}`}
                  disabled={isLoading}
                  maxLength={20}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.login && (
                    <p className={errorClass}>
                      <span>⚠️</span> {errors.login}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 ml-auto">
                    {login.length}/20
                  </p>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  🔐 Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors({ ...errors, password: '' });
                      }
                    }}
                    className={`${inputClass} pr-12 ${errors.password ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30' : ''}`}
                    disabled={isLoading}
                    maxLength={50}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors text-xl"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <p className={errorClass}>
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  🔐 Подтвердите пароль
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: '' });
                      }
                    }}
                    className={`${inputClass} pr-12 ${errors.confirmPassword ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30' : ''}`}
                    disabled={isLoading}
                    maxLength={50}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors text-xl"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className={errorClass}>
                    <span>⚠️</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                icon="✅"
                disabled={isLoading}
                className={isLoading ? 'opacity-75' : ''}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>

            {/* Requirements */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                📋 Требования к паролю:
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className={password.length >= 6 ? 'text-success-400' : 'text-slate-500'}>
                    {password.length >= 6 ? '✓' : '○'}
                  </span>
                  Минимум 6 символов
                </li>
                <li className="flex items-center gap-2">
                  <span className={password === confirmPassword && confirmPassword ? 'text-success-400' : 'text-slate-500'}>
                    {password === confirmPassword && confirmPassword ? '✓' : '○'}
                  </span>
                  Пароли совпадают
                </li>
              </ul>
            </div>
          </Card>

          {/* Help text */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Ваши данные будут сохранены безопасно на вашем устройстве
          </p>
        </div>
      </div>
    </div>
  );
};
