import React, { useState } from 'react';
import { NodeData, IntelligenceReport, GraphData } from '../types';
import { analyzeNetworkCluster } from '../services/geminiService';
import { NODE_COLORS } from '../constants';

interface IntelligencePanelProps {
  selectedNode: NodeData | null;
  graphData: GraphData;
}

const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ selectedNode, graphData }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IntelligenceReport | null>(null);

  const handleAnalyze = async () => {
    if (!selectedNode) return;
    setLoading(true);
    
    // In a real app, we would filter the subgraph connected to this node
    // For demo, we send the whole mock graph to simulate network-wide analysis context
    try {
      const result = await analyzeNetworkCluster(graphData.nodes, graphData.links);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
        <div className="text-center">
          <i className="fa-solid fa-circle-nodes text-4xl mb-3 opacity-30"></i>
          <p>Select a node in the graph to view intelligence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-cyber-900 border-l border-cyber-800">
      {/* Header */}
      <div className="p-4 border-b border-cyber-800">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full shadow-[0_0_10px]" 
            style={{ 
              backgroundColor: NODE_COLORS[selectedNode.type],
              boxShadow: `0 0 8px ${NODE_COLORS[selectedNode.type]}`
            }} 
          />
          <div>
            <h2 className="text-lg font-bold text-white">{selectedNode.label}</h2>
            <p className="text-xs text-cyber-400 font-mono tracking-wider">{selectedNode.type}</p>
          </div>
        </div>
      </div>

      {/* Node Details */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        <div className="bg-cyber-950 p-3 rounded border border-cyber-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Risk Score</span>
            <span className={`text-sm font-bold ${selectedNode.riskScore > 80 ? 'text-cyber-accent' : 'text-yellow-400'}`}>
              {selectedNode.riskScore}/100
            </span>
          </div>
          <div className="w-full bg-cyber-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-cyber-accent" 
              style={{ width: `${selectedNode.riskScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {Object.entries(selectedNode.details).map(([key, value]) => (
            <div key={key} className="flex flex-col bg-cyber-950/50 p-2 rounded">
              <span className="text-[10px] uppercase text-slate-500 font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-sm text-slate-200 font-mono">{String(value)}</span>
            </div>
          ))}
        </div>

        {/* AI Action Area */}
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-3 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              loading 
                ? 'bg-cyber-800 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-cyber-500 hover:from-indigo-500 hover:to-cyber-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
            }`}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Analyzing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-robot"></i> Run AI Network Analysis
              </>
            )}
          </button>
        </div>

        {/* AI Report Result */}
        {report && (
          <div className="mt-4 animate-fade-in space-y-3">
             <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded">
                <h4 className="text-indigo-400 text-xs font-bold uppercase mb-1">Network Type</h4>
                <p className="text-sm text-white">{report.networkType}</p>
             </div>

             <div className="p-3 bg-cyber-950 border border-cyber-800 rounded">
                <h4 className="text-cyber-400 text-xs font-bold uppercase mb-2">AI Summary</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{report.summary}</p>
             </div>

             <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded">
                <h4 className="text-rose-400 text-xs font-bold uppercase mb-2"><i className="fa-solid fa-skull mr-1"></i> Key Suspects</h4>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {report.keySuspects.map((suspect, idx) => (
                    <li key={idx}>{suspect}</li>
                  ))}
                </ul>
             </div>

             <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded">
                <h4 className="text-emerald-400 text-xs font-bold uppercase mb-2"><i className="fa-solid fa-check-circle mr-1"></i> Recommendations</h4>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {report.recommendedActions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
             </div>
             
             <div className="text-[10px] text-slate-600 text-center">
               Generated: {new Date(report.generatedAt).toLocaleTimeString()}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligencePanel;