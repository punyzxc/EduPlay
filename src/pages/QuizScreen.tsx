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
  easy: 'text-emerald-200 border-emerald-400/40 bg-emerald-500/15',
  medium: 'text-amber-200 border-amber-400/45 bg-amber-500/15',
  hard: 'text-rose-200 border-rose-400/45 bg-rose-500/16',
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
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <Card size="lg" variant="gradient" className="w-full max-w-lg space-y-4 text-center">
          <p className="text-xl text-slate-200">Вопросы не найдены для выбранного режима.</p>
          <Button onClick={onQuit} variant="secondary" size="lg">
            Вернуться в меню
          </Button>
        </Card>
      </div>
    );
  }

  const comboActive = streak >= 2 && !quiz.isAnswered;

  return (
    <div className="app-shell min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <Header title="Викторина" subtitle={`${selectedCategory.icon} ${selectedCategory.label}`} showStats />

      <div className="flex-1 overflow-auto px-4 pb-8 pt-2">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card variant="subtle" size="md">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Вопрос {quiz.currentIndex + 1}/{quiz.totalQuestions}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] ${
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <Card variant="glass" size="md" className="surface-glow">
              <Timer
                key={currentQuestion.id}
                duration={QUESTION_TIME_LIMIT}
                onTimeUp={() => handleAnswer(-1)}
                isActive={!quiz.isAnswered}
                compact
                onTick={setRemainingTime}
              />
            </Card>
            <Card variant="subtle" size="md" className="flex items-center justify-between sm:flex-col sm:justify-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Счёт раунда</p>
              <p className={`text-2xl font-bold ${quiz.isAnswered ? 'animate-scorePop' : ''}`}>
                {sessionScore >= 0 ? '+' : ''}
                <span className={sessionScore >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{sessionScore}</span>
              </p>
            </Card>
          </div>

          {comboActive && (
            <Card variant="gradient" size="sm" className="animate-slideUp border border-amber-300/40 text-center">
              <p className="text-sm font-semibold text-amber-200">🔥 Комбо: серия {streak}</p>
            </Card>
          )}

          <Card key={currentQuestion.id} variant="default" size="lg" className="animate-scaleIn">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CategoryIcon categoryId={currentQuestion.categoryId} className="text-sky-300" />
                <span>{currentQuestion.category}</span>
              </div>
              <h2 className="text-2xl font-bold leading-relaxed text-slate-100 sm:text-3xl">
                {currentQuestion.question}
              </h2>
            </div>
          </Card>

          <div className="space-y-2.5">
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
                  className={[
                    'btn-interactive w-full rounded-2xl border p-4 text-left transition-all duration-200',
                    quiz.isAnswered || isSubmitting
                      ? 'cursor-not-allowed opacity-95'
                      : 'hover:-translate-y-0.5 hover:border-sky-400/65 active:scale-[0.99]',
                    showCorrect
                      ? 'border-emerald-400/75 bg-emerald-500/18'
                      : showWrong
                        ? 'border-rose-400/75 bg-rose-500/18 shake'
                        : isSelected
                          ? 'border-sky-400/70 bg-sky-500/15'
                          : 'border-slate-700 bg-slate-900/65',
                  ].join(' ')}
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
              className={feedback === 'correct' ? 'border border-emerald-400/35' : 'border border-rose-400/35'}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-100">
                    {feedback === 'correct' ? 'Отлично!' : 'Есть ошибка'}
                  </p>
                  <p
                    className={`text-2xl font-bold animate-scorePop ${
                      scoreBreakdown.totalPoints >= 0 ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {scoreBreakdown.totalPoints > 0 ? '+' : ''}
                    {scoreBreakdown.totalPoints}
                  </p>
                </div>

                {feedback === 'correct' && (
                  <p className="text-sm text-slate-300">
                    Скорость ответа: {Math.round(scoreBreakdown.speedFactor * 100)}% от максимума.
                  </p>
                )}

                {scoreBreakdown.antiRandomPenalty < 0 && (
                  <p className="text-sm text-amber-300">
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
                      ? 'Показать результат'
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
