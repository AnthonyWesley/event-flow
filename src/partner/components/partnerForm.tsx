import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { FormValidator } from "../../helpers/FormValidator";
import { PartnerOutputDto } from "../services/partnerService";
import { usePartnerMutations } from "../hooks/usePartnerMutations";
import { formatPhoneNumber } from "../../auth/components/authForm";

export type PartnerProps = {
  partner?: PartnerOutputDto;
};

export default function PartnerForm({ partner }: PartnerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  //   const [plan, setPlan] = useState<PlanType>("FREE");
  const { update } = usePartnerMutations();

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setEmail(partner.email);
      setPhone(partner.phone);
    }
  }, [partner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = FormValidator.validateAll({ name, email });
    if (isValid) {
      update.mutate({
        id: partner?.id,
        data: {
          name: fieldFormatter.name(name),
          email,
          phone,
        },
      });
    }
  };

  return (
    <Card key={partner?.id ?? ""} color="green">
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
        <button
          type="submit"
          disabled={update.isPending}
          className="bg-gray rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {update.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </Card>
  );
}
