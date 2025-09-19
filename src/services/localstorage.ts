// src/services/localStorage.service.ts
const REPORTS_KEY = 'oceanHazardReports';
const LOCATIONS_KEY = 'oceanHazardLocations';
const SOCIAL_KEY = 'oceanHazardSocialMentions';
const AUTH_USER_KEY = 'user';
const AUTH_TOKEN_KEY = 'authToken';

export type StoredReport = {
  id: string;
  title: string;
  description: string;
  hazardType: 'tsunami' | 'storm_surge' | 'high_waves' | 'coastal_flooding' | 'abnormal_tide';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number; address: string };
  reportedBy: string;
  reporterEmail?: string;
  createdAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'investigating';
  images?: string[];
};

export type StoredLocation = {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  type: 'city' | 'region' | 'landmark' | 'beach' | 'port';
  country: string;
  state?: string;
  isCoastal: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
};

export type StoredSocialMention = {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'tiktok';
  content: string;
  timestamp: string;
  location?: { lat: number; lng: number; name?: string };
  sentiment: 'positive' | 'negative' | 'neutral' | 'concern' | 'panic';
  relevanceScore?: number;
  hashtags?: string[];
  mentions?: string[];
};

// Generic helpers
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Reports
export function loadReports(): StoredReport[] {
  return readJSON<StoredReport[]>(REPORTS_KEY, []);
}
export function saveReports(reports: StoredReport[]): void {
  writeJSON(REPORTS_KEY, reports);
}
export function addReportLocal(report: StoredReport): StoredReport[] {
  const next = [...loadReports(), report];
  saveReports(next);
  return next;
}
export function updateReportLocal(id: string, patch: Partial<StoredReport>): StoredReport[] {
  const next = loadReports().map(r => (r.id === id ? { ...r, ...patch } : r));
  saveReports(next);
  return next;
}
export function removeReportLocal(id: string): StoredReport[] {
  const next = loadReports().filter(r => r.id !== id);
  saveReports(next);
  return next;
}

// Locations
export function loadLocations(): StoredLocation[] {
  return readJSON<StoredLocation[]>(LOCATIONS_KEY, []);
}
export function saveLocations(locations: StoredLocation[]): void {
  writeJSON(LOCATIONS_KEY, locations);
}

// Social mentions
export function loadSocialMentions(): StoredSocialMention[] {
  return readJSON<StoredSocialMention[]>(SOCIAL_KEY, []);
}
export function saveSocialMentions(mentions: StoredSocialMention[]): void {
  writeJSON(SOCIAL_KEY, mentions);
}

// Auth (optional for prototype continuity)
export function loadAuthUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
export function saveAuthUser(user: any) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}
export function loadToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
export function saveToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}
