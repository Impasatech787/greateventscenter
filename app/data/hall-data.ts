// Central data structure for all halls - designed for easy backend integration

export interface PricingPackage {
  duration: "3hr" | "6hr" | "8hr" | "12hr" | "24hr";
  price: number;
  label: string;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  parkingSpaces: number;
  location: string;
  image: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  description: string;

  // Pricing
  pricing: PricingPackage[];

  // Amenities & Features
  soundSystem: boolean;
  soundSystemDetails: string;
  catering: boolean;
  cateringDetails: string;
  stage: boolean;
  stageDetails: string;

  // Free Items (Included)
  freeItems: string[];

  // Mandatory Items (Required by client)
  mandatoryItems: string[];

  // Additional Amenities
  amenities: string[];

  // Availability status for quick display
  availabilityStatus: "Available" | "Limited" | "Booked";
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  description: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: "morning",
    label: "Morning",
    startTime: "08:00",
    endTime: "12:00",
    description: "8:00 AM - 12:00 PM",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    startTime: "13:00",
    endTime: "16:00",
    description: "1:00 PM - 4:00 PM",
  },
  {
    id: "evening",
    label: "Evening",
    startTime: "16:00",
    endTime: "00:00",
    description: "4:00 PM - 12:00 AM (Exclusive)",
  },
];

