const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const chatRoutes = require('./routes/chat');

// Import services
const { initializeVectorStore } = require('./services/vectorStore');
const { processCVs } = require('./services/pdfProcessor');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/cvs', express.static(path.join(__dirname, '../cv-generator/generated-cvs')));

// Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI CV Screener API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI CV Screener API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`
  });
});

// Initialize the application
async function initializeApp() {
  try {
    console.log('🚀 Initializing AI CV Screener Backend...');
    
    // Process CVs and create vector store
    console.log('📄 Processing CVs...');
    await processCVs();
    
    // Initialize vector store
    console.log('🔍 Initializing vector store...');
    await initializeVectorStore();
    
    console.log('✅ Backend initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing backend:', error);
    process.exit(1);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🎯 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});

// Initialize app after server starts
initializeApp();

module.exports = app; 