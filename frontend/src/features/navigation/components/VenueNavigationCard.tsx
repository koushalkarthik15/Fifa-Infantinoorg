'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { navigationApi, VenueNavigationResponse } from '../services/navigationApi';
import { MapPin, AlertCircle, Navigation, LocateFixed } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export const VenueNavigationCard: React.FC = () => {
  const [origin, setOrigin] = useState('Section 101');
  const [destinationCategory, setDestinationCategory] = useState('Food Court');
  const [route, setRoute] = useState<VenueNavigationResponse | null>(null);
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

  const fetchRoute = async () => {
    if (!origin || !destinationCategory) return;
    setLoading(true);
    setError(null);
    try {
      const response = await navigationApi.getVenueRoute({
        origin,
        destination_category: destinationCategory,
      });
      setRoute(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venue directions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-semantic-success">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-semantic-success" />
          Venue Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative w-full flex">
            <Input 
              placeholder="Your Location" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full rounded-r-none"
              aria-label="Your Location"
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
            placeholder="Destination (e.g. Food Court)" 
            value={destinationCategory}
            onChange={(e) => setDestinationCategory(e.target.value)}
            className="w-full"
            aria-label="Destination"
          />
        </div>
        
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-10 w-20 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        ) : route ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h4 className="text-body-sm font-semibold text-neutral-600 uppercase tracking-wider mb-1">Destination Found</h4>
                <p className="text-h4 font-display font-semibold text-night-900">{route.destination}</p>
              </div>
              <div className="bg-semantic-success/10 text-semantic-success px-4 py-2 rounded-full font-bold">
                {Math.round(route.total_duration_seconds / 60)} min
              </div>
            </div>
            
            <div>
              <h4 className="text-body-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">Directions</h4>
              <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-neutral-200">
                {route.segments.map((seg, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-semantic-success bg-neutral-0 z-10" />
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 shadow-sm flex items-start justify-between gap-4">
                      <span className="text-body-md text-night-900">{seg.instruction}</span>
                      <span className="text-body-sm font-medium text-neutral-600 whitespace-nowrap">{seg.distance_meters}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState 
            title="Navigate the Venue"
            description="Find the quickest path to concessions, medical, and restrooms."
            icon={<Navigation />}
            className="border-none bg-transparent py-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchRoute} disabled={loading || !origin || !destinationCategory} className="w-full">
          {loading ? 'Routing...' : 'Find Destination'}
        </Button>
      </CardFooter>
    </Card>
  )
};

export default VenueNavigationCard;