// Mock booking data - simulates database
export interface Booking {
  id: string;
  hallId: string;
  hallName: string;
  date: string; // ISO date string
  timeSlot: string; // 'morning' | 'afternoon' | 'evening'
  packageDuration: string; // '3hr' | '6hr' | '8hr' | '12hr' | '24hr'
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount: number;
  totalAmount: number;
  depositPaid: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

// Hall data based on client's pricing sheet
export const HALLS_DATA: Hall[] = [
  {
    id: "hall-a",
    name: "Hall A - Grand Ballroom",
    capacity: 500,
    parkingSpaces: 100,
    location: "Main Wing, Ground Floor",
    image:
      "https://images.unsplash.com/photo-1677129661713-14a507086c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb25mZXJlbmNlJTIwaGFsbCUyMGJhbnF1ZXQlMjBldmVudCUyMHNwYWNlfGVufDF8fHx8MTc2NDA1OTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1677129661713-14a507086c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb25mZXJlbmNlJTIwaGFsbCUyMGJhbnF1ZXQlMjBldmVudCUyMHNwYWNlfGVufDF8fHx8MTc2NDA1OTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550064825-b68aa0370fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 4.9,
    reviewCount: 156,
    description:
      "Our flagship Grand Ballroom is perfect for large-scale weddings, corporate galas, and community events. Features soaring ceilings, elegant chandeliers, and a spacious dance floor.",
    pricing: [
      { duration: "3hr", price: 600, label: "3 Hours" },
      { duration: "6hr", price: 1200, label: "6 Hours" },
      { duration: "8hr", price: 2400, label: "8 Hours" },
      { duration: "12hr", price: 3600, label: "12 Hours" },
      { duration: "24hr", price: 7200, label: "24 Hours" },
    ],
    soundSystem: true,
    soundSystemDetails:
      "Professional-grade sound system with wireless microphones, mixer, and speakers",
    catering: true,
    cateringDetails:
      "Full catering kitchen available. Partner with our preferred caterers or bring your own.",
    stage: true,
    stageDetails:
      "Elevated stage with professional lighting and backdrop options",
    freeItems: [
      "Tables (Round & Rectangular)",
      "Chairs (Chiavari & Banquet)",
      "White linens & napkins",
      "Basic centerpieces",
      "Trash bins & recycling",
      "Post-event cleaning",
      "On-site security",
      "Parking attendant",
      "Basic WiFi",
    ],
    mandatoryItems: [
      "Security deposit ($500 - refundable)",
      "Certificate of liability insurance",
      "Final headcount 7 days prior",
      "Event coordinator contact",
    ],
    amenities: [
      "Air Conditioning",
      "Bridal Suite",
      "Groom's Room",
      "Dance Floor",
      "Bar Area",
      "Outdoor Terrace Access",
    ],
    availabilityStatus: "Available",
  },
  {
    id: "hall-b",
    name: "Hall B - Sapphire Banquet",
    capacity: 250,
    parkingSpaces: 60,
    location: "East Wing, Second Floor",
    image:
      "https://images.unsplash.com/photo-1761110787206-2cc164e4913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwaGFsbCUyMGx1eHVyeSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDA1OTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1761110787206-2cc164e4913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwaGFsbCUyMGx1eHVyeSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDA1OTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1678224880435-2d6bbb30eb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1735801952479-708659d1a436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1701431511505-7ce92059c314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 4.8,
    reviewCount: 98,
    description:
      "Elegant mid-sized hall perfect for weddings, birthday parties, and corporate events. Features beautiful lighting and modern decor.",
    pricing: [
      { duration: "3hr", price: 500, label: "3 Hours" },
      { duration: "6hr", price: 1000, label: "6 Hours" },
      { duration: "8hr", price: 2000, label: "8 Hours" },
      { duration: "12hr", price: 3000, label: "12 Hours" },
      { duration: "24hr", price: 6000, label: "24 Hours" },
    ],
    soundSystem: true,
    soundSystemDetails:
      "Premium sound system with DJ booth and wireless microphones",
    catering: true,
    cateringDetails:
      "Catering prep area available. Partner caterers or BYOC (Bring Your Own Caterer).",
    stage: true,
    stageDetails: "Modular stage setup with customizable backdrop",
    freeItems: [
      "Tables & Chairs",
      "Table linens",
      "Coat check area",
      "Trash removal",
      "Basic cleaning",
      "Security guard",
      "WiFi access",
    ],
    mandatoryItems: [
      "Security deposit ($300 - refundable)",
      "Insurance certificate",
      "Guest count confirmation",
      "Event timeline submission",
    ],
    amenities: [
      "Climate Control",
      "Prep Kitchen",
      "Lounge Area",
      "Decorative Lighting",
      "Sound System",
      "Ample Parking",
    ],
    availabilityStatus: "Limited",
  },
  {
    id: "hall-c",
    name: "Hall C - Executive Meeting Suite",
    capacity: 80,
    parkingSpaces: 30,
    location: "North Tower, Third Floor",
    image:
      "https://images.unsplash.com/photo-1758691737278-3af15b37af48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwcm9vbSUyMG1vZGVybiUyMGdsYXNzfGVufDF8fHx8MTc2NDA1OTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1758691737278-3af15b37af48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwcm9vbSUyMG1vZGVybiUyMGdsYXNzfGVufDF8fHx8MTc2NDA1OTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1758686254049-8c1d1e8f9564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1686150766133-c9d132aa7567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1080&auto=format&fit=crop",
    ],
    rating: 5.0,
    reviewCount: 67,
    description:
      "Professional meeting space ideal for corporate trainings, workshops, and small gatherings. Features modern technology and comfortable seating.",
    pricing: [
      { duration: "3hr", price: 300, label: "3 Hours" },
      { duration: "6hr", price: 600, label: "6 Hours" },
      { duration: "8hr", price: 1200, label: "8 Hours" },
      { duration: "12hr", price: 1800, label: "12 Hours" },
      { duration: "24hr", price: 3600, label: "24 Hours" },
    ],
    soundSystem: true,
    soundSystemDetails:
      "Conference audio system with lapel and handheld microphones",
    catering: false,
    cateringDetails:
      "Coffee/refreshment station available. External catering allowed.",
    stage: false,
    stageDetails: "Presentation podium available",
    freeItems: [
      "Conference tables",
      "Ergonomic chairs",
      "Whiteboard & markers",
      "Notepads & pens",
      "Coffee station",
      "Trash removal",
      "Cleaning service",
      "High-speed WiFi",
    ],
    mandatoryItems: [
      "Security deposit ($200 - refundable)",
      "Contact person on-site",
      "Equipment return checklist",
    ],
    amenities: [
      "Video Conferencing",
      "4K Projector",
      "Smart TV",
      "Whiteboard",
      "Coffee Bar",
      "Natural Lighting",
    ],
    availabilityStatus: "Available",
  },
  {
    id: "hall-d",
    name: "Hall D - Community Space",
    capacity: 150,
    parkingSpaces: 40,
    location: "West Wing, Ground Floor",
    image:
      "https://images.unsplash.com/photo-1722321974479-a6722bea8b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBhdWRpdG9yaXVtJTIwZW1wdHl8ZW58MXx8fHwxNzY0MDU5NDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    galleryImages: [
      "https://images.unsplash.com/photo-1722321974479-a6722bea8b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBhdWRpdG9yaXVtJTIwZW1wdHl8ZW58MXx8fHwxNzY0MDU5NDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1701431511505-7ce92059c314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1761110787206-2cc164e4913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1080&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 82,
    description:
      "Versatile community hall perfect for family gatherings, association meetings, and local events. Affordable pricing with great amenities.",
    pricing: [
      { duration: "3hr", price: 400, label: "3 Hours" },
      { duration: "6hr", price: 800, label: "6 Hours" },
      { duration: "8hr", price: 1600, label: "8 Hours" },
      { duration: "12hr", price: 2400, label: "12 Hours" },
      { duration: "24hr", price: 4800, label: "24 Hours" },
    ],
    soundSystem: true,
    soundSystemDetails: "Basic PA system with microphones",
    catering: true,
    cateringDetails: "Kitchen prep area available for caterers or self-service",
    stage: false,
    stageDetails: "Portable stage platform available upon request",
    freeItems: [
      "Tables & Chairs",
      "Basic linens",
      "Kitchen access",
      "Trash bins",
      "Cleaning service",
      "Parking",
      "WiFi",
    ],
    mandatoryItems: [
      "Security deposit ($250 - refundable)",
      "Damage waiver",
      "Final guest count",
    ],
    amenities: [
      "Kitchen Facilities",
      "Storage Room",
      "Flexible Layout",
      "PA System",
      "Ample Seating",
      "Outdoor Access",
    ],
    availabilityStatus: "Available",
  },
  {
    id: "venue-skyline",
    name: "Skyline Rooftop",
    capacity: 150,
    parkingSpaces: 20,
    location: "Rooftop Level",
    image:
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1080&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550064825-b68aa0370fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwYmFyJTIwZHJpbmt8ZW58MXx8fHwxNzY0MDU2MTg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1709054965319-a17f05027f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0JTIwdmlld3xlbnwxfHx8fDE3NjQwNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1080&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 45,
    description:
      "An open-air sanctuary offering breathtaking views of the city skyline. Ideal for cocktail receptions, sunset parties, and intimate networking events.",
    pricing: [
      { duration: "3hr", price: 1800, label: "3 Hours" },
      { duration: "6hr", price: 3000, label: "6 Hours" },
      { duration: "8hr", price: 3800, label: "8 Hours" },
      { duration: "12hr", price: 5000, label: "12 Hours" },
      { duration: "24hr", price: 8000, label: "24 Hours" },
    ],
    soundSystem: true,
    soundSystemDetails: "Outdoor-rated sound system",
    catering: true,
    cateringDetails: "Private bar and canapé service available",
    stage: false,
    stageDetails: "No stage",
    freeItems: [
      "Lounge Seating",
      "High-top Tables",
      "Bar Service",
      "Lighting",
      "Heaters",
      "Cleaning",
    ],
    mandatoryItems: ["Security deposit ($1000)", "Weather contingency plan"],
    amenities: [
      "Panoramic Views",
      "Outdoor Bar",
      "Retractable Roof",
      "Heating",
      "Mood Lighting",
      "Private Elevator",
    ],
    availabilityStatus: "Booked",
  },
  {
    id: "venue-garden",
    name: "Garden Pavilion",
    capacity: 275,
    parkingSpaces: 100,
    location: "North Gardens",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1080&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1735801952479-708659d1a436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjQwNDEzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1761070775230-1921952439de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZXZlbnQlMjBzZWF0aW5nfGVufDF8fHx8MTc2NDA1NjE4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225468358-79ff960543f1?q=80&w=1080&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 78,
    description:
      "Surrounded by manicured gardens, this glass-enclosed pavilion brings the outdoors in. A romantic setting for ceremonies and daytime luncheons.",
    pricing: [
      { duration: "3hr", price: 2000, label: "3 Hours" },
      { duration: "6hr", price: 3500, label: "6 Hours" },
      { duration: "8hr", price: 4500, label: "8 Hours" },
      { duration: "12hr", price: 6000, label: "12 Hours" },
      { duration: "24hr", price: 9000, label: "24 Hours" },
    ],
    soundSystem: true,
    soundSystemDetails: "Acoustic-optimized sound system",
    catering: true,
    cateringDetails: "Garden-fresh catering options available",
    stage: true,
    stageDetails: "Ceremony platform",
    freeItems: [
      "Ceremony Chairs",
      "Archway",
      "Signing Table",
      "Cleaning",
      "Parking",
    ],
    mandatoryItems: ["Security deposit ($500)", "Noise ordinance compliance"],
    amenities: [
      "Lush Greenery",
      "Natural Lighting",
      "Adjoining Patio",
      "Glass Enclosure",
      "Climate Control",
      "Bridal Room",
    ],
    availabilityStatus: "Available",
  },
];

