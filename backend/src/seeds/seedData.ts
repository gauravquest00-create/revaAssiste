import mongoose from "mongoose";

export const defaultUser = {
  name: "Gaurav Verma",
  email: "gauravquest00@gmail.com",
  password: "Admin123@", // Will be hashed via User pre-save hook
  phone: "+91 98765 43210",
  role: "admin",
  organization: "LuxuryNest Real Estate",
  settings: {
    notificationsEnabled: true,
    defaultCorridor: "Dwarka Expressway",
    preferredCurrency: "INR"
  }
};

export const defaultCorridor = {
  name: "Dwarka Expressway",
  slug: "dwarka-expressway",
  description: "Dwarka Expressway (Northern Peripheral Road / NH-248BB) is an 8-lane grade-separated access-controlled expressway connecting Shiv Murti (Delhi) to Kherki Daula (Gurugram). It represents North India's highest capital appreciation and planned infrastructure corridor.",
  location: "Sectors 102 to 113, Gurugram, Haryana",
  sectors: ["Sector 102", "Sector 103", "Sector 104", "Sector 106", "Sector 108", "Sector 111", "Sector 112", "Sector 113"],
  connectivity: {
    metro: [
      "Proposed Millennium City Centre to Sector 101/104 Metro Extension",
      "Dwarka Sector 21 Metro Interchange within 15 minutes"
    ],
    airportAccess: "Direct tunnel & elevated expressway to IGI Airport Terminal 3 in 18-20 minutes",
    highways: [
      "Direct link to NH-48 via Cloverleaf flyover",
      "Direct integration with Central Peripheral Road (CPR)",
      "Direct access to Urban Extension Road II (UER-II)"
    ],
    cprDistance: "Direct access connecting SPR and Golf Course Extension Road"
  },
  infrastructure: {
    employmentHubs: ["DLF Cyber City", "Aerocity Delhi", "Udyog Vihar", "Yashobhoomi IICC Sector 25 Dwarka"],
    schools: ["Delhi Public School (Sector 102)", "The Shri Ram School", "GEMS International School"],
    hospitals: ["Park Hospital (Sector 47)", "Manipal Hospital", "Signature Hospital"],
    retail: ["Reach Airia Mall", "Conscient One", "Neo Square High Street"],
    futureProjects: ["Diplomatic Enclave II", "Yashobhoomi Phase 2 Expansion", "International Cricket Stadium"]
  },
  marketIntelligence: {
    avgPriceSqft: 14500,
    priceRange: "₹1.8 Cr – ₹6.5 Cr",
    rentalYield: "3.9% – 4.5%",
    annualAppreciation: "14.5% YoY",
    endUseSuitability: "Very High",
    investmentSuitability: "Very High",
    demandLevel: "Very High",
    liquidity: "High",
    marketRisks: [
      "Internal sector connecting road completion variations between older and newer developer clusters.",
      "Varying RWA handover timelines across early phase projects."
    ]
  },
  aiAnalysis: {
    overview: "Dwarka Expressway is transitioning from speculative infrastructure to high-density prime end-use living with immediate airport and Delhi connectivity.",
    topSellingAngle: "Unmatched capital safety backed by Tier-1 developers and immediate connectivity to Yashobhoomi and IGI Airport.",
    keyGrowthDrivers: [
      "Operational Yashobhoomi Convention Centre driving international corporate tenancy.",
      "Grade-separated signal-free connectivity to South Delhi and NH-48.",
      "Master-planned wide sector layout with underground service ducts."
    ],
    generatedAt: new Date()
  },
  verificationStatus: "Verified",
  lastVerified: new Date(),
  source: "GMDA Master Plan 2031 / HRERA Gurugram"
};

