#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

console.log('🧪 AI CV Screener - System Test');
console.log('===============================\n');

const API_BASE_URL = 'http://localhost:3001';

async function testBackendHealth() {
  try {
    console.log('🔍 Probando conexión con el backend...');
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    
    if (response.data.status === 'OK') {
      console.log('✅ Backend conectado correctamente');
      return true;
    } else {
      console.log('❌ Backend no responde correctamente');
      return false;
    }
  } catch (error) {
    console.log('❌ No se puede conectar con el backend');
    console.log('   Asegúrate de que el backend esté ejecutándose en el puerto 3001');
    return false;
  }
}

async function testChatEndpoint() {
  try {
    console.log('💬 Probando endpoint de chat...');
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      message: '¿Cuántos CVs tienes disponibles?'
    });
    
    if (response.data.success && response.data.response) {
      console.log('✅ Endpoint de chat funciona correctamente');
      console.log(`📝 Respuesta: ${response.data.response.substring(0, 100)}...`);
      return true;
    } else {
      console.log('❌ Endpoint de chat no responde correctamente');
      return false;
    }
  } catch (error) {
    console.log('❌ Error en el endpoint de chat:', error.message);
    return false;
  }
}

async function checkCVsGenerated() {
  try {
    console.log('📄 Verificando CVs generados...');
    const cvDir = path.join(__dirname, 'cv-generator/generated-cvs');
    
    if (!fs.existsSync(cvDir)) {
      console.log('❌ Directorio de CVs no encontrado');
      return false;
    }
    
    const files = await fs.readdir(cvDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    const jsonFile = files.find(file => file === 'cv_data.json');
    
    if (pdfFiles.length > 0 && jsonFile) {
      console.log(`✅ ${pdfFiles.length} CVs PDF generados`);
      console.log('✅ Datos JSON de CVs disponibles');
      return true;
    } else {
      console.log('❌ No se encontraron CVs generados');
      return false;
    }
  } catch (error) {
    console.log('❌ Error verificando CVs:', error.message);
    return false;
  }
}

async function checkVectorDatabase() {
  try {
    console.log('🔍 Verificando base de datos vectorial...');
    const chromaDir = path.join(__dirname, 'chroma_db');
    
    if (fs.existsSync(chromaDir)) {
      const files = await fs.readdir(chromaDir);
      if (files.length > 0) {
        console.log('✅ Base de datos vectorial encontrada');
        return true;
      }
    }
    
    console.log('⚠️  Base de datos vectorial no encontrada o vacía');
    console.log('   Esto es normal si el backend no se ha inicializado completamente');
    return false;
  } catch (error) {
    console.log('❌ Error verificando base de datos vectorial:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando pruebas del sistema...\n');
  
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
  
  console.log('\n📊 Resultados de las pruebas:');
  console.log('============================');
  
  let passedTests = 0;
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (result.passed) passedTests++;
  });
  
  console.log(`\n🎯 ${passedTests}/${results.length} pruebas pasaron`);
  
  if (passedTests === results.length) {
    console.log('\n🎉 ¡Sistema funcionando correctamente!');
    console.log('🌐 Puedes acceder a la aplicación en: http://localhost:3000');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
    console.log('💡 Asegúrate de:');
    console.log('   1. Tener configuradas las API keys en .env');
    console.log('   2. Haber ejecutado npm run setup');
    console.log('   3. Tener el backend ejecutándose (npm run start-backend)');
  }
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 