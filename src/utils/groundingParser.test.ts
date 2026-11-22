import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractGroundingSources,
  extractJsonObjectFromText,
  reconcileGroundedResults,
} from './groundingParser';

test('extractGroundingSources deduplicates and filters invalid protocols', () => {
  const sources = extractGroundingSources([
    { web: { uri: 'https://edu.sirius.online/math', title: 'Сириус' } },
    { web: { uri: 'https://edu.sirius.online/math', title: 'Дубликат' } },
    { web: { uri: 'javascript:alert(1)', title: 'Bad' } },
    { web: { uri: 'https://www.olymp.hse.ru/mmo/law', title: 'ВШЭ Право' } },
  ]);

  assert.equal(sources.length, 2);
  assert.equal(sources[0].domain, 'edu.sirius.online');
  assert.equal(sources[1].domain, 'olymp.hse.ru');
});

test('extractJsonObjectFromText parses fenced and raw JSON payloads', () => {
  const fenced = 'Вот результаты:\n```json\n{"summary":"Ок","items":[{"title":"Курс"}]}\n```';
  const parsed = extractJsonObjectFromText(fenced);
  assert.equal(parsed?.summary, 'Ок');
  assert.equal(parsed?.items?.length, 1);
});

test('reconcileGroundedResults drops placeholder URLs and keeps grounded items', () => {
  const rawText = JSON.stringify({
    summary: 'Найдены свежие интенсивы по праву.',
    items: [
      {
        title: 'Интенсив ВШЭ по праву',
        organizer: 'НИУ ВШЭ',
        subject: 'law',
        format: 'intensive',
        grades: [10, 11],
        level: 'advanced',
        accessStatus: 'free-full',
        description: 'Открытый интенсив перед заключительным этапом.',
        url: 'https://olymp.hse.ru/mmo/law',
        olympiads: ['Высшая проба'],
      },
      {
        title: 'Фейковый курс',
        organizer: 'Неизвестно',
        subject: 'law',
        format: 'online-course',
        grades: [10],
        level: 'basic',
        accessStatus: 'free-full',
        description: 'Должен быть отброшен из-за example.com',
        url: 'https://example.com/fake',
        olympiads: ['ВсОШ'],
      },
    ],
  });

  const out = reconcileGroundedResults({
    rawText,
    groundingChunks: [
      {
        web: {
          uri: 'https://olymp.hse.ru/mmo/law',
          title: 'Олимпиада Высшая проба по праву',
        },
      },
    ],
    fallbackSubject: 'law',
  });

  assert.equal(out.results.length, 1);
  assert.equal(out.results[0].title, 'Интенсив ВШЭ по праву');
  assert.equal(out.results[0].verifiedDomain, 'olymp.hse.ru');
  assert.equal(out.results[0].accessStatus, 'free-full');
  assert.equal(out.groundingSources.length, 1);
});
