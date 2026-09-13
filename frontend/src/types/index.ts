export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  settings?: {
    notificationsEnabled: boolean;
    defaultCorridor: string;
    preferredCurrency: string;
  };
}

export interface Corridor {
  _id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  sectors: string[];
  isArchived?: boolean;
  connectivity: {
    metro: string[];
    airportAccess: string;
    highways: string[];
    cprDistance?: string;
  };
  infrastructure: {
    employmentHubs: string[];
    schools: string[];
    hospitals: string[];
    retail: string[];
    futureProjects: string[];
  };
  marketIntelligence: {
    avgPriceSqft: number;
    priceRange: string;
    rentalYield: string;
    annualAppreciation: string;
    endUseSuitability: string;
    investmentSuitability: string;
    demandLevel: string;
    liquidity: string;
    marketRisks: string[];
  };
  aiAnalysis?: {
    overview: string;
    topSellingAngle: string;
    keyGrowthDrivers: string[];
  };
  verificationStatus: "Verified" | "Needs Verification" | "Not Verified";
  lastVerified: string;
  source: string;
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  builder: string;
  isArchived?: boolean;
  builderIntelligence: {
    deliveryTrackRecord: string;
    constructionQuality: string;
    knownIssues: string[];
    financialHealth: string;
  };
  corridorName: string;
  sector: string;
  address: string;
  projectArea: string;
  towers: number | string;
  floors: number | string;
  units: number | string;
  configurations: string[];
  launchDate: string;
  possession: string;
  status: "Ready to Move" | "Under Construction" | "Near Possession" | "New Launch";
  priceRange: {
    min: number;
    max: number;
    formatted: string;
    pricePerSqftAvg: number;
  };
  amenities: string[];
  connectivity: string[];
  usp: string[];
  weaknesses: string[];
  marketPosition: string;
  rentalIntelligence: {
    expectedYield: string;
    monthlyRental2BHK?: string;
    monthlyRental3BHK?: string;
    monthlyRental4BHK?: string;
    tenantProfile: string;
  };
  investmentIntelligence: {
    threeYearAppreciation: string;
    exitLiquidity: string;
    investmentThesis: string;
  };
  endUseIntelligence: {
    livabilityScore: number;
    familyFriendlyScore: number;
    noiseAndPollutionRating: string;
    communityVibe: string;
  };
  maintenance: {
    estimatedMonthlyPerSqft: string;
    agencyName: string;
  };
  resaleIntelligence: {
    demandGrade: string;
    averageDaysOnMarket: string;
  };
  photos: string[];
  reraNumber: string;
  verificationStatus: "Verified" | "Needs Verification" | "Not Verified";
  lastVerified: string;
  source: string;
}

export interface Property {
  _id: string;
  propertyId: string;
  project: string;
  projectName: string;
  corridorName: string;
  tower: string;
  floor: number;
  totalFloors?: number;
  unit: string;
  bhk: string;
  area: number;
  facing: string;
  view: string;
  furnishing: string;
  parking: string;
  askingPrice: number;
  expectedPrice: number;
  lowestExpectedPrice: number;
  pricePerSqft: number;
  seller: {
    name: string;
    contact: string;
    urgency: string;
    brokeragePercentage: number;
  };
  availability: string;
  isArchived?: boolean;
  photos: string[];
  notes: string;
  verificationStatus: "Verified" | "Needs Verification" | "Not Verified";
  status: "Available" | "Under Offer" | "Sold" | "Archived";
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  budget: {
    min: number;
    max: number;
    formatted: string;
  };
  purpose: "End Use" | "Investment" | "Rental Income" | "Capital Gain";
  corridor: string;
  preferredProjects: string[];
  interestedProjects?: Array<{
    project?: string;
    projectName: string;
    addedAt?: string;
    notes?: string;
  }>;
  alternativeProjects?: Array<{
    project?: string;
    projectName: string;
    reason?: string;
    whatItDoesBetter?: string;
    whatItDoesWorse?: string;
    matchScore?: number;
    addedAt?: string;
  }>;
  bhk: string[];
  areaMin?: number;
  timeline: string;
  familyStructure?: string;
  financing: string;
  decisionMakers: string[];

