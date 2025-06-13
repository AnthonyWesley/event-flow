import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal";
import LeadForm from "../components/LeadForm";
import useLead from "../hooks/useLead";
import { ProductOutputDto } from "../../product/services/productService";
import { LeadOutputDto } from "../services/leadService";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { useLeadMutations } from "../hooks/useLeadMutations";
import Tooltip from "../../components/Tooltip";
import { useEvent } from "../../event/hooks/useEvent";
import NavAction from "../../components/NavAction";
import Spin from "../../components/Spin";

export default function LeadPage() {
  const { type, eventId } = useParams<{ type: string; eventId: string }>();

  if (type !== "events" && type !== "user") {
    return <Navigate to="/unauthorized" replace />; // ou alguma página de erro
  }

  const navigate = useNavigate();
  const partnerLeads = eventId === "partner";

  const {
    queryLeadByEvent: {
      data: leadsByEvent,
      isPending: isPendingByEvent,
      error: errorByEvent,
    },
    queryLeads: { data: leads, isPending, error },
  } = useLead(partnerLeads ? undefined : eventId);
  console.log(eventId);

  const {
    queryEvent: { data: event },
  } = useEvent(partnerLeads ? undefined : eventId);

  const { deleteSeller } = useLeadMutations();

  if (isPending && isPendingByEvent) return <Spin />;
  if (error && errorByEvent) return "An error has occurred: ";

  const filterLeadList = partnerLeads ? leads : leadsByEvent;

  return (
    <>
      <div className="mx-auto w-full">
        <header className="mb-4 flex items-center justify-between text-xl font-bold">
          <h1>Leads ({filterLeadList?.length})</h1>
          {!partnerLeads && <h1>Evento: {event?.name}</h1>}
        </header>

        {leadsByEvent?.length === 0 ? (
          <p className="text-gray-600">Nenhum lead encontrado.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-500/15">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="w-full bg-slate-900 font-semibold">
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
                  {filterLeadList?.map((lead: LeadOutputDto) => (
                    <tr
                      key={lead.id}
                      className="w-full border-t border-gray-500/15 hover:bg-slate-700"
                    >
                      <td className="p-2 whitespace-nowrap">{lead.name}</td>
                      <td className="p-2 whitespace-nowrap">
                        {lead.email || "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {lead.phone || "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">{lead.source}</td>
                      <td className="p-2">
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
                      <td className="p-2 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="flex gap-2 p-2">
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
        <NavAction>
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
        </NavAction>
      </div>
    </>
  );
}
