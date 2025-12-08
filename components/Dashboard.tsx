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

const StatCard = ({ title, value, sub, icon, colorClass }: any) => (
  <div className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <i className={`fa-solid ${icon} text-5xl`}></i>
    </div>
    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
    <div className="text-3xl font-bold text-white mt-2">{value}</div>
    <div className={`text-xs mt-1 ${colorClass.replace('text-', 'text-opacity-80 ')}`}>{sub}</div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Operation Dashboard</h1>
          <p className="text-slate-400 text-sm">Real-time surveillance overview • Jharkhand District</p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 bg-cyber-500/10 border border-cyber-500/50 text-cyber-400 text-xs rounded-full animate-pulse">
            <i className="fa-solid fa-satellite-dish mr-2"></i>Live Monitoring
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        <div className="lg:col-span-2 bg-cyber-900 border border-cyber-800 p-4 rounded-lg flex flex-col">
          <h3 className="text-white text-sm font-bold mb-4">Call Volume Activity (24H)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="calls" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg flex flex-col">
          <h3 className="text-white text-sm font-bold mb-4">Entity Distribution</h3>
          <div className="flex-1 w-full">
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
                >
                  {nodeTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={NODE_COLORS[entry.name as NodeType] || '#fff'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {nodeTypeData.map(entry => (
              <div key={entry.name} className="flex items-center text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: NODE_COLORS[entry.name as NodeType] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-cyber-900 border border-cyber-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-cyber-800 bg-cyber-950/50">
          <h3 className="text-white text-sm font-bold">Recent Intelligence Alerts</h3>
        </div>
        <div>
          {MOCK_ALERTS.map(alert => (
            <div key={alert.id} className="p-4 border-b border-cyber-800 last:border-0 hover:bg-cyber-800/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-cyber-accent animate-pulse' : 
                    alert.severity === 'high' ? 'bg-orange-500' : 'bg-cyber-400'
                  }`} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{alert.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
