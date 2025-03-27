
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface Artifact {
  name: string;
  imageUrl: string;
  shaDigest: string;
}

interface ArtifactsTabProps {
  artifacts: Artifact[];
}

export function ArtifactsTab({ artifacts }: ArtifactsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Artifacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {artifacts.map((artifact, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{artifact.name}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="break-all">
                  <span className="font-medium">Image:</span>{' '}
                  <span className="bg-gray-100 p-1 rounded">{artifact.imageUrl}</span>
                </div>
                <div>
                  <span className="font-medium">Digest:</span>{' '}
                  <span className="bg-gray-100 p-1 rounded">{artifact.shaDigest.substring(0, 16)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
