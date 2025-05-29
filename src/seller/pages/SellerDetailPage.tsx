import FlexSection from "../../components/FlexSection";
import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import useSeller from "../hooks/useSeller";
import SellerForm from "../components/SellerForm";
import Dialog from "../../components/Dialog";
import { useSellerMutations } from "../hooks/useSellerMutations";
import Card from "../../components/Card";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { useEvent } from "../../event/hooks/useEvent";
import { EventOutputDto } from "../../event/services/eventService";
import { SellerOutputDto } from "../services/sellerService";
import Accordion from "../../components/Accordion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fieldFormatter } from "../../helpers/fieldFormatter";

export default function SellerDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sellerId } = useParams<{ sellerId: string }>();
  const {
    querySeller: { data: seller, isLoading, error },
  } = useSeller(sellerId);

  const {
    queryEvents: { data: events },
  } = useEvent();

  const sellerEvents = events?.filter((ev: EventOutputDto) =>
    ev?.allSellers?.filter((se: SellerOutputDto) => se.id === sellerId),
  );

  // const {
  //   queryProducts: { data: products },
  // } = useProduct();

  const { deleteSeller } = useSellerMutations();

  // const currentSeller =
  //   currentEvent ??
  //   currentEvent.allSellers.filter((se: any) => se?.id === sellerId);
  // const allSalesBySeller = currentEvent?.sales.filter(
  //   (sa: any) => sa.sellerId === sellerId,
  // );
  if (isLoading) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <FlexSection>
        <Card
          key={seller?.id}
          icon="bxs:user"
          color={"blue"}
          isSelected
          header={
            <>
              <FlexSection className="items-start">
                <InfoLine value={seller?.name} size="base" />
                <InfoLine label="E-mail:" value={seller?.email} size="sm" />
                <InfoLine
                  label="Telefone:"
                  value={fieldFormatter.phone(seller.phone ?? "")}
                  size="sm"
                />
              </FlexSection>
            </>
          }
          footer={
            <>
              <Modal id="SellerDetailPageSellerForm" icon="carbon:edit">
                <SellerForm seller={seller} />
              </Modal>
              <Modal
                id="SellerDetailPageDeleteSellerForm"
                icon="carbon:trash-can"
              >
                <Dialog
                  message="Deseja excluir o vendedor?"
                  onClick={() => {
                    deleteSeller.mutate({ sellerId: seller?.id }), navigate(-1);
                  }}
                />
              </Modal>
            </>
          }
        >
          <Accordion
            title={<div>Meus eventos</div>}
            content={sellerEvents?.map((ev: EventOutputDto, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-500/15 py-2"
              >
                <InfoLine label="Evento:" value={ev.name} line="col" />
                <Icon
                  icon="hugeicons:link-forward"
                  width="30"
                  onClick={() =>
                    navigate(`/events/${ev.id}`, {
                      state: { backgroundLocation: location },
                    })
                  }
                  className="hover:text-cyan-400"
                />
              </div>
            ))}
          />
        </Card>
      </FlexSection>
    </>
  );
}
