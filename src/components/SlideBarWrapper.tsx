import { Link, useLocation } from "react-router-dom";
import SlideBar from "./SlideBar";
import { Icon } from "@iconify/react/dist/iconify.js";

import SellerForm from "../seller/components/SellerForm";
import Modal from "./Modal";
import { eventsLinks } from "../ranking/pages/RankingPage";
import { useEvent } from "../event/hooks/useEvent";

export function SlideBarWrapper() {
  const location = useLocation();
  const { currentEvent } = useEvent();
  const showOnPaths = ["/", "/sellers", "/sale"];
  const shouldShowSlideBar = showOnPaths.includes(location.pathname);
  return shouldShowSlideBar && currentEvent ? (
    <SlideBar
      icon={<Icon icon="fa-solid:users-cog" width="40" className="lg:hidden" />}
      sliderSide="right"
      className="mt-18 h-20 w-20 p-2 lg:mr-20"
      verticalPosition={120}
      zIndex="z-10"
    >
      <Modal
        id="SlideBarWrapperSellerForm"
        icon={<Icon icon="ic:round-group-add" width="35" />}
      >
        <SellerForm eventId={currentEvent.id} />
      </Modal>
      {eventsLinks.map((link) => (
        <Link
          key={link.text}
          to={link.href}
          className={`group relative flex h-16 w-full flex-row items-center justify-center gap-3 rounded-lg border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg`}
        >
          <Icon icon={link.icon} width="50" className="hover:text-cyan-400" />
          {/* <p className="hidden lg:flex"> {link.text}</p> */}
        </Link>
      ))}
    </SlideBar>
  ) : null;
}
