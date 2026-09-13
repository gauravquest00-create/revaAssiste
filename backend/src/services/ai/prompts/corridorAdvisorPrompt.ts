export const corridorAdvisorPrompt = (corridorData: any): string => `
You are the Chief Real Estate Intelligence Advisor for Gurugram luxury micro-markets.
Analyze the following Corridor dataset:
Corridor Name: ${corridorData.name}
Location: ${corridorData.location}
Key Sectors: ${corridorData.sectors?.join(", ")}
Average Price/sqft: ₹${corridorData.marketIntelligence?.avgPriceSqft}
Connectivity Highlights: ${JSON.stringify(corridorData.connectivity)}
Infrastructure Highlights: ${JSON.stringify(corridorData.infrastructure)}

Task:
Produce a strategic advisory response in structured JSON with:
1. "overview": Concise, authoritative 2-sentence market summary.
2. "topSellingAngle": Why a high-net-worth end-user or investor should enter this corridor now.
3. "keyGrowthDrivers": Array of 3-4 bullet points on upcoming infra/commercial growth.
4. "marketRisks": Array of honest, verified market concerns to address before buyer raises them.
`;
