import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import { formatDate } from "../../helpers/formatDate";
import FlexSection from "../../components/FlexSection";
import usePartner from "../hooks/usePartner";
import PartnerForm from "../components/partnerForm";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import Dialog from "../../components/Dialog";
import NavAction from "../../components/NavAction";
import Tooltip from "../../components/Tooltip";
import AvatarUploader from "../../components/AvatarUploader";
import partnerApi from "../../api/axios";
import Card from "../../components/Card";
import { useModalStore } from "../../store/useModalStore";

export default function PartnerPage() {
  const {
    queryPartner: { isPending, error, data },
  } = usePartner();
  const navigate = useNavigate();
  const { closeModal } = useModalStore();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth");
    closeModal("PartnerLogout");
  };

  const isPartnerSuspended =
    data?.status === "SUSPENDED"
      ? { tittle: "SUSPENSO", color: "red" }
      : { tittle: "ATIVO", color: "green" };

  return (
    <>
      <section className="flex w-full gap-1">
        <Card
          className={`w-full ${data.plan === "FREE" ? "bg-bronze" : data.plan === "BASIC" ? "bg-silver" : "bg-gold"}`}
          header={
            <header
              className={`w-full px-2 text-right text-2xl font-bold text-slate-900`}
            >
              {data.plan}
            </header>
          }
        >
          <section className="mr-auto flex min-w-90 flex-col place-items-center gap-4 p-4">
            <FlexSection className="w-full flex-row gap-2">
              <AvatarUploader
                name={data?.name}
                icon="ri:user-star-fill"
                image={data?.photo}
                onUpload={(file) => {
                  const formData = new FormData();
                  formData.append("photo", file);
                  return partnerApi.patch(
                    `/partner/${data?.id}/photo`,
                    formData,
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    },
                  );
                }}
                onSuccess={(res) => console.log("Upload concluído:", res)}
              />
              <div className="w-full border-l border-gray-500/15 px-2">
                <InfoLine label="Name:" value={data.name} line="col" />
                <InfoLine label="email:" value={data.email} line="col" />
                <InfoLine
                  label="Telefone:"
                  value={fieldFormatter.phone(data.phone ?? "")}
                  line="col"
                />
              </div>
            </FlexSection>

            <FlexSection className="w-full flex-row rounded-lg border border-gray-500/15 p-2">
              <InfoLine
                label="Status:"
                value={isPartnerSuspended.tittle}
                color={isPartnerSuspended.color}
                line="col"
              />

              <InfoLine
                label="Acesso até:"
                value={formatDate(data.accessExpiresAt)}
                color={isPartnerSuspended.color}
                line="col"
              />
            </FlexSection>
          </section>
        </Card>
        <NavAction className="lg:self-stretch" position="vertical">
          <Modal
            id="PartnerLogout"
            icon={
              <Icon icon="qlementine-icons:log-in-16" width="20" rotate={90} />
            }
            info="Sair do app"
          >
            <Dialog message="Deseja sair do app?" onClick={logout} admin />
          </Modal>

          <Modal id="PartnerPagePartnerForm" icon="carbon:edit" info="Editar">
            <PartnerForm partner={data} />
          </Modal>

          <Tooltip info="Leads">
            <div
              className="cursor-pointer self-end rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
              onClick={() => navigate(`/user/${"partner"}/leads`)}
            >
              <Icon icon="fluent:target-arrow-16-regular" width="20" />
            </div>
          </Tooltip>
        </NavAction>
      </section>
    </>
  );
}
