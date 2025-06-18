import { Icon } from "@iconify/react/dist/iconify.js";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import { useEvent } from "../hooks/useEvent";
import { EventOutputDto } from "../services/eventService";
import HeaderRanking from "../../ranking/components/HeaderRanking";
import { formatDate } from "../../helpers/formatDate";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import Modal from "../../components/Modal";
import Accordion from "../../components/Accordion";
import { useEffect, useRef, useState } from "react";
import NavAction from "../../components/NavAction";
import InputSearch from "../../components/InputSearch";

type StatusEvent = {
  CREATED: EventOutputDto[];
  ACTIVE: EventOutputDto[];
  FINISH: EventOutputDto[];
};
export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);
  const {
    queryEvents: { data: events, error },
  } = useEvent(undefined, debouncedSearch);

  if (error)
    return <p className="text-red-500">Ocorreu um erro: {error.message}</p>;

  const statusEvents: StatusEvent = {
    ACTIVE: events
      ?.filter((event: EventOutputDto) => event.isActive)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    CREATED: events
      ?.filter((event: EventOutputDto) => !event.isActive && !event.endDate)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    FINISH: events
      ?.filter((event: EventOutputDto) => !event.isActive && event.endDate)
      .sort(
        (a: any, b: any) =>
          new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime(),
      ),
  };

  const sections = [
    { title: "Em Andamento", key: "ACTIVE", color: "orange" },
    { title: "Não Iniciados", key: "CREATED", color: "gray" },
    { title: "Finalizados", key: "FINISH", color: "slate" },
  ];

  return (
    <>
      <section className="flex flex-col gap-2 px-4 font-bold sm:flex-row sm:items-center sm:justify-between">
        <header className="mt-1 flex w-full justify-between">
          <InputSearch
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar... Eventos"
            onOpenChange={setIsSearchOpen}
          />

          <div
            className={`flex items-center gap-4 transition-all duration-900 ${
              isSearchOpen
                ? "pointer-events-none hidden -translate-x-10"
                : "translate-x-0 opacity-100"
            }`}
          >
            <h1 className="mr-10 text-xl font-semibold text-white">EVENTOS</h1>
          </div>
          <Modal
            id="EventsPageEventForm"
            className="hidden bg-slate-900 lg:flex"
            icon={<Icon icon="ic:baseline-plus" width="20" />}
          >
            <EventForm />
          </Modal>
          <NavAction className="justify-center lg:hidden">
            <Modal
              id="EventsPageEventForm"
              className="bg-slate-900"
              icon={<Icon icon="ic:baseline-plus" width="20" />}
            >
              <EventForm />
            </Modal>
          </NavAction>
        </header>
      </section>

      <section className="px-4">
        {sections?.map(({ title, key }) => {
          const list = statusEvents[key as keyof typeof statusEvents];

          return (
            <Accordion
              key={key}
              title={
                <h2 className="py-2 text-lg font-semibold text-slate-300">
                  {title} ({list?.length})
                </h2>
              }
              startOpen={list?.length > 0}
              content={
                <section key={key} className="py-2">
                  {list?.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Nenhum evento encontrado.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                      {list?.map((event: EventOutputDto) => (
                        <div
                          key={event.id}
                          className={`transition duration-300 ${
                            key === "ACTIVE"
                              ? "bg-gold"
                              : key === "CREATED"
                                ? "bg-silver"
                                : "bg-slate-900"
                          } w-full cursor-pointer rounded-lg transition-opacity duration-200 hover:opacity-90 ${
                            event.isActive ? "opacity-100" : "opacity-80"
                          } hover:shadow-[0_0_10px_#dfb005]`}
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          <div className="mx-auto mt-2 flex flex-col place-items-center gap-4 rounded-lg bg-slate-900 p-4">
                            <HeaderRanking event={event} />
                            <FlexSection className="w-full flex-row justify-between border-t border-gray-500/15">
                              <InfoLine
                                line="col"
                                label="Início:"
                                value={formatDate(event.createdAt)}
                              />
                              <InfoLine
                                line="col"
                                label={
                                  event.endDate
                                    ? "Finalizado:"
                                    : event.isActive
                                      ? "Status:"
                                      : "Status:"
                                }
                                value={
                                  event.endDate
                                    ? formatDate(event.endDate)
                                    : event.isActive
                                      ? "Ativo"
                                      : "Não iniciado"
                                }
                                color={
                                  event.isActive
                                    ? "green"
                                    : event.endDate
                                      ? "gray"
                                      : "yellow"
                                }
                              />
                            </FlexSection>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              }
            />
          );
        })}
      </section>
    </>
  );
}
