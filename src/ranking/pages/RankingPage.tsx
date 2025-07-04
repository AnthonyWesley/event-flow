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
import { useEffect, useState } from "react";
import { SalesOrSellersKey } from "../types/SalesOrSellersKey";
import Tooltip from "../../components/Tooltip";
import EventIcon from "../../icons/eventIcon";
import InfoList from "../../components/InfoList";
import ProgressBar from "../../components/ProgressBar";
import { goalUtils } from "../../helpers/goalUtils";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import GameDisplay from "../components/GameDisplay";
import NavAction from "../../components/NavAction";
import Select from "../../components/Select";
import { EventOutputDto } from "../../event/services/eventService";
import { usePersistedEvent } from "../hooks/usePersistedEvent";
import AnimatedSection from "../../components/AnimatedSection";
import SplitText from "../../components/SplitText";
import GoalAchievedModal from "../../components/GoalAchievedModal";

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
  const [showModal, setShowModal] = useState(false);
  const [alreadyTriggered, setAlreadyTriggered] = useState(false);
  const {
    queryEvents: { data: events = [], isPending, error },
  } = useEvent();

  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  const [list, setList] = useState<SalesOrSellersKey>("SELLERS");
  const activeEvents = events.filter(
    (event: EventOutputDto) => event?.isActive,
  );
  const { selectedEvent: showEvent, changeEvent: setShowEvent } =
    usePersistedEvent(activeEvents);
  const { toggleEvent } = useRanking(showEvent);

  const isValueGoal = showEvent?.goalType === "VALUE";
  const totalGoal = goalUtils.getTotalForGoal(
    showEvent?.allSellers ?? [],
    showEvent?.goalType ?? "VALUE",
  );

  const totalQuantity =
    showEvent?.sales?.reduce((acc, sale) => acc + (sale?.quantity ?? 0), 0) ??
    0;

  const changeList = (status: any) => setList(status);

  useEffect(() => {
    if (!showEvent || alreadyTriggered) return;

    const alreadyShown = localStorage.getItem(`goalAchieved-${showEvent.id}`);
    const total = totalGoal;
    const meta = showEvent?.goal;

    if (total >= meta && !alreadyShown) {
      setShowModal(true);
      setAlreadyTriggered(true);
      localStorage.setItem(`goalAchieved-${showEvent.id}`, "true");
    }
  }, [showEvent, alreadyTriggered, totalGoal]);

  if (isPending) return <Spin />;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  const modalActions = [
    {
      title: "ListaDeVendas",
      id: "RankingPageSaleForm",
      info: "Add venda",
      color: "text-rose-500",
      icon: "mi:shopping-cart-add",
      children: <SaleForm eventId={showEvent?.id} />,
    },
    {
      title: "ListaDeVendedores",
      id: "RankingPageSellerForm",
      info: "Add vendedor",
      icon: "material-symbols:person-add",
      children: <SellerForm eventId={showEvent?.id} />,
    },
    {
      title: "EditarEvento",
      id: "RankingPageEventForm",
      info: "Editar evento",
      icon: <EventIcon icon="PEN" />,
      children: <EventForm event={showEvent} />,
    },
    {
      title: "AtivarOuDesativarEvento",
      id: "RankingPageEventToggleForm",
      info: !showEvent?.endDate ? "Finalizar" : "Ativar",
      icon: (
        <Icon
          icon="lets-icons:on-button"
          width="20"
          className={
            showEvent?.endDate
              ? "text-gray-400"
              : "animate-pulse text-green-400"
          }
        />
      ),
      children: (
        <Dialog
          message={showEvent?.endDate ? "Reativar evento?" : "Encerrar evento?"}
          onClick={toggleEvent}
          color="bg-green"
        />
      ),
    },
  ];

  return (
    <>
      {/* <button
        onClick={() => localStorage.removeItem(`goalAchieved-${showEvent?.id}`)}
      >
        remover
      </button> */}
      {showModal && <GoalAchievedModal onClose={() => setShowModal(false)} />}
      {/* {showEvent && (
        <header className="mt-2">
          <Select
            selectList={activeEvents}
            selected={showEvent}
            onChange={setShowEvent}
            className="bg-gold rankingPageSelect text-lg font-bold text-slate-900"
          />
        </header>
      )} */}

      {showEvent ? (
        <div className="flex w-full flex-col lg:flex-row">
          {/* Principal Display */}
          <GameDisplay
            className="bg-dark flex-[2]"
            infoHeader={
              <header className="w-full">
                <Select
                  selectList={activeEvents}
                  selected={showEvent}
                  onChange={setShowEvent}
                  className="bg-gold rankingPageSelect w-full text-lg font-bold text-slate-900"
                />
              </header>
            }
            infoFooter={
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
                      ? showEvent?.allSellers?.length
                      : totalQuantity
                  }
                  className="bg-slate-950"
                />
              </div>
            }
          >
            <section className="mb-auto max-h-[55vh] w-full overflow-y-auto lg:max-h-[65vh]">
              {list === "SALES" && (
                <AnimatedSection className="flex flex-1">
                  <SaleList
                    sales={showEvent?.sales}
                    sellers={showEvent?.allSellers}
                    products={products}
                  />
                </AnimatedSection>
              )}
              {list === "SELLERS" && (
                <AnimatedSection className="flex flex-1">
                  <RankingDisplay event={showEvent} mode="PODIUM" />
                </AnimatedSection>
              )}
            </section>
          </GameDisplay>

          {/* Estatísticas */}
          <GameDisplay
            className="flex-[1]"
            infoHeader={
              <div className="flex w-full flex-col">
                <div className="flex justify-between">
                  <InfoLine
                    label="Meta:"
                    value={
                      isValueGoal
                        ? currencyFormatter.ToBRL(showEvent?.goal)
                        : `${showEvent?.goal} unid`
                    }
                    color={goalUtils.handleGoalAchieved(
                      totalGoal,
                      showEvent?.goal,
                    )}
                  />
                  <InfoLine
                    label="Total:"
                    value={
                      isValueGoal
                        ? currencyFormatter.ToBRL(totalGoal)
                        : totalGoal
                    }
                    color={goalUtils.handleGoalAchieved(
                      totalGoal,
                      showEvent?.goal,
                    )}
                  />
                </div>
                <ProgressBar total={showEvent?.goal} current={totalGoal} />
              </div>
            }
            infoFooter={<div className="py-5"></div>}
          >
            <div className="flex max-h-[60vh] w-full flex-1 flex-col bg-slate-900 lg:max-h-[65vh]">
              <div className="flex-1 overflow-y-auto">
                {list === "SELLERS" && (
                  <AnimatedSection className="text-sm">
                    <RankingDisplay
                      event={showEvent}
                      mode={showEvent?.sales.length <= 0 ? "NORMAL" : "OTHERS"}
                    />
                  </AnimatedSection>
                )}
                {list === "SALES" && (
                  <AnimatedSection>
                    <RankingDisplay event={showEvent} />
                  </AnimatedSection>
                )}
              </div>
            </div>
          </GameDisplay>

          {/* Ações */}
          <GameDisplay>
            <AnimatedSection>
              <NavAction position="vertical" className="lg:h-[80vh]">
                <Tooltip
                  info={list === "SALES" ? "Vendas" : "Vendedores"}
                  className="rankingPageChangeList cursor-pointer rounded-full border border-gray-100/15 opacity-80 hover:bg-[#142a49] hover:opacity-100"
                >
                  <ChangeButton onChange={changeList} />
                </Tooltip>
                {modalActions.map((modal) => (
                  <Modal
                    key={modal.id}
                    info={modal.info}
                    id={modal.id}
                    icon={modal.icon}
                    color={modal.color}
                    className={modal.title}
                  >
                    {modal.children}
                  </Modal>
                ))}
              </NavAction>
            </AnimatedSection>
          </GameDisplay>
        </div>
      ) : (
        <>
          <div className="shadow-basic Logo bg-dark my-2 flex w-full flex-col items-center justify-end gap-1 rounded-md border border-gray-100/15 p-2 italic">
            <img
              // src="./images/bg-3.jpg"
              src="./images/logo-1.svg"
              alt=""
              className="max-w-[300px] p-8 md:flex lg:flex"
            />
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-2">
            <SplitText message="Nenhum evento ativo no momento!" />
            <Modal
              info="Criar evento"
              id="RankingPageEventForm2"
              className="RankingCreateEvent mt-10 text-cyan-400"
              icon={<Icon icon="ic:baseline-plus" width="40" />}
            >
              <EventForm event={showEvent} />
            </Modal>
          </div>
        </>
      )}
    </>
  );
}
