'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { accessibilityApi, VisionResponse } from '../services/accessibilityApi';
import { Upload, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';

export const VisionCard: React.FC = () => {
  const [result, setResult] = useState<VisionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const response = await accessibilityApi.analyzeVision(file);
      setResult(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-purple-600">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Vision Assistance
          </div>
          <Badge variant="neutral">Upcoming</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          disabled={true}
          aria-label="Upload an image for analysis"
        />

        {loading ? (
          <div className="space-y-6">
            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
              <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Image Description</h4>
              <p className="text-body-md text-night-900 leading-relaxed">{result.description}</p>
            </div>
            
            {result.obstacles_identified.length > 0 ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="text-body-sm font-semibold text-red-700 flex items-center gap-1.5 uppercase tracking-wider mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  Potential Obstacles
                </h4>
                <ul className="space-y-2">
                  {result.obstacles_identified.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-red-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      {obs}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-body-sm text-emerald-800 font-medium">No immediate obstacles identified.</p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState 
            title="Image Analysis"
            description="Upload an image of your surroundings for an AI description of entrances, signs, and obstacles."
            className="border-none bg-transparent py-4"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => {}} 
          disabled={true} 
          variant="secondary" 
          className="w-full text-purple-700 hover:bg-purple-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Coming Soon
        </Button>
      </CardFooter>
    </Card>
  );
};
