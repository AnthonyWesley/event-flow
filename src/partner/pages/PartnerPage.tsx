import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import { formatDate } from "../../helpers/formatDate";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import usePartner from "../hooks/usePartner";
import PartnerForm from "../components/partnerForm";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import Dialog from "../../components/Dialog";

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
    <>
      <section className="mx-auto mt-4 min-w-90 place-items-center">
        <Card
          key={data.id}
          icon={"ri:map-pin-user-fill"}
          color={"bg-gray"}
          footer={
            <>
              <Modal
                id="PartnerLogout"
                icon={
                  <Icon
                    icon="qlementine-icons:log-in-16"
                    width="20"
                    rotate={90}
                  />
                }
                info="Sair do app"
              >
                <Dialog message="Deseja sair do app?" onClick={logout} />
              </Modal>

              <Modal
                id="PartnerPagePartnerForm"
                icon="carbon:edit"
                info="Editar"
              >
                <PartnerForm partner={data} />
              </Modal>
            </>
          }
        >
          <FlexSection className="flex-row">
            <InfoLine label="Name:" value={data.name} line="col" />
            <div
              className={`rounded-lg p-2 ${data.plan === "FREE" ? "bg-bronze" : data.plan === "BASIC" ? "bg-silver" : "bg-gold"}`}
            >
              <InfoLine value={data.plan} />
            </div>
          </FlexSection>

          <FlexSection className="items-start">
            <InfoLine label="email:" value={data.email} line="col" />
            <InfoLine
              label="Telefone:"
              value={fieldFormatter.phone(data.phone ?? "")}
              line="col"
            />
          </FlexSection>

          <FlexSection className="flex-row">
            <InfoLine label="Status:" value={data.status} line="col" />

            <InfoLine
              label="Trail até:"
              value={formatDate(data.trialEndsAt)}
              line="col"
            />
          </FlexSection>
        </Card>
      </section>
    </>
  );
}
