
import React from 'react';
import type { ResultData } from '../types';
import { CopyButton } from './CopyButton';

interface ResultCardProps {
  result: ResultData;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const twitterThreadText = result.posts.twitterThread.join('\n\n');

  return (
    <div className="bg-brand-surface border border-slate-700 rounded-lg shadow-xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-brand-accent">{result.concept}</h3>
        <p className="text-sm text-brand-text-secondary mt-1">{result.explanation}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-700">
        <div className="bg-brand-surface p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg text-brand-text-primary">LinkedIn</h4>
            <CopyButton textToCopy={result.posts.linkedinPost} />
          </div>
          <p className="text-brand-text-secondary whitespace-pre-wrap text-sm leading-relaxed">{result.posts.linkedinPost}</p>
        </div>
        
        <div className="bg-brand-surface p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg text-brand-text-primary">X / Twitter Thread</h4>
            <CopyButton textToCopy={twitterThreadText} />
          </div>
          <div className="text-brand-text-secondary whitespace-pre-wrap text-sm leading-relaxed space-y-4">
            {result.posts.twitterThread.map((tweet, i) => (
              <p key={i}>{tweet}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
