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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Card size="lg" variant="gradient">
          <p className="text-xl text-slate-300">Загрузка вопросов...</p>
        </Card>
        <Button onClick={onQuit} variant="secondary" size="lg">
          ← Вернуться
        </Button>
      </div>
    );
  }

  const difficultyColors = {
    easy: { bg: 'bg-success-500/20', border: 'border-success-500/50', text: 'text-success-400' },
    medium: { bg: 'bg-warning-500/20', border: 'border-warning-500/50', text: 'text-warning-400' },
    hard: { bg: 'bg-danger-500/20', border: 'border-danger-500/50', text: 'text-danger-400' },
  };

  const difficulty = currentQuestion.difficulty as 'easy' | 'medium' | 'hard';
  const diffColor = difficultyColors[difficulty];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      <Header title="Викторина" showStats={true} />

      <div className="flex-1 overflow-auto px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Вопрос {quiz.currentIndex + 1}
                </p>
                <p className="text-xs text-slate-500">из {quiz.totalQuestions}</p>
              </div>
              <div
                className={`${diffColor.bg} ${diffColor.border} border rounded-lg px-3 py-1`}
              >
                <p className={`text-sm font-bold ${diffColor.text} uppercase tracking-wider`}>
                  {difficulty === 'easy'
                    ? 'Легко'
                    : difficulty === 'medium'
                      ? 'Средне'
                      : 'Сложно'}
                </p>
              </div>
            </div>
            <ProgressBar
              current={quiz.currentIndex + 1}
              max={quiz.totalQuestions}
              color="primary"
              size="lg"
            />
          </div>

          {/* Timer Card */}
          <Card variant="gradient" size="md" className="overflow-hidden">
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

          {/* Question Card */}
          <Card
            variant="default"
            size="lg"
            className="border-l-4 border-l-primary-500"
          >
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-display leading-relaxed text-slate-100">
                {currentQuestion.question}
              </h2>

              {/* Category Badge */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  📚 Категория
                </span>
                <span className="px-3 py-1 rounded-full glass text-sm font-semibold text-primary-300 border border-primary-500/30">
                  {currentQuestion.category}
                </span>
              </div>
            </div>
          </Card>

          {/* Answers Section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Выберите правильный ответ
            </p>

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
                    w-full p-4 rounded-lg font-semibold text-left
                    transition-all duration-200 transform
                    border-2 backdrop-blur-sm
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${
                      !quiz.isAnswered
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-primary-500 cursor-pointer hover:scale-105'
                        : 'cursor-not-allowed'
                    }
                    ${showCorrect ? 'bg-success-500/30 border-success-500 scale-105 shadow-lg shadow-success-500/20' : ''}
                    ${showWrong ? 'bg-danger-500/30 border-danger-500 shake shadow-lg shadow-danger-500/20' : ''}
                    ${isSelected && !quiz.isAnswered ? 'bg-primary-500/20 border-primary-500' : ''}
                  `}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Answer Number/Icon */}
                    <div className="flex-shrink-0">
                      {showCorrect && (
                        <span className="text-2xl font-bold">✅</span>
                      )}
                      {showWrong && (
                        <span className="text-2xl font-bold">❌</span>
                      )}
                      {!quiz.isAnswered && (
                        <span className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500 flex items-center justify-center text-sm font-bold text-primary-300">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                      {quiz.isAnswered && !showCorrect && !showWrong && (
                        <span className="w-8 h-8 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center text-sm font-bold text-slate-400">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>

                    {/* Answer Text */}
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Card */}
          {quiz.isAnswered && (
            <Card
              variant={feedback === 'correct' ? 'gradient' : 'default'}
              size="md"
              className={`animate-scaleIn border-l-4 ${
                feedback === 'correct'
                  ? 'border-l-success-500 bg-gradient-to-r from-success-500/10 to-success-500/5'
                  : 'border-l-danger-500 bg-gradient-to-r from-danger-500/10 to-danger-500/5'
              }`}
            >
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {feedback === 'correct' ? '🎉' : '😊'}
                  </span>
                  <div>
                    <h3 className={`text-lg font-bold font-display ${
                      feedback === 'correct' ? 'text-success-300' : 'text-slate-200'
                    }`}>
                      {feedback === 'correct' ? 'Отлично!' : 'Хорошая попытка!'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {feedback === 'correct'
                        ? 'Вы выбрали правильный ответ'
                        : 'Это неправильный ответ'}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="pt-3 border-t border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      Очки
                    </span>
                    <span
                      className={`text-2xl font-bold font-mono ${
                        feedback === 'correct' ? 'text-success-400' : 'text-danger-400'
                      }`}
                    >
                      {feedback === 'correct'
                        ? `+${calculateScore(currentQuestion, true, QUESTION_TIME_LIMIT - timeLeft)}`
                        : '-5'}
                    </span>
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  variant={feedback === 'correct' ? 'success' : 'secondary'}
                  size="md"
                  fullWidth
                  icon={quiz.isQuizComplete ? '🏁' : '→'}
                >
                  {quiz.isQuizComplete ? 'Завершить викторину' : 'Далее'}
                </Button>
              </div>
            </Card>
          )}

          {/* Quit Button */}
          {!quiz.isAnswered && (
            <button
              onClick={onQuit}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-300 transition-colors py-3 font-semibold uppercase tracking-wider hover:bg-slate-800/30 rounded-lg"
            >
              ✕ Выход
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