export const verified15Projects = [
  {
    name: "M3M Capital",
    slug: "m3m-capital-sector-113",
    builder: "M3M India",
    builderIntelligence: {
      deliveryTrackRecord: "Verified delivery across Golf Course Ext & Dwarka Expressway",
      constructionQuality: "Luxury",
      knownIssues: ["High density campus layout"],
      financialHealth: "Strong liquidity"
    },
    sector: "Sector 113",
    address: "Sector 113, Right on 0 KM Delhi-Gurugram Border, Dwarka Expressway",
    projectArea: "65 Acres Mixed Township",
    towers: 14,
    floors: 36,
    units: 1400,
    configurations: ["2.5 BHK", "3.5 BHK", "4.5 BHK"],
    launchDate: "2022",
    possession: "2026",
    status: "Under Construction",
    priceRange: {
      min: 22000000,
      max: 48000000,
      formatted: "₹2.20 Cr – ₹4.80 Cr",
      pricePerSqftAvg: 15500
    },
    amenities: ["60,000 sqft Grand Clubhouse", "Golf greens view", "7-tier security", "Olympic sized pool", "High-street retail arcade"],
    connectivity: ["0 KM from Delhi border", "12 minutes to IGI Airport T3", "5 minutes to Yashobhoomi (IICC)"],
    usp: ["Closest luxury project to Delhi border", "Adjacent to upcoming commercial hub", "Expansive central green podium"],
    weaknesses: ["Under construction timeline", "Higher density than boutique projects"],
    marketPosition: "Luxury",
    rentalIntelligence: {
      expectedYield: "4.2%",
      monthlyRental3BHK: "₹65,000 – ₹75,000",
      monthlyRental4BHK: "₹90,000 – ₹1,10,000",
      tenantProfile: "Aerocity executives, Embassy delegates, MNC VPs"
    },
    investmentIntelligence: {
      threeYearAppreciation: "18% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Zero-kilometre Delhi boundary status commands highest rental interest upon possession."
    },
    endUseIntelligence: {
      livabilityScore: 89,
      familyFriendlyScore: 88,
      noiseAndPollutionRating: "Sound-insulated frontage buffer",
      communityVibe: "High-net-worth cosmopolitan"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹4.5 / sqft",
      agencyName: "M3M Facility Services"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "35 days"
    },
    photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    documents: [{ title: "Brochure", url: "https://example.com/m3m-capital.pdf", type: "PDF" }],
    reraNumber: "RC/REP/HARERA/GGM/531/263/2022/06",
    notes: "Verified direct builder inventory and secondary resales.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Tata La Vida",
    slug: "tata-la-vida-sector-113",
    builder: "Tata Housing",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered & Ready to Move, debt-free Tata trust",
      constructionQuality: "Premium",
      knownIssues: ["Approach road during monsoon requires GMDA final blacktop completion"],
      financialHealth: "AAA Rated (Tata Group)"
    },
    sector: "Sector 113",
    address: "Sector 113, Bajghera, Dwarka Expressway, Gurugram",
    projectArea: "12 Acres",
    towers: 8,
    floors: 25,
    units: 688,
    configurations: ["2 BHK", "2.5 BHK", "3 BHK"],
    launchDate: "2016",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 16500000,
      max: 27500000,
      formatted: "₹1.65 Cr – ₹2.75 Cr",
      pricePerSqftAvg: 13200
    },
    amenities: ["IGBC Gold certified green campus", "Tree-canopied skywalk", "Cricket pitch & tennis courts", "Double height grand lobby"],
    connectivity: ["0.5 KM from Delhi Border", "15 mins to Aerocity", "8 mins to Dwarka Sec 21 Metro"],
    usp: ["Ready to move with Tata brand trust", "80% open green landscaped space", "Active inhabited community with families"],
    weaknesses: ["Compact bedroom sizes compared to new ultra-luxury launches", "Approach road sector patch"],
    marketPosition: "Premium End-Use",
    rentalIntelligence: {
      expectedYield: "4.0%",
      monthlyRental2BHK: "₹38,000 – ₹42,000",
      monthlyRental3BHK: "₹52,000 – ₹60,000",
      tenantProfile: "Aviation staff, Cyber City engineers, young nuclear families"
    },
    investmentIntelligence: {
      threeYearAppreciation: "14% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Ready-to-move Tata property delivers immediate rental yield with zero construction execution risk."
    },
    endUseIntelligence: {
      livabilityScore: 92,
      familyFriendlyScore: 94,
      noiseAndPollutionRating: "Quiet tree-lined interior layout",
      communityVibe: "Warm family community"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.8 / sqft",
      agencyName: "JLL / Tata Services"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "28 days"
    },
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    documents: [{ title: "Tata La Vida RERA Handover", url: "https://example.com/tata-la-vida.pdf", type: "PDF" }],
    reraNumber: "148 of 2017 registered",
    notes: "Top recommendation for ₹1.8Cr – ₹2.5Cr end-use buyers.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Godrej Meridien",
    slug: "godrej-meridien-sector-106",
    builder: "Godrej Properties",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered phase 1, finishing final towers",
      constructionQuality: "Luxury",
      knownIssues: ["Premium club membership fees"],
      financialHealth: "Godrej Group corporate governance"
    },
    sector: "Sector 106",
    address: "Sector 106, Dwarka Expressway, Gurugram",
    projectArea: "14.5 Acres",
    towers: 7,
    floors: 34,
    units: 700,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    launchDate: "2018",
    possession: "Near Possession / Ready",
    status: "Near Possession",
    priceRange: {
      min: 24000000,
      max: 55000000,
      formatted: "₹2.40 Cr – ₹5.50 Cr",
      pricePerSqftAvg: 16200
    },
    amenities: ["66,000 sqft Clubhouse curated by international hospitality brands", "Olympic sized all-weather pool", "Concierge by Quintessentially", "Fine dining restaurant on campus"],
    connectivity: ["Direct 75-meter road connection to expressway", "20 mins to Cyber Hub", "20 mins to IGI Airport"],
    usp: ["Largest clubhouse in North India", "Ultra-luxury hotel-style hospitality & concierge", "Glass façade architecture"],
    weaknesses: ["High monthly maintenance cost", "Higher ticket size for mid-income buyers"],
    marketPosition: "Ultra Luxury",
    rentalIntelligence: {
      expectedYield: "4.1%",
      monthlyRental3BHK: "₹65,000 – ₹80,000",
      monthlyRental4BHK: "₹95,000 – ₹1,25,000",
      tenantProfile: "C-suite executives, NRI returnees, corporate expats"
    },
    investmentIntelligence: {
      threeYearAppreciation: "16% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Benchmark lifestyle luxury asset commanding peak rental rates along Sector 106."
    },
    endUseIntelligence: {
      livabilityScore: 94,
      familyFriendlyScore: 92,
      noiseAndPollutionRating: "Well buffered",
      communityVibe: "High lifestyle luxury"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹5.2 / sqft",
      agencyName: "Godrej Living"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "40 days"
    },
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    documents: [],
    reraNumber: "HRERA-PKL-GGM-64-2018",
    notes: "Best for luxury lifestyle seekers wanting resort amenities.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Sobha City",
    slug: "sobha-city-sector-108",
    builder: "Sobha Limited",
    builderIntelligence: {
      deliveryTrackRecord: "Gold standard backward integration & construction finish",
      constructionQuality: "Ultra Luxury",
      knownIssues: ["Strict interior modification rules by builder"],
      financialHealth: "Debt-managed publicly listed company"
    },
    sector: "Sector 108",
    address: "Sector 108, Chintels Metropolis, Dwarka Expressway, Gurugram",
    projectArea: "39 Acres",
    towers: 22,
    floors: 25,
    units: 1600,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    launchDate: "2016",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 21000000,
      max: 46000000,
      formatted: "₹2.10 Cr – ₹4.60 Cr",
      pricePerSqftAvg: 15000
    },
    amenities: ["8.5-acre urban park", "Half-acre resort style lakelet", "Two clubhouses totaling 40,000 sqft", "90m diameter cricket ground"],
    connectivity: ["Direct access to Dwarka Expressway", "15 mins to Delhi IGI Airport", "10 mins to Yashobhoomi"],
    usp: ["Finest construction quality in India with zero pre-cast shortcuts", "Unmatched 39-acre low-density development", "Full-size cricket ground on site"],
    weaknesses: ["Adjacent Chintels sector boundary requires route verification"],
    marketPosition: "Luxury",
    rentalIntelligence: {
      expectedYield: "3.9%",
      monthlyRental3BHK: "₹60,000 – ₹72,000",
      monthlyRental4BHK: "₹85,000 – ₹1,10,000",
      tenantProfile: "Doctors, Senior Tech Leads, Corporate Directors"
    },
    investmentIntelligence: {
      threeYearAppreciation: "15% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Sobha brand craftsmanship retains highest value retention in secondary transactions."
    },
    endUseIntelligence: {
      livabilityScore: 96,
      familyFriendlyScore: 97,
      noiseAndPollutionRating: "Expansive green sanctuary",
      communityVibe: "Cultured, sports-enthusiastic community"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹4.2 / sqft",
      agencyName: "Sobha Facilities Management"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "25 days"
    },
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    documents: [],
    reraNumber: "02 OF 2017 / 12 OF 2021",
    notes: "Unrivaled end-use recommendation for sports & green space lovers.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Emaar Gurgaon Greens",
    slug: "emaar-gurgaon-greens-sector-102",
    builder: "Emaar India",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered & Fully Inhabited, international developer pedigree",
      constructionQuality: "Premium",
      knownIssues: ["Outer sector road finishing delays by GMDA"],
      financialHealth: "Strong Dubai parentage backing"
    },
    sector: "Sector 102",
    address: "Sector 102, Dwarka Expressway, Gurugram",
    projectArea: "13.5 Acres",
    towers: 14,
    floors: 14,
    units: 672,
    configurations: ["3 BHK", "4 BHK"],
    launchDate: "2014",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 19500000,
      max: 31000000,
      formatted: "₹1.95 Cr – ₹3.10 Cr",
      pricePerSqftAvg: 12500
    },
    amenities: ["Spacious central park", "Clubhouse with squash & badminton courts", "Perimeter jogging track", "Convenience daily shopping mart"],
    connectivity: ["100m from main Dwarka Expressway service lane", "Direct road to Hero Honda Chowk via Basai flyover", "22 mins to Cyber City"],
    usp: ["Ready to move with low-rise G+14 structure", "Low density feel", "Spacious 3 BHK layouts starting from 1650 sqft"],
    weaknesses: ["Sector 102 drainage upgrade in progress by municipal corporation"],
    marketPosition: "Premium End-Use",
    rentalIntelligence: {
      expectedYield: "4.3%",
      monthlyRental3BHK: "₹45,000 – ₹55,000",
      tenantProfile: "Corporate families working along CPR & NH-48"
    },
    investmentIntelligence: {
      threeYearAppreciation: "13% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Affordable entry into ready 3 BHK luxury with immediate high rental cashflow."
    },
    endUseIntelligence: {
      livabilityScore: 90,
      familyFriendlyScore: 91,
      noiseAndPollutionRating: "Moderate buffer",
      communityVibe: "Family oriented"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.6 / sqft",
      agencyName: "Emaar Management"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "32 days"
    },
    photos: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
    documents: [],
    reraNumber: "36 of 2017 registered",
    notes: "Proven high-yield ready asset in Sector 102.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "M3M Crown",
    slug: "m3m-crown-sector-111",
    builder: "M3M India",
    builderIntelligence: {
      deliveryTrackRecord: "New generation luxury architecture",
      constructionQuality: "Luxury",
      knownIssues: ["High ongoing construction activity in vicinity"],
      financialHealth: "Strong liquidity"
    },
    sector: "Sector 111",
    address: "Sector 111, Dwarka Expressway, Gurugram",
    projectArea: "16 Acres",
    towers: 11,
    floors: 32,
    units: 800,
    configurations: ["3 BHK", "4 BHK"],
    launchDate: "2023",
    possession: "2027",
    status: "Under Construction",
    priceRange: {
      min: 29000000,
      max: 60000000,
      formatted: "₹2.90 Cr – ₹6.00 Cr",
      pricePerSqftAvg: 17500
    },
    amenities: ["Italian marble finishes", "5.5-acre central landscape park", "Lake and cascading water feature", "Shaded leisure cabanas"],
    connectivity: ["Immediate Delhi boundary touchpoint", "10 mins to Terminal 3 IGI Airport", "8 mins to Yashobhoomi"],
    usp: ["Sector 111 prime luxury corridor", "Waterfront central landscaping theme", "Italian marble standard specifications"],
    weaknesses: ["Possession in 2027", "Requires long investment horizon"],
    marketPosition: "Ultra Luxury",
    rentalIntelligence: {
      expectedYield: "4.1%",
      monthlyRental3BHK: "₹80,000 (Projected)",
      tenantProfile: "Aerocity corporate leadership"
    },
    investmentIntelligence: {
      threeYearAppreciation: "19% CAGR",
      exitLiquidity: "Moderate",
      investmentThesis: "Sector 111 is being developed as the smart city gold coast adjoining Dwarka."
    },
    endUseIntelligence: {
      livabilityScore: 91,
      familyFriendlyScore: 90,
      noiseAndPollutionRating: "Planned acoustic barriers",
      communityVibe: "Luxury executive"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹4.8 / sqft",
      agencyName: "M3M Facility Services"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "45 days"
    },
    photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    documents: [],
    reraNumber: "RC/REP/HARERA/GGM/687/419/2023/31",
    notes: "High-end investor favorite for capital appreciation.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "SmartWorld One DXP",
    slug: "smartworld-one-dxp-sector-113",
    builder: "SmartWorld Developers",
    builderIntelligence: {
      deliveryTrackRecord: "Singapore design partnership, rapid construction velocity",
      constructionQuality: "Luxury",
      knownIssues: ["Newer developer brand compared to Tata or Godrej"],
      financialHealth: "Backed by institutional private equity"
    },
    sector: "Sector 113",
    address: "Sector 113, Dwarka Expressway, Gurugram",
    projectArea: "16 Acres",
    towers: 8,
    floors: 30,
    units: 900,
    configurations: ["2.5 BHK", "3.5 BHK", "4.5 BHK"],
    launchDate: "2022",
    possession: "2026",
    status: "Under Construction",
    priceRange: {
      min: 23000000,
      max: 51000000,
      formatted: "₹2.30 Cr – ₹5.10 Cr",
      pricePerSqftAvg: 16000
    },
    amenities: ["Club One DXP with 24x7 co-working pods", "Heated indoor pool", "Aqua amusement park for kids", "Double-glazed acoustic windows"],
    connectivity: ["0 KM from Delhi border", "10 mins to Aerocity", "Direct signal-free connectivity to Dwarka Sector 21"],
    usp: ["Smart home automation integrated", "24x7 co-working club lounge", "Delhi border position"],
    weaknesses: ["Under construction stage requires milestone tracking"],
    marketPosition: "Luxury",
    rentalIntelligence: {
      expectedYield: "4.3%",
      monthlyRental3BHK: "₹70,000 – ₹85,000",
      tenantProfile: "Tech founders, young C-suite executives, pilots"
    },
    investmentIntelligence: {
      threeYearAppreciation: "17% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Smart automation and co-working amenities target modern hybrid corporate workforces."
    },
    endUseIntelligence: {
      livabilityScore: 92,
      familyFriendlyScore: 91,
      noiseAndPollutionRating: "Double-glazed sound insulation",
      communityVibe: "Modern tech-forward"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹4.5 / sqft",
      agencyName: "SmartWorld Living"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "30 days"
    },
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    documents: [],
    reraNumber: "RC/REP/HARERA/GGM/645/377/2022/120",
    notes: "Strong competitor to M3M Capital in Sector 113.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Hero Homes",
    slug: "hero-homes-sector-104",
    builder: "Hero Realty",
    builderIntelligence: {
      deliveryTrackRecord: "Hero Group industrial legacy and ethical governance",
      constructionQuality: "Premium",
      knownIssues: ["Visitor parking slots limited during festivals"],
      financialHealth: "AAA Corporate Backing (Hero Enterprise)"
    },
    sector: "Sector 104",
    address: "Sector 104, Dwarka Expressway, Gurugram",
    projectArea: "9 Acres",
    towers: 8,
    floors: 35,
    units: 1040,
    configurations: ["2 BHK", "3 BHK"],
    launchDate: "2019",
    possession: "Near Possession / Ready",
    status: "Near Possession",
    priceRange: {
      min: 17500000,
      max: 29000000,
      formatted: "₹1.75 Cr – ₹2.90 Cr",
      pricePerSqftAvg: 13500
    },
    amenities: ["Ayur-themed medicinal greens", "Oxygen-point gardens", "Reflexology pathways", "Solar powered lighting"],
    connectivity: ["Direct road to Old Railway Road and New Railway Road", "Direct service lane to Dwarka Expressway", "18 mins to Cyber City"],
    usp: ["Wellness-themed living with herbal gardens", "Hero Group trust and transparent billing", "Practical floor plans with no wasted foyer space"],
    weaknesses: ["Slightly higher density per acre"],
    marketPosition: "Premium End-Use",
    rentalIntelligence: {
      expectedYield: "4.2%",
      monthlyRental2BHK: "₹38,000 – ₹42,000",
      monthlyRental3BHK: "₹50,000 – ₹58,000",
      tenantProfile: "Corporate professionals and healthcare specialists"
    },
    investmentIntelligence: {
      threeYearAppreciation: "15% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Sector 104 has dual access to both Old Gurgaon markets and the new expressway."
    },
    endUseIntelligence: {
      livabilityScore: 91,
      familyFriendlyScore: 92,
      noiseAndPollutionRating: "Herbally purified air buffer",
      communityVibe: "Health & wellness conscious"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.8 / sqft",
      agencyName: "Hero Facility Management"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "33 days"
    },
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    documents: [],
    reraNumber: "HRERA-PKL-GGM-27-2018",
    notes: "Prime alternative to Tata La Vida for ₹2Cr buyers.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Indiabulls Centrum Park",
    slug: "indiabulls-centrum-park-sector-103",
    builder: "Indiabulls Real Estate",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered & matured community with high occupancy",
      constructionQuality: "Standard",
      knownIssues: ["Older architectural facade compared to 2024 launches"],
      financialHealth: "Equinox Holdings transition"
    },
    sector: "Sector 103",
    address: "Sector 103, Dwarka Expressway, Gurugram",
    projectArea: "17 Acres",
    towers: 16,
    floors: 24,
    units: 1010,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    launchDate: "2010",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 14000000,
      max: 26000000,
      formatted: "₹1.40 Cr – ₹2.60 Cr",
      pricePerSqftAvg: 11000
    },
    amenities: ["Mature landscaped gardens", "Operational clubhouse with swimming pool", "On-site supermarket and salon", "Tennis and basketball courts"],
    connectivity: ["150m from Dwarka Expressway corridor", "Direct route to Daulatabad flyover and railway station", "25 mins to Cyber City"],
    usp: ["Lowest price per sqft for ready verified 3 BHK on Dwarka Expressway", "Fully functional mature society with 800+ families living", "Spacious room sizes"],
    weaknesses: ["Older elevation aesthetics", "Older lift fittings"],
    marketPosition: "Mid-Market",
    rentalIntelligence: {
      expectedYield: "4.4%",
      monthlyRental2BHK: "₹30,000 – ₹35,000",
      monthlyRental3BHK: "₹42,000 – ₹48,000",
      tenantProfile: "Families seeking affordable space close to expressway"
    },
    investmentIntelligence: {
      threeYearAppreciation: "12% CAGR",
      exitLiquidity: "High",
      investmentThesis: "High rental yield and affordable entry ticket create continuous secondary resale velocity."
    },
    endUseIntelligence: {
      livabilityScore: 86,
      familyFriendlyScore: 89,
      noiseAndPollutionRating: "Interior quiet zone",
      communityVibe: "Warm established neighborhood"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.2 / sqft",
      agencyName: "Indiabulls RWA"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "22 days"
    },
    photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    documents: [],
    reraNumber: "Pre-RERA delivered / Completion certificate issued",
    notes: "Value pick for budget-constrained buyers under ₹2 Cr.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Godrej Vrikshya",
    slug: "godrej-vrikshya-sector-103",
    builder: "Godrej Properties",
    builderIntelligence: {
      deliveryTrackRecord: "Brand-new marquee launch in Sector 103",
      constructionQuality: "Luxury",
      knownIssues: ["New launch with early stage foundation work"],
      financialHealth: "Exceptional corporate balance sheet"
    },
    sector: "Sector 103",
    address: "Sector 103, Dwarka Expressway, Gurugram",
    projectArea: "15 Acres",
    towers: 7,
    floors: 30,
    units: 650,
    configurations: ["3 BHK", "4 BHK"],
    launchDate: "2024",
    possession: "2028",
    status: "New Launch",
    priceRange: {
      min: 32000000,
      max: 65000000,
      formatted: "₹3.20 Cr – ₹6.50 Cr",
      pricePerSqftAvg: 18000
    },
    amenities: ["Forest-inspired Japanese landscaped gardens", "70,000 sqft signature clubhouse", "Private lift lobbies", "Infinity edge sky lounge"],
    connectivity: ["Direct access to 75m wide sector road", "15 mins to Yashobhoomi", "20 mins to Aerocity"],
    usp: ["Lowest density Godrej luxury development on expressway", "Massive bio-diverse green forest cover", "Ultra-spacious deck balconies"],
    weaknesses: ["Longest completion timeline (2028)"],
    marketPosition: "Ultra Luxury",
    rentalIntelligence: {
      expectedYield: "4.0%",
      monthlyRental3BHK: "₹85,000 (Projected)",
      tenantProfile: "Corporate executives and multi-generational business families"
    },
    investmentIntelligence: {
      threeYearAppreciation: "20% CAGR",
      exitLiquidity: "Moderate",
      investmentThesis: "New launch pricing lock-in provides strong appreciation upside as Sector 103 develops."
    },
    endUseIntelligence: {
      livabilityScore: 95,
      familyFriendlyScore: 94,
      noiseAndPollutionRating: "Dense forest acoustic barrier",
      communityVibe: "Ultra-luxury sanctuary"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹5.0 / sqft",
      agencyName: "Godrej Living"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "45 days"
    },
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    documents: [],
    reraNumber: "RC/REP/HARERA/GGM/823/555/2024/50",
    notes: "Premium launch for patient capital investors.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "BPTP Amstoria Verti Greens",
    slug: "bptp-amstoria-verti-greens-sector-102",
    builder: "BPTP Limited",
    builderIntelligence: {
      deliveryTrackRecord: "Matured 126-acre integrated township delivery",
      constructionQuality: "Premium",
      knownIssues: ["Township exterior boundary fencing in progress in parts"],
      financialHealth: "Stable operational asset"
    },
    sector: "Sector 102",
    address: "BPTP Amstoria Township, Sector 102, Dwarka Expressway, Gurugram",
    projectArea: "126 Acres Integrated Township",
    towers: 6,
    floors: 22,
    units: 420,
    configurations: ["3 BHK", "4 BHK"],
    launchDate: "2021",
    possession: "Near Possession",
    status: "Near Possession",
    priceRange: {
      min: 22500000,
      max: 38000000,
      formatted: "₹2.25 Cr – ₹3.80 Cr",
      pricePerSqftAvg: 13800
    },
    amenities: ["Sanctuary 102 grand clubhouse", "Vertical green landscaped towers", "Township wide 24x7 security", "Dedicated cycle paths"],
    connectivity: ["Direct entry from 60m sector dividing road", "Immediate link to CPR", "20 mins to NH-48"],
    usp: ["Low-density high-rise living within a secure 126-acre plotted township", "Vertical hanging gardens on balconies", "Peaceful township environment"],
    weaknesses: ["Commercial high-street still developing within township"],
    marketPosition: "Premium End-Use",
    rentalIntelligence: {
      expectedYield: "4.1%",
      monthlyRental3BHK: "₹55,000 – ₹65,000",
      tenantProfile: "Township lifestyle seekers and corporate families"
    },
    investmentIntelligence: {
      threeYearAppreciation: "14% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Living inside an integrated plotted township yields superior open space and lower ambient density."
    },
    endUseIntelligence: {
      livabilityScore: 92,
      familyFriendlyScore: 93,
      noiseAndPollutionRating: "Zero highway noise (interior township location)",
      communityVibe: "Plotted township luxury"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.9 / sqft",
      agencyName: "BPTP Facility Services"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "38 days"
    },
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    documents: [],
    reraNumber: "HRERA-PKL-GGM-112-2019",
    notes: "Great option for buyers who prefer township security.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Indiabulls Heights",
    slug: "indiabulls-heights-sector-104",
    builder: "Indiabulls Real Estate",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered towers with active occupation",
      constructionQuality: "Standard",
      knownIssues: ["Approach road needs street lighting enhancement by GMDA"],
      financialHealth: "Equinox Transition"
    },
    sector: "Sector 104",
    address: "Sector 104, Near Daulatabad Flyover, Dwarka Expressway, Gurugram",
    projectArea: "11 Acres",
    towers: 7,
    floors: 26,
    units: 550,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    launchDate: "2012",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 15500000,
      max: 28500000,
      formatted: "₹1.55 Cr – ₹2.85 Cr",
      pricePerSqftAvg: 11800
    },
    amenities: ["Operational swimming pool", "Gymnasium and community hall", "Full power backup", "Children play park"],
    connectivity: ["Close to Hero Homes Sector 104", "Direct link to Dhanwapur and Old Railway road", "22 mins to Cyber City"],
    usp: ["Very competitive price point for ready possession", "Spacious layouts", "High immediate rental demand"],
    weaknesses: ["Mid-tier finish quality compared to Sobha or Godrej"],
    marketPosition: "Mid-Market",
    rentalIntelligence: {
      expectedYield: "4.3%",
      monthlyRental3BHK: "₹42,000 – ₹48,000",
      tenantProfile: "Budget-conscious IT professionals and corporate managers"
    },
    investmentIntelligence: {
      threeYearAppreciation: "13% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Strong resale demand due to accessible ticket size."
    },
    endUseIntelligence: {
      livabilityScore: 85,
      familyFriendlyScore: 87,
      noiseAndPollutionRating: "Quiet residential cluster",
      communityVibe: "Warm middle-class professional"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.3 / sqft",
      agencyName: "Indiabulls RWA"
    },
    resaleIntelligence: {
      demandGrade: "B+",
      averageDaysOnMarket: "30 days"
    },
    photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    documents: [],
    reraNumber: "Pre-RERA registered / OC granted",
    notes: "Solid value proposition under ₹2 Cr.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Tata Gurgaon Gateway",
    slug: "tata-gurgaon-gateway-sector-112",
    builder: "Tata Housing",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered luxury project right at Delhi threshold",
      constructionQuality: "Luxury",
      knownIssues: ["High ongoing maintenance charges"],
      financialHealth: "AAA Rated (Tata Group)"
    },
    sector: "Sector 112",
    address: "Sector 112, Dwarka Expressway, Gurugram (Delhi Border)",
    projectArea: "9 Acres",
    towers: 6,
    floors: 24,
    units: 358,
    configurations: ["2 BHK", "3 BHK"],
    launchDate: "2013",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 24000000,
      max: 42000000,
      formatted: "₹2.40 Cr – ₹4.20 Cr",
      pricePerSqftAvg: 16500
    },
    amenities: ["Boutique luxury clubhouse", "Multi-tiered swimming pool", "Fitness club by international consultants", "High-security gated access"],
    connectivity: ["Exact entrance point to Gurugram from Delhi on NPR", "12 mins to Aerocity", "10 mins to Dwarka Metro"],
    usp: ["Very low density (only 358 units across 9 acres)", "Tata brand quality and maintenance", "Gateway location to Delhi"],
    weaknesses: ["Limited secondary inventory available in market"],
    marketPosition: "Luxury",
    rentalIntelligence: {
      expectedYield: "3.9%",
      monthlyRental3BHK: "₹65,000 – ₹78,000",
      tenantProfile: "Senior airline pilots, diplomatic staff, senior executives"
    },
    investmentIntelligence: {
      threeYearAppreciation: "15% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Boutique low density ensures scarcity value and pristine community preservation."
    },
    endUseIntelligence: {
      livabilityScore: 93,
      familyFriendlyScore: 92,
      noiseAndPollutionRating: "Well-insulated boundary walls",
      communityVibe: "Elite boutique community"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹4.6 / sqft",
      agencyName: "Tata Services"
    },
    resaleIntelligence: {
      demandGrade: "A+",
      averageDaysOnMarket: "24 days"
    },
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    documents: [],
    reraNumber: "57 of 2017 registered",
    notes: "Boutique luxury pick for low-density preference.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Experion The Heartsong",
    slug: "experion-the-heartsong-sector-108",
    builder: "Experion Developers",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered and maintained by Singapore FDI backed developer",
      constructionQuality: "Premium",
      knownIssues: ["Approach road enhancement pending GMDA"],
      financialHealth: "100% FDI funded by AT Holdings Singapore"
    },
    sector: "Sector 108",
    address: "Sector 108, Dwarka Expressway, Gurugram",
    projectArea: "15 Acres",
    towers: 15,
    floors: 14,
    units: 811,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    launchDate: "2013",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 17000000,
      max: 32000000,
      formatted: "₹1.70 Cr – ₹3.20 Cr",
      pricePerSqftAvg: 12800
    },
    amenities: ["20,000 sqft community club", "Air-conditioned indoor games arena", "Cricket practice nets", "Daily convenience store"],
    connectivity: ["Direct link to 75m wide sector road", "18 mins to IGI Airport", "15 mins to Yashobhoomi"],
    usp: ["100% FDI backed Singapore developer transparency", "Spacious open balconies with green courtyard views", "Ready with occupancy certificate"],
    weaknesses: ["Mid-rise elevation aesthetics"],
    marketPosition: "Premium End-Use",
    rentalIntelligence: {
      expectedYield: "4.1%",
      monthlyRental3BHK: "₹48,000 – ₹56,000",
      tenantProfile: "Corporate engineers, Aerocity staff, families"
    },
    investmentIntelligence: {
      threeYearAppreciation: "13.5% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Singapore corporate governance ensures clear land titles and steady rental yields."
    },
    endUseIntelligence: {
      livabilityScore: 89,
      familyFriendlyScore: 91,
      noiseAndPollutionRating: "Quiet sector location",
      communityVibe: "Warm cosmopolitan"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹3.8 / sqft",
      agencyName: "Experion FM"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "31 days"
    },
    photos: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
    documents: [],
    reraNumber: "135 of 2017 registered",
    notes: "High trust ready-to-move option with Singapore standards.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  },
  {
    name: "Adani M2K Oyster Grande",
    slug: "adani-m2k-oyster-grande-sector-102",
    builder: "Adani Realty & M2K",
    builderIntelligence: {
      deliveryTrackRecord: "Delivered luxury township phase, Adani infrastructure backing",
      constructionQuality: "Luxury",
      knownIssues: ["High density tower clusters"],
      financialHealth: "Adani Enterprises conglomerate backing"
    },
    sector: "Sector 102",
    address: "Sector 102, Dwarka Expressway, Gurugram",
    projectArea: "19 Acres",
    towers: 9,
    floors: 25,
    units: 750,
    configurations: ["3 BHK", "4 BHK", "Penthouse"],
    launchDate: "2013",
    possession: "Ready to Move",
    status: "Ready to Move",
    priceRange: {
      min: 22000000,
      max: 45000000,
      formatted: "₹2.20 Cr – ₹4.50 Cr",
      pricePerSqftAvg: 14200
    },
    amenities: ["Expansive Olympic sized pool", "Grand luxury clubhouse", "Multi-tier security", "Lush landscaped gardens and tennis courts"],
    connectivity: ["Immediate touchpoint to Dwarka Expressway", "Direct link to Hero Honda Chowk via Basai road", "20 mins to Cyber City"],
    usp: ["Adani brand backing", "Ready to move with spacious 3 & 4 BHK layouts", "Large central podium park"],
    weaknesses: ["Sector 102 external commercial infrastructure still maturing"],
    marketPosition: "Luxury",
    rentalIntelligence: {
      expectedYield: "4.0%",
      monthlyRental3BHK: "₹58,000 – ₹68,000",
      monthlyRental4BHK: "₹80,000 – ₹1,00,000",
      tenantProfile: "Senior managers, business owners, and corporate consultants"
    },
    investmentIntelligence: {
      threeYearAppreciation: "14.5% CAGR",
      exitLiquidity: "High",
      investmentThesis: "Reputable conglomerate execution and ready occupancy make it a safe capital haven."
    },
    endUseIntelligence: {
      livabilityScore: 92,
      familyFriendlyScore: 93,
      noiseAndPollutionRating: "Well-insulated interior block",
      communityVibe: "Affluent corporate family living"
    },
    maintenance: {
      estimatedMonthlyPerSqft: "₹4.0 / sqft",
      agencyName: "Adani Facility Services"
    },
    resaleIntelligence: {
      demandGrade: "A",
      averageDaysOnMarket: "32 days"
    },
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    documents: [],
    reraNumber: "HRERA-PKL-GGM-140-2019",
    notes: "Prime ready luxury option in Sector 102.",
    verificationStatus: "Verified",
    lastVerified: new Date(),
    source: "HRERA / Official Master Sales Brochure",
    dataVersion: 1
  }
];

