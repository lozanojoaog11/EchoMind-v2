
export interface UserPreferences {
  voice: string;
}

export interface Concept {
  concept: string;

  explanation: string;
}

export interface GeneratedPosts {
  linkedinPost: string;
  twitterThread: string[];
}

export interface ResultData extends Concept {
  posts: GeneratedPosts;
}

// V4 Architecture Types
interface VoiceLexicon {
  always_use: string[];
  never_use: string[];
}

interface CreatorPersona {
  core_identity: string;
  worldview: string;
  voice_lexicon: VoiceLexicon;
}

interface StrategicGoal {
  objective: string;
  status: 'active' | 'inactive';
  target_keywords: string[];
}

interface AudienceInsights {
  resonating_themes: string[];
  preferred_format: string;
}

export interface CreatorConstitution {
  creator_persona: CreatorPersona;
  strategic_goals: StrategicGoal[];
  audience_insights: AudienceInsights;
}
