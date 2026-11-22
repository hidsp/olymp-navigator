import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, RotateCcw } from 'lucide-react';
import { CURATED_CATALOG, SUBJECT_LABELS } from './data/catalog';
import { CourseCard } from './components/CourseCard';
import { FilterSidebar } from './components/FilterSidebar';
import { Header, type ActiveTab } from './components/Header';
import { LiveSearchPanel } from './components/LiveSearchPanel';
import { PrepTrackView } from './components/PrepTrackView';
import type {
  FilterState,
  LiveSearchResponse,
  OlympiadResource,
  TrackedResource,
  TrackStatus,
} from './types/olympiad';
import {
  buildQueryFromFilters,
  countBySubject,
  DEFAULT_FILTERS,
  filterResources,
  hasActiveFilters,
} from './utils/filters';
import {
  loadTrackFromStorage,
  removeFromTrack,
  saveTrackToStorage,
  THEME_STORAGE_KEY,
  toggleResourceInTrack,
  updateTrackNote,
  updateTrackStatus,
} from './utils/trackStorage';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Ignore storage read errors
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Prep Track (persisted to localStorage)
  const [trackedItems, setTrackedItems] = useState<TrackedResource[]>(() =>
    loadTrackFromStorage()
  );

  // Live Gemini Search Grounding state
  const [aiQuery, setAiQuery] = useState('');
  const [aiValidationError, setAiValidationError] = useState<string | null>(
    null
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<LiveSearchResponse | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync dark mode class on <html> and persist preference
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  // Persist prep track on change
  useEffect(() => {
    saveTrackToStorage(trackedItems);
  }, [trackedItems]);

  const savedIds = useMemo(
    () => new Set(trackedItems.map((entry) => entry.resource.id)),
    [trackedItems]
  );

  const subjectCounts = useMemo(() => countBySubject(CURATED_CATALOG), []);

  const filteredCatalog = useMemo(
    () => filterResources(CURATED_CATALOG, filters),
    [filters]
  );

  const handleFilterChange = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleToggleSave = (resource: OlympiadResource) => {
    setTrackedItems((prev) => toggleResourceInTrack(prev, resource));
  };

  const handleUpdateTrackStatus = (resourceId: string, status: TrackStatus) => {
    setTrackedItems((prev) => updateTrackStatus(prev, resourceId, status));
  };

  const handleUpdateTrackNote = (resourceId: string, note: string) => {
    setTrackedItems((prev) => updateTrackNote(prev, resourceId, note));
  };

  const handleRemoveFromTrack = (resourceId: string) => {
    setTrackedItems((prev) => removeFromTrack(prev, resourceId));
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleFocusAiSearch = () => {
    setActiveTab('catalog');
    window.setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 40);
  };

  const runLiveAiSearch = async (overrideQuery?: string) => {
    const effectiveQuery = (
      overrideQuery !== undefined ? overrideQuery : aiQuery
    ).trim();

    if (overrideQuery !== undefined) {
      setAiQuery(overrideQuery);
    }

    if (effectiveQuery.length < 3) {
      setAiValidationError(
        'Введите запрос (минимум 3 символа), например: «интенсив по праву 10 класс».'
      );
      searchInputRef.current?.focus();
      return;
    }

    setAiValidationError(null);
    setAiError(null);
    setAiLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: effectiveQuery,
          subject: filters.subject,
          format: filters.format,
          grade: filters.grade,
          level: filters.level,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof data?.error === 'string'
            ? data.error
            : 'Ошибка при обращении к ИИ-поиску.'
        );
      }

      setAiResult(data as LiveSearchResponse);
    } catch (err: unknown) {
      setAiError(
        err instanceof Error
          ? err.message
          : 'Не удалось выполнить живой ИИ-поиск. Проверьте соединение.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleRunSearchForCurrentFilters = () => {
    const generated = buildQueryFromFilters(filters);
    void runLiveAiSearch(generated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header
        activeTab={activeTab}
        trackCount={trackedItems.length}
        theme={theme}
        onSelectTab={handleSelectTab}
        onFocusAiSearch={handleFocusAiSearch}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
      />

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {activeTab === 'track' ? (
          <PrepTrackView
            items={trackedItems}
            onUpdateStatus={handleUpdateTrackStatus}
            onUpdateNote={handleUpdateTrackNote}
            onRemove={handleRemoveFromTrack}
            onGoToCatalog={() => handleSelectTab('catalog')}
          />
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <FilterSidebar
              filters={filters}
              subjectCounts={subjectCounts}
              mobileOpen={mobileFiltersOpen}
              onToggleMobile={setMobileFiltersOpen}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            <div className="min-w-0 flex-1">
              <LiveSearchPanel
                inputRef={searchInputRef}
                query={aiQuery}
                validationError={aiValidationError}
                isLoading={aiLoading}
                apiError={aiError}
                liveResult={aiResult}
                savedIds={savedIds}
                onQueryChange={(val) => {
                  setAiQuery(val);
                  if (aiValidationError) setAiValidationError(null);
                }}
                onSubmitSearch={(q) => void runLiveAiSearch(q)}
                onClearResults={() => setAiResult(null)}
                onToggleSave={handleToggleSave}
              />

              {/* Curated Preloaded Catalog Section */}
              <section aria-labelledby="curated-catalog-heading">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h2
                      id="curated-catalog-heading"
                      className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {filters.subject === 'all'
                        ? 'Проверенная база бесплатных площадок'
                        : `Проверенные площадки: ${SUBJECT_LABELS[filters.subject]}`}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Сириус.Курсы, Т-Образование, МФТИ, НИУ ВШЭ, ЦПМ, МГУ,
                      СПбГУ, Яндекс Образование, Фоксфорд и открытые архивы
                    </p>
                  </div>

                  <p className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    Показано {filteredCatalog.length} из {CURATED_CATALOG.length}
                  </p>
                </div>

                {filteredCatalog.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      В предзагруженной базе не найдено точных совпадений
                    </h3>
                    <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-400">
                      Сбросьте часть фильтров или запустите живой ИИ-поиск с
                      Google Search по выбранным параметрам.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      {hasActiveFilters(filters) && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <RotateCcw className="h-4 w-4" aria-hidden="true" />
                          <span>Сбросить фильтры</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleRunSearchForCurrentFilters}
                        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        <Globe className="h-4 w-4" aria-hidden="true" />
                        <span>Искать через ИИ по этим фильтрам</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    data-testid="curated-grid"
                    className="grid grid-cols-1 gap-4 xl:grid-cols-2"
                  >
                    {filteredCatalog.map((item) => (
                      <CourseCard
                        key={item.id}
                        resource={item}
                        isSaved={savedIds.has(item.id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8 dark:text-slate-400">
          <span>
            ОлимпНавигатор — агрегатор бесплатной подготовки к ВсОШ и
            перечневым олимпиадам РСОШ.
          </span>
          <span>
            Ссылки из живого поиска проверяются через Google Search Grounding.
          </span>
        </div>
      </footer>
    </div>
  );
}
