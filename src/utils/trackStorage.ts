import type {
  OlympiadResource,
  TrackedResource,
  TrackStatus,
} from '../types/olympiad';

export const TRACK_STORAGE_KEY = 'olymp-navigator-track-v1';
export const THEME_STORAGE_KEY = 'olymp-navigator-theme-v1';

export function toggleResourceInTrack(
  items: TrackedResource[],
  resource: OlympiadResource,
  nowIso: string = new Date().toISOString()
): TrackedResource[] {
  const exists = items.some((entry) => entry.resource.id === resource.id);
  if (exists) {
    return items.filter((entry) => entry.resource.id !== resource.id);
  }

  const newEntry: TrackedResource = {
    resource,
    status: 'planned',
    deadlineNote: resource.deadlineHint ?? '',
    savedAt: nowIso,
    updatedAt: nowIso,
  };

  return [newEntry, ...items];
}

export function updateTrackStatus(
  items: TrackedResource[],
  resourceId: string,
  status: TrackStatus,
  nowIso: string = new Date().toISOString()
): TrackedResource[] {
  return items.map((entry) =>
    entry.resource.id === resourceId
      ? { ...entry, status, updatedAt: nowIso }
      : entry
  );
}

export function updateTrackNote(
  items: TrackedResource[],
  resourceId: string,
  deadlineNote: string,
  nowIso: string = new Date().toISOString()
): TrackedResource[] {
  return items.map((entry) =>
    entry.resource.id === resourceId
      ? { ...entry, deadlineNote, updatedAt: nowIso }
      : entry
  );
}

export function removeFromTrack(
  items: TrackedResource[],
  resourceId: string
): TrackedResource[] {
  return items.filter((entry) => entry.resource.id !== resourceId);
}

export function getTrackStats(items: TrackedResource[]): {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
} {
  let planned = 0;
  let inProgress = 0;
  let completed = 0;

  for (const item of items) {
    if (item.status === 'planned') planned += 1;
    else if (item.status === 'in-progress') inProgress += 1;
    else if (item.status === 'completed') completed += 1;
  }

  return {
    total: items.length,
    planned,
    inProgress,
    completed,
  };
}

export function parseStoredTrack(raw: string | null): TrackedResource[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is TrackedResource =>
        Boolean(entry) &&
        typeof entry === 'object' &&
        Boolean(entry.resource) &&
        typeof entry.resource.id === 'string' &&
        typeof entry.resource.title === 'string' &&
        typeof entry.resource.url === 'string' &&
        (entry.status === 'planned' ||
          entry.status === 'in-progress' ||
          entry.status === 'completed')
    );
  } catch {
    return [];
  }
}

export function loadTrackFromStorage(): TrackedResource[] {
  if (typeof window === 'undefined') return [];
  try {
    return parseStoredTrack(window.localStorage.getItem(TRACK_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveTrackToStorage(items: TrackedResource[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TRACK_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors safely
  }
}
