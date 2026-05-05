import {
  CategoryId,
  Difficulty,
  DifficultyFilter,
  Question,
  QuizCategory,
  QuizSettings,
} from '../types/quiz';

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'history',
    label: 'История Казахстана',
    icon: '🏛️',
    description: 'Ключевые события, личности и даты истории Казахстана.',
  },
  {
    id: 'english',
    label: 'Английский язык',
    icon: '🇬🇧',
    description: 'Грамматика, лексика и языковые конструкции школьного уровня.',
  },
  {
    id: 'informatics',
    label: 'Информатика',
    icon: '💻',
    description: 'Компьютерные системы, алгоритмы, сети и цифровая грамотность.',
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyFilter, string> = {
  all: 'Сбалансировано',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const MAX_SCORE_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 5,
  medium: 7,
  hard: 10,
};

export const WRONG_PENALTY_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: -10,
  medium: -15,
  hard: -20,
};

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  categoryId: 'history',
  difficulty: 'all',
  questionCount: 10,
};

const makeQuestion =
  (categoryId: CategoryId, category: string) =>
  (
    id: string,
    difficulty: Difficulty,
    question: string,
    options: string[],
    correctAnswer: number,
  ): Question => ({
    id,
    question,
    options,
    correctAnswer,
    difficulty,
    category,
    categoryId,
  });

const history = makeQuestion('history', 'История Казахстана');
const english = makeQuestion('english', 'Английский язык');
const informatics = makeQuestion('informatics', 'Информатика');

