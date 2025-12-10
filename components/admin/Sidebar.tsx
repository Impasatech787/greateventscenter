"use client";

type OpenState = Record<number, string | null>;

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  LayoutDashboard,
  Film,
  Building2,
  Calendar,
  Heart,
  Music,
  Users,
  Ticket,
  MapPin,
  Settings,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  FileText,
  Star,
  MessageSquare,
  Bell,
  CreditCard,
  BarChart3,
  Clapperboard,
  LogOut,
  Armchair,
  HelpCircle,
  Mail,
  PanelLeftClose,
  PanelLeft,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SideBarMenu {
  title: string;
  icon: ReactNode;
  link?: string;
  children?: SideBarMenu[];
}

const menuItems: SideBarMenu[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    link: "/back_office/dashboard",
  },
  {
    title: "Event Hall Management",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      {
        title: "Movie Hall",
        icon: <Film className="w-4 h-4" />,
        children: [
          {
            title: "Movies",
            icon: <Clapperboard className="w-4 h-4" />,
            link: "/back_office/movies",
          },
          {
            title: "Showtimes",
            icon: <Calendar className="w-4 h-4" />,
            link: "/back_office/showtimes",
          },
          {
            title: "Seat Layout Designer",
            icon: <Armchair className="w-4 h-4" />,
            link: "/back_office/seat-layout",
          },
        ],
      },
      {
        title: "Event Venues",
        icon: <MapPin className="w-4 h-4" />,
        link: "/back_office/venues",
      },
      {
        title: "Wedding Halls",
        icon: <Heart className="w-4 h-4" />,
        link: "/back_office/wedding-halls",
      },
      {
        title: "Corporate Halls",
        icon: <Building2 className="w-4 h-4" />,
        link: "/back_office/corporate-halls",
      },
      {
        title: "Concert & Shows",
        icon: <Music className="w-4 h-4" />,
        link: "/back_office/concerts",
      },
    ],
  },
  {
    title: "Bookings & Tickets",
    icon: <Ticket className="w-5 h-5" />,
    children: [
      {
        title: "All Bookings",
        icon: <Calendar className="w-4 h-4" />,
        link: "/back_office/bookings",
      },
      {
        title: "Movie Tickets",
        icon: <Film className="w-4 h-4" />,
        link: "/back_office/movie-tickets",
      },
      {
        title: "Event Tickets",
        icon: <Ticket className="w-4 h-4" />,
        link: "/back_office/event-tickets",
      },
    ],
  },
  {
    title: "Content Management",
    icon: <FileText className="w-5 h-5" />,
    children: [
      {
        title: "Home Banner",
        icon: <ImageIcon className="w-4 h-4" />,
        link: "/back_office/cms/home-banner",
      },
      {
        title: "Services Section",
        icon: <Star className="w-4 h-4" />,
        link: "/back_office/cms/services",
      },
      {
        title: "Statistics",
        icon: <BarChart3 className="w-4 h-4" />,
        link: "/back_office/cms/statistics",
      },
      {
        title: "Testimonials",
        icon: <MessageSquare className="w-4 h-4" />,
        link: "/back_office/cms/testimonials",
      },
      {
        title: "Gallery",
        icon: <ImageIcon className="w-4 h-4" />,
        link: "/back_office/cms/gallery",
      },
      {
        title: "Blogs",
        icon: <Newspaper className="w-4 h-4" />,
        link: "/back_office/cms/gallery",
      },
    ],
  },
  {
    title: "Users & Customers",
    icon: <Users className="w-5 h-5" />,
    children: [
      {
        title: "All Users",
        icon: <Users className="w-4 h-4" />,
        link: "/back_office/users",
      },
      {
        title: "Customers",
        icon: <Users className="w-4 h-4" />,
        link: "/back_office/customers",
      },
    ],
  },
  {
    title: "Payments",
    icon: <CreditCard className="w-5 h-5" />,
    link: "/back_office/payments",
  },
  {
    title: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    link: "/back_office/notifications",
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    link: "/back_office/settings",
  },
];

