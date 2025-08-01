const { ChatOpenAI } = require('@langchain/openai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { similaritySearch } = require('./vectorStore');

class LLMService {
  constructor() {
    this.llm = null;
    this.initializeLLM();
  }

  initializeLLM() {
    try {
      // Try to use Google AI first (free tier)
      if (process.env.GOOGLE_AI_API_KEY) {
        this.llm = new ChatGoogleGenerativeAI({
          modelName: 'gemini-1.5-flash',
          maxOutputTokens: 2048,
          temperature: 0.7,
          apiKey: process.env.GOOGLE_AI_API_KEY
        });
        console.log('🤖 Using Google AI (Gemini 1.5 Flash)');
      }
      // Fallback to OpenAI
      else if (process.env.OPENAI_API_KEY) {
        this.llm = new ChatOpenAI({
          modelName: 'gpt-3.5-turbo',
          temperature: 0.7,
          openAIApiKey: process.env.OPENAI_API_KEY
        });
        console.log('🤖 Using OpenAI (GPT-3.5 Turbo)');
      }
      // Fallback to OpenRouter
      else if (process.env.OPENROUTER_API_KEY) {
        this.llm = new ChatOpenAI({
          modelName: 'openai/gpt-3.5-turbo',
          temperature: 0.7,
          openAIApiKey: process.env.OPENROUTER_API_KEY,
          configuration: {
            baseURL: 'https://openrouter.ai/api/v1'
          }
        });
        console.log('🤖 Using OpenRouter (GPT-3.5 Turbo)');
      }
      else {
        throw new Error('No LLM API key provided. Please set GOOGLE_AI_API_KEY, OPENAI_API_KEY, or OPENROUTER_API_KEY');
      }
    } catch (error) {
      console.error('❌ Error initializing LLM:', error);
      throw error;
    }
  }

  createSystemPrompt() {
    return `Eres un asistente de RRHH especializado en screening de CVs. Tu función es responder preguntas ÚNICAMENTE basándote en la información de los CVs proporcionados.

INSTRUCCIONES IMPORTANTES:
1. Responde ÚNICAMENTE basándote en la información de los CVs que se te proporciona
2. Si no encuentras información relevante en los CVs, di claramente que no tienes esa información disponible
3. Sé específico y menciona los nombres de los candidatos cuando sea relevante
4. Proporciona respuestas estructuradas y útiles
5. Si se te pide información sobre un candidato específico, busca en todos los CVs disponibles
6. Para preguntas sobre habilidades, experiencia o educación, menciona todos los candidatos relevantes

FORMATO DE RESPUESTA:
- Responde de manera clara y profesional
- Menciona los nombres de los candidatos cuando sea relevante
- Si no hay información disponible, indícalo claramente
- Proporciona contexto cuando sea útil

Recuerda: Solo puedes usar la información de los CVs proporcionados. No inventes información.`;
  }

  createUserPrompt(query, relevantDocs) {
    let context = '';
    
    if (relevantDocs && relevantDocs.length > 0) {
      context = 'INFORMACIÓN DE LOS CVs:\n\n';
      relevantDocs.forEach((doc, index) => {
        context += `CV ${index + 1} (${doc.metadata.cvName}):\n${doc.content}\n\n`;
      });
    } else {
      context = 'No se encontró información relevante en los CVs para responder a esta pregunta.';
    }
    
    return `CONTEXTO:
${context}

PREGUNTA DEL USUARIO:
${query}

Por favor, responde la pregunta basándote ÚNICAMENTE en la información proporcionada arriba. Si no hay información suficiente, indícalo claramente.`;
  }

  async processChatMessage(message) {
    try {
      console.log(`💬 Processing message: "${message}"`);
      
      // Search for relevant documents
      const relevantDocs = await similaritySearch(message, 5);
      
      // Create prompts
      const systemPrompt = this.createSystemPrompt();
      const userPrompt = this.createUserPrompt(message, relevantDocs);
      
      // Generate response using the correct format for Google AI
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      const response = await this.llm.invoke(fullPrompt);
      
      // Extract sources
      const sources = relevantDocs.map(doc => ({
        cvName: doc.metadata.cvName,
        cvId: doc.metadata.cvId,
        relevance: doc.distance ? (1 - doc.distance).toFixed(3) : 'N/A'
      }));
      
      return {
        answer: response.content,
        sources: sources,
        query: message
      };
      
    } catch (error) {
      console.error('❌ Error processing chat message:', error);
      
      // Return a fallback response
      return {
        answer: 'Lo siento, hubo un error procesando tu pregunta. Por favor, intenta de nuevo.',
        sources: [],
        query: message,
        error: error.message
      };
    }
  }

  async testConnection() {
    try {
      const response = await this.llm.invoke('Responde solo con "OK" si puedes leer este mensaje.');
      return response.content === 'OK';
    } catch (error) {
      console.error('❌ LLM connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
const llmService = new LLMService();

// Export functions
async function processChatMessage(message) {
  return await llmService.processChatMessage(message);
}

async function testLLMConnection() {
  return await llmService.testConnection();
}

module.exports = {
  processChatMessage,
  testLLMConnection,
  LLMService
}; 