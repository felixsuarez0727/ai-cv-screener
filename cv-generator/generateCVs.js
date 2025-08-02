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
  // Spain
  'Complutense University of Madrid', 'University of Barcelona', 'University of Valencia',
  'Polytechnic University of Madrid', 'University of Seville', 'University of Granada',
  'Autonomous University of Madrid', 'Pompeu Fabra University', 'University of Salamanca',
  
  // Costa Rica
  'University of Costa Rica (UCR)', 'Costa Rica Institute of Technology (TEC)',
  'National University (UNA)', 'State Distance University (UNED)',
  'Latin University of Costa Rica', 'Catholic University of Costa Rica',
  
  // United States
  'Massachusetts Institute of Technology (MIT)', 'Stanford University', 'Harvard University',
  'University of California, Berkeley', 'Carnegie Mellon University', 'Georgia Institute of Technology',
  'University of Texas at Austin', 'University of Illinois at Urbana-Champaign', 'Cornell University',
  'University of Michigan', 'University of Washington', 'New York University (NYU)',
  'University of California, Los Angeles (UCLA)', 'University of Pennsylvania', 'Columbia University',
  
  // Peru (some for diversity)
  'Peruvian University of Applied Sciences (UPC)', 'Pontifical Catholic University of Peru (PUCP)',
  'National University of Engineering (UNI)', 'University of the Pacific'
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
      description: faker.helpers.arrayElements([
        "Developed and maintained web applications using modern technologies.",
        "Led cross-functional teams to deliver high-quality software solutions.",
        "Implemented scalable backend systems and database architectures.",
        "Collaborated with stakeholders to define project requirements.",
        "Optimized application performance and user experience.",
        "Managed software development lifecycle from concept to deployment.",
        "Created responsive user interfaces and interactive features.",
        "Conducted code reviews and mentored junior developers.",
        "Integrated third-party APIs and external services.",
        "Troubleshot and resolved complex technical issues.",
        "Designed and implemented RESTful APIs and microservices.",
        "Performed database optimization and query tuning.",
        "Implemented CI/CD pipelines and automated testing.",
        "Mentored junior developers and conducted technical interviews.",
        "Collaborated with UX/UI designers to improve user experience."
      ], faker.number.int({ min: 2, max: 4 })).join(" ")
    });
  }
  
  return experiences.sort((a, b) => {
    const aYear = parseInt(a.startDate.split(' ')[1]);
    const bYear = parseInt(b.startDate.split(' ')[1]);
    return bYear - aYear;
  });
}

function generateRandomSkills() {
  const technicalCount = faker.number.int({ min: 8, max: 15 });
  const softCount = faker.number.int({ min: 5, max: 8 });
  
  const technical = faker.helpers.arrayElements(skills.technical, technicalCount);
  const soft = faker.helpers.arrayElements(skills.soft, softCount);
  
  return { technical, soft };
}

function generateRandomLanguages() {
  const numLanguages = faker.number.int({ min: 3, max: 5 });
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
      phone: faker.phone.number('+1 ### ### ####'), // US format as default
      address: faker.location.streetAddress(true),
      city: faker.location.city(),
      country: faker.helpers.arrayElement(['United States', 'Spain', 'Costa Rica', 'Peru']),
      linkedin: `linkedin.com/in/${faker.internet.userName({ firstName, lastName })}`
    },
    summary: faker.helpers.arrayElement([
      "Experienced software developer with expertise in modern web technologies and agile methodologies.",
      "Results-driven professional with strong background in full-stack development and team leadership.",
      "Skilled developer passionate about creating innovative solutions and optimizing user experiences.",
      "Dedicated professional with proven track record in software development and project management.",
      "Technical expert with deep knowledge of cloud technologies and scalable architectures."
    ]),
    experience: generateRandomExperience(),
    education: {
      university: faker.helpers.arrayElement(universities),
      degree: faker.helpers.arrayElement(degrees),
      startYear: faker.number.int({ min: 2010, max: 2018 }),
      endYear: faker.number.int({ min: 2014, max: 2022 })
    },
    skills: generateRandomSkills(),
    languages: generateRandomLanguages(),
    certifications: faker.helpers.arrayElements([
      'AWS Certified Solutions Architect',
      'Google Cloud Professional',
      'Microsoft Azure Administrator',
      'Certified Scrum Master (CSM)',
      'Project Management Professional (PMP)',
      'Certified Kubernetes Administrator (CKA)',
      'MongoDB Certified Developer',
      'Oracle Certified Professional',
      'Cisco Certified Network Associate (CCNA)',
      'ITIL Foundation Certification'
    ], faker.number.int({ min: 1, max: 3 }))
  };
}

