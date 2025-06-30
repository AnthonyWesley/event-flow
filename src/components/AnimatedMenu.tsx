import { useState, useEffect } from "react";
import { useAnimate, stagger, motion } from "framer-motion";
import usePartner from "../partner/hooks/usePartner";
import { PRIVATE_ROUTES } from "../constants/privateRoutes";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function App() {
  const [open, setOpen] = useState(false);
  const [scope, animate] = useAnimate();

  const staggerList = stagger(0.1, { startDelay: 0.25 });

  useEffect(() => {
    animate(
      "ul",
      {
        transform: open ? "translateX(0)" : "translateX(-100%)",
        opacity: open ? 1 : 0,
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.4,
      },
    );
    animate(
      "li",
      open
        ? { opacity: 1, scale: 1, x: 0 }
        : { opacity: 0, scale: 0.3, x: -50 },
      {
        duration: 0.2,
        delay: open ? staggerList : 0,
      },
    );
  }, [open]);

  const {
    queryPartner: { data: partner },
  } = usePartner();
  const links = PRIVATE_ROUTES(partner);
  const pathname = useLocation();

  return (
    <div
      className="flex flex-col items-start gap-4 font-sans lg:hidden"
      ref={scope}
    >
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer self-end rounded-full border border-gray-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
      >
        {open && (
          <Icon
            icon="line-md:menu-to-close-alt-transition"
            color="#22d3ee"
            width={20}
          />
        )}
        {!open && (
          <Icon
            icon="line-md:close-to-menu-alt-transition"
            color="#22d3ee"
            width={20}
          />
        )}
      </motion.button>

      <ul
        className="fixed top-0 left-0 z-50 h-screen w-[300px] overflow-hidden bg-slate-950/95 transition-all"
        style={{
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {links &&
          links?.map((link, index) => (
            <motion.li
              key={index}
              className="m-0 mr-auto list-none py-2 text-[17px] font-normal text-white"
            >
              <Link
                key={link.text}
                to={link.href}
                aria-label={link.text}
                className={`group ${link.text} relative flex h-16 w-full flex-row items-start justify-start gap-3 rounded-lg border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg ${
                  pathname.pathname === link.href ||
                  (link.href !== "/" && pathname.pathname.startsWith(link.href))
                    ? "text-cyan-400"
                    : ""
                }`}
              >
                {link?.image ? (
                  <img
                    src={link.image}
                    alt={link.text}
                    className="size-10 rounded-full ring-2"
                  />
                ) : (
                  <Icon icon={link.icon} width="30" />
                )}

                {<p className="lg:flex">{link.text}</p>}
              </Link>
            </motion.li>
          ))}
      </ul>
    </div>
  );
}
