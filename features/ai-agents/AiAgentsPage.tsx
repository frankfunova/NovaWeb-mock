
import React, { useState, useEffect } from 'react';
import { AgentsToolbar } from './components/AgentsToolbar';
import { AgentsTable } from './components/AgentsTable';
import { AgentDetail } from './components/AgentDetail';
import { Flyout } from '../../components/Flyout';
import { api } from '../../services/api';
import { Agent } from '../../types';

interface AiAgentsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const DEFAULT_AGENT: Agent = {
  id: '',
  name: '',
  isActive: true,
  description: '',
  tools: [],
  agentType: 'Structured',
  modelName: 'gemini-2.5-flash',
  createdAt: '',
  updatedAt: '',
  requiredInput: []
};

export const AiAgentsPage: React.FC<AiAgentsPageProps> = ({ onNavigate }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchAgents();
        setAgents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAgentClick = (agent: Agent) => {
      setSelectedAgent(agent);
      setIsFlyoutOpen(true);
  };

  const handleCreate = () => {
      setIsCreateOpen(true);
  };

  const handleSaveNewAgent = (newAgent: Agent) => {
      // Mock save logic - normally this would call API
      const agentWithId = { 
          ...newAgent, 
          id: `new-${Date.now()}`, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
      };
      setAgents([agentWithId, ...agents]);
      setIsCreateOpen(false);
  };

  const handleViewLogs = () => {
      // Use parent navigation handler
      onNavigate('ai-agent-logs');
  };

  const handleShowRowLogs = (agent: Agent) => {
      // Use parent navigation handler with filter params
      onNavigate('ai-agent-logs', { agentId: agent.id });
  };

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading agents...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <AgentsToolbar onCreate={handleCreate} onViewLogs={handleViewLogs} />
        
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
            <AgentsTable agents={agents} onAgentClick={handleAgentClick} onShowLogs={handleShowRowLogs} />
            
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                <span className="text-slate-500">Showing {agents.length} agents</span>
            </div>
        </div>

        {/* View/Edit Agent Flyout */}
        <Flyout
            isOpen={isFlyoutOpen}
            onClose={() => setIsFlyoutOpen(false)}
            title="Agent Details"
            side="right"
            size="lg"
            noPadding={true}
        >
            {selectedAgent && <AgentDetail agent={selectedAgent} />}
        </Flyout>

        {/* Create Agent Flyout */}
        <Flyout
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            title="New Agent"
            side="right"
            size="lg"
            noPadding={true}
            hideDefaultActions={true}
        >
            {isCreateOpen && (
                <AgentDetail 
                    agent={DEFAULT_AGENT} 
                    isNew={true} 
                    onSave={handleSaveNewAgent} 
                    onCancel={() => setIsCreateOpen(false)} 
                />
            )}
        </Flyout>
    </div>
  );
};
