import { Icon } from "@iconify/react/dist/iconify.js";
import { PartnerOutputDto } from "../../partner/services/partnerService";
import useAdm from "../hooks/useAdm";
import useAdmMutate from "../hooks/useAdmMutate";
import Modal from "../../components/Modal";
import PartnerForm from "../components/AdmForm";
import Tooltip from "../../components/Tooltip";
import Dialog from "../../components/Dialog";
import { useNavigate } from "react-router-dom";
import { usePartnerMutations } from "../../partner/hooks/usePartnerMutations";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import { fieldFormatter } from "../../helpers/fieldFormatter";

import MultiSectionEntityListPage from "../../components/MultiSectionEntityListPage";
import NavAction from "../../components/NavAction";

export default function AdmPage2() {
  const navigate = useNavigate();

  const { accessPartner, activePartner, suspendPartner } = useAdmMutate();
  const { update } = usePartnerMutations();

  const handleAccessPartner = (partner: PartnerOutputDto) => {
    localStorage.removeItem("accessToken");
    accessPartner.mutate(partner.id);
  };

  const handleStatusPartner = (partner: PartnerOutputDto) => {
    if (partner.status === "SUSPENDED") {
      activePartner.mutate(partner.id);
    } else {
      suspendPartner.mutate(partner.id);
    }
  };
  const logout = () => {
    localStorage.removeItem("admAccessToken");
    localStorage.removeItem("accessToken");
    navigate("/adm");
  };
  return (
    <>
      <NavAction className="top-0 h-18">
        <Modal
          id="PartnerLogout"
          icon={
            <Icon icon="qlementine-icons:log-in-16" width="20" rotate={90} />
          }
          info="Sair do app"
        >
          <Dialog message="Deseja sair do app?" onClick={logout} />
        </Modal>
        <h1 className="test-center text-xl font-semibold text-cyan-400">
          ADMIN
        </h1>
        <img
          // src="./images/bg-3.jpg"
          src="/images/logo.png"
          alt=""
          className="max-w-[60px] self-center md:flex lg:flex"
        />
      </NavAction>
      <section>
        <MultiSectionEntityListPage<PartnerOutputDto>
          title="PARCEIROS"
          searchPlaceholder="Buscar... Eventos"
          useQuery={(search) => {
            const { data, isLoading, error } = useAdm(search).queryPartners;
            return {
              data,
              isLoading,
              error: error ?? undefined,
            };
          }}
          // FormModal={<EventForm />}
          onItemClick={() => {}}
          CardComponent={(partner) => (
            <Card
              key={partner.id}
              header={
                <h1 className="ml-auto px-2 font-extrabold text-slate-900">
                  {partner.plan}
                </h1>
              }
              className={`w-full pt-[1px] ${
                partner.plan === "FREE"
                  ? "bg-bronze"
                  : partner.plan === "BASIC"
                    ? "bg-silver"
                    : partner.status === "SUSPENDED"
                      ? "bg-slate-700"
                      : "bg-gold"
              }`}
              childrenStyle={`hover:shadow-[0_0_10px_#dee5ec]`}
            >
              <FlexSection className={`w-full gap-2 p-2`}>
                {/* <Avatar icon="bxs:user" image={partner.photo} className="my-1" /> */}
                <div
                  className={`flex w-full flex-col items-start gap-1 border-b border-gray-500/15 ${partner.status === "SUSPENDED" ? "opacity-40" : ""}`}
                >
                  <InfoLine
                    value={fieldFormatter.name(partner?.name)}
                    size="base"
                  />
                  <InfoLine label="E-mail:" value={partner.email} size="sm" />
                  <InfoLine
                    label="Telefone:"
                    value={fieldFormatter.phone(partner.phone ?? "")}
                    size="sm"
                  />
                  <InfoLine
                    label="Expirado em:"
                    value={new Date(
                      partner.accessExpiresAt,
                    ).toLocaleDateString()}
                    size="sm"
                  />
                  <InfoLine
                    label="Criado em:"
                    value={new Date(partner.createdAt).toLocaleDateString()}
                    size="sm"
                  />
                </div>
                <nav className="flex w-full justify-evenly gap-2">
                  <Modal
                    id={`AdminToggleForm-${partner.id}-${partner.status}`}
                    info={
                      partner?.status === "SUSPENDED" ? "Ativar" : "Suspender"
                    }
                    icon={
                      <Icon
                        icon="lets-icons:on-button"
                        width="20"
                        className={
                          partner?.status === "SUSPENDED"
                            ? "text-slate-400"
                            : "text-green-500"
                        }
                      />
                    }
                  >
                    <Dialog
                      message={
                        partner?.status === "SUSPENDED"
                          ? `Reativar ${partner?.name}?`
                          : `Suspender ${partner?.name}?`
                      }
                      onClick={() => handleStatusPartner(partner)}
                      color="bg-green"
                      disabled={update.isPending}
                      admin
                    />
                  </Modal>
                  <Modal
                    id={`AdmPageForm-${partner.id}`}
                    icon="carbon:edit"
                    info="Editar"
                  >
                    <PartnerForm partner={partner} isAdmin />
                  </Modal>

                  <Tooltip info="Logar">
                    <div
                      className="cursor-pointer self-end rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                      onClick={() => handleAccessPartner(partner)}
                    >
                      <Icon icon="qlementine-icons:log-in-16" width="20" />
                    </div>
                  </Tooltip>
                </nav>
              </FlexSection>
            </Card>
          )}
          sections={[
            {
              title: "Ativos",
              key: "ACTIVE",
              filter: (e) => e.status === "ACTIVE",
            },
            {
              title: "Suspensos",
              key: "SUSPENDED",
              filter: (e) => e.status === "SUSPENDED",
            },
          ]}
        />
      </section>
    </>
  );
}
