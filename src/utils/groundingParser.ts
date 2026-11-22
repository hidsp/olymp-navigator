import type {
  AccessStatus,
  DifficultyLevel,
  FormatType,
  Grade,
  GroundingSource,
  OlympiadResource,
  Subject,
} from '../types/olympiad.ts';

export interface RawGroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

interface RawAiItem {
  title?: unknown;
  organizer?: unknown;
  subject?: unknown;
  format?: unknown;
  grades?: unknown;
  level?: unknown;
  accessStatus?: unknown;
  description?: unknown;
  url?: unknown;
  olympiads?: unknown;
  deadlineHint?: unknown;
  sourceIndex?: unknown;
}

export function extractSafeDomain(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return null;
  }
}

export function extractGroundingSources(
  chunks?: RawGroundingChunk[] | null
): GroundingSource[] {
  if (!Array.isArray(chunks)) return [];
  const seen = new Set<string>();
  const sources: GroundingSource[] = [];

  for (const chunk of chunks) {
    const uri = chunk?.web?.uri?.trim();
    if (!uri) continue;
    const domain = extractSafeDomain(uri);
    if (!domain) continue;
    if (seen.has(uri)) continue;
    seen.add(uri);
    sources.push({
      title: (chunk.web?.title || domain).trim(),
      uri,
      domain,
    });
  }

  return sources;
}

export function normalizeSubject(
  value: unknown,
  fallback: Subject = 'math'
): Subject {
  if (typeof value !== 'string') return fallback;
  const v = value.toLowerCase().trim();
  if (v === 'math' || v.includes('матем')) return 'math';
  if (v === 'physics' || v.includes('физик')) return 'physics';
  if (
    v === 'informatics' ||
    v.includes('информ') ||
    v.includes('программ') ||
    v.includes('алгоритм')
  ) {
    return 'informatics';
  }
  if (v === 'law' || v.includes('прав') || v.includes('юрид')) return 'law';
  if (v === 'english' || v.includes('англ') || v.includes('english')) {
    return 'english';
  }
  return fallback;
}

export function normalizeFormat(value: unknown): FormatType {
  if (typeof value !== 'string') return 'online-course';
  const v = value.toLowerCase().trim();
  if (
    v === 'archive' ||
    v.includes('архив') ||
    v.includes('разбор') ||
    v.includes('тренаж') ||
    v.includes('задан')
  ) {
    return 'archive';
  }
  if (
    v === 'intensive' ||
    v.includes('интенсив') ||
    v.includes('сбор') ||
    v.includes('школ') ||
    v.includes('смен')
  ) {
    return 'intensive';
  }
  if (
    v === 'community' ||
    v.includes('сообществ') ||
    v.includes('кружок') ||
    v.includes('вебинар') ||
    v.includes('клуб')
  ) {
    return 'community';
  }
  return 'online-course';
}

export function normalizeLevel(value: unknown): DifficultyLevel {
  if (typeof value !== 'string') return 'advanced';
  const v = value.toLowerCase().trim();
  if (v === 'vseros' || v.includes('всерос') || v.includes('всош')) {
    return 'vseros';
  }
  if (v === 'basic' || v.includes('базов') || v.includes('нуля') || v.includes('начин')) {
    return 'basic';
  }
  return 'advanced';
}

export function normalizeAccessStatus(value: unknown): AccessStatus {
  if (typeof value !== 'string') return 'free-full';
  const v = value.toLowerCase().trim();
  if (v === 'free-selection' || v.includes('отбор') || v.includes('конкурс')) {
    return 'free-selection';
  }
  if (v === 'open-archive' || v.includes('архив') || v.includes('открыт')) {
    return 'open-archive';
  }
  return 'free-full';
}

export function normalizeGrades(value: unknown): Grade[] {
  if (!Array.isArray(value)) return [9, 10, 11];
  const valid = value
    .map((n) => Number(n))
    .filter((n): n is Grade => n === 9 || n === 10 || n === 11);
  if (valid.length === 0) return [9, 10, 11];
  return [...new Set(valid)].sort((a, b) => a - b) as Grade[];
}

export function extractJsonObjectFromText(text: string): {
  summary?: string;
  items?: RawAiItem[];
} | null {
  if (!text || !text.trim()) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text.trim();

  const tryParse = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return { items: parsed as RawAiItem[] };
      }
      if (parsed && typeof parsed === 'object') {
        return parsed as { summary?: string; items?: RawAiItem[] };
      }
      return null;
    } catch {
      return null;
    }
  };

  const direct = tryParse(candidate);
  if (direct) return direct;

  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const sliced = tryParse(candidate.slice(firstBrace, lastBrace + 1));
    if (sliced) return sliced;
  }

  const firstBracket = candidate.indexOf('[');
  const lastBracket = candidate.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const sliced = tryParse(candidate.slice(firstBracket, lastBracket + 1));
    if (sliced) return sliced;
  }

  return null;
}

function isPlaceholderUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('example.com') ||
    lower.includes('placeholder') ||
    lower.includes('localhost') ||
    lower.includes('your-site')
  );
}

function resolveGroundedUrl(
  rawUrl: unknown,
  title: string,
  organizer: string,
  groundingSources: GroundingSource[]
): { url: string; domain: string } | null {
  const candidate = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  const candidateDomain = candidate ? extractSafeDomain(candidate) : null;

  if (groundingSources.length > 0) {
    if (candidate && candidateDomain && !isPlaceholderUrl(candidate)) {
      // Exact URI match in grounding chunks
      const exact = groundingSources.find((s) => s.uri === candidate);
      if (exact) {
        return { url: exact.uri, domain: exact.domain };
      }
      // Same domain match in grounding chunks (often Gemini returns canonical URL while chunk has redirect/page URI)
      const sameDomain = groundingSources.find(
        (s) => s.domain === candidateDomain
      );
      if (sameDomain) {
        return { url: candidate, domain: candidateDomain };
      }
    }

    // Try matching grounding source by organizer or title keywords
    const tokens = `${organizer} ${title}`
      .toLowerCase()
      .split(/[\s,.;:«»"()/-]+/)
      .filter((t) => t.length >= 4);

    for (const source of groundingSources) {
      const sourceText = `${source.title} ${source.domain}`.toLowerCase();
      if (tokens.some((tok) => sourceText.includes(tok))) {
        return { url: source.uri, domain: source.domain };
      }
    }
  }

  // If no grounding chunks matched directly but URL is a clean non-placeholder http(s) URL
  if (candidate && candidateDomain && !isPlaceholderUrl(candidate)) {
    return { url: candidate, domain: candidateDomain };
  }

  return null;
}

export function reconcileGroundedResults(params: {
  rawText: string;
  groundingChunks?: RawGroundingChunk[] | null;
  fallbackSubject?: Subject;
}): {
  summary: string;
  results: OlympiadResource[];
  groundingSources: GroundingSource[];
} {
  const groundingSources = extractGroundingSources(params.groundingChunks);
  const parsed = extractJsonObjectFromText(params.rawText);

  const summary =
    typeof parsed?.summary === 'string' && parsed.summary.trim().length > 0
      ? parsed.summary.trim()
      : '';

  const rawItems = Array.isArray(parsed?.items) ? parsed.items : [];
  const results: OlympiadResource[] = [];
  const seenKeys = new Set<string>();

  for (let i = 0; i < rawItems.length; i += 1) {
    const item = rawItems[i];
    const title = typeof item?.title === 'string' ? item.title.trim() : '';
    const organizer =
      typeof item?.organizer === 'string' ? item.organizer.trim() : '';
    const description =
      typeof item?.description === 'string' ? item.description.trim() : '';

    if (!title || !description) continue;

    const resolved = resolveGroundedUrl(
      item.url,
      title,
      organizer,
      groundingSources
    );
    if (!resolved) continue;

    const dedupeKey = `${title.toLowerCase()}|${resolved.domain}`;
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);

    const olympiads = Array.isArray(item.olympiads)
      ? item.olympiads
          .filter((o): o is string => typeof o === 'string' && o.trim().length > 0)
          .map((o) => o.trim())
          .slice(0, 5)
      : ['ВсОШ'];

    results.push({
      id: `ai-${Date.now()}-${i}-${resolved.domain.replace(/[^a-z0-9]/g, '')}`,
      title,
      organizer: organizer || resolved.domain,
      subject: normalizeSubject(item.subject, params.fallbackSubject ?? 'math'),
      format: normalizeFormat(item.format),
      grades: normalizeGrades(item.grades),
      level: normalizeLevel(item.level),
      accessStatus: normalizeAccessStatus(item.accessStatus),
      description,
      url: resolved.url,
      olympiads: olympiads.length > 0 ? olympiads : ['ВсОШ'],
      deadlineHint:
        typeof item.deadlineHint === 'string' && item.deadlineHint.trim()
          ? item.deadlineHint.trim()
          : undefined,
      sourceOrigin: 'ai-search',
      verifiedDomain: resolved.domain,
    });
  }

  return {
    summary,
    results,
    groundingSources,
  };
}
