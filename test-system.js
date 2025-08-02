#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

console.log('🧪 AI CV Screener - System Test');
console.log('===============================\n');

const API_BASE_URL = 'http://localhost:3001';

async function testBackendHealth() {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    
    if (response.data.status === 'OK') {
      console.log('✅ Backend connected successfully');
      return true;
    } else {
      console.log('❌ Backend not responding correctly');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log('   Make sure the backend is running on port 3001');
    return false;
  }
}

async function testChatEndpoint() {
  try {
    console.log('💬 Testing chat endpoint...');
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      message: 'How many CVs do you have available?'
    });
    
    if (response.data.success && response.data.response) {
      console.log('✅ Chat endpoint working correctly');
      console.log(`📝 Response: ${response.data.response.substring(0, 100)}...`);
      return true;
    } else {
      console.log('❌ Chat endpoint not responding correctly');
      return false;
    }
  } catch (error) {
    console.log('❌ Error in chat endpoint:', error.message);
    return false;
  }
}

async function checkCVsGenerated() {
  try {
    console.log('📄 Checking generated CVs...');
    const cvDir = path.join(__dirname, 'cv-generator/generated-cvs');
    
    if (!fs.existsSync(cvDir)) {
      console.log('❌ CV directory not found');
      return false;
    }
    
    const files = await fs.readdir(cvDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    const jsonFile = files.find(file => file === 'cv_data.json');
    
    if (pdfFiles.length > 0 && jsonFile) {
      console.log(`✅ ${pdfFiles.length} PDF CVs generated`);
      console.log('✅ CV JSON data available');
      return true;
    } else {
      console.log('❌ No generated CVs found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking CVs:', error.message);
    return false;
  }
}

async function checkVectorDatabase() {
  try {
    console.log('🔍 Checking vector database...');
    const chromaDir = path.join(__dirname, 'chroma_db');
    
    if (fs.existsSync(chromaDir)) {
      const files = await fs.readdir(chromaDir);
      if (files.length > 0) {
        console.log('✅ Vector database found');
        return true;
      }
    }
    
    console.log('⚠️  Vector database not found or empty');
    console.log('   This is normal if the backend has not been fully initialized');
    return false;
  } catch (error) {
    console.log('❌ Error checking vector database:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting system tests...\n');
  
  const tests = [
    { name: 'Backend Health', fn: testBackendHealth },
    { name: 'Chat Endpoint', fn: testChatEndpoint },
    { name: 'CVs Generated', fn: checkCVsGenerated },
    { name: 'Vector Database', fn: checkVectorDatabase }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n📋 ${test.name}:`);
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
  }
  
  console.log('\n📊 Test Results:');
  console.log('================');
  
  let passedTests = 0;
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (result.passed) passedTests++;
  });
  
  console.log(`\n🎯 ${passedTests}/${results.length} tests passed`);
  
  if (passedTests === results.length) {
    console.log('\n🎉 System working correctly!');
    console.log('🌐 You can access the application at: http://localhost:3000');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('💡 Make sure to:');
    console.log('   1. Have API keys configured in .env');
    console.log('   2. Have run npm run setup');
    console.log('   3. Have the backend running (npm run start-backend)');
  }
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 