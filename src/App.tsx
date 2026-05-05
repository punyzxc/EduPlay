import { useEffect, useRef, useState } from 'react';
import { AchievementToast } from './components';
import { GameProvider, useGame } from './context/GameContext';
import { DEFAULT_QUIZ_SETTINGS, createQuizSession } from './data/questions';
import {
  LeaderboardScreen,
  MainScreen,
  ProfileScreen,
  QuizScreen,
  RegistrationScreen,
  ResultScreen,
} from './pages';
import { Answer, Question, QuizSettings } from './types/quiz';

type AppScreen = 'auth' | 'main' | 'quiz' | 'results' | 'leaderboard' | 'profile';

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

const getHighestStreak = (answers: Answer[]): number => {
  let maxStreak = 0;
  let streak = 0;
  answers.forEach((answer) => {
    if (answer.isCorrect) {
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  });
  return maxStreak;
};

function AppContent() {
  const {
    isUserLoggedIn,
    logout,
    achievementQueue,
    dismissAchievement,
    recordQuizResult,
  } = useGame();

  const [screen, setScreen] = useState<AppScreen>('auth');
  const [activeSettings, setActiveSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Запуск приложения...');
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    loadingTimeoutRef.current = window.setTimeout(() => {
      setLoadingMessage('');
      setScreen(isUserLoggedIn ? 'main' : 'auth');
    }, 650);

    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      setScreen('auth');
      setResult(null);
      setActiveQuestions([]);
      return;
    }

    if (screen === 'auth') {
      setScreen('main');
    }
  }, [isUserLoggedIn, screen]);

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
    if (!isUserLoggedIn) {
      setScreen('auth');
      return;
    }
    scheduleQuizStart(settings);
  };

  const handleQuizComplete = (answers: Answer[], totalScore: number) => {
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
    const totalAnswers = answers.length;
    const averageAnswerTime = totalAnswers
      ? answers.reduce((sum, answer) => sum + answer.timeTaken, 0) / totalAnswers
      : 0;
    const fastestCorrectAnswerTime =
      answers
        .filter((answer) => answer.isCorrect)
        .reduce<number | null>(
          (minTime, answer) =>
            minTime === null ? answer.timeTaken : Math.min(minTime, answer.timeTaken),
          null,
        );

    recordQuizResult({
      totalScore,
      correctAnswers,
      totalAnswers,
      averageAnswerTime,
      fastestCorrectAnswerTime,
      highestStreak: getHighestStreak(answers),
    });

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

  const handleOpenProfile = () => {
    setScreen('profile');
  };

  const handleLogout = () => {
    logout();
  };

  if (loadingMessage) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="fixed right-3 top-3 z-[70] w-[320px] max-w-[calc(100vw-1.5rem)] space-y-2">
        {achievementQueue.slice(0, 3).map((achievement, index) => (
          <div key={`${achievement.id}-${index}`}>
            <AchievementToast achievement={achievement} onClose={dismissAchievement} />
          </div>
        ))}
      </div>

      {screen === 'auth' && <RegistrationScreen onAuthComplete={() => setScreen('main')} />}

      {screen === 'main' && (
        <MainScreen
          onStartQuiz={handleStartQuiz}
          onViewLeaderboard={handleViewLeaderboard}
          onOpenProfile={handleOpenProfile}
          onLogout={handleLogout}
        />
      )}

      {screen === 'profile' && <ProfileScreen onBack={handleQuitToMain} onLogout={handleLogout} />}

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
