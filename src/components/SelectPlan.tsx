import { useEffect, useState } from "react";
import { PlanType } from "../partner/services/partnerService";

type SelectPlanProps = {
  option: PlanType;
  onChange: (value: PlanType) => void;
};

export default function SelectPlan({ option, onChange }: SelectPlanProps) {
  const [select, setSelect] = useState<PlanType>(option);

  useEffect(() => {
    setSelect(option);
  }, [option]);

  const getChangeValue = (value: PlanType) => {
    setSelect(value);
    onChange(value); // Agora os tipos batem
  };

  return (
    <section className="flex w-full flex-col items-center">
      <div className="mx-auto flex w-full items-center justify-center">
        <button
          type="button"
          onClick={() => getChangeValue("FREE")}
          className={`flex h-8 w-full items-center justify-center rounded-l-sm border border-gray-500/35 text-white ${
            select === "FREE" ? "bg-bronze" : ""
          }`}
        >
          Teste
        </button>
        <button
          type="button"
          onClick={() => getChangeValue("BASIC")}
          className={`flex h-8 w-full items-center justify-center border border-gray-500/35 text-white ${
            select === "BASIC" ? "bg-silver" : ""
          }`}
        >
          Básico
        </button>
        <button
          type="button"
          onClick={() => getChangeValue("PREMIUM")}
          className={`flex h-8 w-full items-center justify-center rounded-r-sm border border-gray-500/35 text-white ${
            select === "PREMIUM" ? "bg-gold" : ""
          }`}
        >
          Premium
        </button>
      </div>
    </section>
  );
}
