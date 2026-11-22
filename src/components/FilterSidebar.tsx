import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  FORMAT_LABELS,
  FORMAT_LIST,
  GRADE_LIST,
  LEVEL_LABELS,
  LEVEL_LIST,
  SUBJECT_LABELS,
  SUBJECT_LIST,
} from '../data/catalog';
import type {
  DifficultyLevel,
  FilterState,
  FormatType,
  Grade,
  Subject,
} from '../types/olympiad';
import { hasActiveFilters } from '../utils/filters';

interface FilterSidebarProps {
  filters: FilterState;
  subjectCounts: Record<Subject | 'all', number>;
  mobileOpen: boolean;
  onToggleMobile: (open: boolean) => void;
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  subjectCounts,
  mobileOpen,
  onToggleMobile,
  onChange,
  onReset,
}: FilterSidebarProps) {
  const active = hasActiveFilters(filters);

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Фильтры каталога
        </h2>
        {active && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs font-medium text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Сбросить</span>
          </button>
        )}
      </div>

      {/* Quick filter inside preloaded catalog */}
      <div>
        <label
          htmlFor="catalog-quick-filter"
          className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          Поиск по базе площадок
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            id="catalog-quick-filter"
            type="search"
            value={filters.localSearch}
            onChange={(e) => onChange({ localSearch: e.target.value })}
            placeholder="Сириус, МФТИ, Высшая проба…"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
          />
        </div>
      </div>

      {/* Subject */}
      <fieldset className="space-y-1.5">
        <legend className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          Предмет
        </legend>
        <button
          type="button"
          onClick={() => onChange({ subject: 'all' })}
          aria-pressed={filters.subject === 'all'}
          className={`flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            filters.subject === 'all'
              ? 'bg-blue-700 font-medium text-white dark:bg-blue-600'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
          }`}
        >
          <span className="truncate">Все направления</span>
          <span
            className={`font-mono text-xs tabular-nums ${
              filters.subject === 'all'
                ? 'text-blue-100'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {subjectCounts.all}
          </span>
        </button>

        {SUBJECT_LIST.map((subject) => {
          const isSelected = filters.subject === subject;
          return (
            <button
              key={subject}
              type="button"
              onClick={() => onChange({ subject })}
              aria-pressed={isSelected}
              className={`flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'bg-blue-700 font-medium text-white dark:bg-blue-600'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="truncate">{SUBJECT_LABELS[subject]}</span>
              <span
                className={`font-mono text-xs tabular-nums ${
                  isSelected
                    ? 'text-blue-100'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {subjectCounts[subject]}
              </span>
            </button>
          );
        })}
      </fieldset>

      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* Format */}
      <fieldset className="space-y-1.5">
        <legend className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          Формат подготовки
        </legend>
        <button
          type="button"
          onClick={() => onChange({ format: 'all' })}
          aria-pressed={filters.format === 'all'}
          className={`flex min-h-9 w-full cursor-pointer items-center rounded-lg px-3 py-1.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            filters.format === 'all'
              ? 'bg-slate-900 font-medium text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
          }`}
        >
          Все форматы
        </button>

        {FORMAT_LIST.map((format: FormatType) => {
          const isSelected = filters.format === format;
          return (
            <button
              key={format}
              type="button"
              onClick={() => onChange({ format })}
              aria-pressed={isSelected}
              className={`flex min-h-9 w-full cursor-pointer items-center rounded-lg px-3 py-1.5 text-left text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'bg-slate-900 font-medium text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
              }`}
            >
              {FORMAT_LABELS[format]}
            </button>
          );
        })}
      </fieldset>

      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* Grade segmented buttons */}
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          Класс
        </legend>
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => onChange({ grade: 'all' })}
            aria-pressed={filters.grade === 'all'}
            className={`h-8 cursor-pointer rounded-md text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 ${
              filters.grade === 'all'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Все
          </button>
          {GRADE_LIST.map((grade: Grade) => {
            const isSelected = filters.grade === grade;
            return (
              <button
                key={grade}
                type="button"
                onClick={() => onChange({ grade })}
                aria-pressed={isSelected}
                className={`h-8 cursor-pointer rounded-md font-mono text-xs font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* Level */}
      <fieldset className="space-y-1.5">
        <legend className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          Уровень подготовки
        </legend>
        <button
          type="button"
          onClick={() => onChange({ level: 'all' })}
          aria-pressed={filters.level === 'all'}
          className={`flex h-9 w-full cursor-pointer items-center rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            filters.level === 'all'
              ? 'bg-slate-900 font-medium text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
          }`}
        >
          Любой уровень
        </button>
        {LEVEL_LIST.map((level: DifficultyLevel) => {
          const isSelected = filters.level === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ level })}
              aria-pressed={isSelected}
              className={`flex h-9 w-full cursor-pointer items-center rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'bg-slate-900 font-medium text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
              }`}
            >
              {LEVEL_LABELS[level]}
            </button>
          );
        })}
      </fieldset>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => onToggleMobile(!mobileOpen)}
          aria-expanded={mobileOpen}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          )}
          <span>Фильтры{active ? ' (активны)' : ''}</span>
        </button>

        {active && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400"
          >
            Сбросить все
          </button>
        )}
      </div>

      {/* Mobile Collapsible Panel */}
      {mobileOpen && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          {filterContent}
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside
        aria-label="Фильтры каталога"
        className="hidden w-64 shrink-0 lg:block"
      >
        <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
