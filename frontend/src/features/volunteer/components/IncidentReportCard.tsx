'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { volunteerApi, IncidentResponse } from '../services/volunteerApi';
import { AlertTriangle, UserCheck, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading';

export const IncidentReportCard: React.FC = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Section 102');
  const [result, setResult] = useState<IncidentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await volunteerApi.reportIncident({ description, location });
      setResult(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit incident');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityVariant = (priority: string): 'error' | 'warning' | 'info' | 'neutral' => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-night-700">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-night-700" />
          Report an Incident
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="Where are you? (e.g. Section 102)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full sm:w-1/3"
              aria-label="Location"
            />
            <Input 
              placeholder="Describe what happened..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitReport()}
              className="w-full sm:w-2/3"
              aria-label="Incident Description"
            />
          </div>

          <Button onClick={submitReport} disabled={loading || !description} className="w-full bg-night-700 hover:bg-night-800 text-neutral-0">
            {loading ? 'AI Analyzing Report...' : 'Submit Report'}
          </Button>

          {loading && (
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 mt-6 space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Category</h4>
                  <span className="text-h4 font-display font-semibold text-night-900">{result.category}</span>
                </div>
                <Badge variant={getPriorityVariant(result.priority)} className="uppercase tracking-wider text-xs">
                  {result.priority} Priority
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-0 p-3 rounded-md border border-neutral-200 shadow-sm flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">Assigned Responder</h4>
                    <p className="text-body-md font-semibold text-night-900">{result.assigned_volunteer}</p>
                  </div>
                </div>
                
                <div className="bg-neutral-0 p-3 rounded-md border border-neutral-200 shadow-sm flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">Status</h4>
                    <p className="text-body-md font-semibold text-night-900">Dispatched</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Suggested Immediate Actions</h4>
                <ul className="space-y-2">
                  {result.suggested_actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-neutral-0 p-2.5 rounded border border-neutral-100 shadow-sm">
                      <ChevronRight className="w-4 h-4 text-night-400 shrink-0 mt-0.5" />
                      <span className="text-body-sm text-night-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