const historyQuestions: Question[] = [
  history('history-e-1', 'easy', 'В каком году Казахстан провозгласил независимость?', ['1989', '1991', '1993', '1995'], 1),
  history('history-e-2', 'easy', 'Кто был первым Президентом Республики Казахстан?', ['Нурсултан Назарбаев', 'Касым-Жомарт Токаев', 'Динмухамед Кунаев', 'Алихан Букейханов'], 0),
  history('history-e-3', 'easy', 'Какой город является столицей Казахстана сегодня?', ['Алматы', 'Шымкент', 'Астана', 'Караганда'], 2),
  history('history-e-4', 'easy', 'Как называется национальная валюта Казахстана?', ['Рубль', 'Сом', 'Тенге', 'Манат'], 2),
  history('history-e-5', 'easy', 'Какой язык имеет статус государственного в Казахстане?', ['Русский', 'Казахский', 'Английский', 'Узбекский'], 1),
  history('history-e-6', 'easy', 'Когда в Казахстане отмечают День Независимости?', ['1 декабря', '16 декабря', '22 марта', '30 августа'], 1),
  history('history-e-7', 'easy', 'В каком городе находится монумент "Байтерек"?', ['Астана', 'Алматы', 'Туркестан', 'Актобе'], 0),
  history('history-e-8', 'easy', 'В каком городе расположен мавзолей Ходжи Ахмеда Ясави?', ['Тараз', 'Туркестан', 'Кызылорда', 'Павлодар'], 1),
  history('history-e-9', 'easy', 'Кто написал роман-эпопею "Путь Абая"?', ['Сабит Муканов', 'Илияс Есенберлин', 'Мухтар Ауэзов', 'Олжас Сулейменов'], 2),
  history('history-e-10', 'easy', 'В каком году было образовано Казахское ханство?', ['1219', '1465', '1731', '1917'], 1),
  history('history-e-11', 'easy', 'Какой город был столицей Казахстана до переноса в Акмолу?', ['Семей', 'Алматы', 'Уральск', 'Костанай'], 1),
  history('history-e-12', 'easy', 'На какую дату чаще всего приходится празднование Наурыза?', ['1 января', '8 марта', '22 марта', '9 мая'], 2),
  history('history-e-13', 'easy', 'Какая из этих рек протекает по территории Казахстана?', ['Нил', 'Амазонка', 'Иртыш', 'Темза'], 2),
  history('history-e-14', 'easy', 'В какой области расположен космодром Байконур?', ['Мангистауская', 'Кызылординская', 'Восточно-Казахстанская', 'Акмолинская'], 1),

  history('history-m-1', 'medium', 'Какой хан сыграл ключевую роль в укреплении Казахского ханства в XVIII веке?', ['Абылай хан', 'Тауке хан', 'Керей хан', 'Касым хан'], 0),
  history('history-m-2', 'medium', 'В каком году была принята первая Конституция независимого Казахстана?', ['1991', '1993', '1995', '1998'], 1),
  history('history-m-3', 'medium', 'В каком году Казахстан стал членом ООН?', ['1991', '1992', '1994', '1996'], 1),
  history('history-m-4', 'medium', 'В каком году было создано правительство Алаш-Орда?', ['1905', '1916', '1917', '1920'], 2),
  history('history-m-5', 'medium', 'В каком году была принята действующая Конституция Республики Казахстан?', ['1993', '1995', '1997', '1999'], 1),
  history('history-m-6', 'medium', 'В каком году был официально закрыт Семипалатинский ядерный полигон?', ['1989', '1990', '1991', '1992'], 2),
  history('history-m-7', 'medium', 'Кто стал первым казахстанским космонавтом?', ['Талгат Мусабаев', 'Юрий Гагарин', 'Айдын Аимбетов', 'Токтар Аубакиров'], 3),
  history('history-m-8', 'medium', 'Какой современный город в царское время назывался Верный?', ['Петропавловск', 'Алматы', 'Кокшетау', 'Талдыкорган'], 1),
  history('history-m-9', 'medium', 'Какой древний город Южного Казахстана был важным центром Великого шелкового пути?', ['Тараз', 'Экибастуз', 'Риддер', 'Атырау'], 0),
  history('history-m-10', 'medium', 'Как называют события декабря 1986 года в Алма-Ате?', ['Жас тулпар', 'Желтоксан', 'Алаш', 'Орбулак'], 1),
  history('history-m-11', 'medium', 'Кто считается автором свода законов "Жеты Жаргы"?', ['Кенесары хан', 'Есим хан', 'Тауке хан', 'Абулхаир хан'], 2),
  history('history-m-12', 'medium', 'В каком году столица Казахстана была перенесена в Акмолу?', ['1995', '1997', '1998', '2001'], 1),
  history('history-m-13', 'medium', 'Как называлась кампания по освоению сельхозземель в Северном Казахстане в 1950-х?', ['Индустриализация', 'Перестройка', 'Целинная кампания', 'Коллективизация'], 2),
  history('history-m-14', 'medium', 'Кто стал первым президентом Академии наук Казахской ССР?', ['Шокан Уалиханов', 'Каныш Сатпаев', 'Ахмет Байтурсынов', 'Алькей Маргулан'], 1),

  history('history-h-1', 'hard', 'Какой казахский хан принял российское подданство в 1731 году?', ['Абылай хан', 'Абулхаир хан', 'Касым хан', 'Жангир хан'], 1),
  history('history-h-2', 'hard', 'В каком году Казахская АССР была преобразована в Казахскую ССР?', ['1925', '1936', '1941', '1954'], 1),
  history('history-h-3', 'hard', 'Кто является автором исторического труда "Тарих-и-Рашиди"?', ['Мухаммед Хайдар Дулати', 'Кадыргали Жалаири', 'Абулгази Бахадур', 'Ахмет Ясави'], 0),
  history('history-h-4', 'hard', 'В каком году началось восстание Кенесары Касымова?', ['1822', '1837', '1847', '1868'], 1),
  history('history-h-5', 'hard', 'Кто возглавил восстание 1916 года в Тургайской области?', ['Сырым Датулы', 'Исатай Тайманов', 'Амангельды Иманов', 'Байзак батыр'], 2),
  history('history-h-6', 'hard', 'Какой город был столицей Казахской АССР в 1925-1929 годах?', ['Оренбург', 'Кызылорда', 'Алма-Ата', 'Туркестан'], 1),
  history('history-h-7', 'hard', 'Как назывался крупнейший лагерь ГУЛАГа на территории Карагандинской области?', ['АЛЖИР', 'Карлаг', 'Степлаг', 'Песчанлаг'], 1),
  history('history-h-8', 'hard', 'В каком году был принят закон о государственных символах Республики Казахстан?', ['1991', '1992', '1993', '1995'], 1),
  history('history-h-9', 'hard', 'Кто возглавлял движение и партию "Алаш"?', ['Миржакып Дулатов', 'Алихан Букейханов', 'Мағжан Жумабаев', 'Жаханша Досмухамедов'], 1),
  history('history-h-10', 'hard', 'Какое государство историки чаще всего называют предшественником Казахского ханства в Дешт-и-Кыпчаке?', ['Ногайская Орда', 'Ак Орда', 'Крымское ханство', 'Тимуридская держава'], 1),
  history('history-h-11', 'hard', 'Войска какого противника были разгромлены в сражении при Анракае?', ['Калмыков', 'Кокандцев', 'Джунгар', 'Тимуридов'], 2),
  history('history-h-12', 'hard', 'Кто из просветителей XIX века написал "Киргизскую хрестоматию"?', ['Абай Кунанбаев', 'Ыбырай Алтынсарин', 'Шокан Уалиханов', 'Ахмет Байтурсынов'], 1),
  history('history-h-13', 'hard', 'В каком году был запущен первый национальный спутник связи KazSat-1?', ['2003', '2006', '2010', '2013'], 1),
  history('history-h-14', 'hard', 'В районе какого археологического памятника был найден "Золотой человек"?', ['Ботай', 'Тамгалы', 'Иссыкский курган', 'Отырар'], 2),
];

