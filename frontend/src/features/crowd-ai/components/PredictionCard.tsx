'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { crowdApi, PredictionResponse } from '../services/crowdApi';
import { Skeleton } from '@/components/ui/loading';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export const PredictionCard: React.FC = () => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crowdApi.getPrediction({
        currentZone: 'North Gate Entry',
        targetZone: 'Food Court A',
        timeOffsetMinutes: 15,
      });
      setPrediction(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-semantic-info">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-semantic-info" />
          AI Crowd Prediction
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
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : prediction ? (
          <div className="space-y-6">
            <div className="bg-semantic-info/5 p-4 rounded-lg border border-semantic-info/20">
              <h4 className="text-body-sm font-semibold text-semantic-info mb-1 uppercase tracking-wider">Prediction</h4>
              <p className="text-body-md text-night-800">{prediction.predictionText}</p>
            </div>
            <div>
              <h4 className="text-body-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wider">Recommended Action</h4>
              <p className="text-h4 font-display font-semibold text-semantic-info">{prediction.recommendedAction}</p>
            </div>
          </div>
        ) : (
          <EmptyState 
            title="Ready for Prediction"
            description="Request an AI prediction for your movement across the venue."
            className="border-none bg-transparent py-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchPrediction} disabled={loading} className="w-full">
          {loading ? 'Predicting...' : 'Get Prediction (North Gate to Food Court)'}
        </Button>
      </CardFooter>
    </Card>
  );
};
