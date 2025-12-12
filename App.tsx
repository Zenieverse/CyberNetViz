import React, { useState, useMemo, useCallback } from 'react';
import { ViewState, NodeData, Alert, NodeType } from './types';
import { MOCK_GRAPH_DATA, MOCK_ALERTS } from './constants';
import Dashboard from './components/Dashboard';
import NetworkGraph from './components/NetworkGraph';
import IntelligencePanel from './components/IntelligencePanel';
import ReportsView from './components/ReportsView';
import IngestionView from './components/IngestionView';
import SettingsView from './components/SettingsView';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Alert State Management
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS.map(a => ({...a, read: false})));
  
  // Graph States
  // Expanded filter type to support specific NodeTypes
  const [graphFilter, setGraphFilter] = useState<'all' | 'risk' | NodeType>('all');
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // Toast System
  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = (Date.now() + Math.random()).toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Stable callback to prevent graph re-simulation
  const handleNodeSelect = useCallback((node: NodeData) => {
    setSelectedNode(node);
  }, []);

  // Stable callback for navigation
  const handleNavigate = useCallback((view: ViewState) => {
    setCurrentView(view);
  }, []);

  // Dashboard Interaction Handlers
  const handleDashboardFilter = (filter: 'all' | 'risk' | NodeType) => {
    setGraphFilter(filter);
    setCurrentView(ViewState.GRAPH_EXPLORER);
    const label = filter === 'risk' ? 'High Risk Entities' : filter === 'all' ? 'All Entities' : `${filter} Entities`;
    notify(`Graph filtered by: ${label}`, 'info');
  };

  const handleDashboardNodeClick = (nodeId: string) => {
    const node = MOCK_GRAPH_DATA.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setGraphFilter('all'); // Reset filter to show context
      setCurrentView(ViewState.GRAPH_EXPLORER);
      notify(`Focused on ${node.label}`, 'success');
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const foundNode = MOCK_GRAPH_DATA.nodes.find(n => 
        n.label.toLowerCase().includes(query) || 
        n.id.toLowerCase().includes(query) ||
        (n.details.imei && n.details.imei.includes(query)) ||
        (n.details.phone && n.details.phone.includes(query))
      );

      if (foundNode) {
        setSelectedNode(foundNode);
        setCurrentView(ViewState.GRAPH_EXPLORER);
        notify(`Found entity: ${foundNode.label}`, 'success');
        setSearchQuery('');
      } else {
        notify('No entity found matching query', 'error');
      }
    }
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({...a, read: true})));
    notify('All notifications marked as read', 'success');
    // Optional: close dropdown after action
    // setShowNotifications(false); 
  };

  // Filter Graph Data based on state
  const displayedGraphData = useMemo(() => {
    if (graphFilter === 'all') return MOCK_GRAPH_DATA;
    
    let filteredNodes: NodeData[] = [];

    if (graphFilter === 'risk') {
       // Filter for nodes with Risk Score > 60
       filteredNodes = MOCK_GRAPH_DATA.nodes.filter(n => n.riskScore >= 60);
    } else {
       // Filter by specific NodeType
       filteredNodes = MOCK_GRAPH_DATA.nodes.filter(n => n.type === graphFilter);
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    // Only keep links connecting two existing nodes in the filtered set
    const filteredLinks = MOCK_GRAPH_DATA.links.filter(l => {
       const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
       const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
       return nodeIds.has(sourceId as string) && nodeIds.has(targetId as string);
    });
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphFilter]);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="flex h-screen bg-cyber-950 text-slate-200 font-sans overflow-hidden relative">
      
      {/* Toast Container */}
      <div className="absolute top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`min-w-[250px] p-4 rounded shadow-2xl border-l-4 animate-fade-in backdrop-blur-md pointer-events-auto ${
            toast.type === 'success' ? 'bg-emerald-900/80 border-emerald-500 text-white' :
            toast.type === 'error' ? 'bg-rose-900/80 border-rose-500 text-white' :
            'bg-cyber-800/90 border-cyber-400 text-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <i className={`fa-solid ${
                toast.type === 'success' ? 'fa-check-circle' :
                toast.type === 'error' ? 'fa-triangle-exclamation' :
                'fa-circle-info'
              }`}></i>
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation (Hidden in Fullscreen) */}
      {!fullscreenMode && (
        <nav className="w-20 flex-shrink-0 bg-cyber-950 border-r border-cyber-800 flex flex-col items-center py-6 z-20 transition-all">
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
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header (Hidden in Fullscreen) */}
        {!fullscreenMode && (
          <header className="h-16 bg-cyber-950/80 backdrop-blur border-b border-cyber-800 flex items-center justify-between px-6 z-10 transition-all">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight text-white">
                CYBER<span className="text-cyber-400">NET</span>VIZ
              </h2>
              <div className="hidden md:flex items-center bg-cyber-900 border border-cyber-800 rounded px-3 py-1.5 ml-8 group focus-within:border-cyber-500 transition-colors">
                <i className="fa-solid fa-search text-slate-500 text-xs mr-2 group-focus-within:text-cyber-400"></i>
                <input 
                  type="text" 
                  placeholder="Search Suspect ID, IMEI, Phone... (Enter)" 
                  className="bg-transparent border-none outline-none text-sm w-64 text-slate-200 placeholder-slate-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
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
                  {unreadCount > 0 && (
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
                      <span className="text-[10px] bg-cyber-800 px-1.5 py-0.5 rounded text-slate-300">{unreadCount} New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {alerts.map(alert => (
                        <div key={alert.id} className={`p-3 border-b border-cyber-800 last:border-0 hover:bg-cyber-800/30 transition-colors cursor-pointer group ${alert.read ? 'opacity-60 bg-cyber-950/30' : ''}`}>
                          <div className="flex gap-3">
                             <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                               alert.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.6)]' : 
                               alert.severity === 'high' ? 'bg-orange-500' : 'bg-cyber-400'
                             }`} />
                             <div>
                               <h4 className={`text-xs font-bold transition-colors ${alert.read ? 'text-slate-500' : 'text-slate-200 group-hover:text-cyber-400'}`}>{alert.title}</h4>
                               <p className="text-[10px] text-slate-400 mt-1 leading-tight">{alert.description}</p>
                               <span className="text-[9px] text-slate-500 font-mono mt-1 block">{alert.timestamp}</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 bg-cyber-950/50 border-t border-cyber-800 text-center">
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-cyber-400 hover:text-cyber-300 font-bold uppercase w-full py-1 hover:bg-cyber-900/50 rounded transition-colors"
                      >
                        Mark all read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-xs text-rose-400 font-bold">
                SECURITY LEVEL: HIGH
              </div>
            </div>
          </header>
        )}

        {/* View Container */}
        <div className="flex-1 relative overflow-hidden flex">
          
          {/* Dashboard View */}
          {currentView === ViewState.DASHBOARD && (
            <div className="w-full h-full animate-fade-in">
              <Dashboard 
                onNavigate={handleNavigate} 
                alerts={alerts}
                onFilter={handleDashboardFilter}
                onNodeClick={handleDashboardNodeClick}
              />
            </div>
          )}

          {/* Graph Explorer View (Split Screen) */}
          {currentView === ViewState.GRAPH_EXPLORER && (
            <>
              <div className="flex-1 h-full relative">
                 <NetworkGraph 
                    data={displayedGraphData} 
                    onNodeSelect={handleNodeSelect} 
                    selectedNode={selectedNode}
                 />
                 {/* Floating Overlay Controls */}
                 <div className="absolute bottom-6 left-6 flex gap-2 z-20">
                    <button 
                      onClick={() => {
                        // Toggle between 'all' and 'risk', resetting from any specific type filter
                        const newFilter = graphFilter === 'all' ? 'risk' : 'all';
                        setGraphFilter(newFilter);
                        notify(newFilter === 'risk' ? 'Showing High Risk Clusters Only' : 'Showing Full Network Graph', 'info');
                      }}
                      className={`w-10 h-10 bg-cyber-900 border rounded transition-all flex items-center justify-center shadow-lg ${graphFilter === 'risk' ? 'border-cyber-400 text-cyber-400' : 'border-cyber-800 text-slate-300 hover:text-white'}`}
                      title={graphFilter === 'all' ? "Filter: High Risk Only" : "Filter: Show All"}
                    >
                      <i className={`fa-solid ${graphFilter === 'all' ? 'fa-filter' : 'fa-filter-circle-xmark'}`}></i>
                    </button>
                    <button 
                      onClick={() => {
                        setFullscreenMode(!fullscreenMode);
                      }}
                      className={`w-10 h-10 bg-cyber-900 border rounded text-slate-300 hover:text-white transition-all flex items-center justify-center shadow-lg ${fullscreenMode ? 'border-cyber-400 text-cyber-400' : 'border-cyber-800'}`}
                      title={fullscreenMode ? "Exit Fullscreen" : "Fullscreen Mode"}
                    >
                      <i className={`fa-solid ${fullscreenMode ? 'fa-compress' : 'fa-expand'}`}></i>
                    </button>
                 </div>
              </div>
              
              {/* Intelligence Panel Sidebar - Hide in Fullscreen */}
              <div className={`${fullscreenMode ? 'w-0 border-none opacity-0' : 'w-96 border-l opacity-100'} h-full flex-shrink-0 bg-cyber-900 z-10 border-cyber-800 shadow-2xl transition-all duration-300 overflow-hidden`}>
                 <IntelligencePanel selectedNode={selectedNode} graphData={MOCK_GRAPH_DATA} />
              </div>
            </>
          )}

          {/* Reports View */}
          {currentView === ViewState.REPORTS && (
             <div className="w-full h-full animate-fade-in">
               <ReportsView onNotify={notify} />
             </div>
          )}

          {/* Ingestion View */}
          {currentView === ViewState.INGESTION && (
             <div className="w-full h-full animate-fade-in">
               <IngestionView onNotify={notify} />
             </div>
          )}

          {/* Settings View */}
          {currentView === ViewState.SETTINGS && (
             <div className="w-full h-full animate-fade-in">
               <SettingsView onNotify={notify} />
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