// Mock bookings data - simulates what would come from database
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-001",
    hallId: "hall-a",
    hallName: "Hall A - Grand Ballroom",
    date: "2025-12-15",
    timeSlot: "evening",
    packageDuration: "8hr",
    customerName: "John Smith",
    customerEmail: "john@email.com",
    customerPhone: "555-0123",
    guestCount: 300,
    totalAmount: 2400,
    depositPaid: 600,
    status: "confirmed",
    createdAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "booking-002",
    hallId: "hall-b",
    hallName: "Hall B - Sapphire Banquet",
    date: "2025-12-05",
    timeSlot: "afternoon",
    packageDuration: "6hr",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@email.com",
    customerPhone: "555-0456",
    guestCount: 150,
    totalAmount: 1000,
    depositPaid: 250,
    status: "confirmed",
    createdAt: "2025-11-18T14:30:00Z",
  },
  {
    id: "booking-003",
    hallId: "hall-a",
    hallName: "Hall A - Grand Ballroom",
    date: "2025-12-01",
    timeSlot: "evening",
    packageDuration: "12hr",
    customerName: "Michael Brown",
    customerEmail: "michael@email.com",
    customerPhone: "555-0789",
    guestCount: 450,
    totalAmount: 3600,
    depositPaid: 900,
    status: "confirmed",
    createdAt: "2025-11-15T09:15:00Z",
  },
];

// Helper function to check if a date/time slot is available
export function isSlotAvailable(
  hallId: string,
  date: string,
  timeSlot: string,
): boolean {
  return !MOCK_BOOKINGS.some(
    (booking) =>
      booking.hallId === hallId &&
      booking.date === date &&
      booking.timeSlot === timeSlot &&
      booking.status !== "cancelled",
  );
}

// Helper function to get price for a package
export function getPackagePrice(hallId: string, duration: string): number {
  const hall = HALLS_DATA.find((h) => h.id === hallId);
  if (!hall) return 0;

  const pkg = hall.pricing.find((p) => p.duration === duration);
  return pkg?.price || 0;
}

// Calculate total with fees
export function calculateTotal(basePrice: number): {
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  deposit: number;
} {
  const cleaningFee = 150;
  const serviceFee = 100;
  const total = basePrice + cleaningFee + serviceFee;
  const deposit = Math.round(total * 0.25); // 25% deposit

  return {
    basePrice,
    cleaningFee,
    serviceFee,
    total,
    deposit,
  };
}
