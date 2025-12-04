"use client";

import {
  Menu,
  X,
  Home,
  Film,
  Building2,
  MapPin,
  Ticket,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

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
  {
    title: "My Bookings",
    href: "/bookings",
    icon: <Ticket className="w-5 h-5" />,
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center justify-between gap-4 md:gap-6 px-4 md:px-6 py-3 rounded-full bg-white shadow-lg w-full md:w-auto">
          {/* Logo & Brand Name for Mobile */}
          <Link className="flex items-center gap-2" href="/">
            <Image
              src="/GreatEventsLogo.svg"
              alt="Great Events Center"
              className="min-w-10 flex-shrink-0"
              height={40}
              width={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm font-medium whitespace-nowrap hover:text-red-700 transition-colors"
              >
                {link.title}
              </Link>
            ))}

            <Button
              size="lg"
              className="rounded-full px-5 py-1 bg-red-700 hover:bg-red-800 flex-shrink-0"
            >
              Book a Demo
            </Button>
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
            <Button
              size="lg"
              className="w-full rounded-full bg-red-700 hover:bg-red-800 mb-4"
              onClick={closeMobileMenu}
            >
              Book a Demo
            </Button>

            {/* Contact Info */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <a
                href="tel:+15551234567"
                className="flex items-center gap-1 hover:text-red-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>(555) 123-4567</span>
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
  );
};

export default Navbar;
