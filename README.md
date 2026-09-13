# REVA ASSISTE
### AI-Powered Real Estate Sales Intelligence & Brokerage Operating System

> **Central Principle:** The system should think like a senior real-estate sales advisor while the user focuses on talking to clients, conducting visits, negotiating, and closing deals.

---

## 1. System Overview

**REVA ASSISTE** is not a generic CRM, property listing website, or chatbot. It is a full-stack, enterprise-grade Sales Intelligence Operating System designed specifically for real-estate sales advisors, consultants, and brokerages operating in high-demand growth corridors (such as **Dwarka Expressway, Gurugram**).

The core operational question continuously answered by the system is:
**"Gaurav ko is lead ko close karne ke liye ab kya karna chahiye?"**

---

## 2. Core Modules & Capabilities

1. **AI Sales Command Center (Dashboard)**
   - Real-time KPI counters dynamically routing to filtered pipelines.
   - Daily Sales Task Sequence with granular *"What To Say"*, *"What To Ask"*, and *"What Not To Say"*.
   - High Priority Lead cards with explainable 0–100 AI scores.
   - Live alerts on Deals At Risk with structured closing remedies.

2. **Corridor Intelligence (`/corridors`)**
   - Full CRUD & deep macro-market analytics for **Dwarka Expressway**.
   - Direct integration metrics: UER-II, Cloverleaf NH-48, IGI Airport T3, and Yashobhoomi Convention Centre.
   - Price velocity, rental yield benchmarks, and verified infrastructure risk mitigation.

3. **15 Verified Shortlisted Projects (`/projects`)**
   - Strictly verified project data (Zero fake projects, zero fabricated claims).
   - Projects: *M3M Capital, Tata La Vida, Godrej Meridien, Sobha City, Emaar Gurgaon Greens, M3M Crown, SmartWorld One DXP, Hero Homes, Indiabulls Centrum Park, Godrej Vrikshya, BPTP Amstoria Verti Greens, Indiabulls Heights, Tata Gurgaon Gateway, Experion The Heartsong, Adani M2K Oyster Grande*.
   - Deep Project Intelligence: Builder reputation, livability scores, tenant demand, and RERA verification.

4. **Slide-Over Quick Pitch Panel**
   - Desktop right-side drawer and mobile full-screen bottom sheet.
   - Instant sales pitch scripts (End-Use, Investment, Phone Hook, WhatsApp).
   - Dynamic Client Question Engine with project-specific expandable answers.
   - Ranked Alternative Projects (what they do better/worse).
   - Live linked verified inventory.

5. **Inventory Management & Smart Import (`/properties`)**
   - Unit-level pricing, floor orientation, and seller urgency tracking.
   - Smart CSV / text bulk import with automated column detection, duplicate identification, and pre-commit preview.
   - Property duplication and valuation gap analysis.

6. **Lead Intelligence & AI Diagnostic (`/leads`)**
   - Multi-dimensional pipeline: Stage, Activity State, Temperature, and Outcome.
   - Natural Language Conversation Notes: Broker types messy field notes -> AI extracts budget, objections, decision-makers, and visit commitments.
   - Tailored objection handling and strategic next actions.

7. **Site Visits (`/visits`) & Follow-ups (`/followups`)**
   - Multi-channel scheduling with AI-recommended contact windows.
   - Post-visit intelligence analyzer extracting buyer sentiment shifts and closing probability changes.

8. **Deal Management & Negotiation Advice**
   - Counter-offer timeline tracking, token logging, and KYC documentation status.
   - AI negotiation strategist providing settlement anchors and walk-away points.

9. **Comparison Tool (`/comparison`)**
   - Side-by-side metric comparison between 2–3 projects to address buyer hesitation.

10. **Progressive Web App (PWA)**
    - Installable on Android, iOS, and Desktop with offline application shell support.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18, Vite 5, TypeScript
- **Routing:** React Router v6
- **Icons:** React Icons (`react-icons/md`) — *Zero emojis, stickers, or cartoon graphics*
- **Styling:** Dedicated modular CSS stylesheets per component/page (Light SaaS enterprise design)
- **Responsiveness:** Rigorously optimized for extreme mobile viewports (down to 320px–377px)

### Backend
- **Runtime:** Node.js, Express (Pure ES Modules: `import` / `export`)
- **Database:** MongoDB with Mongoose ODM
- **Security:** JWT Authentication, bcrypt password hashing, input sanitization
- **Media:** Cloudinary configuration

### AI Integration
- **SDK:** Official `@google/genai` SDK
- **Model:** `gemini-3.6-flash` (configurable via `process.env.GEMINI_MODEL`)
- **Resilience:** 3-tier exponential backoff handling HTTP 429 rate limits, 5xx server errors, and network timeouts.
- **Graceful Fallback:** Verified domain-grounded heuristic fallback engine ensures the application never crashes even if the AI service is offline or unkeyed.

---

## 4. Getting Started Locally

### Prerequisites
- Node.js (v18 or v20+)
- MongoDB running locally or a MongoDB Atlas connection URI

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Configure your MONGODB_URI and GEMINI_API_KEY in .env

# Seed verified Dwarka Expressway projects and default admin user:
npm run seed

# Start development server on http://localhost:5000:
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env

# Start Vite development server on http://localhost:5173:
npm run dev
```

---

## 5. Seeded Credentials

The database seeder provisions a secure, verified administrator account:

- **Email:** `gauravquest00@gmail.com`
- **Password:** `Admin123@` *(stored as a salted bcrypt hash)*

---

## 6. Architecture & Data Flow

```
[ Client Conversation ]
         ↓
[ Raw Broker Field Notes ]
         ↓
[ AI Extraction & Lead State Engine ]
         ↓
[ Strategic Next Action + Sales Task ]
         ↓
[ Quick Pitch / Objection Reframing ]
         ↓
[ Scheduled Site Visit ]
         ↓
[ Post-Visit Analysis ]
         ↓
[ Deal Negotiation & Settlement Target ]
         ↓
[ Token & Closing ]
```

---

## 7. License & Rights

REVA ASSISTE Enterprise Real Estate Operating System © 2026. All rights reserved.
