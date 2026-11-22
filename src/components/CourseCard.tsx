import {
  Archive,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  KeyRound,
} from 'lucide-react';
import {
  ACCESS_STATUS_LABELS,
  FORMAT_SHORT_LABELS,
  LEVEL_LABELS,
  SUBJECT_LABELS,
} from '../data/catalog';
import type { AccessStatus, OlympiadResource } from '../types/olympiad';
import { formatGradesRange } from '../utils/filters';

interface CourseCardProps {
  resource: OlympiadResource;
  isSaved: boolean;
  onToggleSave: (resource: OlympiadResource) => void;
}

function renderAccessStatus(status: AccessStatus) {
  if (status === 'free-full') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{ACCESS_STATUS_LABELS[status]}</span>
      </span>
    );
  }
  if (status === 'free-selection') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <KeyRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{ACCESS_STATUS_LABELS[status]}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
      <Archive className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{ACCESS_STATUS_LABELS[status]}</span>
    </span>
  );
}

export function CourseCard({
  resource,
  isSaved,
  onToggleSave,
}: CourseCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-150 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Unboxed inline metadata kicker (zero-pill discipline) */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
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
        </div>

        {resource.sourceOrigin === 'ai-search' && (
          <span className="font-mono text-[11px] font-medium text-blue-700 dark:text-blue-400">
            ИИ-поиск
          </span>
        )}
      </div>

      {/* Primary Title */}
      <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
        {resource.title}
      </h3>

      {/* Organizer & Target Olympiads */}
      <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        <span className="text-slate-800 dark:text-slate-200">
          {resource.organizer}
        </span>
        {resource.olympiads.length > 0 && (
          <>
            <span className="mx-1.5 text-slate-400" aria-hidden="true">
              /
            </span>
            <span>{resource.olympiads.join(', ')}</span>
          </>
        )}
      </p>

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {resource.description}
      </p>

      {/* Optional deadline/cohort note */}
      {resource.deadlineHint && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Сроки и набор: {resource.deadlineHint}
        </p>
      )}

      {/* Footer: Access status + verified domain + primary actions */}
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          {renderAccessStatus(resource.accessStatus)}
          {resource.verifiedDomain && (
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {resource.verifiedDomain}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-700 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <span>Перейти к курсу</span>
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => onToggleSave(resource)}
            aria-pressed={isSaved}
            aria-label={
              isSaved
                ? `Убрать «${resource.title}» из избранного`
                : `Сохранить «${resource.title}» в избранное`
            }
            className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isSaved
                ? 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-950'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>В треке</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>В избранное</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