export const sampleVerifiedProperties = [
  {
    propertyId: "TLV-T3-1204",
    projectName: "Tata La Vida",
    tower: "Tower 3",
    floor: 12,
    totalFloors: 25,
    unit: "1204",
    bhk: "3 BHK",
    area: 1579,
    facing: "North-East",
    view: "Central Tree-canopied Green View",
    furnishing: "Semi-Furnished",
    parking: "2 Covered Dedicated",
    askingPrice: 22800000,
    expectedPrice: 22000000,
    lowestExpectedPrice: 21500000,
    pricePerSqft: 14439,
    seller: {
      name: "Ramesh Narang",
      contact: "+91 98110 54321",
      urgency: "High",
      brokeragePercentage: 1.0
    },
    availability: "Available",
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    documents: [{ title: "Possession Letter & Electricity NOC", url: "https://example.com/noc.pdf", type: "PDF" }],
    notes: "Motivated seller relocating to Bengaluru. Immediate token will lock unit at ₹2.18 Cr.",
    verificationStatus: "Verified",
    status: "Available"
  },
  {
    propertyId: "M3M-CAP-T2-1801",
    projectName: "M3M Capital",
    tower: "Tower B",
    floor: 18,
    totalFloors: 36,
    unit: "1801",
    bhk: "3.5 BHK",
    area: 2085,
    facing: "East Facing",
    view: "Delhi Ridge & Yashobhoomi View",
    furnishing: "Semi-Furnished",
    parking: "2 Covered Dedicated",
    askingPrice: 32500000,
    expectedPrice: 31500000,
    lowestExpectedPrice: 31000000,
    pricePerSqft: 15587,
    seller: {
      name: "Vikram Singhania",
      contact: "+91 98711 22334",
      urgency: "Moderate",
      brokeragePercentage: 1.0
    },
    availability: "Available",
    photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    documents: [],
    notes: "Prime high-floor unit with uninterrupted Delhi greens view. Ready for builder transfer.",
    verificationStatus: "Verified",
    status: "Available"
  },
  {
    propertyId: "SOBHA-CT-T7-0702",
    projectName: "Sobha City",
    tower: "Tower 7",
    floor: 7,
    totalFloors: 25,
    unit: "702",
    bhk: "3 BHK",
    area: 1710,
    facing: "Park Facing",
    view: "Cricket Ground & Resort Lake View",
    furnishing: "Semi-Furnished",
    parking: "2 Covered Dedicated",
    askingPrice: 25800000,
    expectedPrice: 25000000,
    lowestExpectedPrice: 24500000,
    pricePerSqft: 15087,
    seller: {
      name: "Anandita Sen",
      contact: "+91 99990 87654",
      urgency: "Moderate",
      brokeragePercentage: 1.0
    },
    availability: "Available",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    documents: [],
    notes: "Impeccably maintained Sobha construction with wooden flooring in master bedroom.",
    verificationStatus: "Verified",
    status: "Available"
  },
  {
    propertyId: "EMAAR-GG-T4-0901",
    projectName: "Emaar Gurgaon Greens",
    tower: "Tower 4",
    floor: 9,
    totalFloors: 14,
    unit: "901",
    bhk: "3 BHK",
    area: 1650,
    facing: "North Facing",
    view: "Open Courtyard & Swimming Pool",
    furnishing: "Semi-Furnished",
    parking: "1 Covered Dedicated",
    askingPrice: 20500000,
    expectedPrice: 19800000,
    lowestExpectedPrice: 19500000,
    pricePerSqft: 12424,
    seller: {
      name: "Harish Gupta",
      contact: "+91 98101 44556",
      urgency: "High",
      brokeragePercentage: 1.0
    },
    availability: "Available",
    photos: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
    documents: [],
    notes: "Spacious ready unit, ideal for immediate move-in or renting out at ₹50,000/month.",
    verificationStatus: "Verified",
    status: "Available"
  },
  {
    propertyId: "HERO-H-T1-1402",
    projectName: "Hero Homes",
    tower: "Tower 1",
    floor: 14,
    totalFloors: 35,
    unit: "1402",
    bhk: "3 BHK",
    area: 1689,
    facing: "North-East",
    view: "Ayur Green & Expressway Boulevard",
    furnishing: "Semi-Furnished",
    parking: "2 Covered Dedicated",
    askingPrice: 22800000,
    expectedPrice: 22000000,
    lowestExpectedPrice: 21600000,
    pricePerSqft: 13500,
    seller: {
      name: "Pradeep Mehra",
      contact: "+91 98118 77665",
      urgency: "Immediate Distress",
      brokeragePercentage: 1.0
    },
    availability: "Available",
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    documents: [],
    notes: "Distress sale due to overseas migration. Clear funds can close at attractive discount.",
    verificationStatus: "Verified",
    status: "Available"
  }
];

