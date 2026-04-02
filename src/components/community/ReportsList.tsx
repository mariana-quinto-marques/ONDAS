import {
  Flame, ThumbsUp, ThumbsDown, Meh, Zap, Star,
  TreePalm, User, Users, UsersRound,
} from 'lucide-react';
import { useConfirmationStore } from '../../stores/confirmationStore';
import { formatTimeAgo } from '../../utils/formatters';
import type { ConditionEmoji, CrowdLevel } from '../../types/community';

const vibeIcons: Record<ConditionEmoji, { icon: typeof Flame; color: string }> = {
  fire: { icon: Flame, color: '#E87461' },
  shaka: { icon: Zap, color: '#D4A24E' },
  thumbsup: { icon: ThumbsUp, color: '#0E7490' },
  meh: { icon: Meh, color: '#6B8299' },
  thumbsdown: { icon: ThumbsDown, color: '#E87461' },
};

const crowdIcons: Record<CrowdLevel, { icon: typeof User; label: string }> = {
  empty: { icon: TreePalm, label: 'Empty' },
  few: { icon: User, label: 'Few people' },
  moderate: { icon: Users, label: 'Moderate' },
  crowded: { icon: UsersRound, label: 'Crowded' },
};

export function ReportsList({ spotId }: { spotId: string }) {
  const allReports = useConfirmationStore((s) => s.reports);
  const reports = allReports.filter((r) => r.spotId === spotId).slice(0, 10);

  if (reports.length === 0) {
    return <p className="py-4 text-center text-xs text-text-secondary">No reports yet. Be the first to share conditions!</p>;
  }

  return (
    <div className="space-y-2">
      {reports.slice(0, 5).map((report) => {
        const vibe = vibeIcons[report.emoji] ?? vibeIcons.thumbsup;
        const VibeIcon = vibe.icon;
        const crowd = crowdIcons[report.crowdLevel];
        const CrowdIcon = crowd.icon;
        return (
          <div key={report.id} className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface-warm/40 p-3">
            <VibeIcon size={20} color={vibe.color} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: report.rating }, (_, i) => (
                    <Star key={i} size={10} fill="#D4A24E" color="#D4A24E" />
                  ))}
                </span>
                <span className="text-[10px] text-text-secondary">{formatTimeAgo(report.timestamp)}</span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                <CrowdIcon size={12} />{crowd.label}
              </p>
              {report.note && <p className="mt-1 text-xs text-text">{report.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
