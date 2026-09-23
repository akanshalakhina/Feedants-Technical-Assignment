import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  referralCode?: string;
}

export interface Reward {
  position: number;
  label: string;
  amount: number;
  icon: 'gold' | 'silver' | 'bronze' | 'star';
}

export interface PreviousWinner {
  name: string;
  rank: '1st' | '2nd' | '3rd';
  videoThumbnailUrl: string;
  videoUrl: string;
}

export interface Competition {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  spotsRemaining: number;
  computedStatus: string;
  judge: {
    name: string;
    title: string;
    experience: string;
    photoUrl: string;
    introVideoUrl: string;
  };
  registrationCloseDate: string;
  submissionStartDate: string;
  submissionEndDate: string;
  resultDate: string;
  description: { en: string; hi: string };
  judgingParameters: { en: string; hi: string };
  rulesAndEligibility: { en: string; hi: string };
  rewards: Reward[];
  previousWinners: PreviousWinner[];
  status: string;
}

export interface Registration {
  _id: string;
  userId: string;
  competitionId: string;
  paymentStatus: string;
  submissionUrl?: string;
  submittedAt?: string;
  createdAt: string;
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await AsyncStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? `HTTP ${response.status}`);
  }
  return data as T;
}

// ─── API surface ─────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (name: string, email: string, password: string) =>
      request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),

    login: (email: string, password: string) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () => request<{ user: User }>('/auth/me'),
  },

  competitions: {
    list: () => request<{ competitions: Competition[] }>('/competitions'),

    get: (id: string) =>
      request<{
        competition: Competition;
        isRegistered: boolean;
        registration: Registration | null;
      }>(`/competitions/${id}`),

    register: (id: string) =>
      request<{ message: string; competition: Competition; registration: Registration }>(
        `/competitions/${id}/register`,
        { method: 'POST' }
      ),

    submitEntry: (id: string, submissionUrl: string) =>
      request<{ message: string; registration: Registration }>(
        `/competitions/${id}/submit`,
        { method: 'POST', body: JSON.stringify({ submissionUrl }) }
      ),

    getRegistrationStatus: (id: string) =>
      request<{ isRegistered: boolean; registration: Registration | null }>(
        `/competitions/${id}/registration-status`
      ),
  },
};