export const sampleLeads = [
  {
    name: "Rahul Sharma",
    phone: "+91 98102 34567",
    email: "rahul.sharma@techcorp.com",
    source: "Direct Referral",
    budget: {
      min: 22000000,
      max: 24000000,
      formatted: "₹2.20 Cr – ₹2.40 Cr"
    },
    purpose: "End Use",
    corridor: "Dwarka Expressway",
    preferredProjects: ["Tata La Vida", "Hero Homes", "Emaar Gurgaon Greens"],
    bhk: ["3 BHK"],
    timeline: "< 30 Days",
    familyStructure: "Nuclear family (Wife + 1 child)",
    financing: "Pre-approved Loan",
    decisionMakers: ["Rahul", "Pooja (Wife)"],
        interestedProjects: [
      { projectName: "Tata La Vida", notes: "Primary shortlisted project for 3 BHK unit" },
      { projectName: "Hero Homes", notes: "Secondary option for family living" }
    ],
    alternativeProjects: [
      {
        projectName: "Hero Homes",
        reason: "Sector 104 location with comparable wellness park amenities and slightly lower ticket price.",
        whatItDoesBetter: "Expansive herbal park and direct approach to railway station road.",
        whatItDoesWorse: "Slightly higher overall tower density.",
        matchScore: 89
      },
      {
        projectName: "Emaar Gurgaon Greens",
        reason: "Ready-to-move spacious 3 BHK in Sector 102 with established community.",
        whatItDoesBetter: "Larger room dimensions (1650 sqft) at lower rate per sqft.",
        whatItDoesWorse: "Sector 102 internal road development by GMDA in progress.",
        matchScore: 86
      }
    ],
    clientRequirement: {
      budgetRange: "₹2.20 Cr – ₹2.40 Cr",
      purpose: "End Use",
      timeline: "< 30 Days",
      bhk: ["3 BHK"],
      areaSqft: "1550 - 1700 sqft",
      facing: "Park Facing / North-East",
      floorPreference: "Middle Floor (7th to 14th)",
      furnishing: "Semi-Furnished",
      lifestyle: "Quiet Gated Community with Sports Amenities",
      preferredCorridor: "Dwarka Expressway",
      preferredLocation: "Sector 113 or Sector 104",
      preferredSectors: ["Sector 113", "Sector 104"],
      possessionPreference: "Ready to Move (within 30-45 days)",
      investmentPriority: "Capital preservation and safe title",
      rentalPriority: "Secondary consideration",
      familyRequirement: "Safe gated play areas for 5-year-old child; green walking tracks",
      mustHave: ["Ready to move OC received", "2 covered car parks", "Central park view"],
      niceToHave: ["EV charging point", "Clubhouse tennis court"],
      financing: "Pre-approved loan with HDFC Bank",
      decisionMakers: ["Rahul Sharma (Self)", "Pooja Sharma (Wife)"],
      specialRequirements: "Requires confirmation on GMDA road carpeting before signing token"
    },
    preferences: {
      preferredFloor: "Middle Floor (7th to 14th)",
      facing: "Park Facing / Open View",
      mustHave: ["Ready to move or possession within 60 days", "Gated security with clubhouse", "Near Delhi border"],
      niceToHave: ["EV charging provision", "Covered parking"]
    },
    objections: ["Price negotiation buffer", "Wife felt approach road needs final carpeting"],
    temperature: "Hot",
    stage: "Visiting",
    activityState: "Visit",
    outcome: "Active",
    lastInteraction: new Date(Date.now() - 12 * 3600 * 1000),
    nextAction: {
      action: "Call Rahul to resolve approach road query and present Tata La Vida unit TLV-T3-1204 offer",
      why: "Client has already completed first site tour. Decision is price & wife consensus. Seller is urgent.",
      whatToSay: "Confirm that GMDA tender for Sector 113 link road is awarded for completion before winter. Unit TLV-T3-1204 seller will accept ₹2.20 Cr for immediate cheque.",
      whatToAsk: "Can we review the revised payment schedule over a brief call at 4:30 PM today?",
      whatNotToSay: "Do not sound desperate or suggest cheaper secondary older sectors.",
      targetDate: new Date()
    },
    aiPriority: {
      score: 92,
      grade: "Hot Priority",
      explanation: "₹2.3Cr verified budget, visited Tata La Vida, timeline < 30 days, pre-approved loan in place.",
      topFactors: [
        "Pre-approved loan ready with HDFC Bank",
        "Already physically toured Sector 113",
        "Decision maker involved in discussions"
      ],
      lastCalculated: new Date()
    },
    notes: "Sir ko project pasand aya but wife ko road ka concern tha. Solved with GMDA documentation."
  },
  {
    name: "Amit Patel",
    phone: "+91 99201 88990",
    email: "amit.patel@investments.in",
    source: "Channel Partner",
    budget: {
      min: 28000000,
      max: 35000000,
      formatted: "₹2.80 Cr – ₹3.50 Cr"
    },
    purpose: "Investment",
    corridor: "Dwarka Expressway",
    preferredProjects: ["M3M Capital", "SmartWorld One DXP", "M3M Crown"],
    bhk: ["3.5 BHK", "4 BHK"],
    timeline: "< 15 Days",
    familyStructure: "Investor (Portfolio allocation)",
    financing: "Self Funded / Cash",
    decisionMakers: ["Self"],
    preferences: {
      preferredFloor: "High Floor (18+)",
      facing: "East / Delhi Border",
      mustHave: ["High rental yield", "Reputed developer with capital gain history"],
      niceToHave: ["Subvention payment plan"]
    },
    objections: ["Comparing M3M Capital vs SmartWorld One DXP payment milestones"],
    temperature: "Hot",
    stage: "Advising",
    activityState: "Follow-up",
    outcome: "Active",
    lastInteraction: new Date(Date.now() - 24 * 3600 * 1000),
    nextAction: {
      action: "Send side-by-side ROI and payment schedule analysis for M3M Capital vs SmartWorld One DXP",
      why: "Buyer has ready liquidity and is evaluating which developer gives better post-possession leasing velocity.",
      whatToSay: "Highlight M3M Capital's 0-KM boundary premium vs SmartWorld's automated clubhouse amenities.",
      whatToAsk: "Are you prioritizing 3-year capital gain exit or 5-year steady rental cashflow?",
      targetDate: new Date()
    },
    aiPriority: {
      score: 89,
      grade: "High Interest",
      explanation: "Self-funded ₹3.2Cr budget, looking for immediate token booking before quarter end.",
      topFactors: [
        "100% self-funded cash buyer",
        "Timeline under 15 days",
        "Zero dependency on external bank sanction"
      ],
      lastCalculated: new Date()
    },
    notes: "Met at Aerocity lounge. High urgency to deploy capital before tax financial year cycle."
  },
  {
    name: "Neha Kapoor",
    phone: "+91 98188 11223",
    email: "neha.kapoor@consulting.com",
    source: "Website",
    budget: {
      min: 20000000,
      max: 23000000,
      formatted: "₹2.00 Cr – ₹2.30 Cr"
    },
    purpose: "End Use",
    corridor: "Dwarka Expressway",
    preferredProjects: ["Hero Homes", "Tata La Vida"],
    bhk: ["3 BHK"],
    timeline: "1 - 3 Months",
    familyStructure: "Parents + Neha",
    financing: "Loan Required",
    decisionMakers: ["Father & Neha"],
    preferences: {
      preferredFloor: "Lower to Middle Floor (2nd to 8th)",
      facing: "Park Facing",
      mustHave: ["Low density", "Senior citizen friendly parks", "24x7 security"],
      niceToHave: ["Temple in premises"]
    },
    objections: ["Father prefers lower floors with easy garden access"],
    temperature: "Warm",
    stage: "Exploring",
    activityState: "Scheduled",
    outcome: "Active",
    lastInteraction: new Date(Date.now() - 48 * 3600 * 1000),
    nextAction: {
      action: "Confirm Saturday 11:00 AM site visit to Hero Homes Ayur Gardens",
      why: "Father needs to physically inspect walking tracks and bench seating before committing.",
      whatToSay: "Show the reflexology pathway and medicinal green lawns in Hero Homes Sector 104.",
      whatToAsk: "Will Uncle require golf cart assistance during the community tour?",
      targetDate: new Date(Date.now() + 24 * 3600 * 1000)
    },
    aiPriority: {
      score: 79,
      grade: "Warm Engagement",
      explanation: "Solid budget fit, father's comfort is the primary gatekeeper for decision.",
      topFactors: ["Family end-use requirement", "Budget fits ready Sector 104 inventory perfectly"],
      lastCalculated: new Date()
    },
    notes: "Very polite corporate professional. Respectful handling of father's requirements is key."
  }
];

