import React, { useEffect, useState } from 'react';
import { Header, Button, Card, ProgressBar, Timer } from '../components';
import { useGame } from '../context/GameContext';
import { useQuiz, Question, Answer } from '../hooks/useQuiz';
import { calculateScore } from '../utils/scoring';

interface QuizScreenProps {
  questions: Question[];
  onQuit: () => void;
  onComplete: (answers: Answer[], totalScore: number) => void;
}

const QUESTION_TIME_LIMIT = 30; // seconds

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onQuit, onComplete }) => {
  const { addScore, addXP, streak, setStreak } = useGame();
  const quiz = useQuiz(questions);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const currentQuestion = quiz.currentQuestion;

  // Timer effect
  useEffect(() => {
    if (quiz.isAnswered || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Auto-submit if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.isAnswered, currentQuestion]);

  const handleAnswer = (index: number) => {
    if (quiz.isAnswered) return;

    const timeTaken = QUESTION_TIME_LIMIT - timeLeft;
    const isCorrect = index === currentQuestion.correct;

    setSelectedAnswer(index);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Calculate score
    if (isCorrect) {
      const points = calculateScore(currentQuestion, true, timeTaken);
      addScore(points);
      addXP(points);
      setStreak(streak + 1);
      setTotalScore((prev) => prev + points);
    } else {
      addScore(-5);
      setStreak(0);
      setTotalScore((prev) => prev - 5);
    }

    quiz.answerQuestion(index, timeTaken);
  };

  const handleNext = () => {
    if (quiz.isQuizComplete) {
      onComplete(quiz.answers, totalScore);
    } else {
      setSelectedAnswer(null);
      setFeedback(null);
      setTimeLeft(QUESTION_TIME_LIMIT);
      quiz.nextQuestion();
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <Button onClick={onQuit} size="lg">
          Вернуться
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-20">
      <Header title="Викторина" showStats={true} />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Вопрос {quiz.currentIndex + 1}/{quiz.totalQuestions}
            </span>
            <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
              {currentQuestion.category}
            </span>
          </div>
          <ProgressBar current={quiz.currentIndex + 1} max={quiz.totalQuestions} color="blue" />
        </div>

        {/* Timer */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900">
          <Timer
            duration={QUESTION_TIME_LIMIT}
            onTimeUp={() => {
              if (!quiz.isAnswered) {
                handleAnswer(-1);
              }
            }}
            isActive={!quiz.isAnswered}
          />
        </Card>

        {/* Question */}
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-purple-700 p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            {currentQuestion.question}
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Сложность</span>
            <div className="flex gap-1">
              {currentQuestion.difficulty === 'easy' && <span className="text-green-400">●</span>}
              {(currentQuestion.difficulty === 'easy' || currentQuestion.difficulty === 'medium') && (
                <span className="text-yellow-400">●</span>
              )}
              {currentQuestion.difficulty === 'hard' && <span className="text-red-400">●</span>}
            </div>
          </div>
        </Card>

        {/* Answers */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correct;
            const showCorrect = quiz.isAnswered && isCorrectAnswer;
            const showWrong = quiz.isAnswered && isSelected && !isCorrectAnswer;

            return (
              <button
                key={index}
                onClick={() => !quiz.isAnswered && handleAnswer(index)}
                disabled={quiz.isAnswered}
                className={`
                  w-full p-4 rounded-xl font-semibold transition-all duration-200 text-left
                  transform hover:scale-105 active:scale-95 disabled:hover:scale-100
                  ${
                    !quiz.isAnswered
                      ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500'
                      : ''
                  }
                  ${showCorrect ? 'bg-green-600 border border-green-500 scale-105' : ''}
                  ${showWrong ? 'bg-red-600 border border-red-500 shake' : ''}
                  ${isSelected && !quiz.isAnswered ? 'bg-blue-600 border border-blue-400' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  {showCorrect && <span className="text-xl ml-2">✅</span>}
                  {showWrong && <span className="text-xl ml-2">❌</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {quiz.isAnswered && (
          <Card
            className={`text-center py-4 animate-scaleIn ${
              feedback === 'correct'
                ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-600'
                : 'bg-gradient-to-br from-red-900 to-red-800 border-red-600'
            }`}
          >
            <p className="text-lg font-bold mb-2">
              {feedback === 'correct' ? '🎉 Правильно!' : '😢 Неправильно!'}
            </p>
            <p className="text-sm text-gray-300 mb-3">
              {feedback === 'correct'
                ? `+${calculateScore(currentQuestion, true, QUESTION_TIME_LIMIT - timeLeft)} очков`
                : '-5 очков'}
            </p>
            <Button
              onClick={handleNext}
              variant={feedback === 'correct' ? 'success' : 'secondary'}
              size="md"
              className="w-full"
            >
              {quiz.isQuizComplete ? 'Завершить викторину' : 'Далее →'}
            </Button>
          </Card>
        )}

        {/* Quit Button */}
        {!quiz.isAnswered && (
          <button
            onClick={onQuit}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-300 transition-colors py-2"
          >
            ✕ Выход
          </button>
        )}
      </div>
    </div>
  );
};
