'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { navigationApi, TransportationResponse } from '../services/navigationApi';
import { TrainFront, AlertCircle, Info, LocateFixed } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export const TransportationCard: React.FC = () => {
  const [origin, setOrigin] = useState('Downtown Hotel');
  const [destination, setDestination] = useState('Stadium North Gate');
  const [context, setContext] = useState('I have young children with me.');
  const [recommendation, setRecommendation] = useState<TransportationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      () => {
        setError('Unable to retrieve your location');
      }
    );
  };

  const fetchRecommendation = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);
    try {
      const response = await navigationApi.getTransportation({
        origin,
        destination,
        context,
      });
      setRecommendation(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch options');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-semantic-success">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <TrainFront className="h-5 w-5 text-semantic-success" />
          Transportation Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full flex">
              <Input 
                placeholder="Origin" 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full rounded-r-none"
                aria-label="Origin"
              />
              <Button 
                type="button" 
                variant="secondary" 
                className="rounded-l-none px-3" 
                onClick={requestLocation}
                title="Use current location"
              >
                <LocateFixed className="h-4 w-4" />
              </Button>
            </div>
            <Input 
              placeholder="Destination" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full"
              aria-label="Destination"
            />
          </div>
          <Input 
            placeholder="Context (e.g. I have young children)" 
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full"
            aria-label="Context"
          />
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-24 mt-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : recommendation ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-body-sm font-semibold text-neutral-600 uppercase tracking-wider mb-2">Recommended Mode</h4>
              <div className="bg-semantic-success/10 border border-semantic-success/20 rounded-lg p-4 flex items-center gap-3">
                <TrainFront className="h-6 w-6 text-semantic-success" />
                <p className="text-h4 font-display font-bold text-semantic-success">{recommendation.recommended_mode}</p>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
              <h4 className="text-body-sm font-semibold text-neutral-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Info className="h-4 w-4" /> Why?
              </h4>
              <p className="text-body-md text-night-800 leading-relaxed">{recommendation.explanation}</p>
            </div>
          </div>
        ) : (
          <EmptyState 
            title="Transit Advice"
            description="Get personalized transit recommendations based on your needs."
            className="border-none bg-transparent py-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchRecommendation} disabled={loading || !origin || !destination} variant="secondary" className="w-full">
          {loading ? 'Analyzing...' : 'Get Transit Advice'}
        </Button>
      </CardFooter>
    </Card>
  )
};

export default TransportationCard;
