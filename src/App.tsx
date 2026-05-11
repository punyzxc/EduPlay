import { useEffect, useRef, useState } from 'react';
import { AchievementToast, BottomNav } from './components';
import { GameProvider, useGame } from './context/GameContext';
import { DEFAULT_QUIZ_SETTINGS, createQuizSession } from './data/questions';
import {
  LandingPage,
  LeaderboardScreen,
  MainScreen,
  ProfileScreen,
  QuizScreen,
  RegistrationScreen,
  ResultScreen,
} from './pages';
import { Answer, Question, QuizSettings } from './types/quiz';

type AppScreen = 'landing' | 'auth' | 'main' | 'quiz' | 'results' | 'leaderboard' | 'profile';

interface QuizResult {
  answers: Answer[];
  totalScore: number;
}

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen = ({ message }: LoadingScreenProps) => (
  <div className="app-shell safe-top flex min-h-screen items-center justify-center px-4">
    <div className="glass-lg w-full max-w-sm rounded-[1.65rem] border border-slate-600/35 p-7 text-center shadow-soft-card">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-sky-300/20 border-t-sky-300" />
      <p className="text-xl font-bold text-slate-100">EduPlay</p>
      <p className="mt-2 text-sm text-slate-300">{message}</p>
      <div className="mt-5 space-y-2">
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-2 w-3/4 rounded-full" />
      </div>
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

  const [screen, setScreen] = useState<AppScreen>('landing');
  const [activeSettings, setActiveSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Запуск приложения...');
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    loadingTimeoutRef.current = window.setTimeout(() => {
      setLoadingMessage('');
      setScreen('landing');
    }, 650);

    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isUserLoggedIn) {
      setResult(null);
      setActiveQuestions([]);
      if (screen === 'main' || screen === 'quiz' || screen === 'results' || screen === 'leaderboard' || screen === 'profile') {
        setScreen('auth');
      }
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
    const quizSessionId = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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
      quizSessionId,
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
    setScreen('landing');
  };

  const handleBottomNavigation = (target: 'main' | 'leaderboard' | 'profile') => {
    setScreen(target);
  };

  const handleEnterFromLanding = () => {
    setScreen(isUserLoggedIn ? 'main' : 'auth');
  };

  const showBottomNav =
    isUserLoggedIn && (screen === 'main' || screen === 'leaderboard' || screen === 'profile');

  if (loadingMessage) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <div className="app-shell bg-gray-900 text-white min-h-screen">
      <div className="safe-top fixed right-3 top-0 z-[70] w-[320px] max-w-[calc(100vw-1.5rem)] space-y-2 pt-2">
        {achievementQueue.slice(0, 3).map((achievement, index) => (
          <div key={`${achievement.id}-${index}`}>
            <AchievementToast achievement={achievement} onClose={dismissAchievement} />
          </div>
        ))}
      </div>

      <div key={screen} className="screen-enter">
        {screen === 'landing' && <LandingPage onStart={handleEnterFromLanding} />}

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

      {showBottomNav && (
        <BottomNav
          active={screen === 'leaderboard' ? 'leaderboard' : screen === 'profile' ? 'profile' : 'main'}
          onChange={handleBottomNavigation}
        />
      )}
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
