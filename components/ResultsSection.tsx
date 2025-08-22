
import React from 'react';
import type { ResultData } from '../types';
import { ResultCard } from './ResultCard';

interface ResultsSectionProps {
  results: ResultData[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">Your Amplified Content</h2>
      <div className="space-y-8">
        {results.map((result, index) => (
          <div key={index} style={{ animationDelay: `${index * 100}ms` }} className="opacity-0 animate-fade-in-up">
             <ResultCard result={result} />
          </div>
        ))}
      </div>
    </section>
  );
};
