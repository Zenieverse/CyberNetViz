<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1IuDyGTllxXxc90gDgNNXlrwl5HRkEz6o

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

CyberNetV: AI-Driven Cybercrime Network Intelligence Platform
Mapping Hidden Fraud Ecosystems Across Jharkhand Using Graph Intelligence & AI
📌 Overview
Jharkhand’s cybercrime hotspots—such as Jamtara, Deoghar, and surrounding districts—operate not as isolated offenders but as highly coordinated fraud ecosystems. Traditional investigations often identify individual scammers, yet fail to expose the interconnected networks that orchestrate SIM swapping, device sharing, mule banking, and cross-state defrauding.
CyberNetV is an AI-powered platform that helps law enforcement map, analyze, and dismantle cybercriminal networks by correlating CDRs, IP logs, bank transactions, device fingerprints, and complaint logs into a unified graph intelligence system.
The platform shifts policing from reactive arrests to proactive network disruption, identifying kingpins, multi-node clusters, SIM farms, and fraud rings using graph analytics and AI.
🚨 Problem Being Solved
Cybercrime in Jharkhand works as complex networks, not isolated actors.
Police tools often provide linear data, not relationship-based analysis.
Manual correlation of CDRs, IP logs, transactions, and device info is slow and error-prone.
Fraud rings remain intact even after multiple arrests because kingpins remain hidden.
There is no unified system to visualize or quantify who connects to whom.
CyberNetV solves all of this by using Graph AI.
🎯 Objectives
Map cybercriminal ecosystems using graph intelligence
Identify kingpins, influential nodes, and multi-case repeat offenders
Detect fraud rings, SIM farms, and coordinated device reuse
Automate investigation summaries using Gemini AI
Provide an investigator-friendly dashboard for real-time intelligence
🧠 Key Capabilities
1. Graph-Based Network Mapping
Links SIM ↔ device ↔ bank ↔ IP ↔ suspects
Real-time, interactive graph with expandable nodes
Detects cross-case linkages automatically
2. AI/ML-Driven Pattern Detection
Fraud ring detection using community detection
Centrality scoring to identify hidden leaders
Anomaly detection for unusual call/transaction bursts
3. Timeline Reconstruction
Chronological view of fraud operations
SIM/device switching detection
Movement patterns and location-based signals
4. Automated Intelligence Reports
One-click PDF briefings
AI-generated summaries from Gemini
Node profiles + money flow reconstruction
5. Investigation Dashboard
Filters: SIMs, devices, IPs, bank accounts
Hotspot heatmaps across police districts
Watchlists, alerts, and case folders
🧱 System Architecture
flowchart TD

A[Data Ingestion\nCDR, Transactions, IP Logs, Complaints] --> B[Data Cleaning & ETL\nPython / Spark]
B --> C[(BigQuery Storage)]
B --> D[(Cloud Storage)]

C --> E[(Graph Database\nNeo4j/TigerGraph)]
D --> E

E --> F[Graph Analytics\nPageRank, Louvain, Community Detection]
F --> G[AI Models\nGNNs, ML, Gemini Summaries]

G --> H[API Layer\nFastAPI + Node.js]
H --> I[Investigator Dashboard\nReact.js]
H --> J[Graph Visualizer\nD3.js / Neo4j Bloom]
H --> K[Reporting Engine\nGrafana + PDF Builder]
🧩 Tech Stack
Graph Layer
Neo4j / TigerGraph
AI/ML
Python
PyTorch
Scikit-learn
Gemini AI models
NetworkX / PyG (GNNs)
Frontend
React.js
D3.js
Neo4j Bloom
Grafana
Backend
FastAPI
Node.js
GraphQL
Cloud & Storage
Firebase
Google BigQuery
GCP Storage
Docker + Kubernetes (deployment)
📦 Features
SIM-Device-Bank-IP correlation
Kingpin scoring & influence ranking
Fraud ring clustering
SIM sharing / IMEI reuse detection
Money mule network mapping
Hotspot monitoring
Timeline reconstruction
Intelligence report generation
Alerts for new fraud patterns
Role-based access control (RBAC)
Secure data pipelines
🛠 Installation & Setup
1. Clone Repository
git clone https://github.com/your-org/CyberNetV.git
cd CyberNetV
2. Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
3. Frontend Setup
cd frontend
npm install
npm start
4. Neo4j Setup
Install Neo4j Desktop / Aura
Create DB instance
Load schema via /graph/schema.cypher
Set credentials in .env
5. Connect APIs
Configure:
GRAPH_URI=
GRAPH_USER=
GRAPH_PASSWORD=
BIGQUERY_PROJECT=
FIREBASE_ADMIN_KEY=
🚀 Usage
1. Upload Datasets
CDR
IMEI/IMSI
Bank transactions
Complaint logs
2. Visualize Network Graph
Expand nodes
Trace money flow
Identify ring activity
3. Analyze Clusters
Run fraud detection
See community structures
4. Generate Reports
For ACP/SP-level reviews
Attach to case folders
🛡 Security
Role-based access for officers & analysts
Encrypted data at rest & in transit
Detailed audit logs
Backend and DB isolated in private VPC
📈 Roadmap
MVP
Graph ingestion
Network visualization
Basic ML scoring
Report generator
Version 2
Real-time CDR ingestion
Advanced GNN models
District-level heatmaps
Version 3
Predictive fraud emergence
Cross-state federation
Integration with national cybercrime portal APIs
👥 Target Users
Cyber Police Stations
State Crime Branch
DGP / Cyber Coordination Center (CCC)
District Intelligence Units
📄 License
MIT License / State Use License (as applicable)
🤝 Contributors
AI Engineer
Data Engineer
Law Enforcement Domain Experts
UI/UX Designers
Graph Analysts
