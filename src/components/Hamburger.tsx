import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import SlideBar from "./SlideBar";

import { RouteType } from "./Navbar";

export default function Hamburger({ links }: { links: RouteType[] }) {
  const pathname = useLocation();

  return (
    <section className="flex lg:hidden">
      <SlideBar
        icon={
          <Icon
            icon="line-md:close-to-menu-alt-transition"
            color="#22d3ee"
            width={30}
          />
        }
        links={links}
        buttonStyle="lg:hidden"
        className="w-60 bg-slate-950/95"
        sliderSide="left"
        pushButtonOnSlide={false}
      >
        {links &&
          links?.map((link, index) => (
            <motion.li
              key={index}
              className="m-0 mr-auto w-full list-none py-2 text-[17px] font-normal text-white"
            >
              <Link
                key={link.text}
                to={link.href}
                aria-label={link.text}
                className={`group ${link.text} relative flex h-16 w-60 flex-row items-center justify-start gap-3 rounded-lg border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg ${
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
                    className="size-8 rounded-full ring-2"
                  />
                ) : (
                  <Icon icon={link.icon} width="30" />
                )}

                {<p className="lg:flex">{link.text}</p>}
              </Link>
            </motion.li>
          ))}
      </SlideBar>
    </section>
  );
}
