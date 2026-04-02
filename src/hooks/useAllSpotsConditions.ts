import { useQuery } from '@tanstack/react-query';
import { fetchAllSpotsConditions } from '../services/api';
import { spots } from '../data/spots';

export function useAllSpotsConditions() {
  return useQuery({
    queryKey: ['conditions', 'all'],
    queryFn: () => fetchAllSpotsConditions(spots),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