const englishQuestions: Question[] = [
  english('english-e-1', 'easy', 'Как переводится слово "book"?', ['Ручка', 'Книга', 'Стол', 'Окно'], 1),
  english('english-e-2', 'easy', 'Выберите правильную форму: "She ___ my friend."', ['am', 'are', 'is', 'be'], 2),
  english('english-e-3', 'easy', 'Антоним слова "hot" — это:', ['warm', 'cold', 'cool', 'sunny'], 1),
  english('english-e-4', 'easy', 'Множественное число слова "tooth":', ['tooths', 'teeth', 'toothes', 'toothes'], 1),
  english('english-e-5', 'easy', 'Какой день идет после Monday?', ['Sunday', 'Tuesday', 'Thursday', 'Friday'], 1),
  english('english-e-6', 'easy', 'Какого цвета обычно трава? (green)', ['Blue', 'Red', 'Green', 'Black'], 2),
  english('english-e-7', 'easy', 'Выберите верный вариант: "I ___ to school every day."', ['go', 'goes', 'went', 'going'], 0),
  english('english-e-8', 'easy', 'Дополните: "There ___ a cat on the sofa."', ['is', 'are', 'be', 'am'], 0),
  english('english-e-9', 'easy', 'Какое из слов является фруктом?', ['Carrot', 'Potato', 'Banana', 'Cucumber'], 2),
  english('english-e-10', 'easy', 'Сколько месяцев в году?', ['10', '11', '12', '13'], 2),
  english('english-e-11', 'easy', 'Выберите артикль: "My mother is ___ doctor."', ['a', 'an', 'the', '-'], 0),
  english('english-e-12', 'easy', 'Сравнительная степень слова "small":', ['more small', 'smaller', 'smallest', 'smalled'], 1),
  english('english-e-13', 'easy', 'Выберите подходящий глагол: "Can you ___ the door?"', ['opened', 'open', 'opens', 'opening'], 1),
  english('english-e-14', 'easy', 'Как переводится "Thank you"?', ['Пожалуйста', 'Привет', 'Спасибо', 'До свидания'], 2),

  english('english-m-1', 'medium', 'Прошедшая форма глагола "go":', ['goed', 'gone', 'went', 'going'], 2),
  english('english-m-2', 'medium', 'Формула Present Continuous:', ['am/is/are + verb-ing', 'have/has + V3', 'did + V1', 'will + V2'], 0),
  english('english-m-3', 'medium', 'Выберите верно: "If it rains, we ___ at home."', ['stayed', 'will stay', 'stay', 'would stay'], 1),
  english('english-m-4', 'medium', 'Дополните: "I have lived here ___ 2018."', ['for', 'since', 'from', 'at'], 1),
  english('english-m-5', 'medium', 'Какое предложение в Passive Voice?', ['Tom did the homework.', 'The homework was done by Tom.', 'Tom is doing the homework.', 'Tom has done the homework.'], 1),
  english('english-m-6', 'medium', 'Какой модальный глагол чаще используется для совета?', ['must', 'should', 'can', 'may'], 1),
  english('english-m-7', 'medium', 'Выберите верно: "He asked me where I ___ from."', ['am', 'is', 'was', 'were'], 2),
  english('english-m-8', 'medium', 'Какое предложение грамматически корректно?', ['Neither my brother nor my sister like coffee.', 'Neither my brother nor my sister likes coffee.', 'Neither my brother nor my sister liking coffee.', 'Neither my brother nor my sister are liking coffee.'], 1),
  english('english-m-9', 'medium', 'Прилагательное от слова "success":', ['successive', 'successful', 'successing', 'successness'], 1),
  english('english-m-10', 'medium', 'Дополните: "By the time we arrived, the film ___."', ['starts', 'started', 'had started', 'has started'], 2),
  english('english-m-11', 'medium', 'Значение phrasal verb "look after":', ['искать', 'заботиться о', 'смотреть вверх', 'встречать'], 1),
  english('english-m-12', 'medium', 'Какое существительное неисчисляемое?', ['apple', 'idea', 'information', 'book'], 2),
  english('english-m-13', 'medium', 'Конструкция "used to" чаще всего выражает:', ['будущее намерение', 'привычку в прошлом', 'обязательство', 'запрет'], 1),
  english('english-m-14', 'medium', 'Выберите правильный question tag: "You are coming, ___?"', ['isn’t you', 'aren’t you', 'don’t you', 'won’t you'], 1),

  english('english-h-1', 'hard', 'Выберите предложение с правильной инверсией после "Rarely":', ['Rarely I have seen such talent.', 'Rarely have I seen such talent.', 'Rarely I saw such talent.', 'Rarely did seen I such talent.'], 1),
  english('english-h-2', 'hard', 'Какой вариант соответствует Third Conditional?', ['If I know, I call you.', 'If I knew, I would call you.', 'If I had known, I would have called you.', 'If I have known, I will call you.'], 2),
  english('english-h-3', 'hard', 'Выберите корректный вариант Reported Speech: She said, "I am tired."', ['She said that she is tired.', 'She said that she was tired.', 'She told she was tired.', 'She said me she was tired.'], 1),
  english('english-h-4', 'hard', 'Какое предложение использует сослагательное наклонение?', ['If I was you, I apologize.', 'If I were you, I would apologize.', 'If I am you, I apologize.', 'If I be you, I apologize.'], 1),
  english('english-h-5', 'hard', 'Выберите правильную конструкцию с "No sooner ... than":', ['No sooner he arrived than it started raining.', 'No sooner had he arrived than it started raining.', 'No sooner did he arrived than it started raining.', 'No sooner had he arrived when it started raining.'], 1),
  english('english-h-6', 'hard', 'Идиома "once in a blue moon" означает:', ['очень часто', 'очень редко', 'вовремя', 'в последний момент'], 1),
  english('english-h-7', 'hard', 'Что означает "I remember meeting her at school"?', ['Я вспоминаю, что должен встретить ее', 'Я помню сам факт прошлой встречи', 'Я не встретил ее', 'Я планирую встретить ее'], 1),
  english('english-h-8', 'hard', 'Какое предложение является cleft sentence?', ['John solved the problem yesterday.', 'It was John who solved the problem.', 'John was solving the problem.', 'The problem solved John.'], 1),
  english('english-h-9', 'hard', 'Выберите корректную конструкцию с "Hardly ... when":', ['Hardly we had sat down when the bell rang.', 'Hardly had we sat down when the bell rang.', 'Hardly did we sat down when the bell rang.', 'Hardly had we sat down than the bell rang.'], 1),
  english('english-h-10', 'hard', 'Какой формальный синоним ближе всего к глаголу "get"?', ['take', 'obtain', 'catch', 'bring'], 1),
  english('english-h-11', 'hard', 'Выберите верно: "Despite ___ hard, they lost."', ['play', 'to play', 'playing', 'played'], 2),
  english('english-h-12', 'hard', 'Где используется reduced relative clause?', ['Students who live on campus must register.', 'Students living on campus must register.', 'Students live on campus must register.', 'Students to live on campus must register.'], 1),
  english('english-h-13', 'hard', 'Выберите корректное согласование: "Neither of the answers ___ correct."', ['are', 'were', 'is', 'be'], 2),
  english('english-h-14', 'hard', 'Выберите правильную конструкцию с "Scarcely ... when":', ['Scarcely I closed my eyes when the phone rang.', 'Scarcely had I closed my eyes when the phone rang.', 'Scarcely did I closed my eyes when the phone rang.', 'Scarcely had I closed my eyes than the phone rang.'], 1),
];

