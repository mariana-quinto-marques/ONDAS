import type { ConditionQuality } from '../../types/conditions';

const config: Record<ConditionQuality, { label: string; bg: string; text: string; dot: string }> = {
  good: { label: 'Good', bg: 'bg-condition-good/10', text: 'text-condition-good', dot: 'bg-condition-good' },
  fair: { label: 'Fair', bg: 'bg-condition-fair/10', text: 'text-condition-fair', dot: 'bg-condition-fair' },
  poor: { label: 'Poor', bg: 'bg-condition-poor/10', text: 'text-condition-poor', dot: 'bg-condition-poor' },
};

export function ConditionBadge({ quality }: { quality: ConditionQuality }) {
  const c = config[quality];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
