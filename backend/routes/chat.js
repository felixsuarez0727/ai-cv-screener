const express = require('express');
const router = express.Router();
const { processChatMessage } = require('../services/llmService');

// POST /api/chat - Main chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Message is required and must be a string'
      });
    }
    
    console.log(`💬 Processing chat message: "${message}"`);
    
    // Process the message through the RAG pipeline
    const response = await processChatMessage(message);
    
    res.json({
      success: true,
      response: response.answer,
      sources: response.sources,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

// GET /api/chat/status - Check chat service status
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Chat service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 