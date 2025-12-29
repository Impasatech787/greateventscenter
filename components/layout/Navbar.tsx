"use client";

import {
  Menu,
  X,
  Home,
  Film,
  Building2,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRole } from "@/app/context/AuthContext";
import ProfileDropDown from "../elements/ProfileDropDown";

interface NavLink {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { title: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { title: "Movies", href: "/movies", icon: <Film className="w-5 h-5" /> },
  {
    title: "Book Hall",
    href: "/book-hall",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    title: "Venue Rentals",
    href: "/venues",
    icon: <MapPin className="w-5 h-5" />,
  },
  // {
  //   title: "My Bookings",
  //   href: "/bookings",
  //   icon: <Ticket className="w-5 h-5" />,
  // },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [navHeight, setNavHeight] = useState<number | null>(null);
  const [topBarHeight, setTopBarHeight] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { loggedUser, loading } = useRole();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      const threshold =
        topBarHeight ?? topBarRef.current?.getBoundingClientRect().height ?? 8;
      setIsFixed(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [topBarHeight]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateHeight = () => setNavHeight(nav.getBoundingClientRect().height);
    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(nav);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const topBar = topBarRef.current;
    if (!topBar) return;

    const updateHeight = () =>
      setTopBarHeight(topBar.getBoundingClientRect().height);
    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(topBar);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      {/* Top Info Bar (Desktop only) */}
      <div ref={topBarRef} className="hidden md:block bg-red-700 text-white">
        <div className="flex items-center justify-center">
          <div className="w-full md:container flex items-center justify-between gap-4 md:gap-6 px-6 py-2">
            <div className="flex items-center gap-4 text-xs font-medium">
              <a
                href="https://maps.google.com/?q=Great%20Events%20Center"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">
                  7440 Crown Point Ave Omaha NE 68134
                </span>
              </a>
              <span className="h-3 w-px bg-white/25" aria-hidden />
              <a
                href="tel:+1(402) 812-5616"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">+1 (402) 812-5616</span>
              </a>
              <span className="h-3 w-px bg-white/25" aria-hidden />
              <a
                href="mailto:info@greatevents.com"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">info@greatevents.com</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80">
                Weddings • Conferences • Premieres
              </span>
              <span className="h-3 w-px bg-white/25 mx-1" aria-hidden />
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {isFixed && navHeight !== null ? (
        <div aria-hidden style={{ height: navHeight }} />
      ) : null}
      <nav
        ref={navRef}
        className={cn(
          "z-50 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-200",
          isFixed
            ? "fixed top-0 left-0 right-0 bg-white/75 backdrop-blur-xl border-b border-gray-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            : "relative bg-transparent border-b border-transparent",
        )}
      >
        <div className="flex items-center justify-center">
          <div className="w-full md:container flex items-center justify-between gap-4 md:gap-6 px-6 py-4 md:py-3">
            {/* Logo & Brand Name for Mobile */}
            <Link className="flex items-center gap-2" href="/">
              <Image
                src="/GreatEventsLogo.svg"
                alt="Great Events Center"
                className="min-w-19 flex-shrink-0"
                height={65}
                width={65}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center">
              <div className="flex-1 flex justify-center">
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-1 py-1",
                    isFixed
                      ? "bg-white/60 border-gray-200/70 backdrop-blur"
                      : "bg-white/40 border-gray-200/50",
                  )}
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
                        "text-gray-700 hover:text-gray-900 hover:bg-white/70",
                        (
                          link.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(link.href)
                        )
                          ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/70"
                          : "ring-1 ring-transparent",
                      )}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/*If loading for checking user show skeleton*/}
              {loading ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                </div>
              ) : loggedUser ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ProfileDropDown />
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-5 py-1 bg-white/60 border-gray-200/70 hover:bg-white"
                  >
                    <Link href="/signin">Sign in</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "rounded-full px-5 py-1 shadow-sm",
                      "bg-red-700 hover:bg-red-800 text-white",
                      "hover:shadow-md transition-shadow",
                    )}
                  >
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-red-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`
            fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 
            transform transition-transform duration-300 ease-out md:hidden
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Image
                  src="/GreatEventsLogo.svg"
                  alt="Great Events Center"
                  height={40}
                  width={40}
                />
                <div>
                  <h2 className="font-bold text-gray-900">Great Events</h2>
                  <p className="text-xs text-gray-500">Center</p>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-500 hover:text-red-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Menu
                </p>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-700 font-medium hover:bg-red-50 hover:text-red-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 group-hover:text-red-600 transition-colors">
                      {link.icon}
                    </span>
                    {link.title}
                  </div>
                </Link>
              ))}

              {/* Quick Actions */}
              <div className="px-4 mt-6 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Actions
                </p>
              </div>
              <div className="px-4 grid grid-cols-2 gap-3 mt-2">
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors group">
                  <Film className="w-6 h-6 text-gray-400 group-hover:text-red-600" />
                  <span className="text-xs font-medium">Book Movie</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors group">
                  <Building2 className="w-6 h-6 text-gray-400 group-hover:text-red-600" />
                  <span className="text-xs font-medium">Book Hall</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="grid gap-2 mb-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-red-700 hover:bg-red-800"
                >
                  <Link href="/signup" onClick={closeMobileMenu}>
                    Sign up
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <Link href="/signin" onClick={closeMobileMenu}>
                    Sign in
                  </Link>
                </Button>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <a
                  href="tel:+14028125616"
                  className="flex items-center gap-1 hover:text-red-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+1(402) 812-5616</span>
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="mailto:hello@greatevents.com"
                  className="flex items-center gap-1 hover:text-red-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