// Additional items for compact sidebar bottom section
const bottomMenuItems: SideBarMenu[] = [
  {
    title: "Help",
    icon: <HelpCircle className="w-5 h-5" />,
    link: "/back_office/help",
  },
  {
    title: "Messages",
    icon: <Mail className="w-5 h-5" />,
    link: "/back_office/messages",
  },
];

// Check if any child is active
const isChildActive = (
  children: SideBarMenu[] | undefined,
  pathname: string,
): boolean => {
  if (!children) return false;
  return children.some(
    (child) =>
      (child.link && pathname === child.link) ||
      isChildActive(child.children, pathname),
  );
};

// Flyout submenu item for collapsed sidebar
interface FlyoutMenuItemProps {
  item: SideBarMenu;
  depth?: number;
  onItemClick?: () => void;
}

const FlyoutMenuItem = ({
  item,
  depth = 0,
  onItemClick,
}: FlyoutMenuItemProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.link && pathname === item.link;
  const shouldBeOpen = isOpen || isChildActive(item.children, pathname);

  if (hasChildren) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
            shouldBeOpen
              ? "bg-red-50 text-red-700"
              : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(shouldBeOpen ? "text-red-600" : "text-gray-500")}
            >
              {item.icon}
            </span>
            <span>{item.title}</span>
          </div>
          {shouldBeOpen ? (
            <ChevronDown className="w-3 h-3 text-gray-500" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-500" />
          )}
        </button>
        {shouldBeOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
            {item.children?.map((child, index) => (
              <FlyoutMenuItem
                key={index}
                item={child}
                depth={depth + 1}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.link || "#"}
      onClick={onItemClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
        isActive ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100",
      )}
    >
      <span className={cn(isActive ? "text-white" : "text-gray-500")}>
        {item.icon}
      </span>
      <span>{item.title}</span>
    </Link>
  );
};

// Collapsed menu item with flyout for children
interface CollapsedMenuItemProps {
  item: SideBarMenu;
}

