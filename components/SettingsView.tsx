import React, { useState, useRef } from 'react';

type SettingsTab = 'general' | 'integrations' | 'account' | 'system';

interface SettingsViewProps {
  onNotify: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface IntegrationStatus {
  gemini: 'connected' | 'disconnected';
  telecom: 'connected' | 'disconnected';
  googleEarth: 'connected' | 'disconnected';
}

const SettingsView: React.FC<SettingsViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [purging, setPurging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // General State
  const [settings, setSettings] = useState({
    highContrast: false,
    autoRefresh: true,
    emailAlerts: true,
    dataRetention: '30_days'
  });

  // Integrations State
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    gemini: 'connected', 
    telecom: 'disconnected',
    googleEarth: 'disconnected'
  });
  const [showGatewayConfig, setShowGatewayConfig] = useState(false);
  const [gatewayForm, setGatewayForm] = useState({ url: 'https://api.jh-telecom.net/v2/cdr', key: '' });
  const [testing, setTesting] = useState<string | null>(null);

  // Account State
  const [profile, setProfile] = useState({
    name: 'Inspector Zen',
    badgeId: 'JH-CYB-007',
    email: 'zen@jhpolice.gov.in',
    role: 'Senior Investigator',
    accessLevel: 'Level 4 (Field Command)',
    avatar: 'https://picsum.photos/100/100'
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Integration Handlers
  const handleTestConnection = (service: keyof IntegrationStatus) => {
    setTesting(service);
    // Simulate network request
    setTimeout(() => {
      setTesting(null);
      const name = service === 'gemini' ? 'Gemini AI' : service === 'telecom' ? 'Telecom Gateway' : 'Geospatial Service';
      onNotify(`${name} connection verified. Latency: ${Math.floor(Math.random() * 50) + 20}ms`, 'success');
    }, 1500);
  };

  const handleToggleIntegration = (service: keyof IntegrationStatus) => {
    if (service === 'telecom' && integrationStatus.telecom === 'disconnected') {
      setShowGatewayConfig(true);
      return;
    }
    
    setIntegrationStatus(prev => ({
      ...prev,
      [service]: prev[service] === 'connected' ? 'disconnected' : 'connected'
    }));
    
    if (integrationStatus[service] === 'connected') {
       onNotify(`${service} service disconnected.`, 'info');
    } else {
       onNotify(`${service} service connected.`, 'success');
    }
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gatewayForm.key) {
      onNotify('API Key is required', 'error');
      return;
    }
    setTesting('telecom-config');
    setTimeout(() => {
        setIntegrationStatus(prev => ({ ...prev, telecom: 'connected' }));
        setShowGatewayConfig(false);
        setTesting(null);
        onNotify('Telecom CDR Gateway configured and connected securely.', 'success');
    }, 1500);
  };

  const handleUpdateProfile = () => {
    onNotify('User profile information updated', 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        onNotify('Profile image updated successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
    // Reset input to allow re-uploading the same file if needed
    if (e.target) {
        e.target.value = '';
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePurge = () => {
    if(window.confirm('Are you sure? This will permanently delete all locally cached graph data and user preferences.')) {
        setPurging(true);
        // Simulate heavy cleanup operation
        setTimeout(() => {
            setPurging(false);
            onNotify('Local cache purged successfully. System optimized.', 'success');
        }, 2000);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-cyber-950 animate-fade-in relative">
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
          <div className="space-y-6 max-w-3xl">
            
            {/* Gemini Integration Card */}
            <IntegrationCard 
              title="Gemini AI Intelligence" 
              description="Powering graph analysis, pattern detection, and automated reporting."
              icon="fa-brands fa-google"
              status={integrationStatus.gemini}
              onToggle={() => handleToggleIntegration('gemini')}
              onTest={() => handleTestConnection('gemini')}
              isTesting={testing === 'gemini'}
              secureLabel="Secure environment variable configuration."
            />

            {/* Telecom Integration Card */}
            <IntegrationCard 
              title="Telecom CDR Gateway" 
              description="Direct link to regional telecom provider logs (Airtel/Jio/Vi)."
              icon="fa-solid fa-tower-cell"
              status={integrationStatus.telecom}
              onToggle={() => handleToggleIntegration('telecom')}
              onTest={() => handleTestConnection('telecom')}
              isTesting={testing === 'telecom'}
              secureLabel="Encrypted tunnel via government gateway."
            />

            {/* Google Earth Integration Card */}
            <IntegrationCard 
              title="Geospatial Mapping Service" 
              description="Coordinate triangulation and tower location mapping."
              icon="fa-solid fa-earth-asia"
              status={integrationStatus.googleEarth}
              onToggle={() => handleToggleIntegration('googleEarth')}
              onTest={() => handleTestConnection('googleEarth')}
              isTesting={testing === 'googleEarth'}
              secureLabel="Standard API key authentication."
            />

          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
           <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group cursor-pointer" onClick={triggerImageUpload}>
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-2 border-cyber-500 shadow-[0_0_15px_rgba(14,165,233,0.3)] object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-camera text-white"></i>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
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
                      value={profile.accessLevel} 
                      onChange={e => setProfile({...profile, accessLevel: e.target.value})}
                      className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-300 text-sm focus:border-cyber-500 outline-none" 
                    />
                 </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-cyber-800 flex justify-end">
                <button onClick={handleUpdateProfile} className="bg-cyber-500 hover:bg-cyber-400 text-white px-4 py-2 rounded text-sm font-bold shadow-lg transition-all">Update Profile</button>
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
               <button 
                 onClick={handlePurge} 
                 disabled={purging}
                 className="bg-red-900/50 hover:bg-red-900 border border-red-800 text-red-200 px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2"
               >
                 {purging ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-trash-can"></i>}
                 {purging ? 'Purging Data...' : 'Purge Local Cache'}
               </button>
             </div>
           </div>
        )}
      </div>

      {/* Gateway Configuration Modal */}
      {showGatewayConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-cyber-900 border border-cyber-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-cyber-800 flex justify-between items-center bg-cyber-950/50">
              <h3 className="text-white font-bold text-lg"><i className="fa-solid fa-plug mr-2 text-cyber-400"></i>Configure Telecom Gateway</h3>
              <button onClick={() => !testing && setShowGatewayConfig(false)} className="text-slate-500 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveGateway} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Endpoint URL</label>
                <input 
                  type="text" 
                  value={gatewayForm.url}
                  onChange={e => setGatewayForm({...gatewayForm, url: e.target.value})}
                  className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-200 focus:border-cyber-500 focus:outline-none text-sm font-mono"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">API Access Key</label>
                <input 
                  type="password" 
                  autoFocus
                  value={gatewayForm.key}
                  onChange={e => setGatewayForm({...gatewayForm, key: e.target.value})}
                  className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-200 focus:border-cyber-500 focus:outline-none text-sm font-mono"
                  placeholder="Enter secured gateway token"
                />
              </div>

              <div className="bg-cyber-800/30 p-3 rounded border border-cyber-800/50 text-xs text-slate-400 flex gap-3">
                 <i className="fa-solid fa-shield-halved mt-0.5 text-cyber-500"></i>
                 <p>Credentials are stored in a local encrypted vault and never transmitted to unauthorized parties.</p>
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowGatewayConfig(false)}
                  disabled={!!testing}
                  className="flex-1 py-2 rounded bg-cyber-950 border border-cyber-800 text-slate-400 hover:bg-cyber-800 hover:text-white transition-colors text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!!testing} 
                  className="flex-1 py-2 rounded bg-cyber-500 hover:bg-cyber-400 text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all text-sm flex items-center justify-center gap-2"
                >
                  {testing === 'telecom-config' ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-link"></i>} 
                  Verify & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

interface IntegrationCardProps {
    title: string;
    description: string;
    icon: string;
    status: 'connected' | 'disconnected';
    onToggle: () => void;
    onTest: () => void;
    isTesting: boolean;
    secureLabel: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ title, description, icon, status, onToggle, onTest, isTesting, secureLabel }) => (
    <div className={`bg-cyber-900 border rounded-lg p-6 transition-colors ${status === 'connected' ? 'border-cyber-800' : 'border-cyber-800 opacity-80'}`}>
        <div className="flex items-start justify-between mb-4">
        <div>
            <h3 className="text-white font-bold text-lg flex items-center">
                <i className={`${icon} text-cyber-400 mr-2`}></i> {title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        <div className={`px-2 py-1 border rounded text-[10px] font-bold uppercase ${status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-cyber-950 border-cyber-800 text-slate-500'}`}>
            {status}
        </div>
        </div>
        
        <div className="text-sm text-slate-400 bg-cyber-950 p-3 rounded border border-cyber-800 mb-4 flex items-center">
            <i className="fa-solid fa-lock mr-2 text-cyber-400"></i>
            {secureLabel}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-cyber-800/50">
            <button 
                onClick={onToggle} 
                className={`text-xs font-bold transition-colors ${status === 'connected' ? 'text-rose-400 hover:text-rose-300' : 'text-cyber-400 hover:text-cyber-300'}`}
            >
                {status === 'connected' ? 'Disconnect Service' : 'Connect Service'}
            </button>
            
            {status === 'connected' && (
                <button 
                    onClick={onTest} 
                    disabled={isTesting}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                    {isTesting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wifi"></i>}
                    {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
            )}
        </div>
    </div>
);

export default SettingsView;