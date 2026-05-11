import { Question } from '../hooks/useQuiz';

export const QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Что такое React?',
    options: [
      'Библиотека для создания пользовательских интерфейсов',
      'Язык программирования',
      'Фреймворк для бэкенда',
      'База данных',
    ],
    correct: 0,
    category: 'React',
    difficulty: 'easy',
  },
  {
    id: '2',
    question: 'Какой компонент используется для управления состоянием в React?',
    options: ['Props', 'State', 'Hooks', 'Context API'],
    correct: 1,
    category: 'React',
    difficulty: 'easy',
  },
  {
    id: '3',
    question: 'Что такое JSX?',
    options: [
      'Java XML',
      'JavaScript XML синтаксис для описания UI',
      'JSON Extension',
      'Java Script Extension',
    ],
    correct: 1,
    category: 'React',
    difficulty: 'easy',
  },
  {
    id: '4',
    question: 'Какой хук используется для эффектов в React?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correct: 1,
    category: 'React',
    difficulty: 'medium',
  },
  {
    id: '5',
    question: 'Что такое Virtual DOM?',
    options: [
      'Виртуальное копирование реального DOM в памяти',
      'Новый тип данных в JavaScript',
      'Стиль CSS',
      'Шифрование данных',
    ],
    correct: 0,
    category: 'React',
    difficulty: 'medium',
  },
  {
    id: '6',
    question: 'Какой язык используется для стилизации в Tailwind CSS?',
    options: ['SCSS', 'Less', 'CSS Utility Classes', 'PostCSS'],
    correct: 2,
    category: 'CSS',
    difficulty: 'easy',
  },
  {
    id: '7',
    question: 'Что такое TypeScript?',
    options: [
      'Новый язык программирования',
      'Надмножество JavaScript с типизацией',
      'Фреймворк',
      'База данных',
    ],
    correct: 1,
    category: 'TypeScript',
    difficulty: 'easy',
  },
  {
    id: '8',
    question: 'Какой инструмент используется для сборки проектов Vite?',
    options: ['Webpack', 'Rollup', 'Parcel', 'Browserify'],
    correct: 1,
    category: 'Tools',
    difficulty: 'medium',
  },
  {
    id: '9',
    question: 'Что означает PWA?',
    options: [
      'Personal Web Application',
      'Progressive Web App',
      'Powerful Web Application',
      'Public Web API',
    ],
    correct: 1,
    category: 'Web',
    difficulty: 'easy',
  },
  {
    id: '10',
    question: 'Какой из этих методов используется для создания функционального компонента в React?',
    options: [
      'React.createComponent()',
      'class Component extends React.Component',
      'function MyComponent() {}',
      'React.makeComponent()',
    ],
    correct: 2,
    category: 'React',
    difficulty: 'easy',
  },
];

export const CATEGORIES = ['React', 'CSS', 'TypeScript', 'Tools', 'Web'];

export const DIFFICULTY_MULTIPLIERS = {
  easy: 10,
  medium: 20,
  hard: 30,
};
