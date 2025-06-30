import { useLocation, Link, matchPath } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import SlideBar from "./SlideBar";
import { motion } from "framer-motion";
import PendingModal from "./PendingModal";

type RouteType = {
  href: string;
  text: string;
  icon: string;
  image?: string;
};

export type NavProps = {
  links?: RouteType[];
  className?: string;
  linkStyle?: string;
  isTittle?: boolean;
};

export default function Navbar({
  links,
  className,
  isTittle = true,
  linkStyle,
}: NavProps) {
  const pathname = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
  const isAdminRoute = location.pathname.startsWith("/adm");

  const isGuestPage = matchPath(
    "events/:eventId/guest/:sellerId",
    location.pathname,
  );
  const shouldShowPendingModal =
    isAuthenticated && !isGuestPage && !isAdminRoute;

  const shouldShowPublicNavbar = !isAuthenticated && !isAdminRoute;

  return (
    <nav
      className={`fixed top-0 z-40 w-full items-center justify-center rounded-b-lg border-b border-solid border-gray-100/15 bg-slate-950 p-1 shadow-lg shadow-black/15 transition-all duration-[450ms] ease-in-out lg:flex`}
    >
      <div
        className={`Nav flex w-full items-center justify-evenly gap-2 duration-500 ease-in-out ${className}`}
      >
        {!shouldShowPublicNavbar && (
          <img
            src="/images/logo-2.svg"
            alt=""
            className="max-w-[200px] self-center p-4"
          />
        )}
        {links &&
          links.map((link) => (
            <Link
              key={link.text}
              to={link.href}
              aria-label={link.text}
              className={`group ${link.text} ${linkStyle} relative hidden h-16 w-full flex-row items-center justify-center gap-3 rounded-lg border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg lg:flex ${
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

              {isTittle && <p className="lg:flex">{link.text}</p>}
            </Link>
          ))}
        <div className="flex w-full items-center justify-end p-2 lg:justify-center">
          {shouldShowPendingModal && <PendingModal />}

          {!isGuestPage && (
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
                    className="m-0 mr-auto list-none py-2 text-[17px] font-normal text-white"
                  >
                    <Link
                      key={link.text}
                      to={link.href}
                      aria-label={link.text}
                      className={`group ${link.text} relative flex h-16 w-full flex-row items-center justify-start gap-3 rounded-lg border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg ${
                        pathname.pathname === link.href ||
                        (link.href !== "/" &&
                          pathname.pathname.startsWith(link.href))
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
          )}
        </div>
      </div>
    </nav>
  );
}
