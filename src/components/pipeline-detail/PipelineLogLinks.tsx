import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Server, Play, BugIcon, MessageSquare, 
  FileCode, Database, Terminal 
} from 'lucide-react';

// TODO: Add actual link functionality if needed
export const PipelineLogLinks: React.FC = () => {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <FileCode className="h-3.5 w-3.5" />
        Jenkins
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Terminal className="h-3.5 w-3.5" />
        Jenkins Console
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Server className="h-3.5 w-3.5" />
        Aetos Logs
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Database className="h-3.5 w-3.5" />
        KubeConfig
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Play className="h-3.5 w-3.5" />
        Blue Ocean
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Calendar className="h-3.5 w-3.5" />
        Stats
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Server className="h-3.5 w-3.5" />
        KubeDashboard
      </Button>
    </div>
  );
};
