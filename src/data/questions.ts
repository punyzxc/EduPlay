import { CategoryId, Difficulty, DifficultyFilter, Question, QuizCategory, QuizSettings } from '../types/quiz';

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'history',
    label: 'История Казахстана',
    icon: '🏛️',
    description: 'Ключевые даты, личности и события истории Казахстана.',
  },
  {
    id: 'english',
    label: 'Английский язык',
    icon: '🇬🇧',
    description: 'Грамматика, лексика и базовые языковые конструкции.',
  },
  {
    id: 'informatics',
    label: 'Информатика',
    icon: '💻',
    description: 'Алгоритмы, сети, устройства и основы программирования.',
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyFilter, string> = {
  all: 'Смешанная',
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
};

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  easy: 5,
  medium: 7,
  hard: 10,
};

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  categoryId: 'history',
  difficulty: 'all',
  questionCount: 10,
};

const QUESTION_BANK: Question[] = [
  // history - easy
  {
    id: 'history-easy-1',
    question: 'В каком году Казахстан объявил независимость?',
    options: ['1986', '1991', '1995', '2001'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-easy-2',
    question: 'Как назывался первый президент Республики Казахстан?',
    options: ['Касым-Жомарт Токаев', 'Нурсултан Назарбаев', 'Динмухамед Кунаев', 'Абылай хан'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-easy-3',
    question: 'Какая столица Казахстана была до Астаны?',
    options: ['Шымкент', 'Караганда', 'Алматы', 'Тараз'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-easy-4',
    question: 'Как называется национальная валюта Казахстана?',
    options: ['Рубль', 'Сом', 'Тенге', 'Манат'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-easy-5',
    question: 'Кто возглавил восстание 1837-1847 годов в Казахстане?',
    options: ['Кенесары Касымов', 'Исатай Тайманов', 'Амангельды Иманов', 'Букей хан'],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-easy-6',
    question: 'В каком веке жил Абылай хан?',
    options: ['XIV', 'XV', 'XVIII', 'XX'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'История Казахстана',
    categoryId: 'history',
  },

  // history - medium
  {
    id: 'history-medium-1',
    question: 'В каком году была принята действующая Конституция Казахстана?',
    options: ['1993', '1995', '1998', '2007'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-medium-2',
    question: 'Как назывался свод законов Тауке хана?',
    options: ['Каска жолы', 'Жеты Жаргы', 'Ескі жол', 'Яса'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-medium-3',
    question: 'К какому жузу относился Абылай хан?',
    options: ['Старший жуз', 'Средний жуз', 'Младший жуз', 'Не относился к жузам'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-medium-4',
    question: 'Когда произошло восстание Исатая Тайманова и Махамбета Утемисова?',
    options: ['1822-1824', '1836-1838', '1868-1869', '1916'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-medium-5',
    question: 'Как называлась советская автономия, созданная в 1920 году на территории Казахстана?',
    options: ['КазССР', 'Киргизская АССР', 'Туркестанская АССР', 'Кокандская автономия'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-medium-6',
    question: 'В каком году столица Казахстана была перенесена из Алматы в Акмолу?',
    options: ['1996', '1997', '1998', '1999'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'История Казахстана',
    categoryId: 'history',
  },

  // history - hard
  {
    id: 'history-hard-1',
    question: 'Какое название носил Казахстан в составе Российской империи в XIX веке?',
    options: ['Казахская область', 'Киргиз-кайсацкая степь', 'Туркестанский край', 'Сибирская орда'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-hard-2',
    question: 'Кто автор произведения «Тарих-и-Рашиди», важного источника по истории региона?',
    options: ['Мухаммед Хайдар Дулати', 'Кадыргали Жалаири', 'Шакарим Кудайбердыулы', 'Ахмет Байтурсынулы'],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-hard-3',
    question: 'В каком году произошло восстание под руководством Амангельды Иманова?',
    options: ['1905', '1916', '1917', '1921'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-hard-4',
    question: 'Какой договор закрепил вхождение Младшего жуза под подданство России?',
    options: ['Указ Екатерины II', 'Присяга Абулхаира 1731 года', 'Ташкентский договор', 'Оренбургский пакт 1740'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-hard-5',
    question: 'Как называется политика принудительной оседлости и коллективизации в Казахстане в 1930-х?',
    options: ['Индустриализация', 'Раскулачивание', 'Коллективизация', 'Коренизация'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'История Казахстана',
    categoryId: 'history',
  },
  {
    id: 'history-hard-6',
    question: 'Какой космодром расположен на территории Казахстана?',
    options: ['Плесецк', 'Байконур', 'Восточный', 'Капустин Яр'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'История Казахстана',
    categoryId: 'history',
  },

  // english - easy
  {
    id: 'english-easy-1',
    question: 'Выбери правильный перевод слова “school”.',
    options: ['Школа', 'Книга', 'Город', 'Семья'],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-easy-2',
    question: 'Какое местоимение подходит к слову “my mother”?',
    options: ['He', 'She', 'It', 'They'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-easy-3',
    question: 'Выбери форму глагола to be: “I ___ a student.”',
    options: ['is', 'are', 'am', 'be'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-easy-4',
    question: 'Какой день недели идет после Monday?',
    options: ['Sunday', 'Tuesday', 'Friday', 'Thursday'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-easy-5',
    question: 'Выбери правильный артикль: “___ apple”',
    options: ['a', 'an', 'the', '-'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-easy-6',
    question: 'Как переводится “Thank you”?',
    options: ['Пожалуйста', 'Спасибо', 'Извините', 'До свидания'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Английский язык',
    categoryId: 'english',
  },

  // english - medium
  {
    id: 'english-medium-1',
    question: 'Выбери правильную форму Present Simple: “He ___ football every day.”',
    options: ['play', 'plays', 'is playing', 'played'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-medium-2',
    question: 'Какой вариант является сравнительной степенью слова “good”?',
    options: ['gooder', 'more good', 'better', 'best'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-medium-3',
    question: 'Выбери правильный предлог: “She is interested ___ music.”',
    options: ['in', 'on', 'at', 'for'],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-medium-4',
    question: 'Какая форма правильная для Past Simple: “They ___ to school yesterday.”',
    options: ['go', 'went', 'gone', 'going'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-medium-5',
    question: 'Выбери правильный вопрос: “___ you like tea?”',
    options: ['Are', 'Do', 'Does', 'Did'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-medium-6',
    question: 'Выбери правильное слово: “There isn’t ___ milk in the fridge.”',
    options: ['many', 'some', 'any', 'few'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Английский язык',
    categoryId: 'english',
  },

  // english - hard
  {
    id: 'english-hard-1',
    question: 'Выбери правильный условный тип: “If I ___ time, I would travel more.”',
    options: ['have', 'had', 'will have', 'have had'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-hard-2',
    question: 'Выбери пассивный залог: “The homework ___ by students yesterday.”',
    options: ['did', 'was done', 'is done', 'has done'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-hard-3',
    question: 'Выбери корректный reported speech: “He said that he ___ tired.”',
    options: ['is', 'was', 'were', 'has been'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-hard-4',
    question: 'Какой модальный глагол выражает обязанность в прошедшем времени?',
    options: ['must', 'should', 'had to', 'can'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-hard-5',
    question: 'Выбери фразу с правильным герундием:',
    options: ['I enjoy to read books.', 'I enjoy reading books.', 'I enjoy read books.', 'I enjoy reads books.'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Английский язык',
    categoryId: 'english',
  },
  {
    id: 'english-hard-6',
    question: 'Выбери правильный вариант: “By next year, she ___ English for 5 years.”',
    options: ['will study', 'will be studying', 'will have studied', 'studies'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Английский язык',
    categoryId: 'english',
  },

  // informatics - easy
  {
    id: 'informatics-easy-1',
    question: 'Что такое алгоритм?',
    options: ['Компьютерная игра', 'Последовательность действий для решения задачи', 'Тип файла', 'Веб-сайт'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-easy-2',
    question: 'Какое устройство используется для ввода текста?',
    options: ['Монитор', 'Клавиатура', 'Принтер', 'Колонки'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-easy-3',
    question: 'Что означает CPU?',
    options: ['Central Processing Unit', 'Computer Personal Utility', 'Control Program Unit', 'Core Power Utility'],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-easy-4',
    question: 'Какой язык используется для разметки веб-страниц?',
    options: ['Python', 'HTML', 'C++', 'SQL'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-easy-5',
    question: 'Как называется всемирная сеть?',
    options: ['LAN', 'World Wide Web', 'Bluetooth', 'Cloud Storage'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-easy-6',
    question: 'Какой символ используется для комментария в JavaScript (однострочно)?',
    options: ['#', '//', '<!-- -->', '/* */'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Информатика',
    categoryId: 'informatics',
  },

  // informatics - medium
  {
    id: 'informatics-medium-1',
    question: 'Какой тип данных хранит логические значения true/false?',
    options: ['string', 'number', 'boolean', 'array'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-medium-2',
    question: 'Что делает оператор if в программировании?',
    options: ['Создает цикл', 'Проверяет условие', 'Удаляет переменную', 'Выводит графику'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-medium-3',
    question: 'Какой протокол обычно используется для загрузки веб-страниц?',
    options: ['FTP', 'HTTP', 'SMTP', 'SSH'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-medium-4',
    question: 'Какая структура данных работает по принципу FIFO?',
    options: ['Стек', 'Очередь', 'Дерево', 'Граф'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-medium-5',
    question: 'Что такое IP-адрес?',
    options: ['Имя пользователя', 'Уникальный адрес устройства в сети', 'Пароль от Wi-Fi', 'Тип файла'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-medium-6',
    question: 'Какой цикл в JavaScript выполняется, пока условие истинно?',
    options: ['for', 'map', 'while', 'switch'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Информатика',
    categoryId: 'informatics',
  },

  // informatics - hard
  {
    id: 'informatics-hard-1',
    question: 'Какова временная сложность бинарного поиска в отсортированном массиве?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-hard-2',
    question: 'Что из перечисленного относится к реляционным СУБД?',
    options: ['MongoDB', 'Redis', 'PostgreSQL', 'Neo4j'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-hard-3',
    question: 'Какой алгоритм сортировки в среднем работает за O(n log n)?',
    options: ['Пузырьковая сортировка', 'Сортировка вставками', 'Быстрая сортировка', 'Сортировка выбором'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-hard-4',
    question: 'Что обозначает аббревиатура API?',
    options: ['Automated Program Interface', 'Application Programming Interface', 'Applied Protocol Integration', 'Advanced Program Instruction'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-hard-5',
    question: 'Какой HTTP-метод обычно используется для частичного обновления ресурса?',
    options: ['GET', 'POST', 'PATCH', 'DELETE'],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'Информатика',
    categoryId: 'informatics',
  },
  {
    id: 'informatics-hard-6',
    question: 'Что такое рекурсия?',
    options: ['Хранение данных в базе', 'Функция, вызывающая саму себя', 'Передача данных по сети', 'Метод шифрования'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Информатика',
    categoryId: 'informatics',
  },
];

const shuffle = <T,>(source: T[]): T[] => {
  const items = [...source];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

export const getCategoryById = (categoryId: CategoryId): QuizCategory =>
  QUIZ_CATEGORIES.find((category) => category.id === categoryId) ?? QUIZ_CATEGORIES[0];

export const createQuizSession = (settings: QuizSettings): Question[] => {
  const { categoryId, difficulty, questionCount } = settings;
  const targetCount = Math.max(1, questionCount);

  const byCategory = QUESTION_BANK.filter((question) => question.categoryId === categoryId);
  if (byCategory.length === 0) {
    return [];
  }

  const exactPool =
    difficulty === 'all'
      ? byCategory
      : byCategory.filter((question) => question.difficulty === difficulty);

  const exactPicked = shuffle(exactPool).slice(0, targetCount);
  if (exactPicked.length >= targetCount) {
    return exactPicked;
  }

  const usedIds = new Set(exactPicked.map((question) => question.id));
  const fallbackPool = shuffle(byCategory.filter((question) => !usedIds.has(question.id)));
  const need = targetCount - exactPicked.length;
  return [...exactPicked, ...fallbackPool.slice(0, need)];
};

export { QUESTION_BANK as QUESTIONS };
