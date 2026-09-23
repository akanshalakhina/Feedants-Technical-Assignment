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

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.competitions.get(id);
      setCompetition(data.competition);
      setIsRegistered(data.isRegistered);
      setRegistration(data.registration);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load competition');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { competition, isRegistered, registration, isLoading, error, refetch: fetchData };
}
