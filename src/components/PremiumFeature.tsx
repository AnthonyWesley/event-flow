import { toast } from "react-toastify";
import usePartner from "../partner/hooks/usePartner";

function isPremium(plan: string | undefined): boolean {
  return plan === "PREMIUM";
}

type PremiumFeatureProps = {
  children: React.ReactNode;
  onAllowed?: () => void;
};

export default function PremiumFeature({
  children,
  onAllowed,
}: PremiumFeatureProps) {
  const {
    queryPartner: { data: partner, isLoading },
  } = usePartner();

  function handleClick() {
    if (!isPremium(partner?.plan)) {
      toast.warning("Este recurso está disponível apenas no plano PREMIUM.");
      return;
    }

    if (onAllowed) onAllowed();
  }

  if (isLoading) return <p>Carregando...</p>;

  return (
    <section onClick={handleClick}>
      <div
        className={`transition-opacity ${
          isPremium(partner?.plan)
            ? "cursor-pointer opacity-100 select-auto"
            : "pointer-events-none cursor-not-allowed opacity-50 select-none"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
