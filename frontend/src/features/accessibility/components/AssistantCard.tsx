'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { accessibilityApi, AssistantResponse } from '../services/accessibilityApi';
import { Mic, Send, Sparkles, User, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';

export const AssistantCard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResponse = async (textToFetch: string) => {
    if (!textToFetch.trim()) return;
    setSubmittedQuery(textToFetch);
    setQuery('');
    setLoading(true);
    setError(null);
    try {
      const res = await accessibilityApi.getAssistantResponse({ query: textToFetch });
      setResponse(res.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-purple-600">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Ambient AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 mb-4 text-body-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex space-x-2 mb-6">
          <Input 
            placeholder="How can I help you today?" 
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && fetchResponse(query)}
            className="flex-1"
          />
          <Button onClick={() => fetchResponse(query)} disabled={loading || !query} className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white border-none" aria-label="Send query">
            <Send className="w-4 h-4" />
          </Button>
          <Button variant="secondary" aria-label="Use voice input (mocked)" className="shrink-0">
            <Mic className="w-4 h-4 text-purple-600" />
          </Button>
        </div>

        {(submittedQuery || loading || response) && (
          <div className="space-y-4 border-t border-neutral-100 pt-4">
            {submittedQuery && (
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-neutral-100 px-4 py-2 rounded-2xl rounded-tr-sm text-body-sm text-night-900 max-w-[85%]">
                  {submittedQuery}
                </div>
                <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-neutral-500" />
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-2 flex-1 max-w-[85%] bg-purple-50/50 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            )}

            {!loading && response && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-3 flex-1 bg-purple-50/50 border border-purple-100/50 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <p className="text-body-md text-night-900">{response.response}</p>
                  
                  {response.suggested_actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-100/50">
                      {response.suggested_actions.map((action, idx) => (
                        <button key={idx} className="px-3 py-1.5 bg-neutral-0 border border-purple-200 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors">
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
