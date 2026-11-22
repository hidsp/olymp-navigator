export type Subject =
  | 'math'
  | 'physics'
  | 'informatics'
  | 'law'
  | 'english';

export type FormatType =
  | 'online-course'
  | 'intensive'
  | 'archive'
  | 'community';

export type Grade = 9 | 10 | 11;

export type DifficultyLevel = 'basic' | 'advanced' | 'vseros';

export type AccessStatus =
  | 'free-full'
  | 'free-selection'
  | 'open-archive';

export type TrackStatus = 'planned' | 'in-progress' | 'completed';

export interface OlympiadResource {
  id: string;
  title: string;
  organizer: string;
  subject: Subject;
  format: FormatType;
  grades: Grade[];
  level: DifficultyLevel;
  accessStatus: AccessStatus;
  description: string;
  url: string;
  olympiads: string[];
  deadlineHint?: string;
  sourceOrigin: 'curated' | 'ai-search';
  verifiedDomain?: string;
}

export interface TrackedResource {
  resource: OlympiadResource;
  status: TrackStatus;
  deadlineNote: string;
  savedAt: string;
  updatedAt: string;
}

export interface FilterState {
  subject: Subject | 'all';
  format: FormatType | 'all';
  grade: Grade | 'all';
  level: DifficultyLevel | 'all';
  localSearch: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
  domain: string;
}

export interface LiveSearchResponse {
  query: string;
  summary: string;
  results: OlympiadResource[];
  groundingSources: GroundingSource[];
  searchQueries: string[];
  searchedAt: string;
}
