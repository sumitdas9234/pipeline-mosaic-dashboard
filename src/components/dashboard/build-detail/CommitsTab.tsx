
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GitCommit, GitBranch, ExternalLink } from 'lucide-react';

interface CommitDetail {
  commitId: string;
  repositoryUrl: string;
  branch: string;
  author: string;
}

interface CommitsTabProps {
  commitDetails: CommitDetail[];
}

export function CommitsTab({ commitDetails }: CommitsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Commit Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {commitDetails.map((commit, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{commit.commitId.substring(0, 8)}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span>{commit.branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Repository:</span>
                  <a 
                    href={commit.repositoryUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-crystal-primary hover:underline flex items-center gap-1"
                  >
                    {commit.repositoryUrl.split('/').pop()}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>Author:</span>
                  <span>{commit.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
