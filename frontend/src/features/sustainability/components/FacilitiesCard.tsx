'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sustainabilityApi, FacilityResponse } from '../services/sustainabilityApi';
import { Droplets, Recycle, Search, AlertCircle, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export const FacilitiesCard: React.FC = () => {
  const [location, setLocation] = useState('Section 102');
  const [result, setResult] = useState<FacilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findFacilities = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const response = await sustainabilityApi.getFacilities({ location });
      setResult(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to find facilities');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-emerald-600">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-600" />
          Find Eco-Facilities
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
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input 
                placeholder="Your Location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && findFacilities()}
                className="pl-9 w-full"
                aria-label="Your Location"
              />
            </div>
            <Button 
              onClick={findFacilities} 
              disabled={loading || !location} 
              className="shrink-0 sm:w-auto w-full"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-body-sm font-semibold text-blue-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Water Stations
                </h4>
                <ul className="space-y-2">
                  {result.water_stations.map((station, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-blue-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      {station}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h4 className="text-body-sm font-semibold text-emerald-800 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <Recycle className="w-4 h-4 text-emerald-600" />
                  Recycling Points
                </h4>
                <ul className="space-y-2">
                  {result.recycling_bins.map((bin, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-emerald-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      {bin}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <EmptyState 
              title="Eco-Facilities"
              description="Find nearby water refill stations and recycling points."
              className="border-none bg-transparent py-4"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
};

export default FacilitiesCard;
