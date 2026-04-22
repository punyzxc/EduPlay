import React from 'react';
import { Button, Card } from '../components';

interface LandingPageProps {
  onStart: () => void;
  onContacts: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onContacts }) => {
  const features = [
    {
      icon: '🚀',
      title: 'Быстрое обучение',
      description: 'Интерактивные викторины с немедленной обратной связью',
    },
    {
      icon: '🏆',
      title: 'Соревнование',
      description: 'Ежедневный рейтинг топ-10 с реальными наградами',
    },
    {
      icon: '📈',
      title: 'Система уровней',
      description: 'Прокачивайтесь, получайте достижения и награды',
    },
    {
      icon: '🎮',
      title: 'Геймификация',
      description: 'Очки, опыт и персональные достижения',
    },
    {
      icon: '📱',
      title: 'Везде с тобой',
      description: 'Работает офлайн и на любых устройствах',
    },
    {
      icon: '🌍',
      title: 'Множество категорий',
      description: 'Программирование, математика, языки и многое другое',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Вопросов' },
    { number: '10+', label: 'Категорий' },
    { number: '∞', label: 'Возможностей' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-success-400 to-cyan-400 font-display">
              ▶
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
                EduPlay
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">Геймифицированное обучение</p>
            </div>
          </div>
          <button
            onClick={onContacts}
            className="text-slate-300 hover:text-primary-300 transition-colors text-sm sm:text-base font-semibold"
          >
            Контакты →
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-20 sm:mb-32">
            <div className="mb-8 sm:mb-12">
              <div className="inline-block mb-6 sm:mb-8">
                <div className="text-8xl sm:text-9xl md:text-10xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-success-400 animate-pulse font-display">
                  EduPlay
                </div>
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-100 mb-4 sm:mb-6 font-display leading-tight">
                Превратите обучение <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-success-400">
                  в увлекательную игру
                </span>
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                Викторины, очки, уровни и ежедневный рейтинг. Учитесь с удовольствием и конкурируйте с друзьями!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 sm:mb-24">
              <Button
                onClick={onStart}
                variant="primary"
                size="lg"
                fullWidth={false}
                className="px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold"
                icon="🚀"
              >
                Начать Прямо Сейчас
              </Button>
              <Button
                onClick={onContacts}
                variant="outline"
                size="lg"
                fullWidth={false}
                className="px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold"
                icon="📧"
              >
                Связаться
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-20 sm:mb-32">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  variant="glass"
                  size="sm"
                  className="text-center py-6 sm:py-8"
                >
                  <p className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-success-400 font-display mb-2">
                    {stat.number}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20 sm:mb-32">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-100 mb-12 sm:mb-16 font-display">
              Почему EduPlay? 🎯
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  variant="gradient"
                  size="md"
                  className="transform transition-all hover:scale-105 hover:shadow-2xl"
                >
                  <div className="space-y-4">
                    <div className="text-5xl sm:text-6xl">{feature.icon}</div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">
                      {feature.title}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="mb-20 sm:mb-32">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-100 mb-12 sm:mb-16 font-display">
              Как это работает? ⚙️
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: '1', title: 'Регистрируйтесь', desc: 'Создайте аккаунт за 1 минуту' },
                { step: '2', title: 'Выбирайте', desc: 'Выберите категорию вопросов' },
                { step: '3', title: 'Отвечайте', desc: 'Решайте вопросы и зарабатывайте очки' },
                { step: '4', title: 'Выигрывайте', desc: 'Поднимайтесь в рейтинге' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <Card variant="subtle" size="md" className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-success-500">
                      <p className="text-3xl font-bold text-white font-display">
                        {item.step}
                      </p>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-100 mb-2 font-display">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </Card>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <div className="text-2xl text-primary-400">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Features Highlight */}
          <section className="mb-20 sm:mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <Card variant="gradient" size="md" className="space-y-6">
                <h4 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
                  ✨ Система Достижений
                </h4>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-success-400 font-bold mt-1">✓</span>
                    <span>Разноцветные никнеймы за достижения</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success-400 font-bold mt-1">✓</span>
                    <span>Кастомный аватар с наградами</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success-400 font-bold mt-1">✓</span>
                    <span>Визуальные бейджи и медали</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success-400 font-bold mt-1">✓</span>
                    <span>Делитесь своими достижениями</span>
                  </li>
                </ul>
              </Card>

              <Card variant="gradient" size="md" className="space-y-6">
                <h4 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
                  🌐 Полностью Адаптивен
                </h4>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-400 font-bold mt-1">✓</span>
                    <span>Отлично работает на телефонах</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-400 font-bold mt-1">✓</span>
                    <span>Оптимизирован для планшетов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-400 font-bold mt-1">✓</span>
                    <span>Красиво на больших экранах</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-400 font-bold mt-1">✓</span>
                    <span>Работает без интернета</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center">
            <div className="glass-lg p-8 sm:p-12 rounded-2xl border border-primary-500/30 space-y-6 sm:space-y-8">
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-100 font-display">
                Готовы начать? 🎮
              </h3>
              <p className="text-slate-300 text-base sm:text-lg">
                Присоединяйтесь к тысячам учеников и начните путь к успеху
              </p>
              <Button
                onClick={onStart}
                variant="primary"
                size="lg"
                fullWidth={false}
                className="px-12 py-5 text-lg font-bold"
                icon="🚀"
              >
                Начать Сейчас
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 mt-20 sm:mt-32 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <p className="text-slate-400 text-sm">
            © 2024 EduPlay. Все права защищены.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <button className="hover:text-primary-300 transition-colors">
              О нас
            </button>
            <button onClick={onContacts} className="hover:text-primary-300 transition-colors">
              Контакты
            </button>
            <button className="hover:text-primary-300 transition-colors">
              Политика
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
