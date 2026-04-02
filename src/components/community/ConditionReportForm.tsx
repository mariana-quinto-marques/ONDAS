import { useState } from 'react';
import {
  Send, Star, Flame, ThumbsUp, ThumbsDown, Meh, Zap,
  TreePalm, User, Users, UsersRound,
} from 'lucide-react';
import { useConfirmationStore } from '../../stores/confirmationStore';
import type { CrowdLevel, ConditionEmoji, ConditionReport } from '../../types/community';

const CROWD_OPTIONS: { value: CrowdLevel; label: string; icon: typeof User; color: string }[] = [
  { value: 'empty', label: 'Empty', icon: TreePalm, color: '#059669' },
  { value: 'few', label: 'Few', icon: User, color: '#0E7490' },
  { value: 'moderate', label: 'Moderate', icon: Users, color: '#D4A24E' },
  { value: 'crowded', label: 'Crowded', icon: UsersRound, color: '#E87461' },
];

const CONDITION_EMOJIS: { value: ConditionEmoji; icon: typeof Flame; color: string }[] = [
  { value: 'fire', icon: Flame, color: '#E87461' },
  { value: 'shaka', icon: Zap, color: '#D4A24E' },
  { value: 'thumbsup', icon: ThumbsUp, color: '#0E7490' },
  { value: 'meh', icon: Meh, color: '#6B8299' },
  { value: 'thumbsdown', icon: ThumbsDown, color: '#E87461' },
];

export function ConditionReportForm({ spotId }: { spotId: string }) {
  const addReport = useConfirmationStore((s) => s.addReport);
  const [rating, setRating] = useState<ConditionReport['rating']>(3);
  const [crowd, setCrowd] = useState<CrowdLevel>('few');
  const [emoji, setEmoji] = useState<ConditionEmoji>('thumbsup');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const success = addReport(spotId, rating, crowd, emoji, note || undefined);
    if (success) {
      setSubmitted(true);
      setNote('');
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setError('You already reported in the last hour');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-4">
      <h3 className="font-display mb-3 text-lg text-text">How is it right now?</h3>

      {submitted ? (
        <div className="rounded-xl bg-condition-good/10 p-3 text-center text-sm text-condition-good">
          Thanks for your report!
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-text-secondary">Overall conditions</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star as ConditionReport['rating'])} className="transition-transform hover:scale-110">
                  <Star size={24} fill={star <= rating ? '#D4A24E' : 'none'} color={star <= rating ? '#D4A24E' : '#E4DDD4'} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-text-secondary">Vibe</label>
            <div className="flex gap-2">
              {CONDITION_EMOJIS.map((e) => {
                const Icon = e.icon;
                const isActive = emoji === e.value;
                return (
                  <button key={e.value} onClick={() => setEmoji(e.value)}
                    className={`rounded-xl border-2 p-2 transition-all ${isActive ? 'border-ocean bg-ocean/5 scale-110' : 'border-border/50 hover:bg-surface-warm'}`}>
                    <Icon size={20} color={isActive ? e.color : '#B0B8C4'} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-text-secondary">Crowd level</label>
            <div className="flex gap-2">
              {CROWD_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = crowd === opt.value;
                return (
                  <button key={opt.value} onClick={() => setCrowd(opt.value)}
                    className={`flex flex-col items-center rounded-xl border-2 px-3 py-1.5 text-xs transition-all ${isActive ? 'border-ocean bg-ocean/5' : 'border-border/50 hover:bg-surface-warm'}`}>
                    <Icon size={18} color={isActive ? opt.color : '#B0B8C4'} />
                    <span className={`mt-0.5 text-[10px] ${isActive ? 'text-text' : 'text-text-secondary'}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)" maxLength={100}
            className="w-full rounded-xl border border-border/60 bg-surface-warm/50 px-3 py-2 text-sm text-text placeholder-text-secondary outline-none focus:border-ocean transition-colors" />

          {error && <p className="text-xs text-condition-poor">{error}</p>}

          <button onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-dark">
            <Send size={14} />
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
}
