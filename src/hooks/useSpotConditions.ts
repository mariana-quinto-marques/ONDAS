import { useQuery } from '@tanstack/react-query';
import { fetchSpotForecast } from '../services/api';
import { spots } from '../data/spots';

export function useSpotConditions(spotId: string) {
  const spot = spots.find((s) => s.id === spotId);

  return useQuery({
    queryKey: ['forecast', spotId],
    queryFn: () => fetchSpotForecast(spot!),
    enabled: !!spot,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
