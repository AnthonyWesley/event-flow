import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal";
import LeadForm from "../components/LeadForm";
import useLead from "../hooks/useLead";
import { LeadOutputDto } from "../services/leadService";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { useLeadMutations } from "../hooks/useLeadMutations";
import Tooltip from "../../components/Tooltip";
import { useEvent } from "../../event/hooks/useEvent";
import NavAction from "../../components/NavAction";
import Spin from "../../components/Spin";
import PremiumFeature from "../../components/PremiumFeature";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import AccessExpiredWrapper from "../../components/AccessExpiredWrapper";

export default function LeadPage() {
  const { type, eventId } = useParams<{ type: string; eventId: string }>();

  if (type !== "events" && type !== "user") {
    return <Navigate to="/unauthorized" replace />;
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

  const {
    queryEvent: { data: event },
  } = useEvent(partnerLeads ? undefined : eventId);

  const { deleteLead, exportLead } = useLeadMutations();
  const filterLeadList: LeadOutputDto[] =
    (partnerLeads ? leads : leadsByEvent) ?? [];

  if (isPending && isPendingByEvent) return <Spin />;
  if (error && errorByEvent) return "An error has occurred:";
  const sortedItems = [...filterLeadList]?.sort(
    (a, b) =>
      new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime(),
  );

  return (
    <div className="mx-auto w-full">
      <header className="mb-4 flex items-center justify-between text-xl font-bold">
        <h1>Leads ({sortedItems?.length})</h1>
        {!partnerLeads && <h1>Evento: {event?.name}</h1>}
      </header>

      {sortedItems?.length === 0 ? (
        <p className="text-gray-600">Nenhum lead encontrado.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-500/15 text-sm">
          <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
            <table className="w-full text-left">
              <thead className="w-full bg-slate-950 font-semibold">
                <tr>
                  <th className="p-2">Nome</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Telefone</th>
                  <th className="p-2">Origem</th>
                  <th className="p-2">Interesse nº1</th>
                  <th className="p-2">Interesse nº2</th>
                  <th className="p-2">Interesse nº3</th>
                  <th className="p-2">Criado em</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filterLeadList?.map((lead: LeadOutputDto, index) => (
                  <tr
                    key={lead.id}
                    className={`w-full border-t border-gray-500/15 hover:bg-slate-700 ${index % 2 === 0 ? "bg-slate-900" : "bg-slate-900/15"}`}
                  >
                    <td className="max-w-[220px] truncate p-2">{lead.name}</td>
                    <td className="max-w-[200px] truncate p-2">
                      {lead.email || "-"}
                    </td>
                    <td className="max-w-[200px] truncate p-2">
                      {fieldFormatter.phone(lead.phone || "-")}
                    </td>
                    <td className="p-2">{lead.source}</td>
                    {[0, 1, 2].map((i) => (
                      <td key={i} className="p-2">
                        {lead.products[i]?.name || "-"}
                      </td>
                    ))}
                    <td className="p-2">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <AccessExpiredWrapper>
                        <PremiumFeature className="flex gap-2">
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
                                deleteLead.mutate({
                                  eventId: eventId ?? "",
                                  leadId: lead.id,
                                })
                              }
                            />
                          </Modal>
                        </PremiumFeature>
                      </AccessExpiredWrapper>
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
        <PremiumFeature>
          {!partnerLeads && (
            <Modal
              id="LeadPageSellerForm"
              className="bg-slate-900"
              icon={<Icon icon="ic:baseline-plus" width="20" />}
              info="Add lead"
            >
              <LeadForm eventId={eventId} />
            </Modal>
          )}
        </PremiumFeature>
        <Tooltip info="Baixar relatório">
          <AccessExpiredWrapper>
            <PremiumFeature>
              <div
                className="cursor-pointer rounded-full border border-slate-100/15 p-3 text-yellow-400 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                onClick={() =>
                  exportLead.mutate(eventId === "partner" ? undefined : eventId)
                }
              >
                <Icon icon="line-md:file-download" width="30" />
              </div>
            </PremiumFeature>
          </AccessExpiredWrapper>
        </Tooltip>
      </NavAction>
    </div>
  );
}
