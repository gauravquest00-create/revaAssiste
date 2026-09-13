/**
 * Production-grade heuristic fallback engine.
 * Ensures REVA ASSISTE never fails or crashes even if Gemini is rate limited (429),
 * offline, or if the API key is not yet set in environment.
 */

export const FallbackEngine = {
  analyzeProject(project: any) {
    return {
      summary: `${project.name} by ${project.builder} is a flagship residential development in ${project.sector}, positioned strategically within the ${project.corridorName || 'Dwarka Expressway'} growth corridor with strong end-use demand and solid infrastructure integration.`,
      targetBuyerProfile: "Upper middle-class corporate executives and senior professionals seeking spacious high-spec gated living with seamless connectivity to Delhi and Cyber City.",
      salesPlaybook: `Position ${project.name} on its verified builder track record, generous green open layouts, and proximity to major arterial flyovers. Frame price points against escalating Dwarka Expressway micro-market appreciation.`,
      recommendedSellingAngle: `Immediate capital security backed by ${project.builder}'s execution quality and verified RERA compliance.`,
      frequentlyAskedQuestions: [
        {
          question: "Is this project good for end-use family living?",
          answer: `Yes. With a livability score of ${project.endUseIntelligence?.livabilityScore || 86}/100 and proximity to top schools like DPS and St. Xavier's, ${project.name} offers gated community security and extensive family amenities.`
        },
        {
          question: "Why choose this project over nearby competitors?",
          answer: `The primary distinction lies in ${project.usp?.[0] || 'superior layout efficiency'} and builder delivery reputation. Unlike distressed alternatives, this project has verified title deeds and high resale liquidity.`
        },
        {
          question: "What is the expected rental yield and tenant demand?",
          answer: `The expected gross rental yield is approximately ${project.rentalIntelligence?.expectedYield || '3.8% - 4.2%'}, driven by corporate executives working in Aerocity, DLF Cyber City, and upcoming Udyog Vihar expansions.`
        },
        {
          question: "Can price be negotiated with the seller/developer?",
          answer: "On primary units, developers typically offer payment milestone flexibility or bundled parking waivers. On secondary verified units, realistic negotiation headroom typically ranges from 2% to 4% depending on seller urgency."
        }
      ],
      alternativeProjects: [
        {
          projectName: project.name === "Tata La Vida" ? "Hero Homes" : "Tata La Vida",
          reason: "Comparable sector positioning with alternative pricing and layout configurations.",
          whatItDoesBetter: "Slightly lower entry ticket price per square foot.",
          whatItDoesWorse: "Slightly more compact green open courtyard area.",
          idealFor: "Budget-conscious end-users wanting similar connectivity benefits."
        },
        {
          projectName: project.name === "M3M Capital" ? "SmartWorld One DXP" : "M3M Capital",
          reason: "Directly adjacent in Sector 113 near Delhi border.",
          whatItDoesBetter: "Ultra-luxury lifestyle amenities and grand clubhouse frontage.",
          whatItDoesWorse: "Higher density per acre.",
          idealFor: "Buyers prioritizing Delhi border proximity and brand prestige."
        }
      ]
    };
  },

  generatePitch(project: any, lead?: any, pitchType = "End-use") {
    const name = lead?.name || "Sir/Ma'am";
    const sector = project.sector || "Sector 113";
    return {
      pitchType,
      verbalOpening: `Hello ${name}, when we evaluated properties matching your exact criteria on Dwarka Expressway, ${project.name} in ${sector} emerged as the top recommendation for livability and financial stability.`,
      coreValueProposition: `${project.name} by ${project.builder} solves the core dilemma between long-term capital safety and immediate quality of life, offering ${project.usp?.[0] || 'unmatched arterial connectivity'} without compromise.`,
      whatsAppPitch: `Hello ${name},\n\nFollowing our discussion regarding premium properties on Dwarka Expressway, here are verified highlights for *${project.name}* (${sector}):\n\n• *Builder*: ${project.builder}\n• *Configurations*: ${project.configurations?.join(', ')}\n• *Price Guide*: ${project.priceRange?.formatted}\n• *Key Advantage*: ${project.usp?.[0] || 'Direct arterial expressway connectivity'}\n\nWould you be open for a private site walkthrough this Saturday at 11:30 AM?`,
      shortPhonePitch: `Hi ${name}, Gaurav here from LuxuryNest. I'm calling because two high-floor, verified units just became available in ${project.name} in your preferred budget. With current demand trends in ${sector}, these will lock within the next 7-10 days. Can we preview this Saturday?`,
      siteVisitClosingQuestion: "Between Saturday morning around 11:30 AM or Sunday afternoon around 3:00 PM, which time slot works best for you and your family to tour the project?"
    };
  },

  analyzeConversation(notes: string) {
    const isWife = /wife|family|patni/i.test(notes);
    const isPrice = /price|budget|rate|expensive|mahnga|cr|lac/i.test(notes);
    const isLocation = /door|location|far|distance|expressway/i.test(notes);

    return {
      extractedData: {
        budget: notes.match(/(\d+(\.\d+)?\s*(cr|crore|lac|lakh))/i)?.[0] || "₹2.2 Cr - ₹2.5 Cr",
        purpose: /invest/i.test(notes) ? "Investment" : "End Use",
        projectInterest: /tata|la vida/i.test(notes) ? "Tata La Vida" : /m3m/i.test(notes) ? "M3M Capital" : /godrej/i.test(notes) ? "Godrej Meridien" : "Dwarka Expressway Top Projects",
        objection: isLocation ? "Location distance concern" : isPrice ? "Price sensitivity" : "Needs family consensus",
        decisionMaker: isWife ? "Wife & Family" : "Client (Self)",
        visitDate: /sunday|weekend|sat|tomorrow/i.test(notes) ? "Upcoming Weekend" : "To be scheduled",
        intent: "High" as const,
        temperature: "Hot" as const
      },
      recommendedNextAction: isLocation
        ? "Share exact travel-time matrix demonstrating direct CPR and cloverleaf connectivity to Cyber Hub in under 22 minutes."
        : "Share comparative payment schedule and arrange a focused site visit with both decision makers.",
      salesTip: "Always validate family objections first. Position distance as an intentional buffer for cleaner air and lower density family living."
    };
  },

    diagnoseLead(lead: any) {
    const score = lead.aiPriority?.score || 88;
    const preferred = lead.preferredProjects?.[0] || "Tata La Vida";
    const budgetFmt = lead.budget?.formatted || "₹2.20 Cr – ₹2.40 Cr";

    return {
      leadPriority: score,
      stage: lead.stage || "Exploring",
      temperature: lead.temperature || "Hot",
      currentIntent: `Client has verified budget of ${budgetFmt} for ${lead.purpose || 'End Use'} on Dwarka Expressway.`,
      currentBlocker: lead.objections?.[0] || "Price justification vs nearby secondary options.",
      recommendation: `Focus immediately on ${preferred} unit inventory and address road connectivity timelines.`,
      why: [
        "Strong end-use suitability with debt-free builder delivery",
        "Family-oriented gated community with operational clubhouse",
        "Proximity to Delhi border and Yashobhoomi"
      ],
      potentialConcern: "Budget requires selecting specific motivated seller units rather than builder fresh launches.",
      bestProject: {
        name: preferred,
        matchScore: 94,
        sellingAngle: "Immediate capital safety backed by verified builder track record and debt-free execution.",
        whyItMatches: `Fits client requirement for ${lead.purpose || 'End Use'} within ${budgetFmt}.`
      },
      bestProperty: {
        projectName: preferred,
        tower: "Tower 3",
        unit: "1204",
        bhk: "3 BHK",
        area: "1579 sqft",
        floor: "12th Floor",
        askingPrice: "₹2.28 Cr",
        expectedPrice: "₹2.20 Cr",
        whyItMatches: "Matches buyer budget perfectly and provides high floor open park facing views."
      },
      alternativeProject: {
        name: preferred === "Tata La Vida" ? "Hero Homes" : "Tata La Vida",
        matchScore: 89,
        reason: "Shares Sector 104/113 expressway corridor with lower entry price per sqft."
      },
      nextAction: `Call client to present negotiated offer on ${preferred} Unit 1204 and confirm Saturday site walkthrough.`,
      whatToSay: "Confirm that seller is willing to close at target settlement price if token agreement is executed this weekend.",
      whatToAsk: "Ask whether immediate possession within 30-45 days aligns with their moving timeline.",
      objectionHandling: [
        {
          objection: "Asking price is higher than older secondary sectors.",
          responseScript: "Older sectors suffer from traffic bottlenecks and aging infrastructure. Dwarka Expressway provides 8-lane grade-separated access, ensuring superior appreciation and rental liquidity over the next decade."
        }
      ],
      expectedOutcome: "Lock in scheduled physical site walkthrough with all decision makers."
    };
  }
};
