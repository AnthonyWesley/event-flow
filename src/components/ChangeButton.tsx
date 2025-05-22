import { useState } from "react";
import { SalesOrSellersKey } from "../ranking/types/SalesOrSellersKey";
type ChangeButtonProps = {
  onChange: (status: SalesOrSellersKey) => void;
};

export default function ChangeButton({ onChange }: ChangeButtonProps) {
  const [isSales, setIsSales] = useState(false);
  const changeStatus = () => {
    setIsSales(!isSales);
    onChange(isSales ? "SELLERS" : "SALES");
  };

  return (
    <div
      className={`relative h-fit w-fit p-1.5 ${isSales ? "text-rose-500" : "text-cyan-600"}`}
      onClick={changeStatus}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 32 32"
      >
        {/* Exchange icon paths */}
        <path
          fill="currentColor"
          d="M24 21v2h1.748A11.96 11.96 0 0 1 16 28C9.383 28 4 22.617 4 16H2c0 7.72 6.28 14 14 14c4.355 0 8.374-2.001 11-5.345V26h2v-5z"
        />
        <path
          fill="currentColor"
          d="M16 2A13.95 13.95 0 0 0 5 7.345V6H3v5h5V9H6.252A11.96 11.96 0 0 1 16 4c6.617 0 12 5.383 12 12h2c0-7.72-6.28-14-14-14"
        />

        {/* Sale icon positioned manually */}
        {isSales && (
          <g transform="translate(9,9) scale(0.6)">
            {/* Ajuste aqui para mover */}
            <path
              fill="currentColor"
              d="M4.142 4L6.01 16.136A1 1 0 0 0 7.016 17H18a1 1 0 0 0 .958-.713l3-10A1 1 0 0 0 21 5H6.32l-.33-2.138a1 1 0 0 0-.346-.627A1 1 0 0 0 4.984 2H3a1 1 0 1 0 0 2zm3.716 11l-1.23-8h13.028l-2.4 8zM10 20a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"
            />
          </g>
        )}

        {!isSales && (
          <g transform="translate(9,9) scale(0.6)">
            <path
              fill="currentColor"
              d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
