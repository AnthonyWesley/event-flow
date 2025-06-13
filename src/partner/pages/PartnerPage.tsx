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
import Avatar from "../../components/Avatar";
import Tooltip from "../../components/Tooltip";

export default function PartnerPage() {
  const {
    queryPartner: { isPending, error, data },
  } = usePartner();
  const navigate = useNavigate();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth");
  };

  return (
    <section
      className={`my-2 rounded-lg ${data.plan === "FREE" ? "bg-bronze" : data.plan === "BASIC" ? "bg-silver" : "bg-gold"}`}
    >
      <header
        className={`w-full rounded-lg px-2 text-right text-2xl font-bold text-slate-900`}
      >
        {data.plan}
      </header>
      <section className="mx-auto mt-4 flex min-w-90 flex-col place-items-center gap-4 rounded-lg bg-slate-900 p-4">
        <FlexSection className="w-full flex-row gap-2">
          <Avatar name={data?.name} className="size-30 lg:size-40" />
          <div className="w-full">
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
          <InfoLine label="Status:" value={data.status} line="col" />

          <InfoLine
            label="Acesso até:"
            value={formatDate(data.accessExpiresAt)}
            line="col"
          />
        </FlexSection>
        <NavAction>
          <Modal
            id="PartnerLogout"
            icon={
              <Icon icon="qlementine-icons:log-in-16" width="20" rotate={90} />
            }
            info="Sair do app"
          >
            <Dialog message="Deseja sair do app?" onClick={logout} />
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
    </section>
  );
}
