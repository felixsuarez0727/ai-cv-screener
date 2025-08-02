const fs = require('fs-extra');
const path = require('path');
const { getProcessedCVs } = require('./pdfProcessor');

class VectorStore {
  constructor() {
    this.embeddings = null;
    this.isInitialized = false;
    this.documents = [];
    this.vectorStorePath = path.join(__dirname, '../data/vector_store.json');
  }

  async initialize() {
    try {
      console.log('🔍 Initializing Simple Vector Store...');
      
      // Initialize embeddings - try Google AI first, then OpenAI
      if (process.env.GOOGLE_AI_API_KEY) {
        // Use Google AI embeddings
        const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
        this.embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_AI_API_KEY,
          modelName: 'embedding-001'
        });
        console.log('🔍 Using Google AI embeddings');
      } else if (process.env.OPENAI_API_KEY) {
        const { OpenAIEmbeddings } = require('@langchain/openai');
        this.embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: 'text-embedding-ada-002'
        });
        console.log('🔍 Using OpenAI embeddings');
      } else {
        throw new Error('No embedding API key found. Please set GOOGLE_AI_API_KEY or OPENAI_API_KEY');
      }
      
      // Load existing vector store if it exists
      if (await fs.pathExists(this.vectorStorePath)) {
        this.documents = await fs.readJson(this.vectorStorePath);
        console.log(`📚 Loaded ${this.documents.length} documents from existing vector store`);
        this.isInitialized = true;
        return; // Skip initialization if we already have documents
      }
      
      this.isInitialized = true;
      console.log('✅ Vector store initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing vector store:', error);
      throw error;
    }
  }

  async addDocuments(chunks) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      console.log(`📝 Adding ${chunks.length} chunks to vector store...`);
      
      // Clear existing documents to start fresh
      this.documents = [];
      
      // Process in batches to avoid overwhelming the API
      const batchSize = 15;
      let processed = 0;
      
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (chunk) => {
          const embedding = await this.embeddings.embedQuery(chunk.content);
          return {
            id: chunk.id,
            content: chunk.content,
            embedding: embedding,
            metadata: {
              cvId: chunk.cvId,
              cvName: chunk.cvName,
              chunkId: chunk.id
            }
          };
        });
        
        const batchResults = await Promise.all(batchPromises);
        this.documents.push(...batchResults);
        
        processed += batch.length;
        console.log(`📊 Processed ${processed}/${chunks.length} chunks`);
        
        // Save to file every 1000 chunks to reduce I/O overhead
        if (processed % 1000 === 0 || processed === chunks.length) {
          console.log(`💾 Saving ${this.documents.length} documents to file...`);
          await fs.writeJson(this.vectorStorePath, this.documents, { spaces: 2 });
          console.log(`✅ Saved ${this.documents.length} documents`);
        }
        
        // Small delay between batches
        if (i + batchSize < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      console.log(`✅ Added ${chunks.length} chunks to vector store`);
      
    } catch (error) {
      console.error('❌ Error adding documents to vector store:', error);
      throw error;
    }
  }

  async similaritySearch(query, k = 5) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      console.log(`🔍 Performing 100% comprehensive search for: "${query}"`);
      console.log(`📊 Total documents in store: ${this.documents.length}`);
      
      if (this.documents.length === 0) {
        console.log('⚠️ No documents in vector store');
        return [];
      }
      
      // Generate embedding for the query
      const queryEmbedding = await this.embeddings.embedQuery(query);
      
      // Calculate similarities for ALL documents
      console.log(`🔍 Calculating similarities for all ${this.documents.length} documents...`);
      const similarities = this.documents.map(doc => {
        const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
        return {
          content: doc.content,
          metadata: doc.metadata,
          similarity: similarity
        };
      });
      
      // Sort by similarity (highest first)
      const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
      
      // For comprehensive search, return ALL results above a certain threshold
      const threshold = 0.1; // Lower threshold to catch more potential matches
      const relevantResults = sortedSimilarities.filter(item => item.similarity > threshold);
      
      console.log(`📈 Found ${relevantResults.length} results above threshold (${threshold})`);
      
      // CRITICAL FIX: Ensure we get exactly ONE chunk per CV, prioritizing the most relevant
      const cvMap = new Map(); // Map to track best chunk per CV
      
      for (const item of relevantResults) {
        const cvId = item.metadata.cvId;
        if (!cvMap.has(cvId) || item.similarity > cvMap.get(cvId).similarity) {
          cvMap.set(cvId, item);
        }
      }
      
      // Convert map back to array and sort by similarity
      const uniqueCVResults = Array.from(cvMap.values())
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, k)
        .map(item => ({
          content: item.content,
          metadata: item.metadata,
          distance: 1 - item.similarity
        }));
      
      console.log(`✅ 100% comprehensive search complete:`);
      console.log(`   - Total documents searched: ${this.documents.length}`);
      console.log(`   - Results above threshold: ${relevantResults.length}`);
      console.log(`   - Unique CVs found: ${cvMap.size}`);
      console.log(`   - Final results returned: ${uniqueCVResults.length}`);
      
      return uniqueCVResults;
      
    } catch (error) {
      console.error('❌ Error in similarity search:', error);
      throw error;
    }
  }

  // New method for 100% exhaustive search
  async exhaustiveSearch(query) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      console.log(`🔍 Performing 100% EXHAUSTIVE search for: "${query}"`);
      console.log(`📊 Searching through ALL ${this.documents.length} documents...`);
      
      if (this.documents.length === 0) {
        console.log('⚠️ No documents in vector store');
        return [];
      }
      
      // Generate embedding for the query
      const queryEmbedding = await this.embeddings.embedQuery(query);
      
      // Calculate similarities for ALL documents
      const similarities = this.documents.map(doc => {
        const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
        return {
          content: doc.content,
          metadata: doc.metadata,
          similarity: similarity
        };
      });
      
      // Sort by similarity
      const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
      
      // Return ALL results (no limit)
      const allResults = sortedSimilarities.map(item => ({
        content: item.content,
        metadata: item.metadata,
        distance: 1 - item.similarity
      }));
      
      // Get unique CVs
      const uniqueCVs = new Set(allResults.map(result => result.metadata.cvId));
      
      console.log(`✅ 100% EXHAUSTIVE search complete:`);
      console.log(`   - Total documents searched: ${this.documents.length}`);
      console.log(`   - Total results returned: ${allResults.length}`);
      console.log(`   - Unique CVs found: ${uniqueCVs.size}`);
      
      return allResults;
      
    } catch (error) {
      console.error('❌ Error in exhaustive search:', error);
      throw error;
    }
  }

  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  }

  async getCollectionInfo() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return {
      name: 'Simple Vector Store',
      documentCount: this.documents.length,
      isInitialized: this.isInitialized
    };
  }

  async clearCollection() {
    this.documents = [];
    await fs.remove(this.vectorStorePath);
    console.log('🗑️ Vector store cleared');
  }
}

