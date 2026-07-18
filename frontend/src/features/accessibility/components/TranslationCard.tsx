'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { accessibilityApi, TranslationResponse } from '../services/accessibilityApi';
import { Languages, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export const TranslationCard: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslation = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await accessibilityApi.translateText({ text, targetLanguage: language });
      setResult(response.data!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to translate message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="standard" className="border-t-4 border-t-purple-600">
      <CardHeader>
        <CardTitle className="text-h4 text-night-900 flex items-center gap-2">
          <Languages className="w-5 h-5 text-purple-600" />
          Live Translation
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
            <div className="shrink-0">
              <select 
                className="w-full sm:w-auto border border-neutral-200 bg-neutral-0 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-night-900"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Target language"
              >
                <option value="Spanish">To Spanish</option>
                <option value="French">To French</option>
                <option value="English">To English</option>
              </select>
            </div>
            
            <Input 
              placeholder="Text to translate..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTranslation()}
              className="flex-1"
            />
          </div>

          <div className="min-h-[100px] border border-neutral-100 rounded-lg p-4 bg-neutral-50 flex items-center justify-center">
            {loading ? (
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : result ? (
              <div className="w-full">
                <p className="text-body-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Translation</p>
                <p className="text-h4 font-display text-night-900">{result.translated_text}</p>
              </div>
            ) : (
              <EmptyState 
                title="Translation Output"
                description="Your translated text will appear here."
                className="border-none bg-transparent py-2"
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={fetchTranslation} disabled={loading || !text} className="w-full">
          {loading ? 'Translating...' : 'Translate'}
        </Button>
      </CardFooter>
    </Card>
  );
};
