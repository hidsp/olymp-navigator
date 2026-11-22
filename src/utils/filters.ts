import type { FilterState, OlympiadResource, Subject } from '../types/olympiad';
import {
  FORMAT_LABELS,
  LEVEL_LABELS,
  SUBJECT_LABELS,
} from '../data/catalog';

export const DEFAULT_FILTERS: FilterState = {
  subject: 'all',
  format: 'all',
  grade: 'all',
  level: 'all',
  localSearch: '',
};

export function filterResources(
  resources: OlympiadResource[],
  filters: FilterState
): OlympiadResource[] {
  const normalizedQuery = filters.localSearch.trim().toLowerCase();

  return resources.filter((item) => {
    if (filters.subject !== 'all' && item.subject !== filters.subject) {
      return false;
    }
    if (filters.format !== 'all' && item.format !== filters.format) {
      return false;
    }
    if (filters.grade !== 'all' && !item.grades.includes(filters.grade)) {
      return false;
    }
    if (filters.level !== 'all' && item.level !== filters.level) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const haystack = [
        item.title,
        item.organizer,
        item.description,
        SUBJECT_LABELS[item.subject],
        FORMAT_LABELS[item.format],
        LEVEL_LABELS[item.level],
        ...item.olympiads,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    }
    return true;
  });
}

export function countBySubject(
  resources: OlympiadResource[]
): Record<Subject | 'all', number> {
  const counts: Record<Subject | 'all', number> = {
    all: resources.length,
    math: 0,
    physics: 0,
    informatics: 0,
    law: 0,
    english: 0,
  };

  for (const item of resources) {
    counts[item.subject] += 1;
  }

  return counts;
}

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.subject !== 'all' ||
    filters.format !== 'all' ||
    filters.grade !== 'all' ||
    filters.level !== 'all' ||
    filters.localSearch.trim().length > 0
  );
}

export function buildQueryFromFilters(filters: FilterState): string {
  const parts: string[] = ['бесплатные'];

  if (filters.format !== 'all') {
    parts.push(FORMAT_LABELS[filters.format].toLowerCase());
  } else {
    parts.push('курсы и интенсивы');
  }

  if (filters.subject !== 'all') {
    parts.push(`по предмету «${SUBJECT_LABELS[filters.subject]}»`);
  } else {
    parts.push('для подготовки к олимпиадам ВсОШ и РСОШ');
  }

  if (filters.grade !== 'all') {
    parts.push(`${filters.grade} класс`);
  } else {
    parts.push('9–11 класс');
  }

  if (filters.level !== 'all') {
    parts.push(`уровень: ${LEVEL_LABELS[filters.level].toLowerCase()}`);
  }

  return parts.join(' ');
}

export function formatGradesRange(grades: number[]): string {
  if (grades.length === 0) return '9–11 кл.';
  const sorted = [...new Set(grades)].sort((a, b) => a - b);
  if (sorted.length === 1) return `${sorted[0]} кл.`;
  const isContiguous =
    sorted[sorted.length - 1] - sorted[0] === sorted.length - 1;
  if (isContiguous) {
    return `${sorted[0]}–${sorted[sorted.length - 1]} кл.`;
  }
  return `${sorted.join(', ')} кл.`;
}
