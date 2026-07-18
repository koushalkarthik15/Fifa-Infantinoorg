'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sustainabilityApi, GreenRouteResponse } from '../services/sustainabilityApi';
import { Leaf, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { MetricCard } from '@/components/ui/metric-card';

export const GreenTransportationCard: React.FC = () => {
  const [origin, setOrigin] = useState('Gate A');
  const [destination, setDestination] = useState('Section 102');
  const [result, setResult] = useState<GreenRouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);
    try {
      const response = await sustainabilityApi.getGreenRoute({ origin, destination });
      setResult(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to calculate green route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-emerald-600">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          Eco-Friendly Routing
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="Origin" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full"
              aria-label="Origin"
            />
            <Input 
              placeholder="Destination" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full"
              aria-label="Destination"
            />
          </div>

          {loading ? (
            <div className="space-y-6 mt-4">
              <Skeleton className="h-[120px] w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 mt-6">
              <MetricCard 
                label="Eco Score" 
                value={result.eco_score.toString()} 
                trend={{ value: result.recommendation, direction: 'up' }}
                icon={Leaf}
              />

              <div>
                <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Walking / Transit Directions
                </h4>
                <ul className="space-y-3">
                  {result.segments.map((seg, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-neutral-0 p-3 rounded-md border border-neutral-100 shadow-sm">
                      <ArrowRight className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                      <div>
                        <span className="text-body-md font-medium text-night-900 block">{seg.instruction}</span>
                        <span className="text-body-sm text-neutral-500">{seg.distance_meters}m</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <EmptyState 
              title="Green Routing"
              description="Calculate the most eco-friendly route to your destination."
              className="border-none bg-transparent py-4"
            />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={calculateRoute} 
          disabled={loading || !origin || !destination} 
          className="w-full"
        >
          {loading ? 'Calculating Impact...' : 'Find Green Route'}
        </Button>
      </CardFooter>
    </Card>
  )
};

export default GreenTransportationCard;
