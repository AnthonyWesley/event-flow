import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import { formatDate } from "../../helpers/formatDate";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import usePartner from "../hooks/usePartner";
import PartnerForm from "../components/partnerForm";
import Modal from "../../components/Modal";

export default function PartnerPage() {
  const {
    queryPartner: { isPending, error, data },
  } = usePartner();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <section className="mx-auto mt-4 w-96 place-items-center">
        <Card
          key={data.id}
          icon={"ri:map-pin-user-fill"}
          color={"bg-gray"}
          footer={
            <Modal id="PartnerPagePartnerForm" icon="carbon:edit">
              <PartnerForm partner={data} />
            </Modal>
          }
        >
          <FlexSection className="flex-row">
            <InfoLine label="Name:" value={data.name} />
            <InfoLine label="Plano:" value={data.plan} />
          </FlexSection>

          <FlexSection className="items-start">
            <InfoLine label="email:" value={data.email} />
            <InfoLine label="Telefone:" value={data.phone} />
          </FlexSection>

          <FlexSection className="flex-row">
            <InfoLine label="Status:" value={data.status} />

            <InfoLine label="Trail até:" value={formatDate(data.trialEndsAt)} />
          </FlexSection>
        </Card>
      </section>
    </>
  );
}
