import { GraphData, NodeType, Alert } from './types';

// Mock Data for "Operation Jamtara" simulation
export const MOCK_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'S001', label: 'Raju "The Spider" Mandal', type: NodeType.SUSPECT, riskScore: 95, details: { age: 28, criminalRecord: 'Fraud, 420 IPC', active: true, notes: 'Suspected gang leader' } },
    { id: 'S002', label: 'Amit Kumar', type: NodeType.SUSPECT, riskScore: 75, details: { age: 22, role: 'Caller', location: 'Deoghar', notes: 'Frequent calls to S001' } },
    { id: 'S003', label: 'Vikram Singh', type: NodeType.SUSPECT, riskScore: 88, details: { age: 34, role: 'Handler', location: 'Jamtara', notes: 'Money mule coordinator' } },
    { id: 'D001', label: 'iPhone 13 Pro', type: NodeType.DEVICE, riskScore: 40, details: { activeSince: '2023-01', imei: '356987045612445', model: 'iPhone 13' } },
    { id: 'D002', label: 'Vivo Y21', type: NodeType.DEVICE, riskScore: 60, details: { activeSince: '2023-05', imei: '865432014567992', model: 'Vivo Y21' } },
    { id: 'SIM001', label: '+91 98765 43210', type: NodeType.SIM, riskScore: 80, details: { carrier: 'Airtel', registeredTo: 'Fake ID (Ramesh)', phone: '9876543210' } },
    { id: 'SIM002', label: '+91 88888 11111', type: NodeType.SIM, riskScore: 70, details: { carrier: 'Jio', registeredTo: 'Unknown', phone: '8888811111' } },
    { id: 'BK001', label: 'SBI Acct ...4555', type: NodeType.BANK_ACCOUNT, riskScore: 90, details: { type: 'Mule', balance: '₹4,50,000', accountHolder: 'Suresh Das' } },
    { id: 'BK002', label: 'HDFC Acct ...2231', type: NodeType.BANK_ACCOUNT, riskScore: 65, details: { type: 'Transit', balance: '₹1,20,000', accountHolder: 'Priya Ent.' } },
    { id: 'IP001', label: '192.168.45.22', type: NodeType.IP_ADDRESS, riskScore: 50, details: { isp: 'Jio Fiber', geo: 'Karmatanr, Jharkhand' } },
    { id: 'LOC1', label: 'Karmatanr Tower A', type: NodeType.LOCATION, riskScore: 30, details: { lat: 24.0, lng: 86.0, range: '2km' } },
  ],
  links: [
    { source: 'S001', target: 'D001', type: 'OWNS', strength: 1 },
    { source: 'S002', target: 'D001', type: 'USES_SHARED', strength: 0.8 },
    { source: 'D001', target: 'SIM001', type: 'EQUIPPED_WITH', strength: 1 },
    { source: 'D001', target: 'SIM002', type: 'SWAPPED_IN', strength: 0.9 },
    { source: 'S003', target: 'BK001', type: 'CONTROLS', strength: 1 },
    { source: 'BK001', target: 'BK002', type: 'TRANSFERS_TO', strength: 0.7 },
    { source: 'SIM001', target: 'IP001', type: 'CONNECTED_VIA', strength: 0.5 },
    { source: 'S001', target: 'S003', type: 'CALLS', strength: 0.9 },
    { source: 'S002', target: 'S003', type: 'REPORTS_TO', strength: 0.6 },
    { source: 'SIM001', target: 'LOC1', type: 'PINGED', strength: 0.4 },
  ]
};

export const MOCK_ALERTS: Alert[] = [
  { id: 'A1', title: 'SIM Swapping Detected', description: 'Device D001 associated with 5 different SIMs in 24 hours.', severity: 'high', timestamp: '2 mins ago' },
  { id: 'A2', title: 'High Value Transfer', description: '₹20L moved from Mule Account BK001 to unknown offshore wallet.', severity: 'critical', timestamp: '15 mins ago' },
  { id: 'A3', title: 'New Device Cluster', description: '3 Suspects linked to shared device IMEI...992 in Deoghar.', severity: 'medium', timestamp: '1 hour ago' },
];

export const NODE_COLORS = {
  [NodeType.SUSPECT]: '#f43f5e', // Red
  [NodeType.DEVICE]: '#fbbf24', // Amber
  [NodeType.SIM]: '#38bdf8', // Light Blue
  [NodeType.BANK_ACCOUNT]: '#10b981', // Emerald
  [NodeType.IP_ADDRESS]: '#a855f7', // Purple
  [NodeType.LOCATION]: '#64748b', // Slate
};