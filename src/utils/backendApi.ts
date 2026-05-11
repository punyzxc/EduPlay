const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

export interface BackendAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface BackendLeaderboardEntry {
  id: number;
  username: string;
  email: string;
  avatar: string;
  avatarColor: string;
  totalScore: number;
  bestScore: number;
  dailyScore: number;
  lastResetUTC: string;
  createdAt: string;
  rank: number;
}

export interface BackendProfile extends BackendLeaderboardEntry {
  level: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  gamesPlayed: number;
  totalAnswers: number;
  correctAnswers: number;
  achievements: BackendAchievement[];
  unlockedItems: string[];
  profileSettings: Record<string, string | number | boolean>;
  lastPlayedAt: string;
  updatedAt: string;
}

interface LeaderboardResponse {
  items: BackendLeaderboardEntry[];
}

interface ProfileResponse {
  item: BackendProfile;
}

interface SubmitResponse {
  item: BackendProfile;
}

export interface SubmitScorePayload {
  username: string;
  email: string;
  avatar: string;
  avatarColor?: string;
  score: number;
  password?: string;
  quizSessionId?: string;
  level?: number;
  totalXP?: number;
  currentStreak?: number;
  bestStreak?: number;
  gamesPlayed?: number;
  totalAnswers?: number;
  correctAnswers?: number;
  achievements?: BackendAchievement[];
  unlockedItems?: string[];
  profileSettings?: Record<string, string | number | boolean>;
  lastPlayedAt?: string;
}

interface AuthPayload {
  username: string;
  email: string;
  password: string;
  avatar: string;
  avatarColor?: string;
}

interface LoginPayload {
  identity: string;
  password: string;
}

const requestJson = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const fetchLeaderboardFromBackend = async (limit = 10): Promise<BackendLeaderboardEntry[]> => {
  const data = await requestJson<LeaderboardResponse>(`/leaderboard?limit=${limit}`);
  return data.items;
};

export const fetchProfileFromBackend = async (params: {
  id?: number;
  username?: string;
  email?: string;
}): Promise<BackendProfile> => {
  const search = new URLSearchParams();
  if (params.id !== undefined) {
    search.set('id', String(params.id));
  }
  if (params.username) {
    search.set('username', params.username);
  }
  if (params.email) {
    search.set('email', params.email);
  }

  const data = await requestJson<ProfileResponse>(`/profile?${search.toString()}`);
  return data.item;
};

export const submitScoreToBackend = async (payload: SubmitScorePayload): Promise<BackendProfile> => {
  const data = await requestJson<SubmitResponse>('/submit-score', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.item;
};

export const syncProfileToBackend = async (
  payload: Omit<SubmitScorePayload, 'score' | 'quizSessionId'>,
): Promise<BackendProfile> =>
  submitScoreToBackend({ ...payload, score: 0 });

export const registerUserInBackend = async (payload: AuthPayload): Promise<BackendProfile> => {
  const data = await requestJson<SubmitResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.item;
};

export const loginUserInBackend = async (payload: LoginPayload): Promise<BackendProfile> => {
  const data = await requestJson<SubmitResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.item;
};
