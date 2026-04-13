import { useState, useCallback } from 'react';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Answer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeTaken: number;
}

export const useQuiz = (questions: Question[], onEnd?: (answers: Answer[]) => void) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const answerQuestion = useCallback(
    (selectedIndex: number, timeTaken: number = 0) => {
      if (isAnswered) return;

      const isCorrect = selectedIndex === currentQuestion.correct;
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        selectedIndex,
        isCorrect,
        timeTaken,
      };

      setAnswers((prev) => [...prev, newAnswer]);
      setIsAnswered(true);
    },
    [currentQuestion, isAnswered],
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      onEnd?.(answers);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setIsAnswered(false);
  }, [currentIndex, questions.length, answers, onEnd]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsAnswered(false);
  }, []);

  const isQuizComplete = currentIndex + 1 >= questions.length && isAnswered;

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    progress,
    answers,
    isAnswered,
    answerQuestion,
    nextQuestion,
    reset,
    isQuizComplete,
    correctAnswers: answers.filter((a) => a.isCorrect).length,
  };
};
