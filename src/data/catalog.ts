import type {
  AccessStatus,
  DifficultyLevel,
  FormatType,
  Grade,
  OlympiadResource,
  Subject,
  TrackStatus,
} from '../types/olympiad.ts';

export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Математика',
  physics: 'Физика',
  informatics: 'Информатика',
  law: 'Право',
  english: 'Английский язык',
};

export const SUBJECT_LIST: Subject[] = [
  'math',
  'physics',
  'informatics',
  'law',
  'english',
];

export const FORMAT_LABELS: Record<FormatType, string> = {
  'online-course': 'Бесплатные онлайн-курсы',
  intensive: 'Интенсивы, сборы и школы',
  archive: 'Архивы заданий и разборы',
  community: 'Сообщества, кружки и вебинары',
};

export const FORMAT_SHORT_LABELS: Record<FormatType, string> = {
  'online-course': 'Онлайн-курс',
  intensive: 'Интенсив / школа',
  archive: 'Архив и разборы',
  community: 'Кружок / вебинары',
};

export const FORMAT_LIST: FormatType[] = [
  'online-course',
  'intensive',
  'archive',
  'community',
];

export const GRADE_LIST: Grade[] = [9, 10, 11];

export const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  basic: 'Базовый олимпиадный',
  advanced: 'Продвинутый (РСОШ)',
  vseros: 'Всеросс (ВсОШ)',
};

export const LEVEL_LIST: DifficultyLevel[] = ['basic', 'advanced', 'vseros'];

export const ACCESS_STATUS_LABELS: Record<AccessStatus, string> = {
  'free-full': 'Бесплатно полностью',
  'free-selection': 'Бесплатно по отбору',
  'open-archive': 'Архив в открытом доступе',
};

export const TRACK_STATUS_LABELS: Record<TrackStatus, string> = {
  planned: 'В планах',
  'in-progress': 'Прохожу',
  completed: 'Пройдено',
};

export const QUICK_SEARCH_TAGS: Array<{
  label: string;
  query: string;
  subject?: Subject;
}> = [
  {
    label: 'Интенсив по праву 10 класс',
    query: 'бесплатный интенсив по олимпиадному праву для 10 класса ВсОШ Высшая проба',
    subject: 'law',
  },
  {
    label: 'Кружок по физике с нуля',
    query: 'бесплатный онлайн кружок по олимпиадной физике с нуля 9–10 класс Физтех',
    subject: 'physics',
  },
  {
    label: 'Сборы по алгоритмам C++',
    query: 'открытые бесплатные сборы и курсы по олимпиадной информатике C++ ВсОШ',
    subject: 'informatics',
  },
  {
    label: 'Подготовка к «Высшей пробе»',
    query: 'бесплатные вебинары и материалы ВШЭ Высшая проба математика право английский',
  },
  {
    label: 'Региональный этап по английскому',
    query: 'бесплатные разборы заданий и подготовка к региональному этапу ВсОШ по английскому языку',
    subject: 'english',
  },
  {
    label: 'Смены Сириуса и регионы',
    query: 'открытый набор на бесплатные олимпиадные смены Сириус и региональные центры 2026',
  },
];

