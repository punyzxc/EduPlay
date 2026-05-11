import { useCallback, useMemo, useState } from 'react';
import { Answer, Question } from '../types/quiz';

export const useQuiz = (questions: Question[], onEnd?: (answers: Answer[]) => void) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = useMemo(
    () => (totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0),
    [currentIndex, totalQuestions],
  );

  const answerQuestion = useCallback(
    (selectedIndex: number, timeTaken = 0) => {
      if (isAnswered || !currentQuestion) return;

      const isCorrect = selectedIndex === currentQuestion.correctAnswer;
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        selectedIndex,
        isCorrect,
        timeTaken,
      };

      setAnswers((previous) => [...previous, newAnswer]);
      setIsAnswered(true);
    },
    [currentQuestion, isAnswered],
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      onEnd?.(answers);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setIsAnswered(false);
  }, [answers, currentIndex, onEnd, totalQuestions]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsAnswered(false);
  }, []);

  const isQuizComplete = totalQuestions > 0 && currentIndex + 1 >= totalQuestions && isAnswered;

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    progress,
    answers,
    isAnswered,
    answerQuestion,
    nextQuestion,
    reset,
    isQuizComplete,
    correctAnswers: answers.filter((answer) => answer.isCorrect).length,
  };
};