const informaticsQuestions: Question[] = [
  informatics('info-e-1', 'easy', 'Что означает сокращение CPU?', ['Central Processing Unit', 'Computer Primary Unit', 'Central Print Unit', 'Control Program Utility'], 0),
  informatics('info-e-2', 'easy', 'Какие цифры используются в двоичной системе?', ['0 и 1', '1 и 2', '2 и 3', '0 и 9'], 0),
  informatics('info-e-3', 'easy', 'Как называется память для временного хранения данных во время работы программ?', ['ROM', 'SSD', 'RAM', 'Cache Disk'], 2),
  informatics('info-e-4', 'easy', 'Клавиатура — это устройство...', ['вывода', 'ввода', 'хранения', 'охлаждения'], 1),
  informatics('info-e-5', 'easy', 'Какое расширение обычно у текстового файла?', ['.mp3', '.txt', '.png', '.exe'], 1),
  informatics('info-e-6', 'easy', 'Какой из вариантов является веб-браузером?', ['Chrome', 'Excel', 'Photoshop', 'PowerPoint'], 0),
  informatics('info-e-7', 'easy', 'Что такое алгоритм?', ['Случайный набор действий', 'Пошаговая инструкция решения задачи', 'Тип кабеля', 'Компьютерная игра'], 1),
  informatics('info-e-8', 'easy', 'Что означает WWW?', ['World Wide Web', 'Wide World Work', 'Web World Window', 'World Web Wire'], 0),
  informatics('info-e-9', 'easy', 'Сколько бит в одном байте?', ['4', '8', '16', '32'], 1),
  informatics('info-e-10', 'easy', 'Что из перечисленного является операционной системой?', ['Windows', 'Google', 'YouTube', 'HTML'], 0),
  informatics('info-e-11', 'easy', 'Какое сочетание клавиш обычно выполняет копирование?', ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'], 1),
  informatics('info-e-12', 'easy', 'Что такое облачное хранилище?', ['Флешка в кармане', 'Хранение данных на интернет-серверах', 'Папка на рабочем столе', 'Архив на CD'], 1),
  informatics('info-e-13', 'easy', 'Для чего нужен антивирус?', ['Для ускорения интернета', 'Для защиты от вредоносных программ', 'Для печати документов', 'Для установки игр'], 1),
  informatics('info-e-14', 'easy', 'Монитор является устройством...', ['ввода', 'вывода', 'ввода-вывода', 'питания'], 1),

  informatics('info-m-1', 'medium', 'Для чего нужен IP-адрес?', ['Для шифрования паролей', 'Для идентификации устройства в сети', 'Для форматирования диска', 'Для запуска игр'], 1),
  informatics('info-m-2', 'medium', 'Какой протокол используется для защищенного веб-соединения?', ['HTTP', 'FTP', 'HTTPS', 'SMTP'], 2),
  informatics('info-m-3', 'medium', 'Для чего чаще всего используется SQL?', ['Редактирование изображений', 'Работа с реляционными базами данных', 'Создание презентаций', 'Настройка BIOS'], 1),
  informatics('info-m-4', 'medium', 'Какой цикл сначала проверяет условие, а потом выполняет тело?', ['do...while', 'for...each', 'while', 'repeat...until'], 2),
  informatics('info-m-5', 'medium', 'Основная функция маршрутизатора (router):', ['Хранить резервные копии', 'Соединять сети и направлять пакеты', 'Печатать документы', 'Ускорять процессор'], 1),
  informatics('info-m-6', 'medium', 'Число 1010 в двоичной системе равно в десятичной:', ['8', '9', '10', '12'], 2),
  informatics('info-m-7', 'medium', 'Какой язык обычно относят к объектно-ориентированным?', ['HTML', 'Java', 'CSS', 'SQL'], 1),
  informatics('info-m-8', 'medium', 'Что такое debugging?', ['Создание дизайна интерфейса', 'Поиск и исправление ошибок в программе', 'Сжатие файлов', 'Удаление вирусов'], 1),
  informatics('info-m-9', 'medium', 'Что добавляет двухфакторная аутентификация (2FA)?', ['Второй монитор', 'Второй фактор проверки личности', 'Второй пароль Wi-Fi', 'Вторую учетную запись'], 1),
  informatics('info-m-10', 'medium', 'Для чего используется CSS в веб-разработке?', ['Для логики приложения', 'Для оформления и стилей страницы', 'Для работы с базой данных', 'Для шифрования трафика'], 1),
  informatics('info-m-11', 'medium', 'Рекурсия — это когда функция...', ['вызывает сама себя', 'работает только один раз', 'не принимает аргументы', 'используется только в HTML'], 0),
  informatics('info-m-12', 'medium', 'Что делает DNS?', ['Проверяет вирусы', 'Преобразует доменные имена в IP-адреса', 'Ускоряет процессор', 'Обновляет драйверы'], 1),
  informatics('info-m-13', 'medium', 'Какой инструмент наиболее известен для контроля версий?', ['Figma', 'Git', 'Photoshop', 'Power BI'], 1),
  informatics('info-m-14', 'medium', 'Сложность O(n) означает:', ['Постоянное время', 'Логарифмический рост', 'Линейный рост с размером входа', 'Квадратичный рост'], 2),

  informatics('info-h-1', 'hard', 'Что такое primary key в реляционной таблице?', ['Поле для хранения картинок', 'Уникальный идентификатор записи', 'Поле с паролем', 'Название таблицы'], 1),
  informatics('info-h-2', 'hard', 'Хеш-функция обычно возвращает:', ['Случайную строку переменной длины', 'Фиксированную по формату контрольную сумму', 'IP-адрес сервера', 'Исходный пароль'], 1),
  informatics('info-h-3', 'hard', 'Основная цель нормализации базы данных:', ['Увеличить размер таблиц', 'Уменьшить избыточность данных', 'Скрыть данные от пользователя', 'Добавить анимации'], 1),
  informatics('info-h-4', 'hard', 'Асимметричное шифрование использует:', ['Один общий ключ', 'Пару ключей: открытый и закрытый', 'Только пароль от Wi-Fi', 'Никакие ключи не нужны'], 1),
  informatics('info-h-5', 'hard', 'Какой HTTP-метод обычно используется для полной замены ресурса и является идемпотентным?', ['POST', 'PATCH', 'PUT', 'CONNECT'], 2),
  informatics('info-h-6', 'hard', 'Сложность бинарного поиска по отсортированному массиву:', ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], 1),
  informatics('info-h-7', 'hard', 'Виртуальная память — это:', ['Память видеокарты', 'Использование части диска как расширения RAM', 'Кэш браузера', 'Только память BIOS'], 1),
  informatics('info-h-8', 'hard', 'Deadlock в многопоточности — это ситуация, когда:', ['Потоки завершаются слишком быстро', 'Потоки ждут ресурсы друг друга и не продолжают работу', 'Память полностью свободна', 'Программа обновляет UI'], 1),
  informatics('info-h-9', 'hard', 'Чем компилятор в классическом виде отличается от интерпретатора?', ['Компилятор запускает код строка за строкой', 'Компилятор переводит программу целиком до выполнения', 'Интерпретатор всегда быстрее', 'Разницы нет'], 1),
  informatics('info-h-10', 'hard', 'Пакетная коммутация в сети означает, что данные:', ['Передаются одним непрерывным блоком без деления', 'Делятся на пакеты и маршрутизируются независимо', 'Передаются только по кабелю', 'Передаются только в локальной сети'], 1),
  informatics('info-h-11', 'hard', 'XSS-атака связана с:', ['Переполнением диска', 'Внедрением вредоносного скрипта в веб-страницу', 'Отказом питания сервера', 'Перегревом процессора'], 1),
  informatics('info-h-12', 'hard', 'Что такое sprint в Agile?', ['Годовой план разработки', 'Короткая фиксированная итерация разработки', 'Тип базы данных', 'Метод шифрования'], 1),
  informatics('info-h-13', 'hard', 'Какая структура данных работает по принципу LIFO?', ['Queue', 'Graph', 'Stack', 'Heap file'], 2),
  informatics('info-h-14', 'hard', 'Какое свойство является ключевым для RESTful API?', ['Состояние сессии обязательно хранится на сервере', 'Статус клиента хранится в cookies только', 'Отсутствие серверного состояния между запросами', 'Работа только через XML'], 2),
];

