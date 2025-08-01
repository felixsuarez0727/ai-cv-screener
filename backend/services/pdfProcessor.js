const fs = require('fs-extra');
const path = require('path');

class PDFProcessor {
  constructor() {
    this.cvDataPath = path.join(__dirname, '../../cv-generator/generated-cvs/cv_data.json');
    this.processedDataPath = path.join(__dirname, '../data/processed_cvs.json');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    fs.ensureDirSync(dataDir);
  }

  createChunks(text, chunkSize = 300, overlap = 50) {
    const chunks = [];
    let start = 0;
    
    // Ensure we don't get stuck in an infinite loop
    const maxIterations = 1000;
    let iterations = 0;
    
    while (start < text.length && iterations < maxIterations) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end).trim();
      
      if (chunk.length > 30) {
        chunks.push(chunk);
      }
      
      // Prevent infinite loop
      if (end <= start) {
        break;
      }
      
      start = end - overlap;
      iterations++;
    }
    
    return chunks;
  }

  async processCVData() {
    try {
      console.log('📄 Reading CV data...');
      
      // Read the JSON data from the CV generator
      const cvData = await fs.readJson(this.cvDataPath);
      console.log(`📊 Found ${cvData.length} CVs to process`);
      
      const processedCVs = [];
      
      for (let i = 0; i < cvData.length; i++) {
        const cv = cvData[i];
        console.log(`Processing CV ${i + 1}/${cvData.length}: ${cv.personalInfo.name}`);
        
        // Create a simple text representation
        const cvText = this.createSimpleCVText(cv);
        
        // Create small chunks
        const chunks = this.createChunks(cvText, 300, 50);
        
        const processedCV = {
          id: i + 1,
          name: cv.personalInfo.name,
          email: cv.personalInfo.email,
          summary: cv.summary,
          experience: cv.experience.slice(0, 3).map(exp => ({
            title: exp.title,
            company: exp.company,
            period: `${exp.startDate} - ${exp.endDate}`
          })),
          education: {
            degree: cv.education.degree,
            university: cv.education.university
          },
          skills: {
            technical: cv.skills.technical.slice(0, 6),
            soft: cv.skills.soft.slice(0, 3)
          },
          languages: cv.languages.slice(0, 3),
          chunks: chunks.map((chunk, index) => ({
            id: `${i + 1}_${index + 1}`,
            content: chunk,
            cvId: i + 1,
            cvName: cv.personalInfo.name
          }))
        };
        
        processedCVs.push(processedCV);
        
        // Log progress every 5 CVs
        if ((i + 1) % 5 === 0) {
          console.log(`✅ Processed ${i + 1}/${cvData.length} CVs`);
        }
      }
      
      // Save processed data
      await fs.writeJson(this.processedDataPath, processedCVs, { spaces: 2 });
      
      console.log(`✅ Successfully processed ${processedCVs.length} CVs`);
      return processedCVs;
      
    } catch (error) {
      console.error('Error processing CV data:', error);
      throw error;
    }
  }

  createSimpleCVText(cv) {
    let text = '';
    
    // Basic info
    text += `Name: ${cv.personalInfo.name}\n`;
    text += `Email: ${cv.personalInfo.email}\n`;
    text += `Summary: ${cv.summary}\n\n`;
    
    // Experience (limited)
    text += 'Experience:\n';
    cv.experience.slice(0, 3).forEach((exp, index) => {
      text += `${index + 1}. ${exp.title} at ${exp.company}\n`;
      text += `   ${exp.startDate} - ${exp.endDate}\n`;
      text += `   ${exp.description.substring(0, 150)}...\n\n`;
    });
    
    // Education
    text += `Education: ${cv.education.degree} from ${cv.education.university}\n`;
    text += `Period: ${cv.education.startYear} - ${cv.education.endYear}\n\n`;
    
    // Skills
    text += `Technical Skills: ${cv.skills.technical.slice(0, 6).join(', ')}\n`;
    text += `Soft Skills: ${cv.skills.soft.slice(0, 3).join(', ')}\n\n`;
    
    // Languages
    text += 'Languages: ';
    cv.languages.slice(0, 3).forEach(lang => {
      text += `${lang.name} (${lang.level}), `;
    });
    text += '\n';
    
    return text;
  }

  async getProcessedCVs() {
    try {
      if (await fs.pathExists(this.processedDataPath)) {
        return await fs.readJson(this.processedDataPath);
      } else {
        return await this.processCVData();
      }
    } catch (error) {
      console.error('Error getting processed CVs:', error);
      throw error;
    }
  }

  async getAllChunks() {
    const processedCVs = await this.getProcessedCVs();
    const allChunks = [];
    
    processedCVs.forEach(cv => {
      allChunks.push(...cv.chunks);
    });
    
    return allChunks;
  }
}

// Singleton instance
const pdfProcessor = new PDFProcessor();

// Export functions
async function processCVs() {
  return await pdfProcessor.processCVData();
}

async function getProcessedCVs() {
  return await pdfProcessor.getProcessedCVs();
}

async function getAllChunks() {
  return await pdfProcessor.getAllChunks();
}

module.exports = {
  processCVs,
  getProcessedCVs,
  getAllChunks,
  PDFProcessor
}; 