const CollapsedMenuItem = ({ item }: CollapsedMenuItemProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.link && pathname === item.link;
  const hasActiveChild = isChildActive(item.children, pathname);

  // For items without children, just render a link
  if (!hasChildren) {
    return (
      <div className="flex items-center justify-center">
        <Link
          href={item.link || "#"}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg transition-colors group relative",
            isActive
              ? "bg-red-700 text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
          )}
          title={item.title}
        >
          <span
            className={cn(
              isActive
                ? "text-white"
                : "text-gray-500 group-hover:text-gray-700",
            )}
          >
            {item.icon}
          </span>
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[70]">
            {item.title}
          </div>
        </Link>
      </div>
    );
  }

  // For items with children, show flyout menu on click
  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg transition-colors group relative",
          isOpen || hasActiveChild
            ? "bg-red-50 text-red-700"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        )}
      >
        <span
          className={cn(
            isOpen || hasActiveChild ? "text-red-600" : "text-gray-500",
          )}
        >
          {item.icon}
        </span>
        {/* Tooltip when closed */}
        {!isOpen && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[70]">
            {item.title}
          </div>
        )}
      </button>

      {/* Flyout Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close flyout */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-full top-0 ml-2 min-w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[70]">
            {/* Header */}
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <span className="text-sm font-semibold text-gray-900">
                {item.title}
              </span>
            </div>
            {/* Menu Items */}
            <div className="px-1 space-y-1">
              {item.children?.map((child, index) => (
                <FlyoutMenuItem
                  key={index}
                  item={child}
                  onItemClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface MenuItemProps {
  item: SideBarMenu;
  depth?: number;
  openState: OpenState;
  setOpenState: React.Dispatch<React.SetStateAction<OpenState>>;
}

const MenuItem = ({
  item,
  depth = 0,
  openState,
  setOpenState,
}: MenuItemProps) => {
  const pathname = usePathname();
  // const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.link && pathname === item.link;
  const isOpen = openState[depth] == item.title;
  const shouldBeOpen = isOpen || isChildActive(item.children, pathname);

  const handleClick = () => {
    if (!hasChildren) return;
    setOpenState((prev) => {
      const newState: OpenState = { ...prev };
      if (prev[depth] === item.title) {
        Object.keys(newState).forEach((key) => {
          const numKey = Number(key);
          if (numKey >= depth) {
            delete newState[numKey];
          }
        });
      } else {
        newState[depth] = item.title;
        Object.keys(newState).forEach((key) => {
          const numKey = Number(key);
          if (numKey > depth) {
            delete newState[numKey];
          }
        });
      }
      return newState;
    });
  };

  const paddingLeft = depth === 0 ? "pl-4" : depth === 1 ? "pl-8" : "pl-12";

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center justify-between py-2.5 pr-4 text-sm font-medium rounded-lg transition-colors",
            paddingLeft,
            shouldBeOpen
              ? "bg-red-50 text-red-700"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(shouldBeOpen ? "text-red-600" : "text-gray-500")}
            >
              {item.icon}
            </span>
            <span>{item.title}</span>
          </div>
          {shouldBeOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {shouldBeOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child, index) => (
              <MenuItem
                key={index}
                item={child}
                depth={depth + 1}
                openState={openState}
                setOpenState={setOpenState}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.link || "#"}
      className={cn(
        "flex items-center gap-3 py-2.5 pr-4 text-sm font-medium rounded-lg transition-colors",
        paddingLeft,
        isActive
          ? "bg-red-700 text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <span className={cn(isActive ? "text-white" : "text-gray-500")}>
        {item.icon}
      </span>
      <span>{item.title}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { isExpanded, toggleSidebar, setIsExpanded } = useSidebar();
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = useState<OpenState>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth >= 1280) return;

      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, setIsExpanded]);

  return (
    <aside
      ref={sideBarRef}
      className={cn(
        "fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-72 overflow-hidden" : "w-28 overflow-visible",
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center border-b border-gray-200 transition-all duration-300",
          isExpanded ? "justify-between px-6 py-5" : "justify-center py-4",
        )}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/GreatEventsLogo.svg"
            alt="Great Events Center"
            width={isExpanded ? 40 : 32}
            height={isExpanded ? 40 : 32}
            className="flex-shrink-0"
          />
          {isExpanded && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg leading-tight">
                Great Events
              </span>
              <span className="text-xs text-gray-500">Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "flex items-center justify-center py-3 border-b border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors",
          isExpanded ? "px-4" : "px-3",
        )}
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <div className="flex items-center gap-2 w-full">
            <PanelLeftClose className="w-5 h-5" />
            <span className="text-sm">Collapse</span>
          </div>
        ) : (
          <PanelLeft className="w-5 h-5" />
        )}
      </button>

      {/* Navigation Menu */}
      <nav
        className={cn(
          "flex-1 py-4 px-3 space-y-1",
          isExpanded ? "overflow-y-auto" : "overflow-visible",
        )}
      >
        {isExpanded
          ? menuItems.map((item, index) => (
              <MenuItem
                key={index}
                item={item}
                openState={openState}
                setOpenState={setOpenState}
              />
            ))
          : menuItems.map((item, index) => (
              <CollapsedMenuItem key={index} item={item} />
            ))}
      </nav>

      {/* Bottom Section */}
      <div
        className={cn(
          "border-t border-gray-200",
          isExpanded ? "p-4" : "py-4 px-3 space-y-2",
        )}
      >
        {!isExpanded && (
          <>
            {bottomMenuItems.map((item, index) => (
              <CollapsedMenuItem key={index} item={item} />
            ))}
          </>
        )}

        {/* User Section */}
        {isExpanded ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-700 font-semibold text-sm">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@greatevents.com
                </p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center pt-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors group relative">
              <span className="text-red-700 font-semibold text-sm">AD</span>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Admin User
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
