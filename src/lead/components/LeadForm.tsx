import { useEffect, useState } from "react";
import { formatPhoneNumber } from "../../auth/components/authForm";
import Card from "../../components/Card";
import MultiSelectCombobox from "../../components/MultiSelectCombobox";
import { FormValidator } from "../../helpers/FormValidator";
import { useLeadMutations } from "../hooks/useLeadMutations";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { ProductOutputDto } from "../../product/services/productService";
import useProduct from "../../product/hooks/useProduct";
import AccessExpiredWrapper from "../../components/AccessExpiredWrapper";

type LeadFormProps = {
  eventId?: string;
  lead?: any;
};

export default function LeadForm({ eventId, lead }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  // const [notes, setNotes] = useState("");
  //   const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState<ProductOutputDto[]>([]);

  const { createOrUpdate } = useLeadMutations();
  const {
    queryProducts: { data: allProducts },
  } = useProduct();

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(fieldFormatter.phone(lead.phone ?? "") ?? "");
      setSource(lead.source);
      setSelectedItem(lead.products);
    }
  }, [lead]);

  // const clearForm = () => {
  //   if (!lead) {
  //     setName("");
  //     setEmail("");
  //     setPhone("");
  //   }
  //   setSelectedPeople([]);
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = FormValidator.validateAll({ name, phone });
    if (!isValid) return;

    createOrUpdate.mutate({
      eventId: eventId ?? "",
      leadId: lead?.id,
      data: {
        name: fieldFormatter.name(name),
        email,
        phone,
        eventId: eventId ?? "",
        source,
        products: selectedItem,
        // notes,
      },
    });
  };
  return (
    <Card key={eventId ?? ""} color="blue">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">
          {eventId ? "Editar Lead" : "Registro de Lead"}
        </h1>

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
            Telefone/WhatsApp:
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
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
              //   required
            />
          </label>

          <label className="flex flex-col">
            Fonte:
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="rounded bg-white/5 p-2"
              required
            />
          </label>
          <div className="flex flex-col">
            Interesse:
            <MultiSelectCombobox
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              uniqueItem={allProducts}
              placeholder="Produto de interesse..."
            />
          </div>
        </>

        {/* <label className="flex flex-col">
          Nota:
          <textarea
            name="Note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded bg-white/5 p-2"
            // required
          />
        </label> */}

        <AccessExpiredWrapper>
          <button
            type="submit"
            //   disabled={!hasChanges || createOrUpdate.isPending}
            className="bg-gray w-full rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {createOrUpdate.isPending ? "Salvando..." : "Salvar"}
          </button>
        </AccessExpiredWrapper>
      </form>
    </Card>
  );
}
