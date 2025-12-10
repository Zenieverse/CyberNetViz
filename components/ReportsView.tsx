import React, { useState } from 'react';

interface Report {
  id: string;
  title: string;
  date: string;
  status: string;
  type: string;
}

const INITIAL_REPORTS: Report[] = [
  { id: 'Rpt-2023-001', title: 'Jamtara Cluster Analysis', date: '2023-10-25', status: 'Ready', type: 'Network Brief' },
  { id: 'Rpt-2023-002', title: 'High Value Mule Accounts', date: '2023-10-24', status: 'Ready', type: 'Financial Intelligence' },
  { id: 'Rpt-2023-003', title: 'SIM Swap Detection Log', date: '2023-10-23', status: 'Processing', type: 'Automated Alert' },
  { id: 'Rpt-2023-004', title: 'Deoghar Call Patterns', date: '2023-10-22', status: 'Ready', type: 'Surveillance' },
];

const ReportsView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'Network Brief' });
  const [generating, setGenerating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      const newReport: Report = {
        id: `Rpt-2023-${Math.floor(Math.random() * 1000)}`,
        title: formData.title || 'Untitled Intelligence Brief',
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        type: formData.type,
      };

      setReports(prev => [newReport, ...prev]);
      setShowModal(false);
      setGenerating(false);
      setFormData({ title: '', type: 'Network Brief' });

      // Simulate completion
      setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'Ready' } : r));
      }, 4000);
    }, 1500);
  };

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in custom-scrollbar bg-cyber-950 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Intelligence Briefs</h1>
          <p className="text-slate-400 text-sm">Generated case files and network summaries.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyber-500 hover:bg-cyber-400 text-white px-4 py-2 rounded text-sm font-bold shadow-[0_0_10px_rgba(14,165,233,0.3)] transition-all flex items-center"
        >
          <i className="fa-solid fa-plus mr-2"></i>Generate New Brief
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-cyber-900 border border-cyber-800 p-4 rounded-lg flex items-center justify-between hover:bg-cyber-800/50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-cyber-950 border border-cyber-800 flex items-center justify-center text-cyber-400 group-hover:text-cyber-300 transition-colors">
                <i className="fa-solid fa-file-pdf text-xl"></i>
              </div>
              <div>
                <h3 className="text-slate-200 font-bold text-sm group-hover:text-cyber-400 transition-colors">{report.title}</h3>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="text-slate-500 font-mono">{report.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500">{report.date}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500">{report.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold border flex items-center ${
                 report.status === 'Ready' 
                   ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                   : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
               }`}>
                 {report.status === 'Processing' ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : <i className="fa-solid fa-check mr-2"></i>}
                 {report.status}
               </span>
               <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                 <button className="w-8 h-8 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-300 flex items-center justify-center" title="View">
                   <i className="fa-solid fa-eye"></i>
                 </button>
                 <button className="w-8 h-8 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-300 flex items-center justify-center" title="Download">
                   <i className="fa-solid fa-download"></i>
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-cyber-900 border border-cyber-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-cyber-800 flex justify-between items-center bg-cyber-950/50">
              <h3 className="text-white font-bold text-lg"><i className="fa-solid fa-file-shield mr-2 text-cyber-400"></i>New Intelligence Brief</h3>
              <button onClick={() => !generating && setShowModal(false)} className="text-slate-500 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brief Title</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="e.g. Operation Blue Sky Summary"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-200 focus:border-cyber-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Report Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-cyber-950 border border-cyber-800 rounded p-2 text-slate-200 focus:border-cyber-500 focus:outline-none text-sm"
                >
                  <option>Network Brief</option>
                  <option>Financial Intelligence</option>
                  <option>Surveillance Log</option>
                  <option>Suspect Profile</option>
                  <option>Automated Alert</option>
                </select>
              </div>

              <div className="bg-cyber-800/30 p-3 rounded border border-cyber-800/50 text-xs text-slate-400 flex gap-3">
                 <i className="fa-solid fa-circle-info mt-0.5 text-cyber-500"></i>
                 <p>Generates a PDF summary combining current graph analysis, high-risk flags, and AI-driven recommendations.</p>
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  disabled={generating}
                  className="flex-1 py-2 rounded bg-cyber-950 border border-cyber-800 text-slate-400 hover:bg-cyber-800 hover:text-white transition-colors text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={generating} 
                  className="flex-1 py-2 rounded bg-cyber-500 hover:bg-cyber-400 text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all text-sm flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Generating...</>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Report</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;