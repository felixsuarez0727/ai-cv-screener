const { jsPDF } = require('jspdf');
const fs = require('fs-extra');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Ensure output directory exists
const outputDir = path.join(__dirname, 'generated-cvs');
fs.ensureDirSync(outputDir);

// CV Templates and Data
const jobTitles = [
  'Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Product Manager',
  'UX/UI Designer', 'Graphic Designer', 'Marketing Manager', 'Sales Representative',
  'Business Analyst', 'Project Manager', 'QA Engineer', 'System Administrator',
  'Mobile Developer', 'React Developer', 'Python Developer', 'Java Developer',
  'Node.js Developer', 'Data Analyst', 'Content Writer', 'Digital Marketing Specialist',
  'Customer Success Manager', 'HR Specialist', 'Financial Analyst', 'Operations Manager'
];

const universities = [
  'Universidad Peruana de Ciencias Aplicadas (UPC)', 'Universidad de Lima',
  'Pontificia Universidad Católica del Perú (PUCP)', 'Universidad Nacional Mayor de San Marcos',
  'Universidad Nacional de Ingeniería (UNI)', 'Universidad del Pacífico',
  'Universidad ESAN', 'Universidad de Piura',
  'Universidad Católica de Santa María', 'Universidad Nacional Agraria La Molina'
];

const degrees = [
  'Computer Science', 'Software Engineering', 'Information Technology',
  'Business Administration', 'Marketing', 'Design', 'Data Science',
  'Mathematics', 'Physics', 'Economics', 'Psychology', 'Communication'
];

const skills = {
  technical: [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Google Cloud', 'Git', 'Linux', 'Docker', 'Jenkins'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
    'Time Management', 'Adaptability', 'Creativity', 'Critical Thinking',
    'Emotional Intelligence', 'Negotiation', 'Presentation Skills'
  ]
};

const languages = [
  { name: 'Spanish', levels: ['Native', 'Fluent', 'Advanced', 'Intermediate'] },
  { name: 'English', levels: ['Native', 'Fluent', 'Advanced', 'Intermediate'] },
  { name: 'Catalan', levels: ['Native', 'Fluent', 'Advanced', 'Intermediate'] },
  { name: 'French', levels: ['Fluent', 'Advanced', 'Intermediate', 'Basic'] },
  { name: 'German', levels: ['Fluent', 'Advanced', 'Intermediate', 'Basic'] }
];

function generateRandomExperience() {
  const experiences = [];
  const numJobs = faker.number.int({ min: 2, max: 5 });
  
  for (let i = 0; i < numJobs; i++) {
    const startYear = faker.number.int({ min: 2015, max: 2022 });
    const duration = faker.number.int({ min: 1, max: 4 });
    const endYear = startYear + duration;
    
    experiences.push({
      title: faker.helpers.arrayElement(jobTitles),
      company: faker.company.name(),
      startDate: `${faker.date.month()} ${startYear}`,
      endDate: faker.datatype.boolean() ? `${faker.date.month()} ${endYear}` : 'Present',
      description: faker.lorem.paragraph(2, { locale: 'en' })
    });
  }
  
  return experiences.sort((a, b) => {
    const aYear = parseInt(a.startDate.split(' ')[1]);
    const bYear = parseInt(b.startDate.split(' ')[1]);
    return bYear - aYear;
  });
}

function generateRandomSkills() {
  const technicalCount = faker.number.int({ min: 5, max: 12 });
  const softCount = faker.number.int({ min: 3, max: 6 });
  
  const technical = faker.helpers.arrayElements(skills.technical, technicalCount);
  const soft = faker.helpers.arrayElements(skills.soft, softCount);
  
  return { technical, soft };
}

function generateRandomLanguages() {
  const numLanguages = faker.number.int({ min: 2, max: 4 });
  const selectedLanguages = faker.helpers.arrayElements(languages, numLanguages);
  
  return selectedLanguages.map(lang => ({
    name: lang.name,
    level: faker.helpers.arrayElement(lang.levels)
  }));
}