function createPDF(cvData, filename) {
  const doc = new jsPDF();
  
  // Set margins and page width - FIXED
  const margin = 30;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - (2 * margin) - 20; // Extra safety margin
  
  // Set font
  doc.setFont('helvetica');
  
  // Header with proper margins
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.name, margin, 35);
  
  // Contact info with proper margins
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.personalInfo.email, margin, 48);
  doc.text(cvData.personalInfo.phone, margin, 56);
  doc.text(cvData.personalInfo.address, margin, 64);
  doc.text(cvData.personalInfo.city + ', ' + cvData.personalInfo.country, margin, 72);
  doc.text(cvData.personalInfo.linkedin, margin, 80);
  
  // Summary with proper margins
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFESSIONAL SUMMARY', margin, 95);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(cvData.summary, contentWidth);
  doc.text(summaryLines, margin, 105);
  
  // Experience with proper margins
  let yPosition = 110 + (summaryLines.length * 5);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
  yPosition += 15;
  
  cvData.experience.forEach((exp, index) => {
    // Check if we need a new page - more conservative
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 35;
    }
    
    // Job title
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(exp.title, margin, yPosition);
    yPosition += 8;
    
    // Company and dates
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(exp.company, margin, yPosition);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`${exp.startDate} - ${exp.endDate}`, margin, yPosition + 5);
    yPosition += 12;
    
    // Description with proper margins and line height - FIXED
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(exp.description, contentWidth);
    doc.text(descLines, margin, yPosition);
    yPosition += (descLines.length * 4.5) + 8;
  });
  
  // Education with proper margins
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 35;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EDUCATION', margin, yPosition);
  yPosition += 15;
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.education.degree, margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.education.university, margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`${cvData.education.startYear} - ${cvData.education.endYear}`, margin, yPosition);
  yPosition += 15;
  
  // Skills with proper margins
  if (yPosition > 150) {
    doc.addPage();
    yPosition = 35;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TECHNICAL SKILLS', margin, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const techSkillsText = cvData.skills.technical.join(', ');
  const techSkillsLines = doc.splitTextToSize(techSkillsText, contentWidth);
  doc.text(techSkillsLines, margin, yPosition);
  yPosition += (techSkillsLines.length * 4) + 12;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SOFT SKILLS', margin, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const softSkillsText = cvData.skills.soft.join(', ');
  const softSkillsLines = doc.splitTextToSize(softSkillsText, contentWidth);
  doc.text(softSkillsLines, margin, yPosition);
  yPosition += (softSkillsLines.length * 4) + 15;
  
  // Languages with proper margins
  if (yPosition > 140) {
    doc.addPage();
    yPosition = 35;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('LANGUAGES', margin, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  cvData.languages.forEach(lang => {
    doc.text(`${lang.name}: ${lang.level}`, margin, yPosition);
    yPosition += 6;
  });
  
  // Certifications (if any) with proper margins
  if (cvData.certifications.length > 0) {
    if (yPosition > 120) {
      doc.addPage();
      yPosition = 35;
    }
    
    yPosition += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS', margin, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    cvData.certifications.forEach(cert => {
      doc.text(`• ${cert}`, margin, yPosition);
      yPosition += 6;
    });
  }
  
  // Save PDF
  doc.save(filename);
}

async function generateAllCVs() {
  console.log('🚀 Starting CV generation...');
  
              const cvCount = 30;
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