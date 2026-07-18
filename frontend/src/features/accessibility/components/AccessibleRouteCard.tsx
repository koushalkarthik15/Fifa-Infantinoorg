'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { accessibilityApi, AccessibleRouteResponse } from '../services/accessibilityApi';
import { Badge } from '@/components/ui/badge';
import { Map, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export const AccessibleRouteCard: React.FC = () => {
  const [route, setRoute] = useState<AccessibleRouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accessibilityApi.getAccessibleRoute({
        origin: 'Main Concourse',
        destination: 'Section 101',
        needsWheelchair: true,
      });
      setRoute(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate accessible route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-purple-600">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <Map className="h-5 w-5 text-purple-600" />
          Accessible Navigation
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
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : route ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h4 className="text-body-md font-semibold text-night-900">To: {route.destination}</h4>
              <Badge variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Step-free</Badge>
            </div>
            
            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
              <h4 className="text-body-sm font-semibold text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Accessibility Context
              </h4>
              <p className="text-body-md text-night-800 leading-relaxed">{route.accessibility_context}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider">Directions</h4>
                <span className="text-body-sm font-bold text-purple-700">{Math.round(route.total_duration_seconds / 60)} min</span>
              </div>
              <ul className="space-y-3">
                {route.segments.map((seg, i) => (
                  <li key={i} className="flex items-start gap-3 bg-neutral-0 p-3 rounded-md border border-neutral-100 shadow-sm">
                    <ArrowRight className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
                    <span className="text-body-md text-night-900">{seg.instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <EmptyState 
            title="Step-Free Routing"
            description="Request a wheelchair-friendly route avoiding stairs and obstacles."
            className="border-none bg-transparent py-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchRoute} disabled={loading} variant="secondary" className="w-full text-purple-700 hover:bg-purple-50">
          {loading ? 'Routing...' : 'Get Accessible Route'}
        </Button>
      </CardFooter>
    </Card>
  );
};
