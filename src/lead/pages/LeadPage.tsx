import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal";
import LeadForm from "../components/LeadForm";
import useLead from "../hooks/useLead";
import { ProductOutputDto } from "../../product/services/productService";
import { LeadOutputDto } from "../services/leadService";
import { useParams } from "react-router-dom";

export default function LeadPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const {
    queryLeads: { data: leads },
  } = useLead();

  // useEffect(() => {
  //   setLeads(mockLeads);
  // }, []);

  const handleEdit = (id: string) => {
    alert(`Editar lead ${id}`);
  };

  // const handleDelete = (id: string) => {
  //   const confirm = window.confirm("Tem certeza que deseja deletar?");
  // };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-4 text-2xl font-bold">Leads</h1>
      <Modal
        id="LeadPageSellerForm"
        className="bg-slate-900"
        icon={<Icon icon="ic:baseline-plus" width="25" />}
      >
        <LeadForm eventId={eventId} />
      </Modal>
      {leads?.length === 0 ? (
        <p className="text-gray-600">Nenhum lead encontrado.</p>
      ) : (
        <div className="overflow-auto rounded-xl">
          <table className="min-w-full border border-gray-500/15 text-left text-sm">
            <thead className="bg-slate-900 font-semibold">
              <tr>
                <th className="p-2">Nome</th>
                <th className="p-2">Email</th>
                <th className="p-2">Telefone</th>
                <th className="p-2">Fonte</th>
                <th className="p-2">Interesse</th>
                <th className="p-2">Criado em</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads?.map((lead: LeadOutputDto) => (
                <tr
                  key={lead.id}
                  className="border-t border-gray-500/15 hover:bg-slate-700"
                >
                  <td className="p-2 whitespace-nowrap">{lead.name}</td>
                  <td className="p-2 whitespace-nowrap">{lead.email || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{lead.phone || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{lead.source}</td>
                  <td className="p-2">
                    {lead?.products?.length > 0 ? (
                      <ul className="list-inside list-disc">
                        {lead?.products?.map((item: ProductOutputDto) => (
                          <li key={item.id}>{item.name}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="flex gap-2 p-2">
                    <button
                      onClick={() => handleEdit(lead.id)}
                      className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      // onClick={() => handleDelete(lead.id)}
                      className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
