import FlexSection from "../../components/FlexSection";
import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import useSeller from "../hooks/useSeller";
import SellerForm from "../components/SellerForm";
import Dialog from "../../components/Dialog";
import { useSellerMutations } from "../hooks/useSellerMutations";
import Card from "../../components/Card";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";

export default function SellerDetailPage() {
  const navigate = useNavigate();

  const { sellerId } = useParams<{ sellerId: string }>();
  const {
    querySeller: { data: seller, isLoading, error },
  } = useSeller(sellerId);

  // const {
  //   queryEvents: { data: events },
  //   currentEvent,
  // } = useEvent();

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
                <InfoLine label="Telefone:" value={seller?.phone} size="sm" />
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
          <div>Meus eventos</div>
        </Card>
      </FlexSection>
    </>
  );
}
