export enum NodeType {
    SUSPECT = 'SUSPECT',
    SIM = 'SIM',
    DEVICE = 'DEVICE',
    BANK_ACCOUNT = 'BANK_ACCOUNT',
    IP_ADDRESS = 'IP_ADDRESS',
    LOCATION = 'LOCATION'
  }
  
  export interface NodeData {
    id: string;
    label: string;
    type: NodeType;
    riskScore: number; // 0-100
    details: Record<string, any>;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
  }
  
  export interface LinkData {
    source: string | NodeData;
    target: string | NodeData;
    type: string;
    strength: number; // 0-1
  }
  
  export interface GraphData {
    nodes: NodeData[];
    links: LinkData[];
  }
  
  export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    read?: boolean;
  }
  
  export interface IntelligenceReport {
    summary: string;
    keySuspects: string[];
    recommendedActions: string[];
    networkType: string;
    generatedAt: string;
  }
  
  export enum ViewState {
    DASHBOARD = 'DASHBOARD',
    GRAPH_EXPLORER = 'GRAPH_EXPLORER',
    REPORTS = 'REPORTS',
    INGESTION = 'INGESTION',
    SETTINGS = 'SETTINGS'
  }