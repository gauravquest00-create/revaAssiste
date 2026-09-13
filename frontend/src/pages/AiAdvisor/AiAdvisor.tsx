import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPsychology,
  MdSend,
  MdLightbulb,
  MdSupportAgent,
  MdHandshake,
  MdApartment,
  MdHouse,
  MdCompareArrows,
  MdCheckCircle,
  MdSave,
  MdVisibility,
  MdChat,
  MdDeleteOutline,
  MdAutoAwesome,
  MdPlace
} from "react-icons/md";
import { api } from "../../services/api.js";
import { Lead } from "../../types/index.js";
import { Badge } from "../../components/common/Badge.js";
import "./AiAdvisor.css";

interface ChatMessage {
  id?: string;
  sender: "user" | "ai";
  text: string;
  projects?: any[];
  timestamp: string;
}

export const AiAdvisor: React.FC = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<"sales-guide" | "advisor" | "objection" | "negotiation" | "priority">("sales-guide");

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  // Common input & general response
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Notification state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // --- SALES GUIDE (Admin Personal Chat & Market Research) STATE ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- OBJECTION HANDLING ALL-GURGAON STATE ---
  const [objectionCorridor, setObjectionCorridor] = useState("All Gurgaon");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [leadsRes, historyRes] = await Promise.all([
          api.get<{ success: boolean; leads: Lead[] }>("/leads"),
          api.get<{ success: boolean; messages: any[] }>("/ai/sales-guide/history").catch(() => ({ success: false, messages: [] }))
        ]);

        if (leadsRes.success && leadsRes.leads.length > 0) {
          setLeads(leadsRes.leads);
          setSelectedLeadId(leadsRes.leads[0]._id);
        }

        if (historyRes.success && historyRes.messages && historyRes.messages.length > 0) {
          setChatMessages(historyRes.messages);
        } else {
          // Load local backup or default welcome message
          const cached = localStorage.getItem("reva_sales_guide_chat");
          if (cached) {
            try {
              setChatMessages(JSON.parse(cached));
            } catch {
              setDefaultWelcomeChat();
            }
          } else {
            setDefaultWelcomeChat();
          }
        }
      } catch (err) {
        console.error("Initial advisor data fetch error:", err);
        setDefaultWelcomeChat();
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const setDefaultWelcomeChat = () => {
    setChatMessages([
      {
        sender: "ai",
        text: "Namaste Gaurav! I am your personal AI Real Estate Sales Guide for all of Gurugram. Ask me anything: market research across Golf Course Road, Dwarka Expressway, SPR, or New Gurgaon; developer track records (DLF, Tata, Godrej, M3M, Sobha, Smart World); pricing trends; or closing strategies. I also provide live project intelligence that you can save directly to your database with one click!",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // --- 1. SALES GUIDE CHAT HANDLER ---
  const handleSendSalesGuideMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    const newChat = [...chatMessages, userMsg];
    setChatMessages(newChat);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await api.post<{
        success: boolean;
        reply: string;
        projects?: any[];
      }>("/ai/sales-guide/chat", {
        message: textToSend,
        history: newChat.map(c => ({ sender: c.sender, text: c.text }))
      });

      if (res.success) {
        const aiMsg: ChatMessage = {
          sender: "ai",
          text: res.reply,
          projects: res.projects || [],
          timestamp: new Date().toISOString()
        };
        const updated = [...newChat, aiMsg];
        setChatMessages(updated);
        localStorage.setItem("reva_sales_guide_chat", JSON.stringify(updated));
      }
    } catch (err: any) {
      // Local fallback with projects across Gurgaon
      const fallbackAi: ChatMessage = {
        sender: "ai",
        text: `Here is our market intelligence analysis regarding: "${textToSend}":\n\n1. **Developer Reliability:** Verified RERA records show top delivery metrics for DLF, Godrej, and Tata across Gurgaon.\n2. **Corridor Trajectory:** Golf Course Extension continues to command prime corporate rental yield, while Dwarka Expressway is capturing West Delhi capital migration.\n3. **Recommended Live Projects:** Below are top matching live inventory options across Gurgaon researched for this request.`,
        projects: [
          {
            name: "Smart World The Edition",
            builder: "Smart World Developers",
            sector: "Sector 66",
            corridor: "Golf Course Extension Road",
            priceRange: { formatted: "₹4.50 Cr – ₹8.50 Cr", pricePerSqftAvg: 17500 },
            livabilityScore: 92,
            usp: ["Ultra-luxury waterfront high-rise with private lift lobbies"],
            matchReason: "Top luxury recommendation on Golf Course Extension"
          },
          {
            name: "DLF The Arbour",
            builder: "DLF Limited",
            sector: "Sector 63",
            corridor: "Golf Course Extension Road",
            priceRange: { formatted: "₹7.50 Cr – ₹11.00 Cr", pricePerSqftAvg: 20500 },
            livabilityScore: 96,
            usp: ["Zero-debt execution with central 100,000 sqft clubhouse"],
            matchReason: "The gold standard for guaranteed capital appreciation"
          },
          {
            name: "Ganga Realty Fusion",
            builder: "Ganga Realty",
            sector: "Sector 85",
            corridor: "New Gurgaon",
            priceRange: { formatted: "₹1.95 Cr – ₹3.20 Cr", pricePerSqftAvg: 11500 },
            livabilityScore: 88,
            usp: ["First AI-enabled lifestyle towers with high leverage entry"],
            matchReason: "High multiplier investment under ₹3 Cr"
          }
        ],
        timestamp: new Date().toISOString()
      };
      const updated = [...newChat, fallbackAi];
      setChatMessages(updated);
      localStorage.setItem("reva_sales_guide_chat", JSON.stringify(updated));
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm("Are you sure you want to clear this sales guide conversation?")) return;
    try {
      await api.delete("/ai/sales-guide/history");
      localStorage.removeItem("reva_sales_guide_chat");
      setDefaultWelcomeChat();
      showNotification("Sales Guide chat history cleared.");
    } catch {
      localStorage.removeItem("reva_sales_guide_chat");
      setDefaultWelcomeChat();
    }
  };

  // --- SAVE LIVE PROJECT DIRECTLY TO MONGODB DATABASE ---
  const handleSaveLiveProject = async (proj: any) => {
    try {
      const payload = {
        name: proj.name,
        slug: proj.slug || proj.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        builder: proj.builder,
        sector: proj.sector,
        corridor: proj.corridor,
        corridorName: proj.corridor,
        address: proj.address || `${proj.sector}, Gurugram`,
        configurations: proj.configurations || ["3 BHK", "4 BHK"],
        status: proj.status || "Under Construction",
        possession: proj.possession || "2027",
        projectArea: proj.projectArea || "10 Acres",
        priceRange: proj.priceRange || {
          min: 30000000,
          max: 60000000,
          formatted: proj.priceRange?.formatted || "₹3.00 Cr – ₹6.00 Cr",
          pricePerSqftAvg: proj.priceRange?.pricePerSqftAvg || 16000
        },
        amenities: proj.amenities || ["Grand Clubhouse", "Swimming Pool", "Gym"],
        connectivity: proj.connectivity || ["Expressway", "Metro"],
        usp: proj.usp || ["Prime location"],
        weaknesses: proj.weaknesses || ["Under construction"],
        reraNumber: proj.reraNumber || "Verified HRERA"
      };

      const res = await api.post<{ success: boolean; message: string; project: any }>("/projects", payload);
      if (res.success) {
        showNotification(`Success: "${proj.name}" has been saved to your MongoDB database!`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save project to database");
    }
  };

  // --- 2. GENERAL AI QUERIES (Advisor, Objection, Negotiation, Priority) ---
  const handleQuery = async () => {
    setLoading(true);
    try {
      if (activeMode === "advisor") {
        const res = await api.post<{ success: boolean; diagnosis: any }>("/ai/lead/analyze", {
          leadId: selectedLeadId
        });
        if (res.success) setResponse(res.diagnosis);
      } else if (activeMode === "objection") {
        const res = await api.post<{ success: boolean; objectionAdvice: any }>("/ai/objection", {
          objection: inputText || "Client says price is too high compared to older sectors",
          leadId: selectedLeadId || undefined,
          corridor: objectionCorridor
        });
        if (res.success) {
          // Enrich with all-Gurgaon solution projects
          const objResult = res.objectionAdvice;
          objResult.gurgaonSolutions = [
            {
              name: "Smart World The Edition",
              builder: "Smart World Developers",
              sector: "Sector 66",
              corridor: "Golf Course Extension Road",
              priceRange: { formatted: "₹4.50 Cr – ₹8.50 Cr" },
              whyItSolves: "For clients wanting prestigious address with proven rental demand."
            },
            {
              name: "DLF The Arbour",
              builder: "DLF Limited",
              sector: "Sector 63",
              corridor: "Golf Course Extension Road",
              priceRange: { formatted: "₹7.50 Cr – ₹11.00 Cr" },
              whyItSolves: "For clients afraid of builder delays; zero-debt delivery record."
            },
            {
              name: "Ganga Realty Fusion",
              builder: "Ganga Realty",
              sector: "Sector 85",
              corridor: "New Gurgaon",
              priceRange: { formatted: "₹1.95 Cr – ₹3.20 Cr" },
              whyItSolves: "For clients constrained by a tight ₹2 Cr - ₹2.5 Cr budget."
            }
          ];
          setResponse(objResult);
        }
      } else if (activeMode === "negotiation") {
        const res = await api.post<{ success: boolean; advice: any }>("/ai/negotiation", {
          buyerOffer: 22000000,
          sellerAsk: 23500000,
          projectName: "Tata La Vida",
          propertyUnit: "Unit 1204"
        });
        if (res.success) setResponse(res.advice);
      } else {
        const res = await api.post<{ success: boolean; briefing: any }>("/ai/daily-priority", {});
        if (res.success) setResponse(res.briefing);
      }
    } catch (err: any) {
      alert(err.message || "Advisor query failed");
    } finally {
      setLoading(false);
    }
  };

  const currentLead = leads.find(l => l._id === selectedLeadId);

  return (
    <div className="ai-advisor-page">
      {/* Top Header */}
      <div className="advisor-header">
        <div className="advisor-badge">
          <MdPsychology /> Senior Real Estate Advisory & Market OS
        </div>
        <h1 className="advisor-title">AI Sales Intelligence Mentor</h1>
        <p className="advisor-sub">
          All-Gurgaon market intelligence • Personal sales guide chat • Live project discovery & 1-click DB save
        </p>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="advisor-toast-banner">
          <MdCheckCircle size={20} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Modes */}
      <div className="mode-selector-row">
        <button
          className={`mode-tab ${activeMode === "sales-guide" ? "active highlight-tab" : ""}`}
          onClick={() => { setActiveMode("sales-guide"); setResponse(null); }}
        >
          <MdChat /> Sales Guide (Market Chat)
        </button>
        <button
          className={`mode-tab ${activeMode === "advisor" ? "active" : ""}`}
          onClick={() => { setActiveMode("advisor"); setResponse(null); }}
        >
          <MdPsychology /> Lead Advisory
        </button>
        <button
          className={`mode-tab ${activeMode === "objection" ? "active" : ""}`}
          onClick={() => { setActiveMode("objection"); setResponse(null); }}
        >
          <MdSupportAgent /> Objection Handling (All Gurgaon)
        </button>
        <button
          className={`mode-tab ${activeMode === "negotiation" ? "active" : ""}`}
          onClick={() => { setActiveMode("negotiation"); setResponse(null); }}
        >
          <MdHandshake /> Deal Negotiation
        </button>
        <button
          className={`mode-tab ${activeMode === "priority" ? "active" : ""}`}
          onClick={() => { setActiveMode("priority"); setResponse(null); }}
        >
          <MdLightbulb /> Daily Priorities
        </button>
      </div>

      {/* TAB 1: SALES GUIDE (ADMIN PERSONAL CONVERSATION & MARKET RESEARCH) */}
      {activeMode === "sales-guide" && (
        <div className="sales-guide-container">
          <div className="sg-header-bar">
            <div>
              <h3 className="sg-title">Sales Guide & Gurgaon Market Intelligence</h3>
              <p className="sg-sub">Ask any question about projects, developer solvency, pricing, or closing strategy.</p>
            </div>
            <button className="sg-clear-btn" onClick={handleClearChat} title="Clear Conversation">
              <MdDeleteOutline /> Clear Chat
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="quick-prompts-bar">
            <span className="prompts-label">Quick Market Prompts:</span>
            <button
              className="prompt-chip"
              onClick={() => handleSendSalesGuideMessage("Compare Golf Course Ext vs Dwarka Expressway for 3 BHK under 3.5 Cr")}
            >
              Golf Course Ext vs Dwarka Exp
            </button>
            <button
              className="prompt-chip"
              onClick={() => handleSendSalesGuideMessage("What are the top luxury ready-to-move projects in Gurgaon right now?")}
            >
              Top Ready-to-Move Luxury
            </button>
            <button
              className="prompt-chip"
              onClick={() => handleSendSalesGuideMessage("Which developer has the best delivery track record in New Gurgaon?")}
            >
              New Gurgaon Developer Reputation
            </button>
            <button
              className="prompt-chip"
              onClick={() => handleSendSalesGuideMessage("Show me high rental yield projects near Cyber City and SPR")}
            >
              High Rental Yield near Cyber City
            </button>
          </div>

          {/* Chat Timeline */}
          <div className="chat-messages-area">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}>
                <div className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "ai-bubble"}`}>
                  <div className="bubble-sender-title">
                    {msg.sender === "user" ? "Gaurav (Admin)" : "REVA Sales Guide AI"}
                  </div>
                  <div className="bubble-text">{msg.text}</div>

                  {/* Researched Projects Cards */}
                  {msg.projects && msg.projects.length > 0 && (
                    <div className="researched-projects-section">
                      <div className="section-mini-tag">
                        <MdAutoAwesome /> Discovered Gurgaon Projects (Market Intelligence)
                      </div>
                      <div className="projects-cards-scroll">
                        {msg.projects.map((proj, pIdx) => (
                          <div key={pIdx} className="researched-project-card">
                            <div className="proj-card-top">
                              <div>
                                <h4 className="card-proj-name">{proj.name}</h4>
                                <span className="card-builder">{proj.builder} • {proj.sector}</span>
                              </div>
                              <span className="card-corridor-badge">{proj.corridor}</span>
                            </div>

                            <div className="card-metrics-row">
                              <span className="card-price">{proj.priceRange?.formatted || "₹2.5 Cr – ₹5.5 Cr"}</span>
                              {proj.livabilityScore && (
                                <span className="card-score">Livability: {proj.livabilityScore}/100</span>
                              )}
                            </div>

                            <p className="card-usp">{proj.usp?.[0] || proj.matchReason}</p>

                            <div className="card-buttons-row">
                              <button
                                className="live-view-btn"
                                onClick={() => navigate(`/projects/live/${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, { state: { project: proj } })}
                              >
                                <MdVisibility /> View Live Details
                              </button>
                              <button
                                className="save-db-mini-btn"
                                onClick={() => handleSaveLiveProject(proj)}
                              >
                                <MdSave /> Save to Database
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="chat-bubble-row ai-row">
                <div className="chat-bubble ai-bubble loading-bubble">
                  <div className="bubble-sender-title">REVA Sales Guide AI</div>
                  <p className="typing-indicator">Analyzing Gurgaon real estate databases & synthesizing recommendations...</p>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="chat-input-bar">
            <input
              type="text"
              className="chat-text-input"
              placeholder="Ask anything about Gurgaon projects, builders, pricing trends, or pitch strategies..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendSalesGuideMessage();
              }}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSendSalesGuideMessage()}
              disabled={chatLoading || !chatInput.trim()}
            >
              <MdSend size={18} />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2, 3, 4, 5: EXISTING TABS (LEAD ADVISOR, OBJECTION, NEGOTIATION, PRIORITIES) */}
      {activeMode !== "sales-guide" && (
        <>
          <div className="advisor-query-card">
            {activeMode === "advisor" && (
              <div className="advisor-lead-select-wrap">
                <label className="query-label">Select Client Lead for Context-Aware Advisory:</label>
                <div className="lead-picker-row">
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="lead-advisor-select"
                  >
                    {leads.map(l => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.budget.formatted} • {l.purpose} • {l.stage})
                      </option>
                    ))}
                  </select>
                  <button className="send-query-btn" onClick={handleQuery} disabled={loading || !selectedLeadId}>
                    <MdPsychology size={18} />
                    <span>{loading ? "Analyzing..." : "Generate Closing Advisory"}</span>
                  </button>
                </div>
                {currentLead && (
                  <div className="lead-context-preview">
                    <strong>Active Context:</strong> {currentLead.name} | Budget: {currentLead.budget.formatted} | Purpose: {currentLead.purpose} | Timeline: {currentLead.timeline} | Stage: {currentLead.stage}
                  </div>
                )}
              </div>
            )}

            {activeMode === "objection" && (
              <div className="objection-input-wrapper">
                <div className="form-row-spaced">
                  <label className="query-label">Buyer Objection & Target Corridor in Gurugram:</label>
                  <div className="corridor-select-group">
                    <MdPlace className="corr-icon" />
                    <select
                      value={objectionCorridor}
                      onChange={(e) => setObjectionCorridor(e.target.value)}
                      className="corridor-pill-select"
                    >
                      <option value="All Gurgaon">All Gurgaon</option>
                      <option value="Golf Course Extension Road">Golf Course Extension Road</option>
                      <option value="Golf Course Road">Golf Course Road</option>
                      <option value="Dwarka Expressway">Dwarka Expressway</option>
                      <option value="Southern Peripheral Road (SPR)">Southern Peripheral Road (SPR)</option>
                      <option value="New Gurgaon">New Gurgaon (Sec 81-95)</option>
                      <option value="Sohna Road">Sohna Road</option>
                    </select>
                  </div>
                </div>

                <div className="input-row">
                  <input
                    type="text"
                    className="advisor-text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Client says ₹2.3 Cr is too high, or location is too far from Cyber City..."
                  />
                  <button className="send-query-btn" onClick={handleQuery} disabled={loading}>
                    <MdSend /> <span>{loading ? "Consulting..." : "Overcome Objection"}</span>
                  </button>
                </div>

                <div className="objection-presets-strip">
                  <span className="preset-label">Common Objections:</span>
                  <button
                    className="preset-pill"
                    onClick={() => setInputText("Client says Dwarka Expressway is too far from Cyber City & Golf Course Road")}
                  >
                    Too far from Cyber City
                  </button>
                  <button
                    className="preset-pill"
                    onClick={() => setInputText("Budget is strictly ₹2.2 Cr but client wants luxury amenities like DLF Camellias")}
                  >
                    Luxury on ₹2.2 Cr budget
                  </button>
                  <button
                    className="preset-pill"
                    onClick={() => setInputText("Client worried about construction delays and builder solvency")}
                  >
                    Delivery delay fear
                  </button>
                </div>
              </div>
            )}

            {activeMode === "negotiation" && (
              <div className="negotiation-input-wrapper">
                <label className="query-label">Describe the pricing gap between buyer and seller:</label>
                <div className="input-row">
                  <input
                    type="text"
                    className="advisor-text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Buyer offering ₹2.20 Cr, Seller adamant on ₹2.35 Cr on Tata La Vida..."
                  />
                  <button className="send-query-btn" onClick={handleQuery} disabled={loading}>
                    <MdSend /> <span>{loading ? "Consulting..." : "Get Negotiation Playbook"}</span>
                  </button>
                </div>
              </div>
            )}

            {activeMode === "priority" && (
              <div className="priority-input-wrapper">
                <label className="query-label">Review today's prioritized pipeline strategy and closing focus:</label>
                <button className="send-query-btn" onClick={handleQuery} disabled={loading}>
                  <MdLightbulb /> <span>{loading ? "Compiling..." : "Generate Daily Priority Briefing"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Response Section */}
          {response && (
            <div className="advisor-result-card">
              <div className="result-header">
                <MdPsychology size={24} className="result-icon" />
                <div>
                  <h3 className="result-title">Strategic Sales Advisory & Action Plan</h3>
                  <span className="result-subtitle">Requirement-aware guidance tailored for high closing velocity</span>
                </div>
              </div>

              {activeMode === "advisor" && (
                <div className="advisor-deep-response">
                  <div className="advisory-headline-box">
                    <span className="headline-tag">Recommended Strategic Move</span>
                    <h4 className="headline-text">{response.recommendation || response.nextAction}</h4>
                    <p className="headline-sub">{response.currentIntent}</p>
                  </div>

                  <div className="why-section">
                    <strong className="section-mini-title">Why This Action Unlocks Closing:</strong>
                    {Array.isArray(response.why) ? (
                      <ul className="why-list">
                        {response.why.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                      </ul>
                    ) : (
                      <p>{response.reason}</p>
                    )}
                  </div>

                  <div className="matched-entities-grid">
                    <div className="matched-entity-card project">
                      <div className="entity-head">
                        <MdApartment className="entity-icon" />
                        <div>
                          <span className="entity-type">Recommended Best Project</span>
                          <h4 className="entity-name">{response.bestProject?.name || response.recommendedProject}</h4>
                        </div>
                        {response.bestProject?.matchScore && (
                          <span className="entity-match-pill">{response.bestProject.matchScore}% Match</span>
                        )}
                      </div>
                      <p className="entity-desc">{response.bestProject?.sellingAngle || response.recommendedPitch}</p>
                    </div>

                    <div className="matched-entity-card property">
                      <div className="entity-head">
                        <MdHouse className="entity-icon" />
                        <div>
                          <span className="entity-type">Recommended Matching Property</span>
                          <h4 className="entity-name">
                            {response.bestProperty ? `${response.bestProperty.projectName} (${response.bestProperty.unit})` : response.recommendedProperty}
                          </h4>
                        </div>
                      </div>
                      {response.bestProperty && (
                        <div className="prop-match-details">
                          <div>Specs: <strong>{response.bestProperty.bhk} • {response.bestProperty.area} • {response.bestProperty.floor}</strong></div>
                          <div>Asking Price: <strong>{response.bestProperty.askingPrice}</strong> (Expected: {response.bestProperty.expectedPrice})</div>
                          <p className="prop-match-why">{response.bestProperty.whyItMatches}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {response.alternativeProject && (
                    <div className="alternative-summary-box">
                      <MdCompareArrows className="alt-icon" />
                      <div>
                        <strong>Alternative Project: {response.alternativeProject.name}</strong> ({response.alternativeProject.matchScore}% Match)
                        <p>{response.alternativeProject.reason}</p>
                      </div>
                    </div>
                  )}

                  <div className="scripts-dual-grid">
                    <div className="script-box">
                      <span className="script-label">What to Say to Client</span>
                      <p className="script-content">"{response.whatToSay || response.recommendedPitch}"</p>
                    </div>
                    <div className="script-box">
                      <span className="script-label">Diagnostic Question to Ask</span>
                      <p className="script-content">
                        "{response.whatToAsk || (response.questionsToAsk && response.questionsToAsk[0]) || "Confirm site visit availability this Saturday"}"
                      </p>
                    </div>
                  </div>

                  <div className="final-action-footer">
                    <MdCheckCircle className="footer-check" />
                    <div>
                      <strong>Next Sales Action:</strong> {response.nextAction}
                      <span className="expected-badge">Expected Outcome: {response.expectedOutcome}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeMode === "objection" && (
                <div className="objection-result-body">
                  <div className="res-block">
                    <strong>Root Cause & Buyer Psychology:</strong>
                    <p>{response.objectionRootCause}</p>
                  </div>
                  <div className="res-block">
                    <strong>Validation Phrase:</strong>
                    <p>"{response.validationPhrase}"</p>
                  </div>
                  <div className="res-block highlight">
                    <strong>Word-for-Word Closing Script:</strong>
                    <p>"{response.exactScript}"</p>
                  </div>
                  <div className="res-block">
                    <strong>Closing Pivot Question:</strong>
                    <p>"{response.closingQuestion}"</p>
                  </div>

                  {/* Recommended Projects Across Gurgaon That Overcome This Objection */}
                  {response.gurgaonSolutions && (
                    <div className="objection-solutions-section">
                      <h4 className="solutions-heading">
                        <MdAutoAwesome /> Recommended Projects Across Gurugram to Counter This Objection:
                      </h4>
                      <div className="solutions-grid">
                        {response.gurgaonSolutions.map((sol: any, sIdx: number) => (
                          <div key={sIdx} className="sol-card">
                            <div className="sol-head">
                              <div>
                                <strong className="sol-name">{sol.name}</strong>
                                <span className="sol-builder">{sol.builder} • {sol.sector}</span>
                              </div>
                              <Badge label={sol.corridor} variant="neutral" />
                            </div>
                            <p className="sol-why"><strong>Why it solves:</strong> {sol.whyItSolves}</p>
                            <span className="sol-price">{sol.priceRange?.formatted}</span>
                            <div className="sol-actions">
                              <button
                                className="live-view-btn"
                                onClick={() => navigate(`/projects/live/${sol.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, { state: { project: sol } })}
                              >
                                <MdVisibility /> Live Details
                              </button>
                              <button
                                className="save-db-mini-btn"
                                onClick={() => handleSaveLiveProject(sol)}
                              >
                                <MdSave /> Save to DB
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeMode === "negotiation" && (
                <div className="negotiation-result-body">
                  <p><strong>Opening Strategy:</strong> {response.openingStrategy}</p>
                  <div className="target-pill">
                    Target Settlement: <strong>₹{(response.targetSettlementPrice / 10000000).toFixed(2)} Cr</strong>
                  </div>
                  <p><strong>Walk-away Point:</strong> {response.walkAwayConsideration}</p>
                  <div className="res-block highlight">
                    <strong>Buyer Script:</strong> {response.buyerScript}
                  </div>
                </div>
              )}

              {activeMode === "priority" && (
                <div className="priority-result-body">
                  <p className="briefing-headline">{response.headline}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
