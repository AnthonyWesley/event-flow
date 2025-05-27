import FlexSection from "../../components/FlexSection";
import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import useSeller from "../hooks/useSeller";
import { SellerOutputDto } from "../services/sellerService";
import Card from "../../components/Card";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../../components/Modal";
import SellerForm from "../components/SellerForm";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function SellerPage() {
  const {
    querySellers: { data: sellers, isLoading, error },
  } = useSeller();

  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <header className="flex items-center justify-between text-xl font-bold">
        <span className="ml-4 flex w-full items-center justify-between p-1">
          <h1>VENDEDORES</h1>
          <Modal
            id="EventsPageEventForm"
            className="bg-slate-900"
            icon={<Icon icon="ic:baseline-plus" width="25" />}
          >
            <SellerForm />
          </Modal>
        </span>
      </header>
      <div className="grid w-full place-items-center gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {sellers?.map((seller: SellerOutputDto) => (
          <div
            key={seller.id}
            className="w-full"
            onClick={() =>
              navigate(`/sellers/${seller.id}`, {
                state: { backgroundLocation: location },
              })
            }
          >
            <Card key={seller.id} icon="bxs:user" color={"blue"}>
              <FlexSection className="items-start border-t border-t-gray-500/15">
                <InfoLine value={seller.name} size="base" />
                <InfoLine label="E-mail:" value={seller.email} size="sm" />
                <InfoLine label="Telefone:" value={seller.phone} size="sm" />
              </FlexSection>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
