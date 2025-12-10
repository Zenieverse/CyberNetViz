import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_ALERTS, MOCK_GRAPH_DATA, NODE_COLORS } from '../constants';
import { NodeType } from '../types';

// Process Data for charts
const nodeTypeData = Object.values(NodeType).map(type => ({
  name: type,
  value: MOCK_GRAPH_DATA.nodes.filter(n => n.type === type).length
}));

const activityData = [
  { time: '00:00', calls: 12 }, { time: '04:00', calls: 5 }, 
  { time: '08:00', calls: 45 }, { time: '12:00', calls: 120 },
  { time: '16:00', calls: 98 }, { time: '20:00', calls: 65 }
];

interface StatCardProps {
  title: string;
  value: number | string;
  sub: string;
  icon: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, sub, icon, colorClass }) => (
  <div className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg relative overflow-hidden group hover:border-cyber-700 transition-colors">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <i className={`fa-solid ${icon} text-5xl`}></i>
    </div>
    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
    <div className="text-3xl font-bold text-white mt-2">{value}</div>
    <div className={`text-xs mt-1 ${colorClass.replace('text-', 'text-opacity-80 ')}`}>{sub}</div>
  </div>
);

const Dashboard: React.FC = () => {
  // Get Top Risk Suspects
  const topSuspects = MOCK_GRAPH_DATA.nodes
    .filter(n => n.type === NodeType.SUSPECT)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Operation Dashboard</h1>
          <p className="text-slate-400 text-sm">Real-time surveillance overview • Jharkhand District</p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 bg-cyber-500/10 border border-cyber-500/50 text-cyber-400 text-xs rounded-full animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-400"></span>
            Live Monitoring
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Suspects" 
          value={MOCK_GRAPH_DATA.nodes.filter(n => n.type === NodeType.SUSPECT).length}
          sub="+2 identified today"
          icon="fa-user-secret"
          colorClass="text-cyber-accent"
        />
        <StatCard 
          title="Mule Accounts" 
          value={MOCK_GRAPH_DATA.nodes.filter(n => n.type === NodeType.BANK_ACCOUNT).length}
          sub="₹5.7 Lakhs frozen"
          icon="fa-building-columns"
          colorClass="text-emerald-400"
        />
        <StatCard 
          title="Flagged SIMs" 
          value={MOCK_GRAPH_DATA.nodes.filter(n => n.type === NodeType.SIM).length}
          sub="High rotation detected"
          icon="fa-sim-card"
          colorClass="text-cyber-400"
        />
        <StatCard 
          title="Alerts" 
          value={MOCK_ALERTS.length}
          sub="1 Critical pending"
          icon="fa-bell"
          colorClass="text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bar Chart */}
          <div className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg flex flex-col h-80">
            <h3 className="text-white text-sm font-bold mb-4 flex items-center justify-between">
              <span>Call Volume Activity (24H)</span>
              <span className="text-[10px] text-slate-500 font-normal">Updated: 5m ago</span>
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Bar dataKey="calls" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

           {/* High Value Targets */}
           <div className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-sm font-bold"><i className="fa-solid fa-crosshairs text-cyber-accent mr-2"></i>High Value Targets</h3>
                <button className="text-xs text-cyber-400 hover:text-white">View All</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {topSuspects.map(suspect => (
                 <div key={suspect.id} className="bg-cyber-950/50 p-3 rounded border border-cyber-800 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-cyber-accent/10 rounded-bl-full"></div>
                    <div className="flex justify-between items-start z-10">
                       <div>
                         <div className="text-xs text-slate-400 font-mono">{suspect.id}</div>
                         <div className="text-sm font-bold text-white">{suspect.label}</div>
                       </div>
                       <div className="text-xs font-bold text-cyber-accent">{suspect.riskScore}% Risk</div>
                    </div>
                    <div className="w-full bg-cyber-800 h-1 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-cyber-accent" style={{ width: `${suspect.riskScore}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex gap-2">
                       {suspect.details.location && <span><i className="fa-solid fa-location-dot mr-1"></i>{suspect.details.location}</span>}
                       {suspect.details.role && <span><i className="fa-solid fa-user-tag mr-1"></i>{suspect.details.role}</span>}
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg flex flex-col h-80">
            <h3 className="text-white text-sm font-bold mb-4">Entity Distribution</h3>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nodeTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {nodeTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={NODE_COLORS[entry.name as NodeType] || '#fff'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '4px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <div className="text-2xl font-bold text-white">{MOCK_GRAPH_DATA.nodes.length}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Nodes</div>
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {nodeTypeData.map(entry => (
                <div key={entry.name} className="flex items-center text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: NODE_COLORS[entry.name as NodeType] }}></span>
                  <span className="capitalize">{entry.name.replace('_', ' ').toLowerCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-cyber-900 border border-cyber-800 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b border-cyber-800 bg-cyber-950/30 flex justify-between items-center">
              <h3 className="text-white text-sm font-bold">Recent Intelligence Alerts</h3>
              <span className="text-[10px] bg-cyber-800 text-slate-300 px-1.5 py-0.5 rounded">{MOCK_ALERTS.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-64 custom-scrollbar">
              {MOCK_ALERTS.map(alert => (
                <div key={alert.id} className="p-3 border-b border-cyber-800 last:border-0 hover:bg-cyber-800/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-cyber-accent animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.6)]' : 
                        alert.severity === 'high' ? 'bg-orange-500' : 'bg-cyber-400'
                      }`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{alert.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pl-5 text-[10px] text-slate-600 font-mono text-right">{alert.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;