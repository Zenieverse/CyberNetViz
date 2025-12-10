import React, { useState } from 'react';
import { ViewState, NodeData } from './types';
import { MOCK_GRAPH_DATA, MOCK_ALERTS } from './constants';
import Dashboard from './components/Dashboard';
import NetworkGraph from './components/NetworkGraph';
import IntelligencePanel from './components/IntelligencePanel';
import ReportsView from './components/ReportsView';
import IngestionView from './components/IngestionView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNodeSelect = (node: NodeData) => {
    setSelectedNode(node);
    // Ensure the intelligence panel is visible on mobile if a node is selected
    // For desktop it's side-by-side
  };

  return (
    <div className="flex h-screen bg-cyber-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <nav className="w-20 flex-shrink-0 bg-cyber-950 border-r border-cyber-800 flex flex-col items-center py-6 z-20">
        <div className="mb-8 text-cyber-400 text-3xl">
          <i className="fa-solid fa-network-wired drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"></i>
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full">
          <NavButton 
            active={currentView === ViewState.DASHBOARD} 
            icon="fa-chart-line" 
            label="Dash" 
            onClick={() => setCurrentView(ViewState.DASHBOARD)} 
          />
          <NavButton 
            active={currentView === ViewState.GRAPH_EXPLORER} 
            icon="fa-project-diagram" 
            label="Graph" 
            onClick={() => setCurrentView(ViewState.GRAPH_EXPLORER)} 
          />
          <NavButton 
            active={currentView === ViewState.REPORTS} 
            icon="fa-file-shield" 
            label="Briefs" 
            onClick={() => setCurrentView(ViewState.REPORTS)} 
          />
           <NavButton 
            active={currentView === ViewState.INGESTION} 
            icon="fa-database" 
            label="Data" 
            onClick={() => setCurrentView(ViewState.INGESTION)} 
          />
           <NavButton 
            active={currentView === ViewState.SETTINGS} 
            icon="fa-cog" 
            label="Settings" 
            onClick={() => setCurrentView(ViewState.SETTINGS)} 
          />
        </div>

        <div className="mb-4">
           <img src="https://picsum.photos/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-cyber-800" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-cyber-950/80 backdrop-blur border-b border-cyber-800 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight text-white">
              CYBER<span className="text-cyber-400">NET</span>VIZ
            </h2>
            <div className="hidden md:flex items-center bg-cyber-900 border border-cyber-800 rounded px-3 py-1.5 ml-8">
              <i className="fa-solid fa-search text-slate-500 text-xs mr-2"></i>
              <input 
                type="text" 
                placeholder="Search Suspect ID, IMEI, Phone..." 
                className="bg-transparent border-none outline-none text-sm w-64 text-slate-200 placeholder-slate-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`text-slate-400 hover:text-white transition-colors relative ${showNotifications ? 'text-white' : ''}`}
              >
                <i className="fa-regular fa-bell text-lg"></i>
                {MOCK_ALERTS.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-cyber-900 border border-cyber-800 rounded-lg shadow-2xl z-50 overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-cyber-800 bg-cyber-950/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                    <span className="text-[10px] bg-cyber-800 px-1.5 py-0.5 rounded text-slate-300">{MOCK_ALERTS.length} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {MOCK_ALERTS.map(alert => (
                      <div key={alert.id} className="p-3 border-b border-cyber-800 last:border-0 hover:bg-cyber-800/30 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                           <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                             alert.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.6)]' : 
                             alert.severity === 'high' ? 'bg-orange-500' : 'bg-cyber-400'
                           }`} />
                           <div>
                             <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyber-400 transition-colors">{alert.title}</h4>
                             <p className="text-[10px] text-slate-400 mt-1 leading-tight">{alert.description}</p>
                             <span className="text-[9px] text-slate-500 font-mono mt-1 block">{alert.timestamp}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-cyber-950/50 border-t border-cyber-800 text-center">
                    <button className="text-[10px] text-cyber-400 hover:text-cyber-300 font-bold uppercase w-full py-1">Mark all read</button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-xs text-rose-400 font-bold">
              SECURITY LEVEL: HIGH
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 relative overflow-hidden flex">
          
          {/* Dashboard View */}
          {currentView === ViewState.DASHBOARD && (
            <div className="w-full h-full animate-fade-in">
              <Dashboard />
            </div>
          )}

          {/* Graph Explorer View (Split Screen) */}
          {currentView === ViewState.GRAPH_EXPLORER && (
            <>
              <div className="flex-1 h-full relative">
                 <NetworkGraph 
                    data={MOCK_GRAPH_DATA} 
                    onNodeSelect={handleNodeSelect} 
                    selectedNode={selectedNode}
                 />
                 {/* Floating Overlay Controls */}
                 <div className="absolute bottom-6 left-6 flex gap-2">
                    <button className="w-10 h-10 bg-cyber-900 border border-cyber-800 rounded text-slate-300 hover:text-white hover:border-cyber-400 transition-all flex items-center justify-center">
                      <i className="fa-solid fa-filter"></i>
                    </button>
                    <button className="w-10 h-10 bg-cyber-900 border border-cyber-800 rounded text-slate-300 hover:text-white hover:border-cyber-400 transition-all flex items-center justify-center">
                      <i className="fa-solid fa-expand"></i>
                    </button>
                 </div>
              </div>
              
              {/* Intelligence Panel Sidebar */}
              <div className="w-96 h-full flex-shrink-0 bg-cyber-900 z-10 border-l border-cyber-800 shadow-2xl">
                 <IntelligencePanel selectedNode={selectedNode} graphData={MOCK_GRAPH_DATA} />
              </div>
            </>
          )}

          {/* Reports View */}
          {currentView === ViewState.REPORTS && (
             <div className="w-full h-full animate-fade-in">
               <ReportsView />
             </div>
          )}

          {/* Ingestion View */}
          {currentView === ViewState.INGESTION && (
             <div className="w-full h-full animate-fade-in">
               <IngestionView />
             </div>
          )}

          {/* Settings View */}
          {currentView === ViewState.SETTINGS && (
             <div className="w-full h-full animate-fade-in">
               <SettingsView />
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Nav Helper
const NavButton: React.FC<{ active: boolean; icon: string; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-col items-center py-3 border-l-2 transition-all group ${
      active 
        ? 'border-cyber-400 bg-cyber-900/50 text-cyber-400' 
        : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-cyber-900/30'
    }`}
  >
    <i className={`fa-solid ${icon} text-xl mb-1 ${active ? 'drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]' : ''}`}></i>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;