import { useEffect, useRef, useState } from 'react';
import { GameProvider } from './context/GameContext';
import { MainScreen, QuizScreen, ResultScreen, LeaderboardScreen } from './pages';
import { DEFAULT_QUIZ_SETTINGS, createQuizSession } from './data/questions';
import { Answer, Question, QuizSettings } from './types/quiz';

type AppScreen = 'main' | 'quiz' | 'results' | 'leaderboard';

interface QuizResult {
  answers: Answer[];
  totalScore: number;
}

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen = ({ message }: LoadingScreenProps) => (
  <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
    <div className="w-full max-w-md rounded-2xl border border-primary-500/30 bg-slate-900/80 p-8 text-center shadow-2xl">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200/20 border-t-primary-400" />
      <p className="text-xl font-bold text-slate-100">EduPlay</p>
      <p className="mt-2 text-slate-300">{message}</p>
    </div>
  </div>
);

function AppContent() {
  const [screen, setScreen] = useState<AppScreen>('main');
  const [activeSettings, setActiveSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Запуск приложения...');
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    loadingTimeoutRef.current = window.setTimeout(() => {
      setLoadingMessage('');
    }, 650);

    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const scheduleQuizStart = (settings: QuizSettings) => {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }

    setLoadingMessage('Подбираем вопросы...');
    loadingTimeoutRef.current = window.setTimeout(() => {
      setActiveSettings(settings);
      setActiveQuestions(createQuizSession(settings));
      setResult(null);
      setScreen('quiz');
      setLoadingMessage('');
    }, 320);
  };

  const handleStartQuiz = (settings: QuizSettings) => {
    scheduleQuizStart(settings);
  };

  const handleQuizComplete = (answers: Answer[], totalScore: number) => {
    setResult({ answers, totalScore });
    setScreen('results');
  };

  const handleRetryQuiz = () => {
    scheduleQuizStart(activeSettings);
  };

  const handleQuitToMain = () => {
    setScreen('main');
  };

  const handleViewLeaderboard = () => {
    setScreen('leaderboard');
  };

  if (loadingMessage) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {screen === 'main' && (
        <MainScreen onStartQuiz={handleStartQuiz} onViewLeaderboard={handleViewLeaderboard} />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          questions={activeQuestions}
          settings={activeSettings}
          onQuit={handleQuitToMain}
          onComplete={handleQuizComplete}
        />
      )}

      {screen === 'results' && result && (
        <ResultScreen
          answers={result.answers}
          totalScore={result.totalScore}
          settings={activeSettings}
          onRetry={handleRetryQuiz}
          onQuit={handleQuitToMain}
        />
      )}

      {screen === 'leaderboard' && <LeaderboardScreen onBack={handleQuitToMain} />}
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
