import { useState, useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import {
  MainScreen,
  QuizScreen,
  ResultScreen,
  LeaderboardScreen,
} from './pages';
import { QUESTIONS } from './data/questions';
import { Answer } from './hooks/useQuiz';

type AppState =
  | { screen: 'main' }
  | { screen: 'quiz' }
  | { screen: 'results'; answers: Answer[]; totalScore: number }
  | { screen: 'leaderboard' };

function AppContent() {
  const [appState, setAppState] = useState<AppState>({ screen: 'main' });
  const [isDarkMode] = useState(true);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration failed (development mode)');
      });
    }

    // Set dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleStartQuiz = () => {
    setAppState({ screen: 'quiz' });
  };

  const handleQuizComplete = (answers: Answer[], totalScore: number) => {
    setAppState({
      screen: 'results',
      answers,
      totalScore,
    });
  };

  const handleRetryQuiz = () => {
    setAppState({ screen: 'quiz' });
  };

  const handleQuitToMain = () => {
    setAppState({ screen: 'main' });
  };

  const handleViewLeaderboard = () => {
    setAppState({ screen: 'leaderboard' });
  };

  return (
    <div className="bg-gray-900 text-white">
      {appState.screen === 'main' && (
        <MainScreen
          onStartQuiz={handleStartQuiz}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}

      {appState.screen === 'quiz' && (
        <QuizScreen
          questions={QUESTIONS}
          onQuit={handleQuitToMain}
          onComplete={handleQuizComplete}
        />
      )}

      {appState.screen === 'results' && (
        <ResultScreen
          answers={appState.answers}
          totalScore={appState.totalScore}
          onRetry={handleRetryQuiz}
          onQuit={handleQuitToMain}
        />
      )}

      {appState.screen === 'leaderboard' && (
        <LeaderboardScreen onBack={handleQuitToMain} />
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
