const { ChatOpenAI } = require('@langchain/openai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { similaritySearch, exhaustiveSearch } = require('./vectorStore');

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
    return `You are an HR assistant specialized in CV screening. Your function is to answer questions EXCLUSIVELY based on the information from the provided CVs.

CRITICAL INSTRUCTIONS FOR 100% COMPREHENSIVE CV ANALYSIS:
1. EXHAUSTIVE CV REVIEW: You must thoroughly examine EVERY single CV provided to you, reading through ALL sections including:
   - Personal information and contact details
   - Education and academic background
   - Work experience and job history
   - Technical skills and competencies
   - Languages and certifications
   - Projects and achievements
   - Any additional relevant information

2. 100% COMPREHENSIVE SEARCH METHODOLOGY:
   - For ANY question, you must systematically go through ALL CVs provided
   - Do not stop at the first few matches - continue until you've reviewed every single CV
   - Pay attention to both explicit mentions and implicit information
   - Look for variations in how skills/experiences are described
   - Search for keywords in ALL sections of each CV

3. DETAILED RESPONSE REQUIREMENTS:
   - When mentioning candidates, provide specific details from their CVs
   - Include relevant context such as job titles, companies, or specific projects
   - If a candidate has multiple relevant experiences, mention them all
   - Be precise about what information is available vs. what is not

4. 100% EXHAUSTIVE COVERAGE:
   - If asked about a skill (e.g., "Who knows Python?"), you MUST check every single CV
   - Do not rely on partial searches or assumptions
   - If you find candidates with the skill, mention ALL of them with supporting details
   - If no candidates have the skill, clearly state this
   - Leave no CV unexamined

5. EVIDENCE-BASED RESPONSES:
   - Always base your answers on specific information found in the CVs
   - Quote or reference specific sections when possible
   - Distinguish between candidates who explicitly mention a skill vs. those who might have related experience
   - Be clear about the level of certainty for each piece of information

6. RESPONSE FORMAT:
   - Respond clearly and professionally in English
   - Structure your response logically with clear sections
   - For each candidate mentioned, provide supporting evidence from their CV
   - If information is missing or unclear, state this explicitly
   - Always respond in English, regardless of the question language

7. QUALITY ASSURANCE:
   - Before providing your final answer, double-check that you've reviewed all CVs
   - Ensure you haven't missed any relevant candidates
   - Verify that your response is complete and accurate
   - If you're unsure about any information, acknowledge the uncertainty

Remember: Your credibility depends on thorough, accurate analysis. Take the time to review each CV completely and provide well-substantiated responses based on the actual content of the CVs. Do not invent or assume information that isn't explicitly stated in the CVs.`;
  }

  createUserPrompt(query, relevantDocs) {
    let context = '';
    let cvGroups = {};
    
    if (relevantDocs && relevantDocs.length > 0) {
      context = 'OPTIMIZED CV INFORMATION FOR FAST EXHAUSTIVE ANALYSIS:\n\n';
      
      // Group by CV for faster processing
      relevantDocs.forEach((doc) => {
        if (!cvGroups[doc.metadata.cvName]) {
          cvGroups[doc.metadata.cvName] = [];
        }
        cvGroups[doc.metadata.cvName].push(doc.content);
      });
      
      Object.entries(cvGroups).forEach(([cvName, contents], index) => {
        context += `=== CV ${index + 1}: ${cvName} ===\n${contents.join('\n')}\n\n`;
      });
      
      // Add optimized analysis instructions
      context += `\nFAST EXHAUSTIVE ANALYSIS INSTRUCTIONS:
1. You have been provided with ${Object.keys(cvGroups).length} complete CVs above
2. For the user's question, you MUST thoroughly review EVERY single CV
3. Look for both explicit mentions and implicit information related to the question
4. Pay attention to all sections: education, experience, skills, projects, etc.
5. Do not skip any CV - review them all systematically
6. Provide specific evidence from each relevant CV to support your answer
7. If the question is general (e.g., "Who knows Python?"), check ALL CVs and mention ALL candidates who meet the criteria
8. Be 100% thorough but FAST in your analysis
9. Leave no stone unturned - examine every piece of information provided\n\n`;
    } else {
      context = 'No CV information was provided for analysis.';
    }
    
    return `FAST EXHAUSTIVE CV ANALYSIS:
${context}

USER QUESTION:
${query}

Please conduct a FAST but 100% thorough analysis of ALL provided CVs to answer this question. Review each CV completely and provide a well-substantiated response based on the actual content found in the CVs. Leave no CV unexamined. Always respond in English. Be concise but comprehensive.`;
  }

  async processChatMessage(message) {
    try {
      console.log(`💬 Processing message: "${message}"`);
      
      // Determine if this is a general skill question that requires 100% exhaustive search
      const isGeneralSkillQuestion = this.isGeneralSkillQuestion(message);
      
      let relevantDocs;
      
      if (isGeneralSkillQuestion) {
        // Use 100% exhaustive search for general skill questions - EXACTLY 30 CVs
        console.log(`🔍 Performing 100% EXHAUSTIVE search for general skill question`);
        relevantDocs = await similaritySearch(message, 30); // Exactly 30 CVs (one per CV)
      } else {
        // Use comprehensive search for specific questions
        console.log(`🔍 Performing comprehensive search for specific question`);
        relevantDocs = await similaritySearch(message, 30); // Exactly 30 CVs
      }
      
      console.log(`📄 Found ${relevantDocs.length} relevant CV chunks for fast exhaustive analysis`);
      
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
        answer: 'Sorry, there was an error processing your question. Please try again.',
        sources: [],
        query: message,
        error: error.message
      };
    }
  }

  isGeneralSkillQuestion(message) {
    const generalSkillKeywords = [
      'who', 'which', 'find', 'show', 'candidates', 'people', 'developers',
      'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node',
      'sql', 'mongodb', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'machine learning', 'ai', 'data science', 'devops', 'frontend', 'backend',
      'mobile', 'ios', 'android', 'swift', 'kotlin', 'php', 'ruby', 'go',
      'rust', 'c++', 'c#', '.net', 'spring', 'django', 'flask', 'express',
      'typescript', 'html', 'css', 'sass', 'less', 'webpack', 'babel',
      'git', 'jenkins', 'travis', 'circleci', 'terraform', 'ansible',
      'experience', 'skills', 'know', 'have', 'worked', 'used'
    ];
    
    const lowerMessage = message.toLowerCase();
    return generalSkillKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  async testConnection() {
    try {
      const response = await this.llm.invoke('Respond only with "OK" if you can read this message.');
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