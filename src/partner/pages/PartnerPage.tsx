import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import { formatDate } from "../../helpers/formatDate";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import usePartner from "../hooks/usePartner";
import PartnerForm from "../components/partnerForm";
import Modal from "../../components/Modal";
import Tooltip from "../../components/Tooltip";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

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
              <Tooltip info="Sair">
                <div
                  className="cursor-pointer self-end rounded-full border border-gray-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                  onClick={logout}
                >
                  <Icon icon="carbon:exit" width="20" />
                </div>
              </Tooltip>
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
            <InfoLine label="Plano:" value={data.plan} line="col" />
          </FlexSection>

          <FlexSection className="items-start">
            <InfoLine label="email:" value={data.email} line="col" />
            <InfoLine label="Telefone:" value={data.phone} line="col" />
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
