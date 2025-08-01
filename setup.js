#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

console.log('🚀 AI CV Screener - Setup Script');
console.log('================================\n');

async function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    process.exit(1);
  }
}

async function checkRequirements() {
  console.log('🔍 Verificando requisitos...');
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const version = nodeVersion.replace('v', '');
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ requerido. Versión actual: ${nodeVersion}`);
    }
    console.log(`✅ Node.js ${nodeVersion} detectado`);
  } catch (error) {
    console.error('❌ Node.js no encontrado o versión incompatible');
    process.exit(1);
  }
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm ${npmVersion} detectado`);
  } catch (error) {
    console.error('❌ npm no encontrado');
    process.exit(1);
  }
  
  console.log('');
}

async function checkEnvironmentFile() {
  console.log('🔧 Verificando archivo de configuración...');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, 'env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Archivo .env creado desde env.example');
      console.log('⚠️  IMPORTANTE: Edita el archivo .env y añade tus API keys antes de continuar');
      console.log('   - GOOGLE_AI_API_KEY (recomendado - gratuito)');
      console.log('   - OPENAI_API_KEY');
      console.log('   - OPENROUTER_API_KEY');
      console.log('');
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('¿Has configurado las API keys en el archivo .env? (y/n): ', resolve);
      });
      
      rl.close();
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Por favor, configura las API keys antes de continuar');
        process.exit(1);
      }
    } else {
      console.error('❌ No se encontró el archivo env.example');
      process.exit(1);
    }
  } else {
    console.log('✅ Archivo .env encontrado');
  }
  
  console.log('');
}

async function installDependencies() {
  console.log('📦 Instalando dependencias...');
  
  // Install root dependencies
  await runCommand('npm install', 'Instalando dependencias del proyecto raíz');
  
  // Install CV generator dependencies
  await runCommand('cd cv-generator && npm install', 'Instalando dependencias del generador de CVs');
  
  // Install backend dependencies
  await runCommand('cd backend && npm install', 'Instalando dependencias del backend');
  
  // Install frontend dependencies
  await runCommand('cd frontend && npm install', 'Instalando dependencias del frontend');
  
  console.log('✅ Todas las dependencias instaladas correctamente\n');
}

async function generateCVs() {
  console.log('📄 Generando CVs...');
  
  try {
    await runCommand('cd cv-generator && npm run generate', 'Generando CVs falsos');
  } catch (error) {
    console.log('⚠️  Error generando CVs. Puedes generarlos manualmente más tarde con: npm run generate-cvs');
  }
  
  console.log('');
}

async function createDirectories() {
  console.log('📁 Creando directorios necesarios...');
  
  const directories = [
    'cv-generator/generated-cvs',
    'backend/data',
    'chroma_db'
  ];
  
  for (const dir of directories) {
    fs.ensureDirSync(dir);
  }
  
  console.log('✅ Directorios creados correctamente\n');
}

async function main() {
  try {
    await checkRequirements();
    await checkEnvironmentFile();
    await createDirectories();
    await installDependencies();
    await generateCVs();
    
    console.log('🎉 ¡Setup completado exitosamente!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Asegúrate de tener configuradas las API keys en el archivo .env');
    console.log('2. Ejecuta el backend: npm run start-backend');
    console.log('3. Ejecuta el frontend: npm run start-frontend');
    console.log('4. O ejecuta ambos: npm run dev');
    console.log('');
    console.log('🌐 La aplicación estará disponible en: http://localhost:3000');
    console.log('📡 El API estará disponible en: http://localhost:3001');
    console.log('');
    console.log('📚 Para más información, consulta el README.md');
    
  } catch (error) {
    console.error('❌ Error durante el setup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main }; 