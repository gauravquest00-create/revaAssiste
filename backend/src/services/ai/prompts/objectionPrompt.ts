export const objectionPrompt = (objectionText: string, projectContext: any, leadContext?: any): string => `
You are an expert Real Estate Sales Negotiation Coach.
The client presented this objection: "${objectionText}"
Regarding Project: ${projectContext.name} (Sector ${projectContext.sector}, ₹${projectContext.priceRange?.formatted})
Buyer Context: ${leadContext ? `Budget: ${leadContext.budget?.formatted}, Purpose: ${leadContext.purpose}` : "General buyer"}

Provide objection handling in strictly JSON format:
{
  "objectionRootCause": "The hidden psychological fear or friction behind this statement",
  "validationPhrase": "A statement that acknowledges the buyer's concern without conceding the point",
  "reframingLogic": "The reframing perspective turning this weakness into an advantage or non-issue",
  "exactScript": "Word-for-word script for the advisor to say out loud",
  "closingQuestion": "Follow-up question that pivots back to action"
}
`;
