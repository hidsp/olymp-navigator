import { Moon, Sun } from 'lucide-react';

export type ActiveTab = 'catalog' | 'track';

interface HeaderProps {
  activeTab: ActiveTab;
  trackCount: number;
  theme: 'light' | 'dark';
  onSelectTab: (tab: ActiveTab) => void;
  onFocusAiSearch: () => void;
  onToggleTheme: () => void;
}

export function Header({
  activeTab,
  trackCount,
  theme,
  onSelectTab,
  onFocusAiSearch,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2.5 px-3 sm:gap-8 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          className="cursor-pointer whitespace-nowrap shrink-0 text-left text-base font-bold tracking-tight text-slate-900 transition-colors hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-lg dark:text-slate-100 dark:hover:text-blue-400"
        >
          ОлимпНавигатор
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Основная навигация"
          className="flex items-center gap-3.5 sm:gap-7"
        >
          <button
            type="button"
            onClick={() => onSelectTab('catalog')}
            aria-current={activeTab === 'catalog' ? 'page' : undefined}
            className={`cursor-pointer whitespace-nowrap shrink-0 border-b-2 py-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              activeTab === 'catalog'
                ? 'border-blue-700 text-slate-900 dark:border-blue-400 dark:text-slate-100'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-100'
            }`}
          >
            Каталог
          </button>

          <button
            type="button"
            onClick={onFocusAiSearch}
            className="hidden cursor-pointer whitespace-nowrap shrink-0 border-b-2 border-transparent py-5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:inline-block dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-100"
          >
            ИИ-поиск
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('track')}
            aria-current={activeTab === 'track' ? 'page' : undefined}
            className={`cursor-pointer whitespace-nowrap shrink-0 border-b-2 py-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              activeTab === 'track'
                ? 'border-blue-700 text-slate-900 dark:border-blue-400 dark:text-slate-100'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-100'
            }`}
          >
            <span>Мой трек</span>
            {trackCount > 0 && (
              <span className="ml-1 font-mono text-xs tabular-nums text-blue-700 dark:text-blue-400">
                ({trackCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Single primary utility action (Theme switch) */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Включить светлую тему'
                : 'Включить тёмную тему'
            }
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto sm:px-3.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Светлая</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Тёмная</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
