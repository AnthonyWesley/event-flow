import { useState } from "react";

const plans = ["Silver", "Gold", "Platinum"];

export default function Radio() {
  const [selected, setSelected] = useState("Silver");

  const getTranslateClass = () => {
    switch (selected) {
      case "Silver":
        return "translate-x-0";
      case "Gold":
        return "translate-x-full";
      case "Platinum":
        return "translate-x-[200%]";
      default:
        return "";
    }
  };

  const getGradientClass = () => {
    switch (selected) {
      case "Silver":
        return "bg-[linear-gradient(135deg,#c0c0c055,#e0e0e0)] shadow-[0_0_18px_rgba(192,192,192,0.5),_inset_0_0_10px_rgba(255,255,255,0.4)]";
      case "Gold":
        return "bg-[linear-gradient(135deg,#ffd70055,#ffcc00)] shadow-[0_0_18px_rgba(255,215,0,0.5),_inset_0_0_10px_rgba(255,235,150,0.4)]";
      case "Platinum":
        return "bg-[linear-gradient(135deg,#d0e7ff55,#a0d8ff)] shadow-[0_0_18px_rgba(160,216,255,0.5),_inset_0_0_10px_rgba(200,240,255,0.4)]";
      default:
        return "";
    }
  };

  return (
    <div className="relative flex w-fit overflow-hidden rounded-xl bg-white/10 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.2),inset_-1px_-1px_6px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-md">
      {/* Glider */}
      <div
        className={`absolute top-0 bottom-0 z-0 w-1/3 rounded-xl transition-transform duration-[500ms] ease-[cubic-bezier(0.37,1.95,0.66,0.56)] ${getTranslateClass()} ${getGradientClass()}`}
      />
      {plans.map((plan) => (
        <label
          key={plan}
          className={`relative z-10 flex min-w-[80px] cursor-pointer items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${selected === plan ? "text-white" : "text-gray-300 hover:text-white"}`}
        >
          <input
            type="radio"
            name="plan"
            value={plan}
            checked={selected === plan}
            onChange={() => setSelected(plan)}
            className="hidden"
          />
          {plan}
        </label>
      ))}
    </div>
  );
}
