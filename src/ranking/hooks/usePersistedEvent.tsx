import { useState, useEffect } from "react";
import { EventOutputDto } from "../../event/services/eventService";

export function usePersistedEvent(events: EventOutputDto[] | undefined) {
  const [selectedEvent, setSelectedEvent] = useState<
    EventOutputDto | undefined
  >();

  useEffect(() => {
    if (!events || events.length === 0) return;

    const savedId = localStorage.getItem("selectedEventId");
    const found = events.find((e) => e.id === savedId);

    setSelectedEvent(found ?? events[0]);
  }, [events]);

  const changeEvent = (event: EventOutputDto) => {
    setSelectedEvent(event);
    localStorage.setItem("selectedEventId", event.id);
  };

  return { selectedEvent, changeEvent };
}
