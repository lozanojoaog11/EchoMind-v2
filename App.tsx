
import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { UserPreferences, ResultData, Concept, CreatorConstitution } from './types';
import { extractConcepts, generatePostsForConceptV4 } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { LoadingState } from './components/LoadingState';

// A sample CreatorConstitution, representing the user's strategic foundation.
// In a full application, this would be editable and persisted per-user.
const creatorConstitution: CreatorConstitution = {
  creator_persona: {
    core_identity: "O Estrategista Pragmático que desmistifica negócios complexos com analogias de engenharia.",
    worldview: "Sistemas, não metas, produzem resultados duradouros.",
    voice_lexicon: {
      always_use: ["primeiros princípios", "atrito", "vetor", "alavancagem"],
      never_use: ["mágica", "fórmula secreta", "atalho", "game-changer"],
    },
  },
  strategic_goals: [
    {
      objective: "Gerar 20 leads qualificados para sua consultoria de otimização de processos.",
      status: 'active',
      target_keywords: ["eficiência operacional", "sistemas de negócio", "escalabilidade"],
    },
     {
      objective: "Aumentar inscrições na newsletter em 15%.",
      status: 'inactive',
      target_keywords: ["insights semanais", "estratégia de negócio", "newsletter"],
    }
  ],
  audience_insights: {
    resonating_themes: ["eliminação de desperdício", "automação inteligente"],
    preferred_format: "passos claros ou frameworks",
  },
};


const App: React.FC = () => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('echomind_user_prefs', {
    voice: 'Direto, analítico, técnico',
  });
  const [lastRun, setLastRun] = useLocalStorage<ResultData[]>('echomind_last_run', []);

  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAmplify = useCallback(async () => {
    if (!content.trim() || !preferences.voice.trim()) {
      setError('Please fill in all fields: content and voice.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastRun([]);

    try {
      setLoadingMessage('EchoMind is thinking... Analyzing key concepts...');
      const concepts: Concept[] = await extractConcepts(content);
      
      if (!concepts || concepts.length === 0) {
        throw new Error("Could not extract any concepts from the text. Please try refining your input.");
      }

      setLoadingMessage(`Found ${concepts.length} concepts. Tuning your voice...`);
      
      const results: ResultData[] = await Promise.all(
        concepts.map(async (concept, index) => {
           setLoadingMessage(`Generating posts for concept ${index + 1} of ${concepts.length}...`);
          const posts = await generatePostsForConceptV4(concept, creatorConstitution, preferences.voice);
          return { ...concept, posts };
        })
      );
      
      setLastRun(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [content, preferences, setLastRun]);
  
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-text-primary mb-2">EchoMind</h1>
            <p className="text-lg text-brand-text-secondary">Transform one idea into a content campaign.</p>
            <p className="text-md text-brand-text-secondary">Paste your content. Define your voice. Amplify your message.</p>
        </header>

        <InputSection
          content={content}
          setContent={setContent}
          preferences={preferences}
          setPreferences={setPreferences}
          onSubmit={handleAmplify}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && <LoadingState message={loadingMessage} />}
        
        {!isLoading && lastRun.length > 0 && <ResultsSection results={lastRun} />}
        
      </main>
    </div>
  );
};

export default App;