export const CURATED_CATALOG: OlympiadResource[] = [
  // === МАТЕМАТИКА ===
  {
    id: 'curated-math-sirius',
    title: 'Дополнительные главы математики: геометрия, комбинаторика и теория чисел',
    organizer: 'Сириус.Курсы',
    subject: 'math',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-full',
    description:
      'Системные модули от тренеров сборной России с видеолекциями, конспектами и задачами с автоматической проверкой. Открываются потоками в течение учебного года.',
    url: 'https://edu.sirius.online/',
    olympiads: ['ВсОШ', 'Физтех', 'МОШ'],
    deadlineHint: 'Набор открывается волнами каждые 1–2 месяца',
    sourceOrigin: 'curated',
    verifiedDomain: 'edu.sirius.online',
  },
  {
    id: 'curated-math-tbank',
    title: 'Олимпиадный кружок по математике для старшеклассников',
    organizer: 'Т-Образование',
    subject: 'math',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'free-selection',
    description:
      'Годовая онлайн-программа с еженедельными живыми занятиями, сдачей устных и письменных листков преподавателям и подготовкой к региональному и заключительному этапам.',
    url: 'https://education.tbank.ru/school/olympiads/',
    olympiads: ['ВсОШ', 'МОШ', 'Всесиб'],
    deadlineHint: 'Отборочный контест проходит в начале осени и зимой',
    sourceOrigin: 'curated',
    verifiedDomain: 'education.tbank.ru',
  },
  {
    id: 'curated-math-zftsh',
    title: 'Заочная физико-техническая школа (ЗФТШ) — отделение математики',
    organizer: 'МФТИ',
    subject: 'math',
    format: 'intensive',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-selection',
    description:
      'Методические пособия от преподавателей Физтеха, регулярные задания на проверку и разбор типовых идей олимпиады «Физтех» и перечневых олимпиад I уровня.',
    url: 'https://zftsh.online/',
    olympiads: ['Физтех', 'Ломоносов', 'Росатом'],
    deadlineHint: 'Приём заявок обычно открыт с февраля по май',
    sourceOrigin: 'curated',
    verifiedDomain: 'zftsh.online',
  },
  {
    id: 'curated-math-vos-archive',
    title: 'Архив заданий, критериев и видеоразборов ВсОШ и МОШ по математике',
    organizer: 'ЦПМ / ВсОШ Москва',
    subject: 'math',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'open-archive',
    description:
      'Полная подборка вариантов школьного, муниципального, регионального и заключительного этапов с официальными решениями и разборами жюри.',
    url: 'https://vos.olimpiada.ru/',
    olympiads: ['ВсОШ', 'МОШ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'vos.olimpiada.ru',
  },
  {
    id: 'curated-math-mipt-webinars',
    title: 'Открытый банк задач и вебинары подготовки к олимпиаде «Физтех»',
    organizer: 'МФТИ',
    subject: 'math',
    format: 'community',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'free-full',
    description:
      'Бесплатные тематические вебинары перед отборочным и заключительным турами, разборы параметров, стереометрии и планиметрии прошлых лет.',
    url: 'https://olymp-online.mipt.ru/',
    olympiads: ['Физтех'],
    sourceOrigin: 'curated',
    verifiedDomain: 'olymp-online.mipt.ru',
  },

  // === ФИЗИКА ===
  {
    id: 'curated-phys-sirius',
    title: 'Дополнительные главы физики: механика, термодинамика и электродинамика',
    organizer: 'Сириус.Курсы',
    subject: 'physics',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-full',
    description:
      'Последовательные курсы для глубокого понимания физической модели, анализа размерностей, кинематических связей и нестандартных цепей.',
    url: 'https://edu.sirius.online/',
    olympiads: ['ВсОШ', 'Физтех', 'МОШ'],
    deadlineHint: 'Свободная регистрация в период набора потока',
    sourceOrigin: 'curated',
    verifiedDomain: 'edu.sirius.online',
  },
  {
    id: 'curated-phys-tbank',
    title: 'Олимпиадный курс по физике: теория и экспериментальный подход',
    organizer: 'Т-Образование',
    subject: 'physics',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'free-selection',
    description:
      'Занятия с призёрами международных олимпиад и тренерами сборных, еженедельные подборки задач уровня региона и финала ВсОШ.',
    url: 'https://education.tbank.ru/school/olympiads/',
    olympiads: ['ВсОШ', 'Физтех', 'Росатом'],
    deadlineHint: 'Вступительное тестирование перед стартом семестра',
    sourceOrigin: 'curated',
    verifiedDomain: 'education.tbank.ru',
  },
  {
    id: 'curated-phys-zftsh',
    title: 'ЗФТШ МФТИ и открытые олимпиадные школы по физике',
    organizer: 'МФТИ',
    subject: 'physics',
    format: 'intensive',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-selection',
    description:
      'Классическая школа физтеховской подготовки: разбор олимпиадных методов механики, оптики и электричества с проверкой решений наставниками.',
    url: 'https://zftsh.online/',
    olympiads: ['Физтех', 'ВсОШ', 'Ломоносов'],
    sourceOrigin: 'curated',
    verifiedDomain: 'zftsh.online',
  },
  {
    id: 'curated-phys-mathus',
    title: 'Открытый архив олимпиадных задач и конспектов по физике',
    organizer: 'Mathus / открытый архив',
    subject: 'physics',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'open-archive',
    description:
      'Структурированный рубрикатор задач Физтеха, МОШ, Ломоносова, Росатома и ВсОШ по темам с краткими конспектами и ответами для самопроверки.',
    url: 'https://mathus.ru/phys/',
    olympiads: ['Физтех', 'МОШ', 'Ломоносов', 'ВсОШ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'mathus.ru',
  },
  {
    id: 'curated-phys-spbu',
    title: 'Открытый лекторий и вебинары Олимпиады школьников СПбГУ по физике',
    organizer: 'СПбГУ',
    subject: 'physics',
    format: 'community',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-full',
    description:
      'Записи консультаций методической комиссии СПбГУ, разборы сложных экспериментальных и виртуальных лабораторных заданий прошлых лет.',
    url: 'https://olympiada.spbu.ru/',
    olympiads: ['СПбГУ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'olympiada.spbu.ru',
  },

  // === ИНФОРМАТИКА ===
  {
    id: 'curated-info-tbank',
    title: 'Алгоритмы и структуры данных (параллели C, B, B′, A)',
    organizer: 'Т-Образование',
    subject: 'informatics',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'free-selection',
    description:
      'Один из сильнейших бесплатных онлайн-кружков страны: лекции, еженедельные контесты на ejudge/Codeforces и код-ревью от тренеров.',
    url: 'https://education.tbank.ru/school/algorithms/',
    olympiads: ['ВсОШ', 'Технокубок', 'Высшая проба', 'ВКОШП'],
    deadlineHint: 'Отборочный контест проводится в августе–сентябре',
    sourceOrigin: 'curated',
    verifiedDomain: 'education.tbank.ru',
  },
  {
    id: 'curated-info-sirius',
    title: 'Введение в программирование (C++ / Python) и олимпиадные алгоритмы',
    organizer: 'Сириус.Курсы',
    subject: 'informatics',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'free-full',
    description:
      'Пошаговый старт в спортивное программирование: динамическое программирование, графы, бинарный поиск и тренировочные задачи со встроенным тестированием.',
    url: 'https://edu.sirius.online/',
    olympiads: ['ВсОШ', 'МОШ', 'ИОИП'],
    sourceOrigin: 'curated',
    verifiedDomain: 'edu.sirius.online',
  },
  {
    id: 'curated-info-yandex',
    title: 'Тренировки по алгоритмам и открытые интенсивы по информатике',
    organizer: 'Яндекс Образование',
    subject: 'informatics',
    format: 'intensive',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-full',
    description:
      'Серии бесплатных открытых лекций с разбором классических алгоритмических приёмов и контестами в Яндекс Контесте для отработки скорости.',
    url: 'https://yandex.ru/yaintern/algorithm-training',
    olympiads: ['ВсОШ', 'Открытая олимпиада', 'Высшая проба'],
    sourceOrigin: 'curated',
    verifiedDomain: 'yandex.ru',
  },
  {
    id: 'curated-info-cf-edu',
    title: 'Codeforces EDU: курсы ИТМО по алгоритмам и архив олимпиадных задач',
    organizer: 'Codeforces / ИТМО',
    subject: 'informatics',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'open-archive',
    description:
      'Бесплатный учебный раздел с теорией и тематическими тренажёрами по дереву отрезков, суффиксным массивам, СНМ и двум указателям.',
    url: 'https://codeforces.com/edu/courses',
    olympiads: ['ВсОШ', 'ВКОШП', 'ИОИП'],
    sourceOrigin: 'curated',
    verifiedDomain: 'codeforces.com',
  },
  {
    id: 'curated-info-stepik',
    title: 'Открытые курсы по C++, алгоритмам и структурам данных',
    organizer: 'Stepik',
    subject: 'informatics',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'free-full',
    description:
      'Десятки бесплатных курсов от Computer Science Center и вузов с автоматической тестирующей системой и форумом обсуждения решений.',
    url: 'https://stepik.org/catalog',
    olympiads: ['ВсОШ', 'МОШ', 'СПбГУ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'stepik.org',
  },

  // === ПРАВО ===
  {
    id: 'curated-law-hse',
    title: 'Подготовка к олимпиаде «Высшая проба» по праву: архивы и методичка',
    organizer: 'НИУ ВШЭ',
    subject: 'law',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'open-archive',
    description:
      'Официальные демоверсии, задания прошлых лет, ключи, перечень нормативных актов и рекомендации факультета права НИУ ВШЭ.',
    url: 'https://olymp.hse.ru/mmo/law',
    olympiads: ['Высшая проба'],
    deadlineHint: 'Регистрация на олимпиаду открывается осенью',
    sourceOrigin: 'curated',
    verifiedDomain: 'olymp.hse.ru',
  },
  {
    id: 'curated-law-vos-cpm',
    title: 'Архив этапов ВсОШ по праву и методические материалы ЦПМ',
    organizer: 'ЦПМ / ВсОШ',
    subject: 'law',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'open-archive',
    description:
      'Банк правовых казусов, задач на латинские юридические выражения, тестов по отраслям права и официальных критериев оценивания ВсОШ.',
    url: 'https://vos.olimpiada.ru/',
    olympiads: ['ВсОШ', 'МОШ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'vos.olimpiada.ru',
  },
  {
    id: 'curated-law-msu',
    title: 'Олимпиада «Ломоносов» по праву: разборы заданий и список литературы',
    organizer: 'МГУ им. М. В. Ломоносова',
    subject: 'law',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'open-archive',
    description:
      'Архив олимпиадных работ юридического факультета МГУ, тренировочные задания по теории государства и права и конституционному праву.',
    url: 'https://olymp.msu.ru/',
    olympiads: ['Ломоносов'],
    sourceOrigin: 'curated',
    verifiedDomain: 'olymp.msu.ru',
  },
  {
    id: 'curated-law-spbu',
    title: 'Вебинары и консультации Олимпиады школьников СПбГУ по праву',
    organizer: 'СПбГУ',
    subject: 'law',
    format: 'community',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'free-full',
    description:
      'Открытые онлайн-встречи с составителями заданий, разбор типовых ошибок при решении правовых задач и аргументации позиции.',
    url: 'https://olympiada.spbu.ru/',
    olympiads: ['СПбГУ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'olympiada.spbu.ru',
  },
  {
    id: 'curated-law-sirius-regions',
    title: 'Региональные центры по модели «Сириуса»: профильные смены по праву',
    organizer: 'Сеть региональных центров Сириуса',
    subject: 'law',
    format: 'intensive',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'free-selection',
    description:
      'Очные и дистанционные бесплатные интенсивные сборы перед региональным этапом ВсОШ в центрах выявления талантов в регионах РФ.',
    url: 'https://sochisirius.ru/obuchenie/partners',
    olympiads: ['ВсОШ', 'Кутафинская', 'Высшая проба'],
    deadlineHint: 'Отбор по результатам школьного/муниципального этапа',
    sourceOrigin: 'curated',
    verifiedDomain: 'sochisirius.ru',
  },

  // === АНГЛИЙСКИЙ ЯЗЫК ===
  {
    id: 'curated-eng-hse',
    title: 'Материалы подготовки к «Высшей пробе» по иностранным языкам',
    organizer: 'НИУ ВШЭ',
    subject: 'english',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'open-archive',
    description:
      'Комплекты заданий прошлых лет, образцы письменных работ уровня C1–C2, задания на лексико-грамматическую трансформацию и страноведение.',
    url: 'https://olymp.hse.ru/mmo/lang',
    olympiads: ['Высшая проба'],
    sourceOrigin: 'curated',
    verifiedDomain: 'olymp.hse.ru',
  },
  {
    id: 'curated-eng-vos',
    title: 'Архив заданий, аудиозаписей и разборов ВсОШ по английскому языку',
    organizer: 'ЦПМ / ВсОШ Москва',
    subject: 'english',
    format: 'archive',
    grades: [9, 10, 11],
    level: 'vseros',
    accessStatus: 'open-archive',
    description:
      'Все разделы ВсОШ: Listening, Reading, Use of English, лингвострановедение, Writing и Speaking с подробными ключами и комментариями жюри.',
    url: 'https://vos.olimpiada.ru/',
    olympiads: ['ВсОШ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'vos.olimpiada.ru',
  },
  {
    id: 'curated-eng-foxford',
    title: 'Открытые бесплатные интенсивы и разборы олимпиад по английскому',
    organizer: 'Фоксфорд',
    subject: 'english',
    format: 'intensive',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'free-full',
    description:
      'Сезонные бесплатные вебинары, открытая неделя подготовки к отборочным турам и разборы олимпиадных эссе и творческих заданий.',
    url: 'https://foxford.ru/olympiads',
    olympiads: ['ВсОШ', 'Ломоносов', 'Высшая проба'],
    sourceOrigin: 'curated',
    verifiedDomain: 'foxford.ru',
  },
  {
    id: 'curated-eng-lektorium',
    title: 'Открытые курсы академического письма и лингвистики',
    organizer: 'Лекториум',
    subject: 'english',
    format: 'online-course',
    grades: [9, 10, 11],
    level: 'basic',
    accessStatus: 'free-full',
    description:
      'Бесплатные видеокурсы от преподавателей российских университетов для прокачки академической лексики, чтения и аргументации.',
    url: 'https://www.lektorium.tv/',
    olympiads: ['Высшая проба', 'СПбГУ', 'МОШ'],
    sourceOrigin: 'curated',
    verifiedDomain: 'lektorium.tv',
  },
  {
    id: 'curated-eng-olimpiada-portal',
    title: 'Календарь, разборы и сообщества олимпиадников по английскому языку',
    organizer: 'Олимпиада.ру',
    subject: 'english',
    format: 'community',
    grades: [9, 10, 11],
    level: 'advanced',
    accessStatus: 'free-full',
    description:
      'Актуальное расписание всех перечневых олимпиад РСОШ по английскому языку, новости регистрации, советы призёров и ссылки на открытые разборы.',
    url: 'https://olimpiada.ru/',
    olympiads: ['ВсОШ', 'Высшая проба', 'Ломоносов', 'СПбГУ', 'Всесиб'],
    sourceOrigin: 'curated',
    verifiedDomain: 'olimpiada.ru',
  },
];
