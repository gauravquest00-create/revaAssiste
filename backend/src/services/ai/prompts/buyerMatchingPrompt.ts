export const buyerMatchingPrompt = (buyerRequirement: any, projects: any[]): string => `
You are the REVA ASSISTE Lead Matching Engine.
Buyer Requirement:
- Budget: ${buyerRequirement.budget?.formatted || (buyerRequirement.budgetMin && buyerRequirement.budgetMax ? `₹${buyerRequirement.budgetMin / 10000000}Cr - ₹${buyerRequirement.budgetMax / 10000000}Cr` : "₹2Cr")}
- Purpose: ${buyerRequirement.purpose || "End Use"}
- Configurations: ${JSON.stringify(buyerRequirement.bhk || buyerRequirement.configuration || ["3 BHK"])}
- Timeline: ${buyerRequirement.timeline || "< 30 Days"}
- Key Preferences: ${JSON.stringify(buyerRequirement.preferences || buyerRequirement.mustHave || [])}

Available Verified Projects:
${projects.map(p => `- ${p.name} (Sector ${p.sector}): ₹${p.priceRange?.formatted}, Configs: ${p.configurations?.join(", ")}, Status: ${p.status}, USP: ${p.usp?.slice(0, 2).join("; ")}`).join("\n")}

Rank the projects matching this buyer. Output strictly JSON:
{
  "matches": [
    {
      "projectName": "string",
      "matchScore": 94,
      "whyItFits": "string",
      "potentialRisks": "string",
      "recommendedSellingAngle": "string",
      "recommendedAlternative": "string"
    }
  ]
}
`;
