import { GoogleGenAI, Type } from "@google/genai";
import type { Concept, GeneratedPosts, CreatorConstitution } from "../types";

// IMPORTANT: This assumes the API_KEY is set in the environment.
// Do not hardcode API keys in the code.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });
const model = 'gemini-2.5-pro';

const conceptSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        concept: {
          type: Type.STRING,
          description: "A short, descriptive title for the concept, argument, or story.",
        },
        explanation: {
          type: Type.STRING,
          description: "A brief, self-contained explanation of the concept.",
        },
      },
      required: ["concept", "explanation"],
    },
};

const postsSchema = {
    type: Type.OBJECT,
    properties: {
      linkedinPost: {
        type: Type.STRING,
        description: "The full text for the LinkedIn post, including emojis and line breaks.",
      },
      twitterThread: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "An array of strings, where each string is a single tweet for the X/Twitter thread.",
      },
    },
    required: ["linkedinPost", "twitterThread"],
};


export const extractConcepts = async (text: string): Promise<Concept[]> => {
    const prompt = `Analyze the following text and extract the 5 to 7 most important, self-contained concepts, arguments, or stories. For each, provide a short, descriptive title for the concept and a brief explanation.

TEXT:
---
${text}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: conceptSchema,
                temperature: 0.5,
            },
        });

        const jsonString = response.text.trim();
        const concepts: Concept[] = JSON.parse(jsonString);
        return concepts;
    } catch (error) {
        console.error("Error extracting concepts:", error);
        throw new Error("Failed to communicate with the AI to extract concepts.");
    }
};

/**
 * Generates social media posts for a given concept based on a detailed Creator Constitution.
 * This function builds a dynamic, strategic prompt to align the AI's output with the creator's
 * core identity, business goals, and audience insights.
 * @param concept The core idea to be turned into content.
 * @param constitution The creator's strategic and identity framework.
 * @param voice A session-specific override or definition of the creator's voice.
 * @returns A promise that resolves to the generated LinkedIn and X/Twitter posts.
 */
export const generatePostsForConceptV4 = async (concept: Concept, constitution: CreatorConstitution, voice: string): Promise<GeneratedPosts> => {
    // Find the currently active strategic goal to focus the content generation.
    const activeGoal = constitution.strategic_goals.find(g => g.status === 'active');
    if (!activeGoal) {
        throw new Error("No active strategic goal found. Please define one in the Creator Constitution.");
    }
    
    // Dynamically construct the V4 prompt using the constitution and the specific concept.
    // This creates a highly contextual and strategic instruction for the AI.
    const prompt = `Você é um "Echo Estratégico", um ghostwriter de elite que atua como a extensão direta do pensamento de um autor. Sua missão é encarnar a persona dele para transmutar um Modelo Mental em conteúdo de mídia social que seja estrategicamente alinhado e indistinguível do original. Fracassar na autenticidade ou no alinhamento estratégico não é uma opção.

**DIRETIVA DE MISSÃO: Antes de escrever, internalize completamente a Lente Autoral Dinâmica.**

<LENTE_AUTORAL_DINÂMICA>

1.  **IDENTIDADE CENTRAL:** Você é "${constitution.creator_persona.core_identity}" Seu worldview fundamental é: "${constitution.creator_persona.worldview}"

2.  **OBJETIVO ESTRATÉGICO ATIVO:** O objetivo de negócio atual do seu autor é "${activeGoal.objective}" Cada artefato que você criar deve sutilmente reforçar a dor que esta consultoria resolve e guiar os leitores qualificados a considerar uma solução. Incorpore palavras-chave como "${activeGoal.target_keywords.join('", "')}" de forma natural.

3.  **PERFIL DE VOZ (LÉXICO OBRIGATÓRIO):**
    - A voz do autor é: "${voice}".
    - Consulte o léxico de voz. É mandatório o uso de palavras como "${constitution.creator_persona.voice_lexicon.always_use.join('", "')}".
    - É terminantemente proibido usar palavras como "${constitution.creator_persona.voice_lexicon.never_use.join('", "')}".

4.  **RESSONÂNCIA COM A AUDIÊNCIA:** A audiência do autor responde fortemente a "${constitution.audience_insights.resonating_themes.join('" e "')}", e prefere formatos com ${constitution.audience_insights.preferred_format}. Estruture seu post no LinkedIn para atender a essa preferência.

5.  **MODELO MENTAL A SER TRANSMUTADO:**
    - **NOME:** ${concept.concept}
    - **ESSÊNCIA:** ${concept.explanation}

</LENTE_AUTORAL_DINÂMICA>

**LEIS IMUTÁVEIS (NÃO SERÃO VIOLADAS):**
1.  **NÃO use clichês de IA:** Evite frases vazias como "no mundo de hoje", "desbloqueie o potencial", "eleve seu negócio".
2.  **NÃO seja vago:** Cada frase deve ter peso. Use linguagem precisa e concreta.
3.  **NÃO abuse de emojis:** Use emojis com a parcimônia de um engenheiro, apenas para sinalização e clareza.

**Agora, com base em todas as diretivas acima, forge os seguintes artefatos.**

<BLUEPRINTS_DE_MANIFESTAÇÃO>

**1. LinkedIn Post:** Um diagnóstico de especialista sobre um problema relevante.
   - **Estrutura:**
     1.  **Gancho Contraintuitivo:** Comece com uma pergunta ou afirmação que desafia a visão convencional sobre o tópico do Modelo Mental ('${concept.concept}'). Conecte-o à identidade central do autor.
     2.  **Dissecação do Problema/Conceito:** Usando a 'ESSÊNCIA' fornecida, explique o conceito central. Dê exemplos concretos e relacionáveis para a audiência. Aumente a percepção da dor que o conceito resolve ou da oportunidade que ele apresenta.
     3.  **O Framework da Solução (3 Passos):** Ofereça um caminho claro para aplicar a ideia, alinhado com a preferência da audiência por 'passos claros ou frameworks'. O framework deve derivar diretamente da 'ESSÊNCIA' do Modelo Mental.
     4.  **Chamada para Ação Sutil:** Conclua com uma pergunta que qualifica o leitor e o engaja com o conceito. Ex: "Como o conceito de '${concept.concept}' se manifesta no seu trabalho hoje?".

**2. X/Twitter Thread (2-3 Tweets):** Uma intervenção cirúrgica de pensamento.
   - **Estrutura:**
     1.  **Tweet 1 (A Bomba):** Introduza o 'NOME' do Modelo Mental ('${concept.concept}') de forma impactante e contraintuitiva. Termine com um gancho para o resto da thread. Ex: "O maior problema não é X, é '${concept.concept}'. E isso muda tudo. 👇"
     2.  **Tweet 2 (A Lógica):** Resuma a 'ESSÊNCIA' do Modelo Mental em menos de 280 caracteres. Explique o 'porquê' de forma clara e direta, mostrando o principal sintoma ou implicação.
     3.  **Tweet 3 (O Vetor):** Apresente a mudança de perspectiva ou o primeiro passo para a solução. Faça uma pergunta aberta que incentive o engajamento e reforce a identidade central do autor.

</BLUEPRINTS_DE_MANIFESTAÇÃO>
`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: postsSchema,
                temperature: 0.8,
            },
        });

        const jsonString = response.text.trim();
        const posts: GeneratedPosts = JSON.parse(jsonString);
        return posts;
    } catch (error) {
        console.error("Error generating posts:", error);
        throw new Error(`Failed to generate posts for concept: "${concept.concept}"`);
    }
};