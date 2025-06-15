import { toast } from "react-toastify";
import usePartner from "../partner/hooks/usePartner";

function isPremium(plan: string | undefined): boolean {
  return plan === "PREMIUM";
}
function expiredDate(date: Date): boolean {
  return date <= new Date();
}

type PremiumFeatureProps = {
  children: React.ReactNode;
  onAllowed?: () => void;
  className?: string;
};

export default function PremiumFeature({
  children,
  onAllowed,
  className,
}: PremiumFeatureProps) {
  const {
    queryPartner: { data: partner, isLoading },
  } = usePartner();

  function handleClick() {
    if (!expiredDate(partner?.accessExpiresAt)) {
      toast.warning("Você não tem mais autorização. Renove seu plano!");
      return;
    }
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
        } ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
