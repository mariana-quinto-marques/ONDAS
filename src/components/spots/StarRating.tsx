import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: number;
  reviewCount: number;
  size?: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

export function StarRating({ stars, reviewCount, size = 12 }: StarRatingProps) {
  const fullStars = Math.floor(stars);
  const fraction = stars - fullStars;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-border/40"
              fill="currentColor"
              strokeWidth={0}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: i <= fullStars ? '100%' : i === fullStars + 1 ? `${fraction * 100}%` : '0%' }}
            >
              <Star
                size={size}
                className="text-amber-400"
                fill="currentColor"
                strokeWidth={0}
              />
            </span>
          </span>
        ))}
      </div>
      <span className="text-xs font-medium text-text-secondary">
        {stars.toFixed(1)}
      </span>
      <span className="text-[10px] text-text-secondary/70">
        ({formatCount(reviewCount)})
      </span>
    </div>
  );
}