export const sampleTasks = [
  {
    title: "Call Rahul Sharma — Present Revised Tata La Vida Unit Offer",
    leadName: "Rahul Sharma",
    type: "Call",
    why: "Client visited Tata La Vida and loved layout; price gap of ₹8 Lakhs is current blocker with urgent seller.",
    whatToDo: "Call Rahul directly at 4:30 PM. Offer unit TLV-T3-1204 with negotiated ₹2.20 Cr closing price.",
    whatToSay: "I spoke with the owner of unit 1204; he has agreed to your budget of ₹2.20 Cr on the condition of token signing this Saturday.",
    whatToAsk: "Can we schedule 30 minutes on Saturday morning at the project to complete the token verification?",
    whatNotToSay: "Do not mention that seller is in financial urgency.",
    expectedOutcome: "Token commitment for Saturday site meeting.",
    recommendedNextStep: "Prepare token receipt draft and property title verification folder.",
    status: "Pending",
    priority: "High",
    dueDate: new Date()
  },
  {
    title: "Send M3M Capital vs SmartWorld One DXP Comparison to Amit Patel",
    leadName: "Amit Patel",
    type: "Pitch",
    why: "Amit is an all-cash ₹3.2Cr investor comparing capital gain velocity across both Sector 113 developments.",
    whatToDo: "Generate and send WhatsApp pitch with comparative appreciation table and handover milestones.",
    whatToSay: "Share detailed breakdown of Delhi border infrastructure and commercial leasing potential.",
    whatToAsk: "Which possession timeline aligns better with your tax planning: late 2026 or early 2027?",
    whatNotToSay: "Do not criticize either developer; focus purely on metric comparisons.",
    expectedOutcome: "Amit selects one project and books private builder consultation.",
    recommendedNextStep: "Schedule VIP conference call with M3M/SmartWorld sales VP.",
    status: "Pending",
    priority: "High",
    dueDate: new Date()
  },
  {
    title: "Follow up with Neha Kapoor regarding Saturday Site Visit",
    leadName: "Neha Kapoor",
    type: "Follow-up",
    why: "Senior citizen father needs to inspect garden layout in Hero Homes Sector 104.",
    whatToDo: "Send polite WhatsApp confirmation with location pin and gate pass code.",
    whatToSay: "Everything is arranged for Uncle's comfortable golf cart tour of the wellness park this Saturday at 11:00 AM.",
    whatToAsk: "Would you like me to reserve dedicated parking right next to the experience centre?",
    whatNotToSay: "Do not rush them into placing immediate offers on the first visit.",
    expectedOutcome: "Confirmed arrival time and positive emotional connection with parents.",
    recommendedNextStep: "Accompany family personally during walkthrough.",
    status: "Pending",
    priority: "Medium",
    dueDate: new Date(Date.now() + 24 * 3600 * 1000)
  }
];
