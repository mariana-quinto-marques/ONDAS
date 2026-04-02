import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConditionReport, CrowdLevel, ConditionEmoji } from '../types/community';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

interface ConfirmationState {
  reports: ConditionReport[];
  addReport: (
    spotId: string,
    rating: ConditionReport['rating'],
    crowdLevel: CrowdLevel,
    emoji: ConditionEmoji,
    note?: string,
  ) => boolean;
  getReportsForSpot: (spotId: string) => ConditionReport[];
  pruneOldReports: () => void;
}

export const useConfirmationStore = create<ConfirmationState>()(
  persist(
    (set, get) => ({
      reports: [],

      addReport: (spotId, rating, crowdLevel, emoji, note) => {
        const now = Date.now();
        const existing = get().reports;

        const recentReport = existing.find(
          (r) => r.spotId === spotId && now - r.timestamp < ONE_HOUR_MS,
        );
        if (recentReport) return false;

        const report: ConditionReport = {
          id: `${spotId}-${now}`,
          spotId,
          timestamp: now,
          rating,
          crowdLevel,
          emoji,
          note: note?.slice(0, 100),
        };

        set((state) => ({
          reports: [report, ...state.reports],
        }));

        return true;
      },

      getReportsForSpot: (spotId) => {
        return get()
          .reports.filter((r) => r.spotId === spotId)
          .slice(0, 10);
      },

      pruneOldReports: () => {
        const cutoff = Date.now() - SEVEN_DAYS_MS;
        set((state) => ({
          reports: state.reports.filter((r) => r.timestamp > cutoff),
        }));
      },
    }),
    {
      name: 'ondas-reports',
    },
  ),
);
