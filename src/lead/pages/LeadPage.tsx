import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal";
import LeadForm from "../components/LeadForm";
import useLead from "../hooks/useLead";
import { ProductOutputDto } from "../../product/services/productService";
import { LeadOutputDto } from "../services/leadService";
import { useNavigate, useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { useLeadMutations } from "../hooks/useLeadMutations";
import Tooltip from "../../components/Tooltip";
import { useEvent } from "../../event/hooks/useEvent";

export default function LeadPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const {
    queryLeads: { data: leads },
  } = useLead();

  const {
    queryEvent: { data: event },
  } = useEvent(eventId);

  const { deleteSeller } = useLeadMutations();

  // const { createOrUpdate } = useLeadMutations();

  // useEffect(() => {
  //   setLeads(mockLeads);
  // }, []);

  // const handleEdit = (id: string) => {
  //   alert(`Editar lead ${id}`);
  // };

  // const handleDelete = (id: string) => {
  //   const confirm = window.confirm("Tem certeza que deseja deletar?");
  // };

  return (
    <>
      <div className="mx-auto w-full">
        <header className="mb-4 flex items-center justify-between text-2xl font-bold">
          <h1>Leads ({leads?.length})</h1>
          <h1>Evento: {event?.name}</h1>
        </header>

        {leads?.length === 0 ? (
          <p className="text-gray-600">Nenhum lead encontrado.</p>
        ) : (
          <div className="rounded-xl border border-gray-500/15">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 font-semibold">
                <tr>
                  <th className="w-[150px] p-2">Nome</th>
                  <th className="w-[180px] p-2">Email</th>
                  <th className="w-[140px] p-2">Telefone</th>
                  <th className="w-[120px] p-2">Fonte</th>
                  <th className="w-[200px] p-2">Interesse</th>
                  <th className="w-[120px] p-2">Criado em</th>
                  <th className="w-[120px] p-2">Ações</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="min-w-full text-left text-sm">
                <tbody>
                  {leads?.map((lead: LeadOutputDto) => (
                    <tr
                      key={lead.id}
                      className="border-t border-gray-500/15 hover:bg-slate-700"
                    >
                      <td className="w-[150px] p-2 whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="w-[180px] p-2 whitespace-nowrap">
                        {lead.email || "-"}
                      </td>
                      <td className="w-[140px] p-2 whitespace-nowrap">
                        {lead.phone || "-"}
                      </td>
                      <td className="w-[120px] p-2 whitespace-nowrap">
                        {lead.source}
                      </td>
                      <td className="w-[200px] p-2">
                        {lead?.products?.length > 0 ? (
                          <ul className="list-inside list-disc">
                            {lead.products.map((item: ProductOutputDto) => (
                              <li key={item.id}>{item.name}</li>
                            ))}
                          </ul>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="w-[120px] p-2 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="flex w-[120px] gap-2 p-2">
                        <Modal id={lead.id} icon="carbon:edit" info="Editar">
                          <LeadForm eventId={eventId} lead={lead} />
                        </Modal>
                        <Modal
                          id="LeadPageDeleteForm"
                          icon="carbon:trash-can"
                          info="Deletar"
                        >
                          <Dialog
                            message="Deseja excluir o lead?"
                            onClick={() =>
                              deleteSeller.mutate({
                                eventId: eventId ?? "",
                                leadId: lead.id,
                              })
                            }
                          />
                        </Modal>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 flex w-full items-center justify-between rounded-t-2xl bg-slate-950 p-2 shadow-lg shadow-black/15 transition-all duration-300 ease-in-out lg:static lg:w-full lg:rounded-2xl">
        <Tooltip info="Voltar">
          <div
            className="cursor-pointer rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
            onClick={() => navigate(-1)}
          >
            <Icon icon="hugeicons:link-backward" width="20" />
          </div>
        </Tooltip>

        <Modal
          id="LeadPageSellerForm"
          className="bg-slate-900"
          icon={<Icon icon="ic:baseline-plus" width="20" />}
          info="Add lead"
        >
          <LeadForm eventId={eventId} />
        </Modal>
        <Tooltip info="Baixar relatório">
          <div
            className="cursor-pointer rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
            // onClick={() => navigate(-1)}
          >
            <Icon icon="fluent-mdl2:report-document" width="20" />
          </div>
        </Tooltip>
      </nav>
    </>
  );
}