// Singleton instance
const vectorStore = new VectorStore();

// Initialize vector store with CV data
async function initializeVectorStore() {
  try {
    await vectorStore.initialize();
    
    // Check if collection is empty
    const info = await vectorStore.getCollectionInfo();
    
    if (info.documentCount === 0) {
      console.log('📄 Loading CV chunks into vector store...');
      const processedCVs = await getProcessedCVs();
      const allChunks = [];
      
      processedCVs.forEach(cv => {
        allChunks.push(...cv.chunks);
      });
      
      await vectorStore.addDocuments(allChunks);
      console.log(`✅ Loaded ${allChunks.length} chunks into vector store`);
    } else {
      console.log(`📚 Vector store already contains ${info.documentCount} documents`);
    }
    
  } catch (error) {
    console.error('❌ Error initializing vector store:', error);
    throw error;
  }
}

// Export functions
async function similaritySearch(query, k = 5) {
  return await vectorStore.similaritySearch(query, k);
}

async function exhaustiveSearch(query) {
  return await vectorStore.exhaustiveSearch(query);
}

async function getCollectionInfo() {
  return await vectorStore.getCollectionInfo();
}

module.exports = {
  initializeVectorStore,
  similaritySearch,
  exhaustiveSearch,
  getCollectionInfo,
  VectorStore
}; 