const QUESTION_BANK: Record<CategoryId, Question[]> = {
  history: historyQuestions,
  english: englishQuestions,
  informatics: informaticsQuestions,
};

export const QUESTIONS: Question[] = Object.values(QUESTION_BANK).flat();

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }
  return copy;
};

const pickRandom = <T,>(items: T[], count: number): T[] => shuffle(items).slice(0, count);

const pickBalancedQuestions = (questions: Question[], count: number): Question[] => {
  const groups = DIFFICULTIES.map((difficulty) =>
    questions.filter((question) => question.difficulty === difficulty),
  );

  const targetPerDifficulty = Math.floor(count / DIFFICULTIES.length);
  const picked: Question[] = groups.flatMap((group) => pickRandom(group, targetPerDifficulty));

  const remainingSlots = count - picked.length;
  if (remainingSlots <= 0) {
    return shuffle(picked).slice(0, count);
  }

  const pickedIds = new Set(picked.map((question) => question.id));
  const leftovers = questions.filter((question) => !pickedIds.has(question.id));
  return shuffle([...picked, ...pickRandom(leftovers, remainingSlots)]).slice(0, count);
};

export const getCategoryById = (categoryId: CategoryId): QuizCategory =>
  QUIZ_CATEGORIES.find((category) => category.id === categoryId) ?? QUIZ_CATEGORIES[0];

export const getQuestionsForCategory = (categoryId: CategoryId): Question[] =>
  QUESTION_BANK[categoryId] ?? [];

export const createQuizSession = (settings: QuizSettings): Question[] => {
  const categoryQuestions = getQuestionsForCategory(settings.categoryId);
  const requestedCount = Math.max(1, Math.min(settings.questionCount, categoryQuestions.length));

  if (settings.difficulty === 'all') {
    return pickBalancedQuestions(categoryQuestions, requestedCount);
  }

  const difficultyQuestions = categoryQuestions.filter(
    (question) => question.difficulty === settings.difficulty,
  );

  if (difficultyQuestions.length >= requestedCount) {
    return pickRandom(difficultyQuestions, requestedCount);
  }

  const fallback = categoryQuestions.filter((question) => question.difficulty !== settings.difficulty);
  return shuffle([...difficultyQuestions, ...pickRandom(fallback, requestedCount - difficultyQuestions.length)]).slice(0, requestedCount);
};
