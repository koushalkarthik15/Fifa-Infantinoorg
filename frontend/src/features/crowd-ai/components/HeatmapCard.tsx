'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { crowdApi, DensityNode } from '../services/crowdApi';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading';
import { Map, AlertCircle, Activity } from 'lucide-react';

export const HeatmapCard: React.FC = () => {
  const [nodes, setNodes] = useState<DensityNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await crowdApi.getHeatmap();
        setNodes(response.data?.nodes || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch heatmap data');
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  if (loading) {
    return (
      <Card variant="standard" className="border-t-4 border-t-semantic-info">
        <CardHeader>
          <CardTitle>Crowd Density Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="standard" className="border-t-4 border-t-semantic-info">
        <CardContent className="p-0">
          <EmptyState 
            title="Unable to load heatmap" 
            description={error} 
            icon={<AlertCircle />} 
            className="border-none bg-transparent"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="standard" className="border-t-4 border-t-semantic-info">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900">Crowd Density Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        {nodes.length === 0 ? (
          <EmptyState 
            title="No crowd data" 
            description="Crowd density data is currently unavailable."
            icon={<Map />}
            className="border-none bg-transparent p-6"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {nodes.map((node, index) => {
              let status: 'error' | 'warning' | 'success' = 'success';
              let statusText = 'Low Density';
              
              if (node.densityLevel > 80) {
                status = 'error';
                statusText = 'Critical Density';
              } else if (node.densityLevel > 50) {
                status = 'warning';
                statusText = 'Moderate Density';
              }

              return (
                <div key={index} className="flex justify-between items-center p-4 border border-neutral-100 rounded-lg bg-neutral-0 shadow-sm transition-colors hover:bg-neutral-50 focus-within:ring-2 focus-within:ring-focus-ring">
                  <span className="font-semibold text-body-md text-night-900">{node.zoneName}</span>
                  <StatusBadge 
                    status={status} 
                    icon={Activity}
                    label={`${node.densityLevel}% - ${statusText}`} 
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
};

export default HeatmapCard;
