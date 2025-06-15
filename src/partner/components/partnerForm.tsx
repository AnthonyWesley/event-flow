import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { FormValidator } from "../../helpers/FormValidator";
import { PartnerOutputDto, PlanType } from "../services/partnerService";
import { usePartnerMutations } from "../hooks/usePartnerMutations";
import { formatPhoneNumber } from "../../auth/components/authForm";
import AccessExpiredWrapper from "../../components/AccessExpiredWrapper";

export type PartnerProps = {
  partner?: PartnerOutputDto;
};

export default function PartnerForm({ partner }: PartnerProps) {
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
      setPlan(partner.plan);
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
          phone: fieldFormatter.phone(phone ?? ""),
          plan,
        },
      });
    }
  };

  const hasChanges =
    fieldFormatter.name(name) !== fieldFormatter.name(partner?.name ?? "") ||
    email !== partner?.email ||
    fieldFormatter.phone(phone) !== fieldFormatter.phone(partner?.phone ?? "");

  return (
    <Card key={partner?.id ?? ""} color="">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">Editar Minhas informações</h1>
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
        <AccessExpiredWrapper>
          <button
            type="submit"
            disabled={!hasChanges || update.isPending}
            className="bg-gray w-full rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {update.isPending ? "Salvando..." : "Salvar"}
          </button>
        </AccessExpiredWrapper>
      </form>
    </Card>
  );
}
