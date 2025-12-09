export type MovieStatus = "NOW SHOWING" | "UPCOMING";

export interface MovieDetail {
  id: number;
  slug: string;
  title: string;
  duration: string;
  genre: string;
  status: MovieStatus;
  rating: string;
  releaseDate: string;
  tagline: string;
  synopsis: string;
  image: string;
  heroImage: string;
  posterImage: string;
  highlights: string[];
  showtimes: {
    label: string;
    date: string;
    format: string;
    theater: string;
    premiumTag?: string;
    times: string[];
  }[];
  experiences: {
    title: string;
    description: string;
    perks: string[];
  }[];
  cast: { name: string; role: string }[];
}

export const MOVIES: MovieDetail[] = [
  {
    id: 1,
    slug: "wicked-for-good",
    title: "Wicked: For Good",
    duration: "165 MIN",
    genre: "FANTASY / MUSICAL",
    status: "NOW SHOWING",
    rating: "PG-13",
    releaseDate: "Nov 22, 2024",
    tagline:
      "The untold story of the witches of Oz takes flight in a spectacular big-screen event.",
    synopsis:
      "Long before Dorothy, two unlikely friends meet in Oz — one emerald-skinned and misunderstood, the other magnetic and ambitious. Their story of sisterhood, sacrifice, and soaring magic unfolds with sweeping music and lavish staging.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Original Broadway score with new cinematic arrangements",
      "Emerald City brought to life with sweeping IMAX vistas",
      "Ariana Grande & Cynthia Erivo star as Glinda and Elphaba",
    ],
    showtimes: [
      {
        label: "Today",
        date: "Mon, Dec 15",
        format: "IMAX with Laser · Reserved Seating",
        premiumTag: "Most popular",
        theater: "Great Events Cinemas · Downtown",
        times: ["12:00 PM", "3:15 PM", "6:45 PM", "10:05 PM"],
      },
      {
        label: "Tomorrow",
        date: "Tue, Dec 16",
        format: "Dolby Atmos · Recliner Seats",
        theater: "Great Events Cinemas · Riverfront",
        times: ["1:20 PM", "4:40 PM", "8:00 PM"],
      },
      {
        label: "Weekend",
        date: "Sat, Dec 20",
        format: "Fan Event · Souvenir Poster",
        premiumTag: "Limited seats",
        theater: "Great Events Cinemas · Skyline",
        times: ["11:15 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      },
    ],
    experiences: [
      {
        title: "IMAX with Laser",
        description:
          "Emerald City glows across a floor-to-ceiling screen with pin-sharp detail.",
        perks: [
          "Wall-to-wall visuals",
          "Precision sound",
          "Priority seating lanes",
        ],
      },
      {
        title: "Dolby Atmos",
        description:
          "Hear broomstick flights and spellcraft swirl above and around you.",
        perks: [
          "360° audio field",
          "Balanced bass without rumble",
          "Studio-grade mix",
        ],
      },
      {
        title: "VIP Green Room",
        description:
          "Arrive early for a crafted mocktail menu and emerald desserts.",
        perks: ["In-seat ordering", "Heated recliners", "Dedicated host"],
      },
    ],
    cast: [
      { name: "Cynthia Erivo", role: "Elphaba" },
      { name: "Ariana Grande", role: "Glinda" },
      { name: "Jonathan Bailey", role: "Fiyero" },
      { name: "Michelle Yeoh", role: "Madame Morrible" },
    ],
  },
  {
    id: 2,
    slug: "mission-impossible-fallout",
    title: "Mission: Impossible – Fallout",
    duration: "147 MIN",
    genre: "ACTION / THRILLER",
    status: "NOW SHOWING",
    rating: "PG-13",
    releaseDate: "Jul 27, 2018",
    tagline: "Some missions are not a choice.",
    synopsis:
      "Ethan Hunt and the IMF team race against time after a mission goes wrong. With double-crosses, HALO jumps, and a dizzying Paris chase, the fallout from past decisions collides with a new global threat.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Practical stunts filmed with IMAX-certified cameras",
      "Motorcycle chase through the Arc de Triomphe at night",
      "Henry Cavill joins the IMF in a brutal bathroom brawl",
    ],
    showtimes: [
      {
        label: "Today",
        date: "Mon, Dec 15",
        format: "IMAX 2D · Assigned Seating",
        premiumTag: "Fan favorite",
        theater: "Great Events Cinemas · Downtown",
        times: ["1:00 PM", "4:10 PM", "7:30 PM", "10:40 PM"],
      },
      {
        label: "Tomorrow",
        date: "Tue, Dec 16",
        format: "Dolby Cinema · Atmos Sound",
        theater: "Great Events Cinemas · Riverfront",
        times: ["12:30 PM", "3:50 PM", "7:05 PM"],
      },
      {
        label: "Weekend",
        date: "Sat, Dec 20",
        format: "4DX · Motion Seats",
        theater: "Great Events Cinemas · Skyline",
        times: ["11:40 AM", "2:55 PM", "6:10 PM", "9:20 PM"],
      },
    ],
    experiences: [
      {
        title: "IMAX Escape",
        description:
          "Chase sequences engineered for towering screens and precision detail.",
        perks: [
          "Expanded 1.90:1 scenes",
          "Laser projection",
          "Reserved aisles",
        ],
      },
      {
        title: "4DX Pursuit",
        description:
          "Ride every turn with motion seats, wind bursts, and scent effects.",
        perks: [
          "Programmed seat motion",
          "Environmental cues",
          "Water toggle at seat",
        ],
      },
      {
        title: "Night Ops",
        description:
          "Late-show screenings with dimmed lobby lighting and quiet entries.",
        perks: [
          "Blackout curtains",
          "Priority parking",
          "Complimentary espresso",
        ],
      },
    ],
    cast: [
      { name: "Tom Cruise", role: "Ethan Hunt" },
      { name: "Henry Cavill", role: "August Walker" },
      { name: "Rebecca Ferguson", role: "Ilsa Faust" },
      { name: "Simon Pegg", role: "Benji Dunn" },
    ],
  },
  {
    id: 3,
    slug: "cell",
    title: "Cell",
    duration: "98 MIN",
    genre: "DRAMA / THRILLER",
    status: "NOW SHOWING",
    rating: "R",
    releaseDate: "Jun 10, 2016",
    tagline: "If the phone rings, you're already connected.",
    synopsis:
      "A mysterious pulse broadcast over the global cell network turns callers into violent husks. A graphic novelist searches for his son alongside a ragtag group of survivors as the signal keeps evolving.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Adapted from Stephen King's apocalyptic signal novel",
      "Handheld survivalist cinematography",
      "Claustrophobic set pieces across an abandoned airport",
    ],
    showtimes: [
      {
        label: "Today",
        date: "Mon, Dec 15",
        format: "Standard 2D",
        theater: "Great Events Cinemas · Downtown",
        times: ["12:40 PM", "3:05 PM", "5:30 PM", "8:10 PM"],
      },
      {
        label: "Tomorrow",
        date: "Tue, Dec 16",
        format: "Late Show · Quiet Auditorium",
        premiumTag: "Horror row",
        theater: "Great Events Cinemas · Skyline",
        times: ["9:15 PM", "11:55 PM"],
      },
      {
        label: "Weekend",
        date: "Sat, Dec 20",
        format: "Matinee Deal",
        theater: "Great Events Cinemas · Riverfront",
        times: ["10:20 AM", "1:10 PM", "4:00 PM"],
      },
    ],
    experiences: [
      {
        title: "Signal-Free Zone",
        description:
          "Faraday pouch check-ins and zero-phone policy enhance the dread.",
        perks: [
          "Device lockers",
          "Darkened aisles",
          "Front-row aisle guardians",
        ],
      },
      {
        title: "Midnight Screams",
        description:
          "After-hours screenings with raised volume and no trailers.",
        perks: [
          "House lights at 5%",
          "Premium audio",
          "Complimentary black coffee",
        ],
      },
      {
        title: "Aisle Safe Seats",
        description: "Quick exits and extra legroom for the easily startled.",
        perks: ["Extra spacing", "Wall-side seating", "Discrete staff support"],
      },
    ],
    cast: [
      { name: "John Cusack", role: "Clay Riddell" },
      { name: "Samuel L. Jackson", role: "Tom McCourt" },
      { name: "Isabelle Fuhrman", role: "Alice Maxwell" },
      { name: "Stacy Keach", role: "Charles Ardai" },
    ],
  },
  {
    id: 4,
    slug: "american-made",
    title: "American Made",
    duration: "115 MIN",
    genre: "ACTION / BIOGRAPHY",
    status: "UPCOMING",
    rating: "R",
    releaseDate: "Sep 29, 2017",
    tagline: "Based on the outrageous true adventures of Barry Seal.",
    synopsis:
      "A commercial pilot is recruited by the CIA to run one of the biggest covert operations in history. Smuggling, surveillance flights, and a sudden cartel alliance spiral into a globe-trotting hustle.",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Shot on vintage aircraft with cockpit-mounted cameras",
      "Lightweight tone with a propulsive Doug Liman pace",
      "70s palette with film-grain inspired grade",
    ],
    showtimes: [
      {
        label: "Preview",
        date: "Thu, Jul 25",
        format: "Early Access · Bonus Featurette",
        premiumTag: "Members",
        theater: "Great Events Cinemas · Downtown",
        times: ["5:30 PM", "8:15 PM"],
      },
      {
        label: "Opening",
        date: "Fri, Jul 26",
        format: "Standard 2D",
        theater: "Great Events Cinemas · Riverfront",
        times: ["1:10 PM", "4:00 PM", "7:20 PM", "10:00 PM"],
      },
      {
        label: "Weekend",
        date: "Sat, Jul 27",
        format: "Premium Large Format",
        theater: "Great Events Cinemas · Skyline",
        times: ["12:00 PM", "3:15 PM", "6:30 PM", "9:45 PM"],
      },
    ],
    experiences: [
      {
        title: "Retro Runway",
        description:
          "Classic trailers and 70s playlists in-lobby to set the mood.",
        perks: [
          "Vinyl playlist",
          "Throwback concessions",
          "Polaroid photo booth",
        ],
      },
      {
        title: "Cockpit Seats",
        description: "Front half of the auditorium tuned for propeller roar.",
        perks: ["Bass shakers", "Wide armrests", "Fast aisle access"],
      },
      {
        title: "True Story Talks",
        description: "Post-show mini featurette on the real Barry Seal ops.",
        perks: ["Included with ticket", "Hosted by staff", "Q&A mic time"],
      },
    ],
    cast: [
      { name: "Tom Cruise", role: "Barry Seal" },
      { name: "Domhnall Gleeson", role: "Monty Schafer" },
      { name: "Sarah Wright", role: "Lucy Seal" },
      { name: "Jesse Plemons", role: "Sheriff Downing" },
    ],
  },
  {
    id: 5,
    slug: "deepwater-horizon",
    title: "Deepwater Horizon",
    duration: "107 MIN",
    genre: "ACTION / DRAMA",
    status: "NOW SHOWING",
    rating: "PG-13",
    releaseDate: "Sep 30, 2016",
    tagline: "When the world watched, they stood firm.",
    synopsis:
      "The true story of the 2010 Deepwater Horizon disaster, capturing the heroism of the rig crew as systems fail and fire consumes the platform.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Industrial set builds with practical fire and debris",
      "Immersive audio capturing the roar of the blowout",
      "Based on firsthand accounts from the rig crew",
    ],
    showtimes: [
      {
        label: "Today",
        date: "Mon, Jul 15",
        format: "Dolby Cinema · Atmos",
        premiumTag: "Best audio",
        theater: "Great Events Cinemas · Downtown",
        times: ["12:05 PM", "3:25 PM", "6:40 PM", "9:55 PM"],
      },
      {
        label: "Tomorrow",
        date: "Tue, Jul 16",
        format: "Standard 2D",
        theater: "Great Events Cinemas · Skyline",
        times: ["1:50 PM", "5:05 PM", "8:20 PM"],
      },
      {
        label: "Weekend",
        date: "Sat, Jul 20",
        format: "Matinee Deal",
        theater: "Great Events Cinemas · Riverfront",
        times: ["10:10 AM", "12:50 PM", "3:35 PM", "6:10 PM"],
      },
    ],
    experiences: [
      {
        title: "Impact Audio",
        description:
          "Feel every metal groan and pressure surge with tuned sub-bass.",
        perks: ["Balanced rumble", "Ear-safe peaks", "Engineer intro track"],
      },
      {
        title: "Safety First",
        description:
          "Reserved seating with extra aisle lighting and safety brief.",
        perks: ["Crew briefing", "Guided exits", "Accessibility escorts"],
      },
      {
        title: "Docu Pairing",
        description: "Stay for a 6-minute doc clip on offshore rig life.",
        perks: ["No extra cost", "Shot on-location", "Optional take-home link"],
      },
    ],
    cast: [
      { name: "Mark Wahlberg", role: "Mike Williams" },
      { name: "Kurt Russell", role: "Jimmy Harrell" },
      { name: "Gina Rodriguez", role: "Andrea Fleytas" },
      { name: "John Malkovich", role: "Donald Vidrine" },
    ],
  },
  {
    id: 6,
    slug: "top-gun-maverick",
    title: "Top Gun: Maverick",
    duration: "130 MIN",
    genre: "ACTION / ADVENTURE",
    status: "NOW SHOWING",
    rating: "PG-13",
    releaseDate: "May 27, 2022",
    tagline: "Feel the need — the need for speed.",
    synopsis:
      "After 30 years of service, Maverick trains a new generation of Top Gun graduates for a near-impossible mission, pushing hypersonic flight and aerial choreography to the edge.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Shot with IMAX-certified cameras in real F/A-18s",
      "Top Gun anthem returns with new Hans Zimmer cues",
      "Hypersonic Darkstar jet designed with Lockheed Martin",
    ],
    showtimes: [
      {
        label: "Today",
        date: "Mon, Jul 15",
        format: "IMAX 2D · Cockpit Mix",
        premiumTag: "Feel the speed",
        theater: "Great Events Cinemas · Downtown",
        times: ["12:15 PM", "3:35 PM", "6:55 PM", "10:15 PM"],
      },
      {
        label: "Tomorrow",
        date: "Tue, Jul 16",
        format: "4DX · Motion Seats",
        theater: "Great Events Cinemas · Skyline",
        times: ["1:25 PM", "4:45 PM", "8:05 PM"],
      },
      {
        label: "Weekend",
        date: "Sat, Jul 20",
        format: "Dolby Atmos · Recliners",
        theater: "Great Events Cinemas · Riverfront",
        times: ["11:00 AM", "2:20 PM", "5:40 PM", "9:00 PM"],
      },
    ],
    experiences: [
      {
        title: "Afterburner",
        description:
          "Subwoofer tuning mirrors jet engine surges without muddy dialogue.",
        perks: [
          "Sweeping sound field",
          "Dialog clarity",
          "Balanced high-G rumbles",
        ],
      },
      {
        title: "Pilot's Row",
        description: "Choose rows E–H for the intended cockpit horizon line.",
        perks: ["Seat tagging", "Neck-friendly tilt", "Quick exits"],
      },
      {
        title: "Flight Deck Lounge",
        description:
          "Pre-show aviation reels and limited-run patches for early arrivals.",
        perks: ["Collectible patch", "Photo wall", "Zero-proof cocktails"],
      },
    ],
    cast: [
      { name: "Tom Cruise", role: "Pete 'Maverick' Mitchell" },
      { name: "Miles Teller", role: "Lt. Bradley 'Rooster' Bradshaw" },
      { name: "Jennifer Connelly", role: "Penny Benjamin" },
      { name: "Glen Powell", role: "Lt. Jake 'Hangman' Seresin" },
    ],
  },
  {
    id: 7,
    slug: "interstellar",
    title: "Interstellar",
    duration: "169 MIN",
    genre: "SCI-FI / DRAMA",
    status: "UPCOMING",
    rating: "PG-13",
    releaseDate: "Re-releasing Aug 30, 2024",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    synopsis:
      "As Earth becomes uninhabitable, a team journeys through a wormhole in search of a new home, facing relativity, isolation, and the power of time dilation.",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1080&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1500&q=80",
    posterImage:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "70mm and IMAX film presentation",
      "Hans Zimmer pipe-organ score",
      "Consulted with physicist Kip Thorne for accurate visuals",
    ],
    showtimes: [
      {
        label: "Presale",
        date: "Fri, Aug 30",
        format: "70mm IMAX · Film Projection",
        premiumTag: "Limited run",
        theater: "Great Events Cinemas · Downtown",
        times: ["1:00 PM", "5:00 PM", "9:00 PM"],
      },
      {
        label: "Opening",
        date: "Sat, Aug 31",
        format: "Dolby Cinema · Atmos",
        theater: "Great Events Cinemas · Riverfront",
        times: ["12:30 PM", "4:15 PM", "8:10 PM"],
      },
      {
        label: "Weekend",
        date: "Sun, Sep 1",
        format: "Standard 2D",
        theater: "Great Events Cinemas · Skyline",
        times: ["11:00 AM", "2:40 PM", "6:20 PM", "9:50 PM"],
      },
    ],
    experiences: [
      {
        title: "70mm Revival",
        description:
          "Pure photochemical projection with handcrafted reel swaps.",
        perks: [
          "Film grain intact",
          "Projectionist intro",
          "Collector ticket stock",
        ],
      },
      {
        title: "Stellar Sound",
        description:
          "Organ swells rendered in Atmos with seat-back transducers.",
        perks: ["Seat shakers", "Bass-managed organ", "Quiet HVAC mode"],
      },
      {
        title: "Cosmic Prelude",
        description:
          "Arrive 20 minutes early for NASA archival footage playlist.",
        perks: ["Curated pre-show", "Minimal ads", "Lighting fade cues"],
      },
    ],
    cast: [
      { name: "Matthew McConaughey", role: "Joseph Cooper" },
      { name: "Anne Hathaway", role: "Dr. Amelia Brand" },
      { name: "Jessica Chastain", role: "Murph" },
      { name: "Michael Caine", role: "Professor Brand" },
    ],
  },
];
