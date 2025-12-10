import React, { useState, useRef } from 'react';

interface FileItem {
  id: string;
  name: string;
  size: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  progress: number;
}

const IngestionView: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Deoghar_CDR_Dump_Oct.csv', size: '45 MB', status: 'Completed', progress: 100 },
    { id: '2', name: 'SBI_Mule_Accounts.xlsx', size: '2.1 MB', status: 'Processing', progress: 65 },
    { id: '3', name: 'Jamtara_Tower_Logs.csv', size: '120 MB', status: 'Pending', progress: 0 },
  ]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0]; // Handle single file for simplicity
      const newFileItem: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        size: formatSize(file.size),
        status: 'Pending',
        progress: 0
      };

      setFiles(prev => [newFileItem, ...prev]);

      // Simulate upload
      setTimeout(() => simulateUpload(newFileItem.id), 500);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const simulateUpload = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'Processing' } : f));

    const interval = setInterval(() => {
      setFiles(prev => {
        const file = prev.find(f => f.id === id);
        if (!file) {
          clearInterval(interval);
          return prev;
        }

        const newProgress = file.progress + Math.floor(Math.random() * 15) + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return prev.map(f => f.id === id ? { ...f, status: 'Completed', progress: 100 } : f);
        }
        
        return prev.map(f => f.id === id ? { ...f, progress: newProgress } : f);
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Completed': return 'text-emerald-400';
          case 'Processing': return 'text-cyber-400';
          case 'Failed': return 'text-rose-400';
          default: return 'text-slate-500';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'Completed': return 'fa-check-circle';
          case 'Processing': return 'fa-spinner fa-spin';
          case 'Failed': return 'fa-circle-exclamation';
          default: return 'fa-clock';
      }
  };

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in custom-scrollbar bg-cyber-950">
      <h1 className="text-2xl font-bold text-white mb-2">Data Ingestion</h1>
      <p className="text-slate-400 text-sm mb-6">Upload raw datasets (CDR, Bank Statements, Device Logs) for processing.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".csv,.xlsx,.json,.txt"
        />
        <div 
            onClick={handleUploadClick}
            className="bg-cyber-900/50 border-2 border-dashed border-cyber-700 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-cyber-900 hover:border-cyber-500 transition-all cursor-pointer group"
        >
          <div className="w-20 h-20 rounded-full bg-cyber-950 border border-cyber-800 flex items-center justify-center mb-4 text-cyber-500 group-hover:text-cyber-400 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
            <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Upload Data Files</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-xs">Drag & drop files here or click to browse from your local secure drive.</p>
          <div className="flex gap-2">
             <span className="px-2 py-1 rounded bg-cyber-950 border border-cyber-800 text-[10px] text-slate-400 font-mono">.CSV</span>
             <span className="px-2 py-1 rounded bg-cyber-950 border border-cyber-800 text-[10px] text-slate-400 font-mono">.XLSX</span>
             <span className="px-2 py-1 rounded bg-cyber-950 border border-cyber-800 text-[10px] text-slate-400 font-mono">.JSON</span>
             <span className="px-2 py-1 rounded bg-cyber-950 border border-cyber-800 text-[10px] text-slate-400 font-mono">Max 500MB</span>
          </div>
        </div>

        {/* Status List */}
        <div className="bg-cyber-900 border border-cyber-800 rounded-lg p-5 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="text-white font-bold text-sm">Processing Queue</h3>
            <button className="text-xs text-cyber-400 hover:text-white" onClick={() => {}}><i className="fa-solid fa-rotate mr-1"></i> Refresh</button>
          </div>
          
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {files.map((file) => (
              <div key={file.id} className="p-3 bg-cyber-950 rounded border border-cyber-800 hover:border-cyber-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-cyber-900 text-slate-500">
                        <i className={`fa-solid ${file.name.endsWith('xlsx') ? 'fa-file-excel' : 'fa-file-csv'}`}></i>
                    </div>
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{file.name}</div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{file.size}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-bold ${getStatusColor(file.status)}`}>
                    <i className={`fa-solid ${getStatusIcon(file.status)}`}></i>
                    <span>{file.status}</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-cyber-900 h-1 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${file.status === 'Completed' ? 'bg-emerald-500' : file.status === 'Failed' ? 'bg-rose-500' : 'bg-cyber-500'}`} 
                        style={{ width: `${file.progress}%`, transition: 'width 0.5s ease-out' }}
                    ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-cyber-800 flex-shrink-0">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Recent Integrations</h4>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <i className="fa-brands fa-google text-slate-300"></i> Google Earth
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <i className="fa-solid fa-tower-cell text-slate-300"></i> Telecom API
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngestionView;