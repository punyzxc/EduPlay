import React, { useMemo, useState } from 'react';
import { Button, Card, CategoryIcon, DifficultyIcon, Header, ProgressBar, Timer } from '../components';
import { DIFFICULTY_LABELS, getCategoryById } from '../data/questions';
import { useGame } from '../context/GameContext';
import { Answer, Question, QuizSettings } from '../types/quiz';
import { useQuiz } from '../hooks/useQuiz';
import { ScoreBreakdown, calculateScore } from '../utils/scoring';

interface QuizScreenProps {
  questions: Question[];
  settings: QuizSettings;
  onQuit: () => void;
  onComplete: (answers: Answer[], totalScore: number) => void;
}

const QUESTION_TIME_LIMIT = 12;
const NEXT_BUTTON_DELAY_MS = 900;

const difficultyStyles = {
  easy: 'text-success-300 border-success-500/40 bg-success-500/15',
  medium: 'text-warning-300 border-warning-500/40 bg-warning-500/15',
  hard: 'text-danger-300 border-danger-500/40 bg-danger-500/15',
} as const;

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  settings,
  onQuit,
  onComplete,
}) => {
  const { addScore, addXP, streak, setStreak } = useGame();
  const quiz = useQuiz(questions);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(QUESTION_TIME_LIMIT);
  const [errorStreak, setErrorStreak] = useState(0);
  const [nextButtonLocked, setNextButtonLocked] = useState(false);

  const currentQuestion = quiz.currentQuestion;
  const selectedCategory = useMemo(() => getCategoryById(settings.categoryId), [settings.categoryId]);

  const getTimeTaken = (): number => {
    const elapsed = Math.round((Date.now() - questionStartedAt) / 1000);
    return Math.max(0, Math.min(QUESTION_TIME_LIMIT, elapsed));
  };

  const lockNextButton = () => {
    setNextButtonLocked(true);
    window.setTimeout(() => setNextButtonLocked(false), NEXT_BUTTON_DELAY_MS);
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion || quiz.isAnswered || isSubmitting) return;
    setIsSubmitting(true);

    const timeTaken = getTimeTaken();
    const isCorrect = index === currentQuestion.correctAnswer;
    const nextErrorStreak = isCorrect ? 0 : errorStreak + 1;
    const nextStreak = isCorrect ? streak + 1 : 0;

    const scoreResult = calculateScore(
      currentQuestion,
      isCorrect,
      remainingTime,
      QUESTION_TIME_LIMIT,
      nextErrorStreak,
      timeTaken,
    );

    addScore(scoreResult.totalPoints);
    if (scoreResult.totalPoints > 0) {
      addXP(scoreResult.totalPoints);
    }

    setStreak(nextStreak);
    setErrorStreak(nextErrorStreak);
    setSelectedAnswer(index);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScoreBreakdown(scoreResult);
    setSessionScore((previous) => previous + scoreResult.totalPoints);

    quiz.answerQuestion(index, timeTaken);
    lockNextButton();
  };

  const handleNext = () => {
    if (nextButtonLocked) return;

    if (quiz.isQuizComplete) {
      onComplete(quiz.answers, sessionScore);
      return;
    }

    quiz.nextQuestion();
    setSelectedAnswer(null);
    setFeedback(null);
    setScoreBreakdown(null);
    setIsSubmitting(false);
    setQuestionStartedAt(Date.now());
    setRemainingTime(QUESTION_TIME_LIMIT);
    setNextButtonLocked(false);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card size="lg" variant="gradient" className="w-full max-w-lg text-center space-y-4">
          <p className="text-xl text-slate-200">Вопросы не найдены для выбранного режима.</p>
          <Button onClick={onQuit} variant="secondary" size="lg">
            Вернуться в меню
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      <Header
        title="Викторина"
        subtitle={`${selectedCategory.icon} ${selectedCategory.label}`}
        showStats={true}
      />

      <div className="flex-1 overflow-auto px-4 py-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card variant="subtle" size="md">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Прогресс: {quiz.currentIndex + 1}/{quiz.totalQuestions}
                </p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    difficultyStyles[currentQuestion.difficulty]
                  }`}
                >
                  <DifficultyIcon difficulty={currentQuestion.difficulty} />
                  {DIFFICULTY_LABELS[currentQuestion.difficulty]}
                </span>
              </div>
              <ProgressBar current={quiz.currentIndex + 1} max={quiz.totalQuestions} size="lg" color="primary" />
            </div>
          </Card>

          <Card variant="gradient" size="md">
            <Timer
              key={currentQuestion.id}
              duration={QUESTION_TIME_LIMIT}
              onTimeUp={() => handleAnswer(-1)}
              isActive={!quiz.isAnswered}
              compact={true}
              onTick={setRemainingTime}
            />
          </Card>

          <Card variant="default" size="lg">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <CategoryIcon categoryId={currentQuestion.categoryId} className="text-primary-300" />
                <span>{currentQuestion.category}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>
          </Card>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect = quiz.isAnswered && isCorrect;
              const showWrong = quiz.isAnswered && isSelected && !isCorrect;

              return (
                <button
                  type="button"
                  key={`${currentQuestion.id}-${index}`}
                  onClick={() => handleAnswer(index)}
                  disabled={quiz.isAnswered || isSubmitting}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                    quiz.isAnswered || isSubmitting
                      ? 'cursor-not-allowed'
                      : 'hover:border-primary-400 hover:bg-primary-500/10 active:scale-[0.99]'
                  } ${
                    showCorrect
                      ? 'border-success-500 bg-success-500/20'
                      : showWrong
                        ? 'border-danger-500 bg-danger-500/20'
                        : isSelected
                          ? 'border-primary-500 bg-primary-500/15'
                          : 'border-slate-700 bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-500 text-xs font-bold text-slate-200">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-slate-100">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {quiz.isAnswered && scoreBreakdown && (
            <Card
              variant={feedback === 'correct' ? 'gradient' : 'default'}
              size="md"
              className={feedback === 'correct' ? 'border border-success-500/30' : 'border border-danger-500/30'}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-100">
                    {feedback === 'correct' ? 'Верно!' : 'Неверно'}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      scoreBreakdown.totalPoints >= 0 ? 'text-success-400' : 'text-danger-400'
                    }`}
                  >
                    {scoreBreakdown.totalPoints > 0 ? '+' : ''}
                    {scoreBreakdown.totalPoints}
                  </p>
                </div>

                {feedback === 'correct' && (
                  <p className="text-sm text-slate-300">
                    Очки зависят от скорости: множитель {Math.round(scoreBreakdown.speedFactor * 100)}%
                  </p>
                )}

                {scoreBreakdown.antiRandomPenalty < 0 && (
                  <p className="text-sm text-warning-300">
                    Анти-рандом штраф: {scoreBreakdown.antiRandomPenalty}
                  </p>
                )}

                <Button
                  onClick={handleNext}
                  variant={feedback === 'correct' ? 'success' : 'secondary'}
                  size="md"
                  fullWidth
                  disabled={nextButtonLocked}
                >
                  {nextButtonLocked
                    ? 'Подождите...'
                    : quiz.isQuizComplete
                      ? 'Завершить'
                      : 'Следующий вопрос'}
                </Button>
              </div>
            </Card>
          )}

          {!quiz.isAnswered && (
            <Button onClick={onQuit} variant="ghost" size="md" fullWidth>
              Выйти из викторины
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
