import { GoogleGenAI } from "@google/genai";
import { NodeData, LinkData, IntelligenceReport } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  // In a real app, we handle missing keys gracefully. 
  // For this demo, we assume the environment is set up correctly as per instructions.
  return new GoogleGenAI({ apiKey });
};

export const analyzeNetworkCluster = async (
  nodes: NodeData[],
  links: LinkData[]
): Promise<IntelligenceReport> => {
  const ai = createClient();
  
  // Format graph data for the LLM
  const networkContext = JSON.stringify({
    nodeCount: nodes.length,
    linkCount: links.length,
    nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.label, risk: n.riskScore, details: n.details })),
    links: links.map(l => ({ 
      source: (typeof l.source === 'object' ? l.source.id : l.source), 
      target: (typeof l.target === 'object' ? l.target.id : l.target), 
      type: l.type 
    }))
  }, null, 2);

  const prompt = `
    You are a Senior Cyber Intelligence Analyst for the Jharkhand Police. 
    Analyze the following JSON graph data representing a potential cybercrime ring in Jamtara.
    
    Data:
    ${networkContext}

    Tasks:
    1. Identify the likely 'Kingpin' or central node based on connections and risk score.
    2. Detect patterns of Money Laundering (Mule accounts) or SIM box usage.
    3. Provide actionable intelligence for field officers (e.g., who to arrest first, which bank accounts to freeze).
    4. Categorize the network type (e.g., "Phishing Call Center", "OTP Fraud Ring").

    Output in JSON format with keys: summary, keySuspects (array of strings), recommendedActions (array of strings), networkType.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);

    return {
      summary: result.summary || "Analysis failed to generate summary.",
      keySuspects: result.keySuspects || [],
      recommendedActions: result.recommendedActions || [],
      networkType: result.networkType || "Unknown",
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "AI Service unavailable or key invalid. Ensure API_KEY is set.",
      keySuspects: [],
      recommendedActions: ["Check manual logs", "Verify API connectivity"],
      networkType: "Error",
      generatedAt: new Date().toISOString()
    };
  }
};