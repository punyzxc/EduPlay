import React, { useState } from 'react';
import { Card, Button } from '../components';
import { useGame } from '../context/GameContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, logout } = useGame();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!isOpen || !user) return null;

  const avatars = [
    { id: '1', emoji: '👨‍💻' },
    { id: '2', emoji: '👩‍💻' },
    { id: '3', emoji: '🧑‍🚀' },
    { id: '4', emoji: '🧙‍♂️' },
    { id: '5', emoji: '🦸‍♂️' },
    { id: '6', emoji: '🎓' },
  ];

  const handleChangePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Введите текущий пароль');
      return;
    }

    if (currentPassword !== user.password) {
      setPasswordError('Неверный текущий пароль');
      return;
    }

    if (!newPassword) {
      setPasswordError('Введите новый пароль');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('Новый пароль должен отличаться от текущего');
      return;
    }

    // Update password
    updateUserProfile({ password: newPassword });
    setPasswordSuccess('Пароль успешно изменён!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);

    setTimeout(() => {
      setPasswordSuccess('');
    }, 3000);
  };

  const handleAvatarChange = (avatarId: string) => {
    updateUserProfile({ avatar: avatarId });
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const inputClass =
    'w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all placeholder-slate-500 text-sm';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        variant="gradient"
        size="md"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <h2 className="text-2xl font-bold text-slate-100 font-display">👤 Мой Профиль</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Avatar Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-100 font-display">Выберите аватар</h3>
          <div className="grid grid-cols-6 gap-2">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarChange(avatar.id)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-3xl transition-all ${
                  user.avatar === avatar.id
                    ? 'ring-2 ring-primary-500 scale-110 bg-primary-500/20'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 font-display">Информация</h3>

          {/* Login */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Логин
            </p>
            <p className="text-lg font-bold text-slate-100">{user.login}</p>
          </div>

          {/* Email */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email
            </p>
            <p className="text-lg font-bold text-slate-100 break-all">{user.email}</p>
          </div>

          {/* Registered At */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Дата регистрации
            </p>
            <p className="text-sm text-slate-300">
              {new Date(user.registeredAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="border-t border-slate-700/50 pt-4">
          {!isEditingPassword ? (
            <Button
              onClick={() => setIsEditingPassword(true)}
              variant="outline"
              size="md"
              fullWidth
              icon="🔐"
            >
              Изменить пароль
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 font-display">🔐 Изменить пароль</h3>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Текущий пароль
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Новый пароль
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showNewPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="bg-danger-500/20 border border-danger-500/50 rounded-lg p-3">
                  <p className="text-danger-400 text-sm font-semibold">⚠️ {passwordError}</p>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="bg-success-500/20 border border-success-500/50 rounded-lg p-3">
                  <p className="text-success-400 text-sm font-semibold">✅ {passwordSuccess}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleChangePassword}
                  variant="success"
                  size="md"
                  icon="✅"
                >
                  Сохранить
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingPassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  variant="secondary"
                  size="md"
                  icon="❌"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="border-t border-slate-700/50 pt-4">
          <Button
            onClick={handleLogout}
            variant="danger"
            size="md"
            fullWidth
            icon="🚪"
          >
            Выход
          </Button>
        </div>
      </Card>
    </div>
  );
};
