
import React, { useState, useEffect } from 'react';
import { AgentLogToolbar } from './components/AgentLogToolbar';
import { AgentLogTable } from './components/AgentLogTable';
import { AgentLogDetail } from './components/AgentLogDetail';
import { Flyout } from '../../components/Flyout';
import { api } from '../../services/api';
import { AgentLog } from '../../types';

export const AiAgentLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AgentLog | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle query params for initial filter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agentIdFilter = params.get('agentId');

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchAgentLogs(agentIdFilter ? { agentId: agentIdFilter } : undefined);
        setLogs(data);
        setFilteredLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
      if (!searchQuery.trim()) {
          setFilteredLogs(logs);
      } else {
          const q = searchQuery.toLowerCase();
          setFilteredLogs(logs.filter(log => 
              log.toolName.toLowerCase().includes(q) || 
              log.status.toLowerCase().includes(q) ||
              (log.userName && log.userName.toLowerCase().includes(q))
          ));
      }
  }, [searchQuery, logs]);

  const handleLogClick = (log: AgentLog) => {
      setSelectedLog(log);
      setIsFlyoutOpen(true);
  };

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading execution logs...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <AgentLogToolbar onSearch={setSearchQuery} />
        
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <AgentLogTable logs={filteredLogs} onLogClick={handleLogClick} />
            
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                <span className="text-slate-500">Showing {filteredLogs.length} logs</span>
            </div>
        </div>

        <Flyout
            isOpen={isFlyoutOpen}
            onClose={() => setIsFlyoutOpen(false)}
            title="Execution Log Detail"
            side="right"
            size="xl"
            noPadding={true}
        >
            {selectedLog && <AgentLogDetail log={selectedLog} />}
        </Flyout>
    </div>
  );
};
