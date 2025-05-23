import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import SellerForm from "./SellerForm";
import Dialog from "../../components/Dialog";
import { useSellerMutations } from "../hooks/useSellerMutations";
import Card from "../../components/Card";
import useProduct from "../../product/hooks/useProduct";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";
import SaleList from "../../sale/components/SaleList";
import Accordion from "../../components/Accordion";
import Modal from "../../components/Modal";
import { CircularProgress } from "../../components/CircularProgress";
import { useModalStore } from "../../store/useModalStore";
import CopyToClipboard from "../../components/CopyToClipboard";

interface SellerDetailByEventProps {
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalSalesCount: number;
    totalSalesValue: number;
  };

  event: any;
  sellerGoal: number;
  currentProgress: number;
  isValueGoal: boolean;
  goalLabel: string;
  index: number;
}

const getGoalColor = (currentProgress: number, sellerGoal: number) =>
  goalUtils.handleGoalAchieved(currentProgress, sellerGoal);

export default function SellerDetailByEvent({
  seller,
  event,
  sellerGoal,
  currentProgress,
  isValueGoal,
  goalLabel,
  index,
}: SellerDetailByEventProps) {
  // const [token, setToken] = useState(sessionStorage.getItem("accessToken"));
  const { deleteSeller } = useSellerMutations();
  const {
    queryProducts: { data: products = [] },
  } = useProduct();
  const { closeModal } = useModalStore();

  const goalColor = getGoalColor(currentProgress, sellerGoal);

  const allSalesBySeller = event?.sales?.filter(
    (sale: any) => sale.sellerId === seller.id,
  );

  // useEffect(() => {
  //   setToken(sessionStorage.getItem("accessToken"));
  // }, []);

  return (
    <div className="w-full">
      <Card
        key={seller.id}
        icon="bxs:user"
        color={"blue"}
        isSelected
        header={
          <>
            <FlexSection className="items-start">
              <InfoLine
                value={seller.name.split(" ").slice(0, 2).join(" ")}
                size="base"
              />
              <InfoLine label="E-mail:" value={seller.email} size="sm" />
              <InfoLine label="Telefone:" value={seller.phone} size="sm" />
            </FlexSection>

            <div className="ml-auto flex w-20 items-start justify-center border-l border-l-gray-500/15 pl-2 text-4xl">
              <h1> {index}</h1>
              <p className="text-base">º</p>
            </div>
          </>
        }
        footer={
          <>
            <Modal
              id="SellerDetailByEventSellerForm"
              info="Editar"
              icon="carbon:edit"
            >
              <SellerForm seller={seller} />
            </Modal>
            <Modal
              id="SellerDetailByEventDeleteForm"
              info="Deletar"
              icon="carbon:trash-can"
            >
              <Dialog
                message="Deseja excluir o vendedor?"
                onClick={() => {
                  deleteSeller.mutate(
                    {
                      sellerId: seller.id,
                      eventId: event.id,
                    },
                    { onSuccess: () => closeModal(seller.id) },
                  );
                }}
              />
            </Modal>
          </>
        }
      >
        <FlexSection className="flex-row justify-start border-t border-b border-gray-400/15">
          {/* <InfoLine label="Vendas:" value={event?.name} /> */}
          <CircularProgress total={sellerGoal} current={currentProgress} />
          <FlexSection className="items-start">
            <InfoLine
              label="Meta:"
              value={goalLabel}
              icon={!isValueGoal ? "iconoir:box-iso" : ""}
              color={goalColor}
            />
            {/* <ProgressBar
            total={sellerGoal}
            current={currentProgress}
            color={goalColor}
          /> */}

            <InfoLine
              label="Vendas:"
              value={seller.totalSalesCount}
              icon="iconoir:box-iso"
              color={!isValueGoal ? goalColor : ""}
            />

            <InfoLine
              label="Total:"
              value={currencyFormatter.ToBRL(seller.totalSalesValue)}
              color={isValueGoal ? goalColor : ""}
            />
          </FlexSection>
          <div className="ml-auto">
            <CopyToClipboard
              text={`https://event-flow-api.vercel.app/events/${event.id}/guest/${seller.id}`}
              label="Copiar Convite"
            />
          </div>
        </FlexSection>
        <Accordion
          title={<h1 className="text-gray-400">Minhas vendas</h1>}
          content={
            <>
              <FlexSection>
                {allSalesBySeller && allSalesBySeller.length > 0 ? (
                  <SaleList
                    sales={allSalesBySeller}
                    sellers={[seller]}
                    products={products}
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Nenhuma venda registrada.
                  </p>
                )}
              </FlexSection>
            </>
          }
        />
      </Card>
    </div>
  );
}
