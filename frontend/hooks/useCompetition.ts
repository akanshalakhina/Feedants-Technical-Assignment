import { useState, useEffect, useCallback } from 'react';
import { api, Competition, Registration } from '../services/api';

export interface CompetitionState {
  competition: Competition | null;
  isRegistered: boolean;
  registration: Registration | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCompetition(id: string): CompetitionState {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!id) return;
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const data = await api.competitions.get(id);
      setCompetition(data.competition);
      setIsRegistered(data.isRegistered);
      setRegistration(data.registration);
    } catch (err: unknown) {
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Failed to load competition');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData(false);
    // Poll every 3 seconds for real-time spot updates & status changes
    const timer = setInterval(() => {
      fetchData(true);
    }, 3000);
    return () => clearInterval(timer);
  }, [fetchData]);

  return { competition, isRegistered, registration, isLoading, error, refetch: () => fetchData(false) };
}
