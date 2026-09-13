export const conversationAnalysisPrompt = (rawNotes: string, leadName = "Client"): string => `
You are REVA ASSISTE's Natural Language Conversation Intelligence Engine.
A real estate broker just finished a call and typed these messy, raw field notes:
"${rawNotes}"

Extract all buyer signals and recommend the immediate next closing step.
Output strictly JSON:
{
  "extractedData": {
    "budget": "Extracted budget (e.g. ₹2.3 Cr) or 'Not specified'",
    "purpose": "End Use or Investment or Capital Gain",
    "projectInterest": "Mentioned project name or corridor interest",
    "objection": "Extracted objection (e.g. price, location, timeline, wife opinion)",
    "decisionMaker": "Key decision maker mentioned (e.g. Wife, Father, Self)",
    "visitDate": "Extracted visit timing or commitment",
    "intent": "High" | "Moderate" | "Low",
    "temperature": "Hot" | "Warm" | "Cold"
  },
  "recommendedNextAction": "The immediate tactical next step for the sales advisor",
  "salesTip": "A psychological sales tip tailored to this specific conversation"
}
`;
