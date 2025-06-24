interface ProgressBarProps {
  total: number;
  current: number;
}

export function CircularProgress({ total, current }: ProgressBarProps) {
  const radius = 50;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const validTotal = isNaN(total) || total <= 0 ? 1 : total;
  const validCurrent = isNaN(current) || current < 0 ? 0 : current;

  const progress = Math.min((validCurrent / validTotal) * 100, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-25 w-25">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] animate-pulse"
      >
        <defs>
          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo 400 */}
            <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan 400 */}
          </linearGradient>
        </defs>
        <circle
          stroke="#e5e7eb30" // Tailwind gray-200 fallback
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#progress-gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="text-[16px] italic"
          style={{ color: progress === 100 ? "#22d3ee" : "" }}
        >
          {progress.toFixed(0) + "%"}
        </p>
      </div>
    </div>
  );
}
