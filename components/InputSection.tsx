
import React from 'react';
import type { UserPreferences } from '../types';

interface InputSectionProps {
  content: string;
  setContent: (value: string) => void;
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  content,
  setContent,
  preferences,
  setPreferences,
  onSubmit,
  isLoading,
}) => {
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="main-content" className="block text-sm font-medium text-brand-text-secondary mb-2">
          Your Article or Transcript
        </label>
        <textarea
          id="main-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your long-form content here..."
          className="w-full h-48 p-4 bg-brand-surface border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-200 resize-y text-brand-text-primary placeholder:text-slate-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="voice" className="block text-sm font-medium text-brand-text-secondary mb-2">
          Your Voice (3 adjectives)
        </label>
        <input
          type="text"
          id="voice"
          name="voice"
          value={preferences.voice}
          onChange={handlePreferenceChange}
          placeholder="e.g., Direct, witty, technical"
          className="w-full p-3 bg-brand-surface border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-200 text-brand-text-primary placeholder:text-slate-500"
          required
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-brand-accent text-slate-900 font-bold rounded-lg shadow-lg hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-accent transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed active:transform active:scale-[0.98]"
        >
          {isLoading ? 'Amplifying...' : 'Amplify My Mind'}
        </button>
      </div>
    </form>
  );
};
