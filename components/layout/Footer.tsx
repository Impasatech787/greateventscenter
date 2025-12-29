import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  title: string;
  href: string;
}

const exploreLinks: FooterLink[] = [
  { title: "Book Event Venue", href: "/" },
  { title: "Book Wedding Venue", href: "/" },
  { title: "Rent Movie Theatre", href: "/" },
  { title: "Buy Movie Ticket", href: "/" },
  { title: "Corporate Events Hall", href: "/" },
  { title: "Buy Concert, Event & Show Tickets", href: "/" },
];

const companyLinks: FooterLink[] = [
  { title: "About Us", href: "/" },
  { title: "Careers", href: "/" },
  { title: "Privacy Policy", href: "/" },
  { title: "Terms", href: "/" },
  { title: "Admin Panel", href: "/admin" },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="flex flex-col gap-2">
            <Image
              src="/GreatEventsLogo.svg"
              alt="GreatEvents Center"
              width={52}
              height={52}
            />
            <p className="text-gray-500 text-sm leading-relaxed">
              The premier destination for corporate events, weddings, and
              community gatherings in Omaha.
            </p>
            <div className="flex gap-4 mt-2">
              <Link
                href="https://facebook.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900">
              Visit Us
            </h3>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <p className="leading-relaxed">
                1234 Event Parkway
                <br />
                Omaha, NE 68102
              </p>
              <p>+1 (555) 123-4567</p>
              <Link
                href="mailto:hello@greatevents.com"
                className="hover:text-gray-900 transition-colors"
              >
                hello@greatevents.com
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Great Events Center. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/sitemap"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
