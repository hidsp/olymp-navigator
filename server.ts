import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  reconcileGroundedResults,
  type RawGroundingChunk,
} from './src/utils/groundingParser.ts';
import {
  FORMAT_LABELS,
  LEVEL_LABELS,
  SUBJECT_LABELS,
} from './src/data/catalog.ts';
import type {
  DifficultyLevel,
  FormatType,
  Grade,
  LiveSearchResponse,
  Subject,
} from './src/types/olympiad.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

interface SearchRequestBody {
  query?: string;
  subject?: Subject | 'all';
  format?: FormatType | 'all';
  grade?: Grade | 'all';
  level?: DifficultyLevel | 'all';
}

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildSearchPrompt(body: SearchRequestBody): {
  userPrompt: string;
  systemInstruction: string;
  fallbackSubject: Subject;
} {
  const query = (body.query ?? '').trim();
  const subjectFilter =
    body.subject && body.subject !== 'all' ? body.subject : undefined;
  const formatFilter =
    body.format && body.format !== 'all' ? body.format : undefined;
  const gradeFilter =
    body.grade && body.grade !== 'all' ? body.grade : undefined;
  const levelFilter =
    body.level && body.level !== 'all' ? body.level : undefined;

  const filterLines: string[] = [];
  if (subjectFilter) {
    filterLines.push(`Предмет: ${SUBJECT_LABELS[subjectFilter]}`);
  }
  if (formatFilter) {
    filterLines.push(`Формат подготовки: ${FORMAT_LABELS[formatFilter]}`);
  }
  if (gradeFilter) {
    filterLines.push(`Класс: ${gradeFilter} класс`);
  }
  if (levelFilter) {
    filterLines.push(`Уровень: ${LEVEL_LABELS[levelFilter]}`);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const systemInstruction = [
    'Ты — экспертный поисковый ассистент по подготовке к школьным олимпиадам в России (ВсОШ и перечневые олимпиады РСОШ: «Высшая проба», Физтех, Всесиб, МОШ, Ломоносов, СПбГУ и др.).',
    `Текущая дата: ${todayStr}. Обязательно используй Google Search для поиска свежих, реально существующих и БЕСПЛАТНЫХ программ, открытых интенсивов, региональных центров по модели «Сириуса», университетских школ, кружков и открытых архивов заданий.`,
    'СТРОГИЕ ПРАВИЛА:',
    '1. Возвращай ТОЛЬКО реальные, проверенные URL-адреса, найденные в результатах Google Search. Категорически запрещено выдумывать ссылки или использовать шаблонные домены.',
    '2. Отбирай только бесплатные ресурсы и обязательно указывай точный статус доступа: "free-full" (бесплатно полностью), "free-selection" (бесплатно по отбору / конкурсу), "open-archive" (архив в открытом доступе).',
    '3. Верни ответ строго в формате валидного JSON без лишнего текста вне JSON-блока:',
    '{',
    '  "summary": "Краткая сводка в 1–2 предложениях о том, что найдено по запросу (на русском).",',
    '  "items": [',
    '    {',
    '      "title": "Точное название курса, интенсива или ресурса",',
    '      "organizer": "Вуз, платформа или центр (например: Сириус.Курсы, НИУ ВШЭ, МФТИ, Т-Образование, ЦПМ, СПбГУ)",',
    '      "subject": "math | physics | informatics | law | english",',
    '      "format": "online-course | intensive | archive | community",',
    '      "grades": [9, 10, 11],',
    '      "level": "basic | advanced | vseros",',
    '      "accessStatus": "free-full | free-selection | open-archive",',
    '      "description": "Конкретное описание программы, что входит и для каких олимпиад полезно (1–2 предложения).",',
    '      "url": "https://точная-реальная-ссылка-из-поиска",',
    '      "olympiads": ["ВсОШ", "Высшая проба"],',
    '      "deadlineHint": "Информация о наборе или сроках регистрации, если найдена в поиске (иначе пустая строка)"',
    '    }',
    '  ]',
    '}',
    'Найди от 4 до 6 наиболее релевантных, свежих и разных бесплатных ресурсов.',
  ].join('\n');

  const userPrompt = [
    `Запрос пользователя: ${query}`,
    filterLines.length > 0
      ? `Дополнительные фильтры:\n${filterLines.join('\n')}`
      : 'Дополнительные фильтры: не ограничены (9–11 классы, ВсОШ и РСОШ).',
    'Выполни живой поиск в Google Search и верни JSON с проверенными ссылками.',
  ].join('\n\n');

  return {
    userPrompt,
    systemInstruction,
    fallbackSubject: subjectFilter ?? 'math',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/search', async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as SearchRequestBody;
    const query = typeof body.query === 'string' ? body.query.trim() : '';

    if (query.length < 3) {
      res.status(400).json({
        error: 'Введите поисковый запрос длиной не менее 3 символов.',
      });
      return;
    }

    if (query.length > 400) {
      res.status(400).json({
        error: 'Поисковый запрос слишком длинный (максимум 400 символов).',
      });
      return;
    }

    const ai = createGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Ключ GEMINI_API_KEY не настроен на сервере. Добавьте его в настройках секретов (Settings > Secrets), чтобы активировать живой ИИ-поиск.',
      });
      return;
    }

    const { userPrompt, systemInstruction, fallbackSubject } =
      buildSearchPrompt(body);

    try {
      const executeSearch = (model: string, useLowThinking: boolean) =>
        ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
            ...(useLowThinking
              ? {
                  thinkingConfig: {
                    thinkingLevel: ThinkingLevel.LOW,
                  },
                }
              : {}),
          },
        });

      let response;
      try {
        response = await executeSearch('gemini-4-hydrogen', true);
      } catch (firstErr: unknown) {
        const msg = firstErr instanceof Error ? firstErr.message : '';
        if (
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('503') ||
          msg.includes('UNAVAILABLE')
        ) {
          // Fall back to Flash-Lite with Google Search Grounding when primary model quota is exhausted
          response = await executeSearch('gemini-3.1-flash-lite', false);
        } else {
          throw firstErr;
        }
      }

      const rawText = response.text ?? '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const groundingChunks = (groundingMetadata?.groundingChunks ??
        []) as RawGroundingChunk[];
      const searchQueries = Array.isArray(groundingMetadata?.webSearchQueries)
        ? groundingMetadata.webSearchQueries.filter(
            (q): q is string => typeof q === 'string' && q.trim().length > 0
          )
        : [];

      const reconciled = reconcileGroundedResults({
        rawText,
        groundingChunks,
        fallbackSubject,
      });

      const payload: LiveSearchResponse = {
        query,
        summary:
          reconciled.summary ||
          (reconciled.results.length > 0
            ? `Найдено ${reconciled.results.length} проверенных бесплатных ресурсов по вашему запросу.`
            : 'По запросу не удалось извлечь структурированные карточки, но доступны найденные источники Google Search ниже.'),
        results: reconciled.results,
        groundingSources: reconciled.groundingSources,
        searchQueries,
        searchedAt: new Date().toISOString(),
      };

      res.json(payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка сервиса';
      const status =
        message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
          ? 429
          : message.includes('403') || message.includes('PERMISSION_DENIED')
            ? 403
            : 502;

      console.error('[api/search] Gemini search error:', message);

      let userMessage =
        'Не удалось выполнить живой поиск через Gemini и Google Search. Попробуйте повторить запрос чуть позже.';
      if (status === 429) {
        userMessage =
          'Превышена квота Gemini API (или лимит бесплатного тарифа для Google Search Grounding). Подождите немного либо выберите API-ключ с подключённым биллингом в Settings > Secrets.';
      } else if (status === 403) {
        userMessage =
          'Ошибка доступа к Gemini API. Проверьте ключ GEMINI_API_KEY в Settings > Secrets.';
      }

      res.status(status).json({ error: userMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
