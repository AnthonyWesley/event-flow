interface ProgressBarProps {
  total: number;
  current: number;
}

export default function ProgressBar({ total, current }: ProgressBarProps) {
  const progress = Math.min((current / total) * 100, 100);
  // const remaining = 100 - progress;

  return (
    <div className="flex w-full items-center gap-1 border-gray-400/15">
      <div
        className="bg-blue flex h-[3px] items-center justify-end rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
      <p
        className="text-[10px] italic"
        style={{ color: progress === 100 ? "#22d3ee" : "" }}
      >
        {progress.toFixed(0) + "%"}
      </p>
    </div>
  );
}
