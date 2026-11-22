import {
  AlertCircle,
  ExternalLink,
  Globe,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import type { FormEvent, RefObject } from 'react';
import { QUICK_SEARCH_TAGS } from '../data/catalog';
import type {
  LiveSearchResponse,
  OlympiadResource,
} from '../types/olympiad';
import { CourseCard } from './CourseCard';

interface LiveSearchPanelProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  validationError: string | null;
  isLoading: boolean;
  apiError: string | null;
  liveResult: LiveSearchResponse | null;
  savedIds: Set<string>;
  onQueryChange: (val: string) => void;
  onSubmitSearch: (customQuery?: string) => void;
  onClearResults: () => void;
  onToggleSave: (resource: OlympiadResource) => void;
}

export function LiveSearchPanel({
  inputRef,
  query,
  validationError,
  isLoading,
  apiError,
  liveResult,
  savedIds,
  onQueryChange,
  onSubmitSearch,
  onClearResults,
  onToggleSave,
}: LiveSearchPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitSearch();
  };

  return (
    <section
      aria-labelledby="ai-search-heading"
      className="mb-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="max-w-3xl">
        <h1
          id="ai-search-heading"
          className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
        >
          Бесплатная подготовка к ВсОШ и олимпиадам РСОШ
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
          Выбирайте программы из проверенной базы или запускайте живой ИИ-поиск
          с Google Search — он находит актуальные наборы на интенсивы, сборы и
          открытые архивы с реальными ссылками.
        </p>
      </div>

      {/* Smart Query Form */}
      <form onSubmit={handleSubmit} className="mt-5" noValidate>
        <label htmlFor="ai-live-search-input" className="sr-only">
          Умный поисковый запрос по бесплатным олимпиадным курсам и интенсивам
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="ai-live-search-input"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Например: бесплатный интенсив по олимпиадному праву для 10 класса"
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ? 'ai-search-validation-error' : undefined
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin shrink-0"
                  aria-hidden="true"
                />
                <span>Ищем в сети…</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Найти свежее через ИИ-поиск</span>
              </>
            )}
          </button>
        </div>

        {validationError && (
          <p
            id="ai-search-validation-error"
            role="alert"
            className="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
          >
            {validationError}
          </p>
        )}
      </form>

      {/* One-Click Quick Search Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Быстрый поиск:
        </span>
        {QUICK_SEARCH_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            disabled={isLoading}
            onClick={() => onSubmitSearch(tag.query)}
            className="cursor-pointer whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          aria-live="polite"
          className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800"
        >
          <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            Выполняем живой поиск в Google Search и проверяем ссылки…
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className="h-52 animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="h-3 w-2/5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {apiError && !isLoading && (
        <div
          role="alert"
          className="mt-6 flex flex-col items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center dark:border-red-900/60 dark:bg-red-950/40"
        >
          <div className="flex items-start gap-2.5 text-sm text-red-800 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{apiError}</span>
          </div>
          <button
            type="button"
            onClick={() => onSubmitSearch()}
            className="cursor-pointer whitespace-nowrap shrink-0 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950"
          >
            Повторить поиск
          </button>
        </div>
      )}

      {/* Live Grounded Results */}
      {liveResult && !isLoading && (
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Свежие результаты ИИ-поиска
                <span className="ml-2 font-mono text-xs font-normal tabular-nums text-slate-500 dark:text-slate-400">
                  ({liveResult.results.length})
                </span>
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {liveResult.summary}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearResults}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Скрыть результаты</span>
            </button>
          </div>

          {liveResult.results.length > 0 && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {liveResult.results.map((item) => (
                <CourseCard
                  key={item.id}
                  resource={item}
                  isSaved={savedIds.has(item.id)}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          )}

          {/* Grounding Sources list (strictly from Google Search Grounding metadata) */}
          {liveResult.groundingSources.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Проверенные источники Google Search ({liveResult.groundingSources.length})
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                {liveResult.groundingSources.map((source) => (
                  <li key={source.uri}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-700 underline-offset-2 hover:underline dark:text-blue-400"
                    >
                      <span className="max-w-[260px] truncate">
                        {source.title}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        ({source.domain})
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
