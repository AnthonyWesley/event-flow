import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "./Modal";
import EventIcon from "../icons/eventIcon";

export default function CircularMenu() {
  return (
    <div className="relative h-[60px] w-[60px]">
      <input
        type="checkbox"
        id="menu-toggle"
        className="peer absolute z-30 h-[60px] w-[60px] cursor-pointer opacity-0"
      />

      {/* Botão principal */}
      <label
        htmlFor="menu-toggle"
        className="absolute z-30 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-slate-900 transition-all duration-300 peer-checked:bg-slate-700 peer-hover:bg-slate-700"
      >
        <Icon icon="eos-icons:rotating-gear" width={20} />
        <span className="hidden peer-checked:inline">−</span>
      </label>

      <div className="absolute top-0 left-0 rounded-full bg-slate-900 shadow-[3px_3px_10px_rgba(16,16,16,0.5)] transition-all duration-300 peer-checked:translate-y-[-90px] peer-checked:delay-[100ms]">
        <Modal
          info="Add Vendedor"
          id="RankingPageSellerForm"
          icon="material-symbols:person-add"
        />
      </div>

      <div className="absolute top-0 left-0 rounded-full bg-slate-900 shadow-[3px_3px_10px_rgba(16,16,16,0.5)] transition-all duration-300 peer-checked:translate-x-[65px] peer-checked:translate-y-[-65px] peer-checked:delay-[200ms]">
        <Modal
          info="Add Vendas"
          id="RankingPageSaleForm"
          icon="mi:shopping-cart-add"
        />
      </div>

      <div className="absolute top-0 left-0 rounded-full bg-slate-900 shadow-[3px_3px_10px_rgba(16,16,16,0.5)] transition-all duration-300 peer-checked:translate-x-[90px] peer-checked:delay-[300ms]">
        <Modal
          info="Finalizar Evento"
          id="RankingPageEventToggleForm"
          icon={<Icon icon="lets-icons:on-button" width="20" />}
        />
      </div>
      <div className="absolute top-0 left-0 rounded-full bg-slate-900 shadow-[3px_3px_10px_rgba(16,16,16,0.5)] transition-all duration-300 peer-checked:translate-x-[65px] peer-checked:translate-y-[65px] peer-checked:delay-[400ms]">
        <Modal
          info="Editar evento"
          id="RankingPageEventForm"
          icon={<EventIcon icon="PEN" />}
        />
      </div>
      <div className="absolute top-0 left-0 rounded-full bg-slate-900 shadow-[3px_3px_10px_rgba(16,16,16,0.5)] transition-all duration-300 peer-checked:translate-y-[90px] peer-checked:delay-[500ms]">
        <Modal
          info="Deletar Evento"
          id="RankingPageEventDeleteForm"
          icon="carbon:trash-can"
        />
      </div>
    </div>
  );
}
