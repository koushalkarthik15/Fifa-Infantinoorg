'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { crowdApi, RouteResponse } from '../services/crowdApi';
import { Skeleton } from '@/components/ui/loading';
import { Map, AlertCircle, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export const RouteCard: React.FC = () => {
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crowdApi.getRoute({
        origin: 'North Gate Entry',
        destination: 'Section 101 Seating',
      });
      setRoute(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-semantic-info">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <Map className="h-5 w-5 text-semantic-info" />
          AI Route Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-32 mt-6" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : route ? (
          <div className="space-y-6">
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
              <h4 className="text-body-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Crowd Context</h4>
              <p className="text-body-md italic text-night-700">&quot;{route.crowdContext}&quot;</p>
            </div>
            <div>
              <h4 className="text-body-sm font-semibold text-neutral-500 mb-3 uppercase tracking-wider">Directions</h4>
              <ul className="space-y-3">
                {route.segments.map((seg, i) => (
                  <li key={i} className="flex items-start gap-3 bg-neutral-0 p-3 rounded-md border border-neutral-100 shadow-sm">
                    <ArrowRight className="h-5 w-5 text-semantic-info shrink-0 mt-0.5" />
                    <div>
                      <span className="text-body-md font-medium text-night-900 block">{seg.instruction}</span>
                      <span className="text-body-sm text-neutral-500">{seg.distanceMeters}m</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <EmptyState 
            title="Find Optimal Route"
            description="Finding the optimal route to avoid high-density zones."
            className="border-none bg-transparent py-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchRoute} disabled={loading} variant="secondary" className="w-full">
          {loading ? 'Calculating...' : 'Get Route (North Gate to Section 101)'}
        </Button>
      </CardFooter>
    </Card>
  );
};
