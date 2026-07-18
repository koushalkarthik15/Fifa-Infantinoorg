'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { navigationApi, TransportationResponse } from '../services/navigationApi';
import { TrainFront, AlertCircle, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export const TransportationCard: React.FC = () => {
  const [recommendation, setRecommendation] = useState<TransportationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await navigationApi.getTransportation({
        origin: 'Downtown Hotel',
        destination: 'Stadium North Gate',
        context: 'I have young children with me.',
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
                <p className="text-h4 font-display font-bold text-semantic-success">{recommendation.recommendedMode}</p>
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
        <Button onClick={fetchRecommendation} disabled={loading} variant="secondary" className="w-full">
          {loading ? 'Analyzing...' : 'Get Transit Advice'}
        </Button>
      </CardFooter>
    </Card>
  )
};

export default TransportationCard;