  clientRequirement?: {
    budgetRange: string;
    purpose: string;
    timeline: string;
    bhk: string[];
    areaSqft: string;
    facing: string;
    floorPreference: string;
    furnishing: string;
    lifestyle: string;
    preferredCorridor: string;
    preferredLocation: string;
    preferredSectors: string[];
    possessionPreference: string;
    investmentPriority: string;
    rentalPriority: string;
    familyRequirement: string;
    mustHave: string[];
    niceToHave: string[];
    financing: string;
    decisionMakers: string[];
    specialRequirements: string;
  };

  preferences: {
    preferredFloor?: string;
    facing?: string;
    mustHave: string[];
    niceToHave: string[];
  };
  objections: string[];
  temperature: "Hot" | "Warm" | "Cold";
  stage: "New" | "Contacted" | "Interested" | "Exploring" | "Advising" | "Pitched" | "Visiting" | "Closing" | "Won" | "Lost";
  activityState: "Follow-up" | "Scheduled" | "Visit" | "Awaiting Response" | "Negotiation";
  outcome: "Active" | "Hold" | "Not Interested" | "Lost" | "Won";
  lastInteraction?: string;
  nextAction: {
    action: string;
    why: string;
    whatToSay: string;
    whatToAsk: string;
    whatNotToSay?: string;
    targetDate?: string;
  };
  aiPriority: {
    score: number;
    grade: string;
    explanation: string;
    topFactors: string[];
  };
  notes: string;
}

export interface Task {
  _id: string;
  lead?: string;
  leadName?: string;
  title: string;
  type: "Call" | "Pitch" | "Follow-up" | "Visit" | "Negotiation" | "General";
  why: string;
  whatToDo: string;
  whatToSay: string;
  whatToAsk: string;
  whatNotToSay: string;
  expectedOutcome: string;
  recommendedNextStep: string;
  status: "Pending" | "Completed" | "Dismissed";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

export interface Visit {
  _id: string;
  lead?: string;
  leadName?: string;
  project?: string;
  projectName?: string;
  property?: string;
  propertyUnit?: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  status: "Scheduled" | "Confirmed" | "Completed" | "Rescheduled" | "Cancelled" | "No Show";
  outcome?: string;
  clientFeedback?: string;
  objections?: string[];
  notes?: string;
  nextAction?: string;
  aiAnalysis?: {
    interestLevel: string;
    primaryObjection: string;
    preferredPropertyDetails: string;
    decisionMakerReaction: string;
    probabilityChange: string;
    recommendedNextStep: string;
  };
}

export interface FollowUp {
  _id: string;
  lead?: string;
  leadName?: string;
  project?: string;
  projectName?: string;
  property?: string;
  propertyUnit?: string;
  date: string;
  time: string;
  channel: "Call" | "WhatsApp" | "Email" | "Visit" | "Meeting";
  type?: string;
  reason: string;
  notes?: string;
  message?: string;
  outcome?: string;
  nextFollowUp?: string;
  status: "Scheduled" | "Completed" | "Pending" | "Rescheduled" | "Cancelled" | "Missed";
  aiRecommendedTiming: string;
}

export interface Deal {
  _id: string;
  dealCode: string;
  lead: string;
  leadName: string;
  project: string;
  projectName: string;
  property: string;
  propertyUnit: string;
  buyerName: string;
  sellerName: string;
  buyerOffer: number;
  sellerAsk: number;
  counterOffers: Array<{
    offeredBy: string;
    amount: number;
    date: string;
    notes?: string;
  }>;
  tokenAmount: number;
  dealValue: number;
  stage: "Negotiation" | "Token" | "Documentation" | "Payment" | "Closed" | "Fallen Through";
  aiNegotiationAdvice?: {
    openingStrategy: string;
    targetSettlementPrice: number;
    walkAwayConsideration: string;
    recommendedTalkingPoints: string[];
    riskFactor: string;
  };
}
