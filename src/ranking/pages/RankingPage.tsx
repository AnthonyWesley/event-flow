import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import EventForm from "../../event/components/EventForm";
import SaleForm from "../../sale/components/SaleForm";
import Dialog from "../../components/Dialog";
import RankingDisplay from "../components/RankingDisplay";
import Modal from "../../components/Modal";
import { useEvent } from "../../event/hooks/useEvent";
import useRanking from "../hooks/useRanking";
import SellerForm from "../../seller/components/SellerForm";
import ChangeButton from "../../components/ChangeButton";
import SaleList from "../../sale/components/SaleList";
import useProduct from "../../product/hooks/useProduct";
import { useState } from "react";
import { SalesOrSellersItem } from "../types/SalesOrSellersItem";
import { SalesOrSellersKey } from "../types/SalesOrSellersKey";
import Tooltip from "../../components/Tooltip";
import EventIcon from "../../icons/eventIcon";
import InfoList from "../../components/InfoList";
import ProgressBar from "../../components/ProgressBar";
import { goalUtils } from "../../helpers/goalUtils";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import GameDisplay from "../components/GameDisplay";

export const eventsLinks = [
  {
    href: "/sellers",
    text: "Vendedores",
    icon: "tdesign:user-list-filled",
  },
  {
    href: "/sales",
    text: "Vendas",
    icon: "hugeicons:sale-tag-01",
  },
];

