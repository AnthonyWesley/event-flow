import { useLocation, Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

type RouteType = {
  href: string;
  text: string;
  icon: string;
};

export type NavProps = {
  links: RouteType[];
};

export default function Navbar({ links }: NavProps) {
  const pathname = useLocation();
  // const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  // console.log(mobile);

  return (
    <nav
      className={`bottom-0 z-40 flex w-full items-center justify-center rounded-b-2xl border-b border-solid border-gray-100/15 bg-slate-950 p-1 shadow-lg shadow-black/15 transition-all duration-[450ms] ease-in-out`}
    >
      {/* <ThemeToggle /> */}
      <div className={`flex w-full duration-500 ease-in-out`}>
        {links.map((link) => (
          <Link
            key={link.text}
            to={link.href}
            aria-label={link.text}
            className={`group relative flex h-16 w-full flex-row items-center justify-center gap-3 rounded-xl border-solid border-gray-100/5 p-4 duration-300 ease-in-out hover:border hover:shadow-lg ${pathname.pathname == link.href ? "text-cyan-400" : ""} `}
          >
            <Icon icon={link.icon} width="30" />
            <p className="hidden lg:flex"> {link.text}</p>
          </Link>
        ))}
      </div>
    </nav>
  );
}
