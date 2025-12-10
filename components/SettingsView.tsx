import React, { useState } from 'react';

type SettingsTab = 'general' | 'integrations' | 'account' | 'system';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  
  // Integrations State
  const [apiKey, setApiKey] = useState('sk-........................');
  const [isEditingKey, setIsEditingKey] = useState(false);
  
  // General State
  const [settings, setSettings] = useState({
    highContrast: false,
    autoRefresh: true,
    emailAlerts: true,
    dataRetention: '30_days'
  });

  // Account State
  const [profile, setProfile] = useState({
    name: 'Inspector Vijay Singh',
    badgeId: 'JH-CYB-007',
    email: 'v.singh@jhpolice.gov.in',
    role: 'Senior Investigator'
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveKey = () => {
    setIsEditingKey(false);
    // Logic to save key would go here
  };

  return (
    <div className="p-6 h-full flex flex-col bg-cyber-950 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>

      {/* Tabs Navigation */}
      <div className="flex border-b border-cyber-800 mb-6">
        <TabButton 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')} 
          icon="fa-sliders" 
          label="General" 
        />
        <TabButton 
          active={activeTab === 'integrations'} 
          onClick={() => setActiveTab('integrations')} 
          icon="fa-network-wired" 
          label="Integrations" 
        />
        <TabButton 
          active={activeTab === 'account'} 
          onClick={() => setActiveTab('account')} 
          icon="fa-user-shield" 
          label="Account" 
        />
        <TabButton 
          active={activeTab === 'system'} 
          onClick={() => setActiveTab('system')} 
          icon="fa-server" 
          label="System" 
        />
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <i className="fa-solid fa-desktop text-cyber-400 mr-2"></i> Interface Preferences
              </h3>
              
              <div className="space-y-4">
                 <ToggleRow 
                   label="High Contrast Mode" 
                   desc="Increase visibility for field operations in daylight."
                   enabled={settings.highContrast} 
                   onToggle={() => toggleSetting('highContrast')} 
                 />
                 <ToggleRow 
                   label="Auto-Refresh Graph" 
                   desc="Automatically fetch new node connections every 30 seconds."
                   enabled={settings.autoRefresh} 
                   onToggle={() => toggleSetting('autoRefresh')} 
                 />
                 <ToggleRow 
                   label="Email Alerts" 
                   desc="Receive digest summaries for critical severity flags."
                   enabled={settings.emailAlerts} 
                   onToggle={() => toggleSetting('emailAlerts')} 
                 />
              </div>
            </div>

            <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6">
               <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <i className="fa-solid fa-database text-cyber-400 mr-2"></i> Data Retention
              </h3>
               <div className="space-y-2">
                 <label className="text-sm text-slate-400">Offline Cache Duration</label>
                 <select 
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({...settings, dataRetention: e.target.value})}
                    className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-200 focus:border-cyber-500 outline-none"
                 >
                   <option value="7_days">7 Days (Low Storage)</option>
                   <option value="30_days">30 Days (Standard)</option>
                   <option value="90_days">90 Days (Investigation)</option>
                   <option value="forever">Indefinite (Server Only)</option>
                 </select>
               </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6">
               <div className="flex items-start justify-between mb-4">
                 <div>
                    <h3 className="text-white font-bold text-lg flex items-center">
                      <i className="fa-brands fa-google text-cyber-400 mr-2"></i> Gemini AI Intelligence
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Powering graph analysis, pattern detection, and automated reporting.</p>
                 </div>
                 <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-bold uppercase">
                   Connected
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="text-xs text-slate-500 font-bold uppercase block mb-1">API Key</label>
                   <div className="flex gap-2">
                     <input 
                        type={isEditingKey ? "text" : "password"} 
                        value={apiKey} 
                        disabled={!isEditingKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={`flex-1 bg-cyber-950 border rounded px-3 py-2 text-sm text-slate-200 focus:outline-none ${isEditingKey ? 'border-cyber-500' : 'border-cyber-800 opacity-70'}`} 
                     />
                     {isEditingKey ? (
                        <button onClick={handleSaveKey} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 text-xs font-bold transition-colors">Save</button>
                     ) : (
                        <button onClick={() => setIsEditingKey(true)} className="px-4 py-2 bg-cyber-800 text-slate-300 rounded hover:bg-cyber-700 text-xs font-bold transition-colors">Edit</button>
                     )}
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6 opacity-60">
               <div className="flex items-start justify-between mb-2">
                 <div>
                    <h3 className="text-white font-bold text-lg flex items-center">
                      <i className="fa-solid fa-tower-cell text-slate-500 mr-2"></i> Telecom CDR Gateway
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Direct link to regional telecom provider logs.</p>
                 </div>
                 <div className="px-2 py-1 bg-cyber-950 border border-cyber-800 rounded text-[10px] text-slate-500 font-bold uppercase">
                   Offline
                 </div>
               </div>
               <button className="text-xs text-cyber-500 hover:text-cyber-400 font-bold mt-2">Configure Gateway <i className="fa-solid fa-arrow-right ml-1"></i></button>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
           <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://picsum.photos/100/100" alt="Profile" className="w-20 h-20 rounded-full border-2 border-cyber-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]" />
                <div>
                   <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                   <div className="text-cyber-400 text-sm font-mono">{profile.badgeId}</div>
                   <div className="text-slate-500 text-xs mt-1">{profile.role}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Official Email</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-300 text-sm focus:border-cyber-500 outline-none" 
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Access Level</label>
                    <input 
                      type="text" 
                      value="Level 4 (Field Command)" 
                      disabled 
                      className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-500 text-sm cursor-not-allowed" 
                    />
                 </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-cyber-800 flex justify-end">
                <button className="bg-cyber-500 hover:bg-cyber-400 text-white px-4 py-2 rounded text-sm font-bold shadow-lg transition-all">Update Profile</button>
              </div>
           </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
           <div className="space-y-6 max-w-2xl">
             <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6">
               <h3 className="text-white font-bold text-lg mb-4">Version Information</h3>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="p-3 bg-cyber-950 rounded border border-cyber-800">
                    <span className="block text-slate-500 text-xs uppercase mb-1">Core Version</span>
                    <span className="text-white font-mono">v2.4.1-beta</span>
                 </div>
                 <div className="p-3 bg-cyber-950 rounded border border-cyber-800">
                    <span className="block text-slate-500 text-xs uppercase mb-1">Build ID</span>
                    <span className="text-white font-mono">#99283-JH</span>
                 </div>
                 <div className="p-3 bg-cyber-950 rounded border border-cyber-800">
                    <span className="block text-slate-500 text-xs uppercase mb-1">Database</span>
                    <span className="text-white font-mono">Neo4j v5.12</span>
                 </div>
                 <div className="p-3 bg-cyber-950 rounded border border-cyber-800">
                    <span className="block text-slate-500 text-xs uppercase mb-1">Last Patch</span>
                    <span className="text-white font-mono">2023-10-25</span>
                 </div>
               </div>
             </div>
             
             <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-6">
               <h3 className="text-red-400 font-bold text-lg mb-2">Danger Zone</h3>
               <p className="text-slate-400 text-sm mb-4">Irreversible actions for system administration.</p>
               <button className="bg-red-900/50 hover:bg-red-900 border border-red-800 text-red-200 px-4 py-2 rounded text-sm font-bold transition-all">
                 Purge Local Cache
               </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all text-sm font-medium ${
      active 
        ? 'border-cyber-400 text-cyber-400 bg-cyber-900/30' 
        : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-cyber-900/10'
    }`}
  >
    <i className={`fa-solid ${icon}`}></i>
    {label}
  </button>
);

const ToggleRow: React.FC<{ label: string; desc: string; enabled: boolean; onToggle: () => void }> = ({ label, desc, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-2 rounded hover:bg-cyber-950/30 transition-colors">
    <div>
      <div className="text-sm font-bold text-slate-200">{label}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
    <div 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-cyber-500' : 'bg-cyber-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7' : 'left-1'}`}></div>
    </div>
  </div>
);

export default SettingsView;