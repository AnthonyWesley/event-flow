import { useLocation, Link, matchPath } from "react-router-dom";
import { Icon } from "@iconify/react";
import PendingModal from "./PendingModal";
import Hamburger from "./Hamburger";

export type RouteType = {
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
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
  const isAdminRoute = location.pathname.startsWith("/adm");

  const isGuestPage = matchPath(
    "events/:eventId/guest/:sellerId",
    location.pathname,
  );

  const shouldShowPendingModal =
    isAuthenticated && !isGuestPage && !isAdminRoute;

  return (
    <nav
      className={`fixed top-0 z-40 w-full items-center justify-center rounded-b-lg border-b border-solid border-gray-100/15 bg-slate-950 p-1 shadow-lg shadow-black/15 transition-all duration-[450ms] ease-in-out lg:flex`}
    >
      <div
        className={`Nav container flex w-full items-center justify-between gap-2 duration-500 ease-in-out ${className}`}
      >
        <img
          src="/images/logo-2.svg"
          alt="Logo"
          className="max-w-[200px] self-center p-4"
        />

        {links &&
          !isGuestPage &&
          links.map((link) => (
            <Link
              key={link.text}
              to={link.href}
              aria-label={link.text}
              className={`group ${link.text} ${linkStyle} relative hidden h-16 w-full flex-row items-center justify-center gap-3 rounded-lg border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg lg:flex ${
                location.pathname === link.href ||
                (link.href !== "/" && location.pathname.startsWith(link.href))
                  ? "text-cyan-400"
                  : ""
              }`}
            >
              {link.image ? (
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
          {links && !isGuestPage && <Hamburger links={links} />}
        </div>
      </div>
    </nav>
  );
}
