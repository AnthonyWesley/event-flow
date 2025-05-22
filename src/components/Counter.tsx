import { useEffect, useState } from "react";

type CountProps = {
  maxValue?: number;
  onChange: (count: number) => void;
  initialValue?: number;
  label: string;
};

export default function Counter({
  maxValue = 5,
  onChange,
  initialValue = 1,
  label,
}: CountProps) {
  const [count, setCount] = useState(initialValue);

  // Dispara o onChange toda vez que o count muda
  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  const handleDecrement = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };

  const handleIncrement = () => {
    if (count < maxValue) setCount((prev) => prev + 1);
  };

  return (
    <section className="flex w-full flex-col items-center">
      {label}
      <div className="mx-auto flex w-full items-center justify-center">
        <button
          type="button"
          onClick={handleDecrement}
          className="flex h-8 w-full items-center justify-center rounded-l-sm border border-gray-500/35 bg-white/5 text-white"
          style={{ opacity: count === 1 ? "50%" : "100%" }}
          disabled={count === 1}
        >
          -
        </button>

        <div className="flex h-8 w-50 items-center justify-center border-t border-b border-gray-500/35 bg-white/5 text-white">
          {count}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          className="flex h-8 w-full items-center justify-center rounded-r-sm border border-gray-500/35 bg-white/5 text-white"
          style={{ opacity: count === maxValue ? "50%" : "100%" }}
          disabled={count === maxValue}
        >
          +
        </button>
      </div>
    </section>
  );
}