function generateCV() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  
  return {
    personalInfo: {
      name: fullName,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number('+51 ### ### ###'),
      address: faker.location.streetAddress(true),
      city: faker.location.city(),
      country: 'Peru',
      linkedin: `linkedin.com/in/${faker.internet.userName({ firstName, lastName })}`
    },
    summary: faker.lorem.paragraph(1, { locale: 'en' }),
    experience: generateRandomExperience(),
    education: {
      university: faker.helpers.arrayElement(universities),
      degree: faker.helpers.arrayElement(degrees),
      startYear: faker.number.int({ min: 2010, max: 2018 }),
      endYear: faker.number.int({ min: 2014, max: 2022 })
    },
    skills: generateRandomSkills(),
    languages: generateRandomLanguages(),
    certifications: faker.datatype.boolean() ? [
      faker.helpers.arrayElement([
        'AWS Certified Solutions Architect',
        'Google Cloud Professional',
        'Microsoft Azure Administrator',
        'Certified Scrum Master (CSM)',
        'Project Management Professional (PMP)'
      ])
    ] : []
  };
}

function createPDF(cvData, filename) {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.name, 20, 30);
  
  // Contact info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.personalInfo.email, 20, 40);
  doc.text(cvData.personalInfo.phone, 20, 45);
  doc.text(cvData.personalInfo.address, 20, 50);
  doc.text(cvData.personalInfo.city + ', ' + cvData.personalInfo.country, 20, 55);
  doc.text(cvData.personalInfo.linkedin, 20, 60);
  
  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Professional Summary', 20, 80);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(cvData.summary, 170);
  doc.text(summaryLines, 20, 90);
  
  // Experience
  let yPosition = 110;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Professional Experience', 20, yPosition);
  yPosition += 10;
  
  cvData.experience.forEach((exp, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(exp.title, 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(exp.company, 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(9);
    doc.text(`${exp.startDate} - ${exp.endDate}`, 20, yPosition);
    yPosition += 8;
    
    const descLines = doc.splitTextToSize(exp.description, 170);
    doc.text(descLines, 20, yPosition);
    yPosition += (descLines.length * 4) + 5;
  });
  
  // Education
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Education', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.education.degree, 20, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.education.university, 20, yPosition);
  yPosition += 5;
  
  doc.setFontSize(9);
  doc.text(`${cvData.education.startYear} - ${cvData.education.endYear}`, 20, yPosition);
  yPosition += 15;
  
  // Skills
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Skills', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const techSkillsText = cvData.skills.technical.join(', ');
  const techSkillsLines = doc.splitTextToSize(techSkillsText, 170);
  doc.text(techSkillsLines, 20, yPosition);
  yPosition += (techSkillsLines.length * 4) + 10;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Soft Skills', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const softSkillsText = cvData.skills.soft.join(', ');
  const softSkillsLines = doc.splitTextToSize(softSkillsText, 170);
  doc.text(softSkillsLines, 20, yPosition);
  yPosition += (softSkillsLines.length * 4) + 15;
  
  // Languages
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Languages', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  cvData.languages.forEach(lang => {
    doc.text(`${lang.name}: ${lang.level}`, 20, yPosition);
    yPosition += 5;
  });
  
  // Certifications (if any)
  if (cvData.certifications.length > 0) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Certifications', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    cvData.certifications.forEach(cert => {
      doc.text(`• ${cert}`, 20, yPosition);
      yPosition += 5;
    });
  }
  
  // Save PDF
  doc.save(filename);
}

async function generateAllCVs() {
  console.log('🚀 Starting CV generation...');
  
  const cvCount = 30; // Back to 30 CVs
  const cvs = [];
  
  // Generate CV data
  for (let i = 0; i < cvCount; i++) {
    const cv = generateCV();
    cvs.push(cv);
    console.log(`Generated CV ${i + 1}/${cvCount}: ${cv.personalInfo.name}`);
  }
  
  // Create PDFs
  for (let i = 0; i < cvs.length; i++) {
    const cv = cvs[i];
    const filename = path.join(outputDir, `CV_${cv.personalInfo.name.replace(/\s+/g, '_')}.pdf`);
    createPDF(cv, filename);
  }
  
  // Save CV data as JSON for the RAG system
  const jsonFilename = path.join(outputDir, 'cv_data.json');
  await fs.writeJson(jsonFilename, cvs, { spaces: 2 });
  
  console.log(`✅ Generated ${cvCount} CVs successfully!`);
  console.log(`📁 PDFs saved in: ${outputDir}`);
  console.log(`📄 CV data saved as: ${jsonFilename}`);
  
  return cvs;
}

// Run the generator
if (require.main === module) {
  generateAllCVs().catch(console.error);
}

module.exports = { generateAllCVs, generateCV }; 