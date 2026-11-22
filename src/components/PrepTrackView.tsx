import { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import {
  ACCESS_STATUS_LABELS,
  FORMAT_SHORT_LABELS,
  LEVEL_LABELS,
  SUBJECT_LABELS,
  TRACK_STATUS_LABELS,
} from '../data/catalog';
import type { TrackedResource, TrackStatus } from '../types/olympiad';
import { formatGradesRange } from '../utils/filters';
import { getTrackStats } from '../utils/trackStorage';

interface PrepTrackViewProps {
  items: TrackedResource[];
  onUpdateStatus: (resourceId: string, status: TrackStatus) => void;
  onUpdateNote: (resourceId: string, note: string) => void;
  onRemove: (resourceId: string) => void;
  onGoToCatalog: () => void;
}

const STATUS_OPTIONS: TrackStatus[] = ['planned', 'in-progress', 'completed'];

export function PrepTrackView({
  items,
  onUpdateStatus,
  onUpdateNote,
  onRemove,
  onGoToCatalog,
}: PrepTrackViewProps) {
  const [statusFilter, setStatusFilter] = useState<TrackStatus | 'all'>('all');
  const stats = getTrackStats(items);

  const visibleItems =
    statusFilter === 'all'
      ? items
      : items.filter((entry) => entry.status === statusFilter);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Мой трек подготовки
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Сохранённые курсы, интенсивы и архивы хранятся локально в вашем
            браузере. Отмечайте прогресс и фиксируйте дедлайны регистрации.
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToCatalog}
          className="inline-flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Вернуться в каталог</span>
        </button>
      </div>

      {/* Tabular Summary Strip */}
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-800">
        <div className="bg-white p-4 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Всего в треке
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {stats.total}
          </div>
        </div>
        <div className="bg-white p-4 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            В планах
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {stats.planned}
          </div>
        </div>
        <div className="bg-white p-4 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Прохожу
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-blue-700 dark:text-blue-400">
            {stats.inProgress}
          </div>
        </div>
        <div className="bg-white p-4 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Пройдено
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
            {stats.completed}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
          <Bookmark
            className="mx-auto h-9 w-9 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Ваш трек подготовки пока пуст
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Нажмите «В избранное» на любой карточке курса или результата
            ИИ-поиска, чтобы отслеживать статус и сроки регистрации.
          </p>
          <button
            type="button"
            onClick={onGoToCatalog}
            className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Перейти в каталог курсов
          </button>
        </div>
      ) : (
        <>
          {/* Status Filter Segmented Controls */}
          <div className="mt-6 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              aria-pressed={statusFilter === 'all'}
              className={`h-9 cursor-pointer whitespace-nowrap rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Все ({stats.total})
            </button>
            {STATUS_OPTIONS.map((status) => {
              const count =
                status === 'planned'
                  ? stats.planned
                  : status === 'in-progress'
                    ? stats.inProgress
                    : stats.completed;
              const selected = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  aria-pressed={selected}
                  className={`h-9 cursor-pointer whitespace-nowrap rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    selected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {TRACK_STATUS_LABELS[status]} ({count})
                </button>
              );
            })}
          </div>

          {/* Saved List */}
          {visibleItems.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Нет ресурсов со статусом «{TRACK_STATUS_LABELS[statusFilter as TrackStatus]}».
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {visibleItems.map((entry) => {
                const { resource } = entry;
                const noteId = `deadline-note-${resource.id}`;
                const statusSelectId = `track-status-${resource.id}`;

                return (
                  <article
                    key={resource.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        {/* Unboxed metadata line */}
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {SUBJECT_LABELS[resource.subject]}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{FORMAT_SHORT_LABELS[resource.format]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {formatGradesRange(resource.grades)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{LEVEL_LABELS[resource.level]}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ACCESS_STATUS_LABELS[resource.accessStatus]}</span>
                        </div>

                        <h2 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                          {resource.title}
                        </h2>
                        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                          {resource.organizer}
                          {resource.olympiads.length > 0 &&
                            ` / ${resource.olympiads.join(', ')}`}
                        </p>
                      </div>

                      {/* Controls: Status selector + Open Link + Remove */}
                      <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={statusSelectId}
                            className="sr-only"
                          >
                            Статус для «{resource.title}»
                          </label>
                          <select
                            id={statusSelectId}
                            value={entry.status}
                            onChange={(e) =>
                              onUpdateStatus(
                                resource.id,
                                e.target.value as TrackStatus
                              )
                            }
                            className="h-10 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {TRACK_STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                        </div>

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-700 px-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                          <span>Открыть</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>

                        <button
                          type="button"
                          onClick={() => onRemove(resource.id)}
                          aria-label={`Удалить «${resource.title}» из трека`}
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Deadline & Registration Notes */}
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <label
                        htmlFor={noteId}
                        className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
                      >
                        Заметки по дедлайнам регистрации и отбору
                      </label>
                      <textarea
                        id={noteId}
                        rows={2}
                        value={entry.deadlineNote}
                        onChange={(e) =>
                          onUpdateNote(resource.id, e.target.value)
                        }
                        placeholder="Например: регистрация открыта до 15 декабря, сдать вступительный тест…"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
