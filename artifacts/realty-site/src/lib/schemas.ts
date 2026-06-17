const BASE_URL = "https://gobigalwilliams.com";

export const agentSchema = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${BASE_URL}/#agent`,
  name: "Go Big Al Williams",
  alternateName: "Al Williams Realtor",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  image: `${BASE_URL}/al-williams.jpeg`,
  telephone: "+16263911342",
  email: "al@gobigalwilliams.com",
  priceRange: "$$",
  description:
    "Al Williams is a dual-licensed Realtor (DRE #01461081) and Loan Officer (NMLS #271420) serving Southern California and the Inland Empire. With 55+ homes sold, Al offers a unique advantage — one trusted advisor for both buying/selling and financing your home.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "17220 Newhope St Ste 214A",
    addressLocality: "Fountain Valley",
    addressRegion: "CA",
    postalCode: "92708",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "33.7091",
    longitude: "-117.9534",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "16:00",
    },
  ],
  areaServed: [
    "Anaheim, CA", "Buena Park, CA", "Chino, CA", "Chino Hills, CA",
    "Corona, CA", "Eastvale, CA", "Fontana, CA", "Fullerton, CA",
    "Garden Grove, CA", "Jurupa Valley, CA", "La Habra, CA", "La Palma, CA",
    "Los Angeles, CA", "Orange, CA", "Rancho Cucamonga, CA", "Riverside, CA",
    "Santa Ana, CA", "Tustin, CA", "Winchester, CA", "Murrieta, CA",
    "Temecula, CA", "Ontario, CA",
  ].map((name) => ({ "@type": "City", name })),
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "California DRE License #01461081",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "NMLS #271420",
    },
  ],
  sameAs: [
    "https://gobigalwilliams.com",
  ],
};

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I find homes for sale in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can browse active listings directly on our website, or contact Al Williams at (626) 391-1342 to get personalized property recommendations in Corona, Chino, Riverside, and across the Inland Empire.",
      },
    },
    {
      "@type": "Question",
      name: "What areas does Al Williams serve as a Realtor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Al Williams serves buyers and sellers throughout Southern California and the Inland Empire, including Corona, Chino, Chino Hills, Riverside, Rancho Cucamonga, Eastvale, Fontana, Winchester, Ontario, Murrieta, Temecula, and surrounding cities.",
      },
    },
    {
      "@type": "Question",
      name: "Can Al Williams help me with both buying a home and getting a mortgage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Al Williams is dual-licensed as both a Realtor (DRE #01461081) and a Loan Officer (NMLS #271420). This means you work with one trusted advisor for the entire process — from finding the right home to securing the best loan.",
      },
    },
    {
      "@type": "Question",
      name: "How do I sell my home in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by requesting a free home valuation. Al Williams will assess your property, recommend a pricing strategy, market it to qualified buyers, and guide you through every step to closing. Call (626) 391-1342 or fill out the seller form on our website.",
      },
    },
    {
      "@type": "Question",
      name: "What loan programs are available for first-time home buyers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Al Williams offers FHA loans (as low as 3.5% down), conventional loans, VA loans for veterans, and down payment assistance programs specifically designed for first-time buyers in California.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to buy a home in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The home buying process typically takes 30–60 days from accepted offer to closing. The full process — including getting pre-approved, finding a home, and going under contract — can take anywhere from a few weeks to several months depending on your timeline and the market.",
      },
    },
  ],
};

export const sellFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I get a free home valuation in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fill out the seller form on this page or call Al Williams directly at (626) 391-1342. You'll receive a detailed comparative market analysis (CMA) based on recent sales in your neighborhood.",
      },
    },
    {
      "@type": "Question",
      name: "What is my home worth in the Inland Empire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Home values vary by location, condition, and current market conditions. Al Williams provides free, no-obligation home valuations for sellers throughout Southern California and the Inland Empire. Contact us for an accurate estimate.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to sell a home in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Properly priced and marketed homes in Southern California typically sell within 30–60 days. Al Williams's marketing strategy includes professional photography, MLS exposure, and targeted digital outreach to qualified buyers.",
      },
    },
  ],
};

export const buyerFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the first step to buying a home in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first step is getting pre-approved for a mortgage. As a licensed Loan Officer (NMLS #271420), Al Williams can review your finances and issue a pre-approval letter so you can shop with confidence.",
      },
    },
    {
      "@type": "Question",
      name: "How much do I need for a down payment in California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Down payment requirements vary by loan type. FHA loans require as little as 3.5% down, conventional loans start at 3–5%, and VA loans for veterans may require zero down payment. Al Williams will find the right loan program for your situation.",
      },
    },
    {
      "@type": "Question",
      name: "Are there first-time home buyer programs in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. California offers several programs including CalHFA down payment assistance, MyHome Assistance Program, and local city programs. Al Williams can walk you through every option available to you.",
      },
    },
  ],
};

export const loanFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of home loans does Al Williams offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Al Williams (NMLS #271420) offers FHA loans, conventional loans, VA loans, jumbo loans, and refinancing options throughout Southern California.",
      },
    },
    {
      "@type": "Question",
      name: "What credit score do I need to buy a home in California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FHA loans are available with credit scores as low as 580 with 3.5% down, or 500–579 with 10% down. Conventional loans typically require a 620+ credit score. Al Williams can review your situation and recommend the best path.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get pre-approved for a mortgage in Southern California?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contact Al Williams at (626) 391-1342 or fill out the home buying plan form on this website. You'll need recent pay stubs, tax returns, bank statements, and a government-issued ID to get started.",
      },
    },
  ],
};

export function buildListingSchema(listing: {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  imageUrl: string;
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.address,
    description: listing.description,
    url: `${BASE_URL}/listings/${listing.id}`,
    image: listing.imageUrl,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "USD",
      availability:
        listing.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: "US",
    },
    numberOfRooms: listing.beds,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.sqft,
      unitCode: "FTK",
    },
  };
}

export function buildListingsItemListSchema(
  listings: Array<{ id: number; address: string; price: number; imageUrl: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Active Homes For Sale — Southern California",
    url: `${BASE_URL}/listings`,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.address,
      url: `${BASE_URL}/listings/${l.id}`,
      image: l.imageUrl,
    })),
  };
}

export function buildSoldItemListSchema(
  listings: Array<{ id: number; address: string; price: number; imageUrl: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recently Sold Homes — Southern California",
    url: `${BASE_URL}/sold`,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.address,
      url: `${BASE_URL}/listings/${l.id}`,
      image: l.imageUrl,
    })),
  };
}
