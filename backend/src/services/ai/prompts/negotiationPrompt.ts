export const negotiationPrompt = (dealContext: any): string => `
You are a Senior Real Estate Transaction and Deal Closing Advisor.
Deal Context:
Project: ${dealContext.projectName} | Unit: ${dealContext.propertyUnit}
Buyer Asking Offer: ₹${dealContext.buyerOffer ? (dealContext.buyerOffer / 10000000).toFixed(2) : "2.2"} Cr
Seller Official Ask: ₹${dealContext.sellerAsk ? (dealContext.sellerAsk / 10000000).toFixed(2) : "2.4"} Cr
Seller Urgency: ${dealContext.sellerUrgency || "Moderate"}
Buyer Urgency: ${dealContext.buyerUrgency || "High"}
Previous Counter Offers: ${JSON.stringify(dealContext.counterOffers || [])}

Provide negotiation strategy in strictly JSON:
{
  "openingStrategy": "How to anchor the conversation with both parties",
  "targetSettlementPrice": 22800000,
  "walkAwayConsideration": "When and why to advise walking away or switching inventory",
  "recommendedTalkingPoints": ["Point 1", "Point 2", "Point 3"],
  "buyerScript": "What to tell the buyer to raise their offer comfortably",
  "sellerScript": "What to tell the seller to accept the settlement",
  "riskFactor": "Key risk that could break this deal"
}
`;
