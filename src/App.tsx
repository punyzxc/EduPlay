import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import {
  MainScreen,
  QuizScreen,
  ResultScreen,
  LeaderboardScreen,
  LandingPage,
  RegistrationScreen,
} from './pages';
import { QUESTIONS } from './data/questions';
import { Answer } from './hooks/useQuiz';

type AppState =
  | { screen: 'landing' }
  | { screen: 'registration' }
  | { screen: 'main' }
  | { screen: 'quiz' }
  | { screen: 'results'; answers: Answer[]; totalScore: number }
  | { screen: 'leaderboard' };

function AppContent() {
  const { isUserLoggedIn, registerUser } = useGame();
  const [appState, setAppState] = useState<AppState>(() => {
    return isUserLoggedIn ? { screen: 'main' } : { screen: 'landing' };
  });
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

  // Navigation handlers
  const handleLandingStart = () => {
    setAppState({ screen: 'registration' });
  };

  const handleLandingContacts = () => {
    // TODO: Implement contacts screen or redirect
    console.log('Contacts');
  };

  const handleRegistrationComplete = (userData: {
    email: string;
    login: string;
    password: string;
  }) => {
    registerUser(userData.email, userData.login, userData.password);
    setAppState({ screen: 'main' });
  };

  const handleRegistrationBack = () => {
    setAppState({ screen: 'landing' });
  };

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
    <div className="bg-gray-900 text-white min-h-screen">
      {appState.screen === 'landing' && (
        <LandingPage
          onStart={handleLandingStart}
          onContacts={handleLandingContacts}
        />
      )}

      {appState.screen === 'registration' && (
        <RegistrationScreen
          onRegistrationComplete={handleRegistrationComplete}
          onBack={handleRegistrationBack}
        />
      )}

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
