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
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error.message);
    process.exit(1);
  }
}

async function checkRequirements() {
  console.log('🔍 Checking requirements...');
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const version = nodeVersion.replace('v', '');
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`);
    }
    console.log(`✅ Node.js ${nodeVersion} detected`);
  } catch (error) {
    console.error('❌ Node.js not found or incompatible version');
    process.exit(1);
  }
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm ${npmVersion} detected`);
  } catch (error) {
    console.error('❌ npm not found');
    process.exit(1);
  }
  
  console.log('');
}

async function checkEnvironmentFile() {
  console.log('🔧 Checking configuration file...');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, 'env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env file created from env.example');
      console.log('⚠️  IMPORTANT: Edit the .env file and add your API keys before continuing');
      console.log('   - GOOGLE_AI_API_KEY (recommended - free)');
      console.log('   - OPENAI_API_KEY');
      console.log('   - OPENROUTER_API_KEY');
      console.log('');
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('Have you configured the API keys in the .env file? (y/n): ', resolve);
      });
      
      rl.close();
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Please configure the API keys before continuing');
        process.exit(1);
      }
    } else {
      console.error('❌ env.example file not found');
      process.exit(1);
    }
  } else {
    console.log('✅ .env file found');
  }
  
  console.log('');
}

async function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  // Install root dependencies
  await runCommand('npm install', 'Installing root project dependencies');
  
  // Install CV generator dependencies
  await runCommand('cd cv-generator && npm install', 'Installing CV generator dependencies');
  
  // Install backend dependencies
  await runCommand('cd backend && npm install', 'Installing backend dependencies');
  
  // Install frontend dependencies
  await runCommand('cd frontend && npm install', 'Installing frontend dependencies');
  
  console.log('✅ All dependencies installed successfully\n');
}

async function generateCVs() {
  console.log('📄 Generating CVs...');
  
  try {
    await runCommand('cd cv-generator && npm run generate', 'Generating fake CVs');
  } catch (error) {
    console.log('⚠️  Error generating CVs. You can generate them manually later with: npm run generate-cvs');
  }
  
  console.log('');
}

async function createDirectories() {
  console.log('📁 Creating necessary directories...');
  
  const directories = [
    'cv-generator/generated-cvs',
    'backend/data',
    'chroma_db'
  ];
  
  for (const dir of directories) {
    fs.ensureDirSync(dir);
  }
  
  console.log('✅ Directories created successfully\n');
}

async function main() {
  try {
    await checkRequirements();
    await checkEnvironmentFile();
    await createDirectories();
    await installDependencies();
    await generateCVs();
    
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Make sure you have configured the API keys in the .env file');
    console.log('2. Run the backend: npm run start-backend');
    console.log('3. Run the frontend: npm run start-frontend');
    console.log('4. Or run both: npm run dev');
    console.log('');
    console.log('🌐 The application will be available at: http://localhost:3000');
    console.log('📡 The API will be available at: http://localhost:3001');
    console.log('');
    console.log('📚 For more information, check the README.md');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main }; 