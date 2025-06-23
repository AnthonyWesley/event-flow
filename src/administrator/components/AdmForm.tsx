import { useEffect, useState } from "react";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { FormValidator } from "../../helpers/FormValidator";
import { formatPhoneNumber } from "../../auth/components/authForm";
import { usePartnerMutations } from "../../partner/hooks/usePartnerMutations";
import {
  PartnerOutputDto,
  PlanType,
} from "../../partner/services/partnerService";
import SelectPlan from "../../components/SelectPlan";
import Card2 from "../../components/Card2";

export type PartnerProps = {
  partner?: PartnerOutputDto;
  isAdmin?: boolean;
};

export default function PartnerForm({ partner, isAdmin }: PartnerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<PlanType>("FREE");
  const { update } = usePartnerMutations();

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setEmail(partner.email);
      setPhone(fieldFormatter.phone(partner.phone ?? ""));
      setPlan(partner.plan ?? "");
    }
  }, [partner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = FormValidator.validateAll({ name, email, phone });
    if (isValid) {
      update.mutate({
        id: partner?.id,
        data: {
          name: fieldFormatter.name(name),
          email,
          phone,
          plan,
        },
      });
    }
  };

  return (
    <Card2
      key={partner?.id ?? ""}
      className={`w-full py-2 ${partner?.plan === "FREE" ? "bg-bronze" : partner?.plan === "BASIC" ? "bg-silver" : "bg-gold"}`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">
          {isAdmin ? "Editar parceiro" : "Editar minhas informaçoes"}
        </h1>
        <label className="flex flex-col">
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded bg-white/5 p-2"
            required
          />
        </label>
        <label className="flex flex-col">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded bg-white/5 p-2"
            required
          />
        </label>
        <label className="flex flex-col">
          Telefone/WhatsApp:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            className="rounded bg-white/5 p-2"
            required
          />
        </label>
        {isAdmin && (
          <label className="flex flex-col">
            Plano:
            <SelectPlan option={plan ?? ""} onChange={setPlan} />
          </label>
        )}

        <button
          type="submit"
          disabled={update.isPending}
          className="bg-gray rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {update.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </Card2>
  );
}
