import { useEffect, useState } from "react";
import { FormValidator } from "../../helpers/FormValidator";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { useSellerMutations } from "../hooks/useSellerMutations";
import { SellerOutputDto } from "../services/sellerService";
import Card from "../../components/Card";
import MultiSelectCombobox from "../../components/MultiSelectCombobox";
import { formatPhoneNumber } from "../../auth/components/authForm";
import { useEvent } from "../../event/hooks/useEvent";
import { toast } from "react-toastify";
import useSeller from "../hooks/useSeller";
// import { useGuestMutations } from "../../guest/hooks/useGuestMutations";

type SellerFormProps = {
  seller?: SellerOutputDto;
  eventId?: string;
};

export default function SellerForm({ seller, eventId }: SellerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<SellerOutputDto[]>([]);
  const [isCreateButton, setIsCreateButton] = useState(true);
  // const { sendEmail } = useGuestMutations();
  const { createOrUpdate } = useSellerMutations();
  const {
    querySellersByEvents: { data: sellersByEvent },
  } = useEvent(eventId);

  const {
    querySellers: { data: sellers },
  } = useSeller();

  useEffect(() => {
    if (seller) {
      setName(seller.name);
      setEmail(seller.email);
      setPhone(fieldFormatter.phone(seller.phone ?? "") ?? "");
    }
  }, [seller]);

  const clearForm = () => {
    if (!seller) {
      setName("");
      setEmail("");
      setPhone("");
    }
    setSelectedPeople([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreateButton) {
      const isValid = FormValidator.validateAll({ name, email, phone });
      if (!isValid) return;

      const sellerAlreadyExists = sellers?.some(
        (s: SellerOutputDto) =>
          s.email === email ||
          s.name.toLowerCase() === fieldFormatter.name(name).toLowerCase(),
      );
      const sellerAlreadyInEventExists = sellersByEvent?.some(
        (s: SellerOutputDto) =>
          s.email === email ||
          s.name.toLowerCase() === fieldFormatter.name(name).toLowerCase(),
      );

      if (sellerAlreadyInEventExists && !seller?.id) {
        toast.error("Este vendedor já está cadastrado para este evento.");
        return;
      }
      if (sellerAlreadyExists && !seller?.id) {
        toast.error("Este vendedor já está cadastrado.");
        return;
      }

      createOrUpdate.mutate(
        {
          sellerId: seller?.id,
          eventId,
          data: {
            name: fieldFormatter.name(name),
            email,
            phone,
            photo: "",
          },
        },
        { onSuccess: () => clearForm() },
        // {
        //   onSuccess: (createdSeller: any) => {
        //     clearForm();

        //     if (eventId && (seller?.id || createdSeller?.id)) {
        //       sendEmail.mutate({
        //         eventId,
        //         sellerId: seller?.id || createdSeller.id,
        //       });
        //     }
        //   },
        // },
      );
    } else {
      selectedPeople.forEach((person) => {
        createOrUpdate.mutate(
          {
            eventId,
            data: {
              name: fieldFormatter.name(person.name),
              email: person.email,
              phone: fieldFormatter.phone(person.phone ?? ""),
              photo: "",
            },
          },
          // {
          //   onSuccess: (createdSeller: any) => {
          //     if (eventId && createdSeller?.id) {
          //       sendEmail.mutate({
          //         eventId,
          //         sellerId: createdSeller.id,
          //       });
          //     }
          //   },
          // },
        );
      });

      setSelectedPeople([]);
    }
  };

  return (
    <Card key={seller?.id ?? ""} color="blue">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">
          {seller?.id ? "Editar Vendedor" : "Registro de Vendedor"}
        </h1>
        {eventId && (
          <div className="flex h-10 w-full">
            <button
              type="button"
              onClick={() => setIsCreateButton(true)}
              className={`w-full rounded-sm border border-gray-500/15 ${
                isCreateButton ? "bg-cyan-800 text-white" : "text-gray-500"
              }`}
            >
              Criar vendedor
            </button>
            <button
              type="button"
              onClick={() => setIsCreateButton(false)}
              className={`w-full rounded-sm border border-gray-500/15 ${
                !isCreateButton ? "bg-cyan-800 text-white" : "text-gray-500"
              }`}
            >
              Adicionar vendedor
            </button>
          </div>
        )}
        {isCreateButton && (
          <>
            <label className="flex flex-col">
              Nome:
              <input
                type="text"
                value={name ?? ""}
                onChange={(e) => setName(e.target.value)}
                className="rounded bg-white/5 p-2"
                required
              />
            </label>
            <label className="flex flex-col">
              Email:
              <input
                type="text"
                value={email ?? ""}
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
          </>
        )}
        {!isCreateButton && selectedPeople && (
          <MultiSelectCombobox
            selectedPeople={selectedPeople}
            setSelectedPeople={setSelectedPeople}
            eventId={eventId}
          />
        )}
        <button
          type="submit"
          disabled={createOrUpdate.isPending}
          className="bg-gray rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {createOrUpdate.isPending
            ? "Salvando..."
            : isCreateButton
              ? "Salvar"
              : "Adicionar selecionados"}
        </button>
      </form>
    </Card>
  );
}