export default function RankingPage() {
  const {
    queryEvents: { isPending, error },
    currentEvent,
  } = useEvent();

  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  const { toggleEvent, handleDelete } = useRanking(currentEvent);
  const [list, setList] = useState<SalesOrSellersKey>("SELLERS");

  if (isPending) return <Spin />;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  const changeList = (status: SalesOrSellersKey) => setList(status);

  const modalActions = [
    {
      id: "RankingPageEventForm",
      info: "Editar evento",
      icon: <EventIcon icon="PEN" />,
      children: <EventForm event={currentEvent} />,
    },
    {
      id: "RankingPageEventDeleteForm",
      info: "Deletar Evento",
      icon: "carbon:trash-can",
      children: (
        <Dialog
          message="Deseja excluir o evento?"
          onClick={handleDelete}
          color="bg-rose"
        />
      ),
    },
    {
      id: "RankingPageEventToggleForm",
      info: !currentEvent?.endDate ? "Finalizar Evento" : "Ativar Evento",
      icon: (
        <Icon
          icon="lets-icons:on-button"
          width="20"
          className={
            currentEvent?.endDate
              ? "text-gray-400"
              : "animate-pulse text-green-400"
          }
        />
      ),
      children: (
        <Dialog
          message={
            currentEvent?.endDate ? "Reativar evento?" : "Encerrar evento?"
          }
          onClick={toggleEvent}
          color="bg-green"
        />
      ),
    },
  ];

  const isSalesOrSellers: Record<SalesOrSellersKey, SalesOrSellersItem> = {
    SALES: {
      title: "Vendas",
      id: "RankingPageSaleForm",
      info: "Add venda",
      icon: "mi:shopping-cart-add",
      children: <SaleForm eventId={currentEvent?.id} />,
    },
    SELLERS: {
      title: "Vendedores",
      id: "RankingPageSellerForm",
      info: "Add vendedor",
      icon: "material-symbols:person-add",
      children: <SellerForm eventId={currentEvent?.id} />,
    },
  };

  const isValueGoal = currentEvent?.goalType === "VALUE";

  const totalGoal = goalUtils.getTotalForGoal(
    currentEvent?.allSellers,
    currentEvent?.goalType,
  );

  return (
    <>
      {currentEvent ? (
        <div className="flex w-full flex-col lg:flex-row">
          <GameDisplay
            className="bg-dark mt-2 flex-[2]"
            infoHeader={
              <div className="flex w-full justify-between p-2">
                <InfoLine value={currentEvent?.name} />
                <InfoLine
                  label="Total:"
                  value={
                    currentEvent?.goalType === "QUANTITY"
                      ? currencyFormatter.ToBRL(
                          goalUtils.getTotalForGoal(
                            currentEvent?.allSellers,
                            "VALUE",
                          ),
                        )
                      : goalUtils.getTotalForGoal(
                          currentEvent?.allSellers,
                          "QUANTITY",
                        )
                  }
                  color={goalUtils.handleGoalAchieved(
                    totalGoal,
                    currentEvent?.goal,
                  )}
                />
              </div>
            }
            infoFooter={
              <div className="flex w-full flex-col">
                <div className="flex justify-between">
                  <InfoLine
                    label="Total:"
                    value={
                      isValueGoal
                        ? currencyFormatter.ToBRL(totalGoal)
                        : totalGoal
                    }
                    color={goalUtils.handleGoalAchieved(
                      totalGoal,
                      currentEvent?.goal,
                    )}
                  />
                  <InfoLine
                    label="Meta:"
                    value={
                      isValueGoal
                        ? currencyFormatter.ToBRL(currentEvent?.goal)
                        : currentEvent?.goal + "unid"
                    }
                    color={goalUtils.handleGoalAchieved(
                      totalGoal,
                      currentEvent?.goal,
                    )}
                  />
                </div>
                <ProgressBar
                  total={currentEvent?.goal}
                  current={goalUtils.getTotalForGoal(
                    currentEvent?.allSellers,
                    currentEvent?.goalType,
                  )}
                />
              </div>
            }
          >
            <div className="flex w-full">
              <RankingDisplay event={currentEvent} mode="PODIUM" />
            </div>
          </GameDisplay>

          <GameDisplay
            className="mt-2 flex-[1]"
            infoHeader={
              <div className="w-full p-2">
                <InfoList
                  tittle={list === "SELLERS" ? "Ranking" : "Vendas"}
                  icon={
                    list === "SELLERS"
                      ? "game-icons:podium-winner"
                      : "mi:shopping-cart"
                  }
                  length={
                    list === "SELLERS"
                      ? currentEvent?.allSellers?.length
                      : currentEvent?.sales?.length
                  }
                  className="bg-slate-950"
                />
              </div>
            }
            infoFooter={<div className="p-5">{""}</div>}
          >
            <div className="scrollbar-transparent flex max-h-[35vh] w-full flex-1 flex-col bg-slate-900 lg:max-h-[60vh]">
              <div className="flex-1 overflow-y-auto">
                {list === "SALES" && currentEvent?.allSellers?.length > 0 && (
                  <SaleList
                    sales={currentEvent?.sales}
                    sellers={currentEvent?.allSellers}
                    products={products}
                  />
                )}

                {list === "SELLERS" && (
                  <RankingDisplay
                    event={currentEvent}
                    mode={currentEvent?.sales <= 0 ? "NORMAL" : "OTHERS"}
                  />
                )}
              </div>
            </div>
          </GameDisplay>

          <GameDisplay className="mt-2">
            <nav className="fixed bottom-0 left-0 flex w-full items-center justify-between rounded-t-2xl bg-slate-950 p-2 shadow-lg shadow-black/15 transition-all duration-300 ease-in-out lg:static lg:h-full lg:w-20 lg:flex-col lg:rounded-l-none lg:rounded-tr-2xl">
              <Tooltip
                info={`${list === "SALES" ? "Vendas" : "Vendedores"}`}
                className="cursor-pointer rounded-full border border-gray-100/15 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
              >
                <ChangeButton onChange={changeList} />
              </Tooltip>

              <Modal
                info={isSalesOrSellers[list].info}
                id={isSalesOrSellers[list].id}
                icon={isSalesOrSellers[list].icon}
              >
                {isSalesOrSellers[list].children}
              </Modal>

              {modalActions.map((modal) => (
                <Modal
                  key={modal.id}
                  info={modal.info}
                  id={modal.id}
                  icon={modal.icon}
                >
                  {modal.children}
                </Modal>
              ))}
            </nav>
          </GameDisplay>
        </div>
      ) : (
        <div className="shadow-basic mb-2 flex w-full flex-col items-center justify-end gap-1 rounded-md border border-gray-100/15 p-2 italic">
          Nenhum evento ativo no momento!
          <div>Criar evento</div>
          <Modal
            info="Criar"
            id="RankingPageEventForm2"
            icon={<Icon icon="ic:baseline-plus" width="40" />}
          >
            <EventForm event={currentEvent} />
          </Modal>
        </div>
      )}
    </>
  );
}
