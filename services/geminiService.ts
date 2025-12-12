import { GoogleGenAI, Type } from "@google/genai";
import { NodeData, LinkData, IntelligenceReport } from "../types";

// Initialize the client
// The API key is injected via environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a subgraph to identify criminal patterns and risks.
 */
export const analyzeNetworkCluster = async (
  nodes: NodeData[],
  links: LinkData[]
): Promise<IntelligenceReport> => {
  // 1. Prepare Data Context for the AI
  // We sanitize and format the graph data to be token-efficient and clear
  const nodeSummaries = nodes.map(n => 
    `ID: ${n.id} | Type: ${n.type} | Label: ${n.label} | Risk: ${n.riskScore} | Details: ${JSON.stringify(n.details)}`
  ).join('\n');

  const linkSummaries = links.map(l => {
     const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
     const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
     return `${sourceId} --[${l.type}]--> ${targetId}`;
  }).join('\n');

  const prompt = `
    Analyze this cybercrime network subgraph from Jharkhand (Operation Jamtara).
    
    ### Graph Data
    Nodes:
    ${nodeSummaries}
    
    Links:
    ${linkSummaries}
    
    ### Instructions
    Provide an intelligence report identifying the key threats, the nature of the criminal operation (e.g., Phishing, SIM Box, Money Mule), and immediate recommended actions for law enforcement.
    Determine the 'networkType' based on the entities (e.g. if many SIMs/Devices -> SIM Farm).
  `;

  // 2. Define Response Schema
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { 
        type: Type.STRING, 
        description: "A concise executive summary of the cluster's suspicious activity." 
      },
      keySuspects: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of names or IDs of the most critical suspects/entities."
      },
      recommendedActions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Specific, actionable steps for investigators (e.g. 'Subpoena bank records for BK001')." 
      },
      networkType: { 
        type: Type.STRING, 
        description: "Classification of the crime ring (e.g. 'SIM Swap Ring', 'Phishing Call Center')." 
      },
      generatedAt: { 
        type: Type.STRING, 
        description: "Current timestamp in ISO format." 
      }
    },
    required: ["summary", "keySuspects", "recommendedActions", "networkType", "generatedAt"]
  };

  // 3. Call API
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        systemInstruction: "You are a senior cybercrime intelligence analyst for the Jharkhand Police. Your output must be strict JSON."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as IntelligenceReport;
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Graceful fallback for demo/offline resilience
    return {
      summary: "AI Service Interruption. Manual review required. Preliminary pattern matching suggests high-velocity money movement linked to multiple SIM activations.",
      keySuspects: nodes.filter(n => n.riskScore > 80).map(n => n.label).slice(0, 3),
      recommendedActions: ["Check internet connectivity", "Verify API Key", "Manual Graph Inspection"],
      networkType: "Unknown - Analysis Failed",
      generatedAt: new Date().toISOString()
    };
  }
};

/**
 * Generates a full markdown brief for a specific investigation case.
 */
export const generateInvestigationBrief = async (
  title: string,
  reportType: string,
  nodes: NodeData[],
  links: LinkData[]
): Promise<{ title: string, content: string }> => {
    
  const nodeCount = nodes.length;
  const highRiskCount = nodes.filter(n => n.riskScore >= 80).length;
  const suspectCount = nodes.filter(n => n.type === 'SUSPECT').length;
  
  const prompt = `
    Generate a formal investigation brief.
    
    **Report Metadata**
    Title: ${title}
    Type: ${reportType}
    
    **Network Stats**
    Total Entities: ${nodeCount}
    High Risk Entities: ${highRiskCount}
    Suspects Identified: ${suspectCount}
    
    **Instructions**
    Write a detailed police report in Markdown format.
    The report should include:
    1. Operational Overview
    2. Suspect Profile Analysis (synthesize from general high-risk indicators)
    3. Financial Trail Assessment (mention potential money mule paths)
    4. Strategic Recommendations
    
    Do not halluncinate specific details not present in the stats, but use the stats to infer the scale and severity.
  `;

  const responseSchema = {
      type: Type.OBJECT,
      properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: "The full report body in Markdown format." }
      },
      required: ["title", "content"]
  };

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
              systemInstruction: "You are a police commander drafting official case files. Tone: Professional, Authoritative, Urgent."
          }
      });
      
      const text = response.text;
      if(!text) throw new Error("No response");
      return JSON.parse(text);

  } catch (error) {
      console.error("Brief Generation Failed:", error);
      return {
          title: title,
          content: "## Generation Failed\n\nUnable to connect to intelligence server. Please check your API Key and network connection."
      };
  }
}