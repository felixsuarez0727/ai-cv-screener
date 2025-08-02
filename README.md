# AI CV Screener 🚀

A complete AI-powered CV screening system that uses a RAG (Retrieval-Augmented Generation) pipeline to answer questions about candidates based solely on information from their CVs.

## ✨ Features

- **Automatic CV Generation**: Creates 30 unique and realistic CVs in PDF format
- **Complete RAG Pipeline**: Extracts, processes, and stores CV information in a vector database
- **Intelligent Chat**: Chat interface that answers questions based solely on the CVs
- **Semantic Search**: Finds relevant information using embeddings
- **Modern Interface**: React frontend with responsive design and optimized UX
- **Free APIs**: Uses Google AI Studio, OpenAI, or OpenRouter based on availability

## 🏗️ Architecture

```
ai-cv-screener/
├── cv-generator/          # Fake CV generator
├── backend/              # API with RAG pipeline
├── frontend/             # React chat interface
├── cvs/                  # Generated CVs (PDFs)
└── chroma_db/           # Vector database
```

## 🚀 Quick Installation

### 1. Clone and configure

```bash
git clone <repository-url>
cd ai-cv-screener
```

### 2. Configure environment variables

```bash
cp env.example .env
```

Edit `.env` and add your API keys:
```env
# Use at least one of these options:
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
```

### 3. Install dependencies and generate CVs

```bash
npm run setup
```

### 4. Run the system

```bash
# Terminal 1: Backend
npm run start-backend

# Terminal 2: Frontend
npm run start-frontend
```

Or run both simultaneously:
```bash
npm run dev
```

## 📋 Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **API Key** from at least one of these services:
  - [Google AI Studio](https://aistudio.google.com/apikey) (Recommended - Free)
  - [OpenAI](https://platform.openai.com/api-keys)
  - [OpenRouter](https://openrouter.ai/keys)

## 🔧 Detailed Configuration

### Environment Variables

```env
# API Keys (use at least one)
GOOGLE_AI_API_KEY=your_google_ai_api_key
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Server configuration
PORT=3001
NODE_ENV=development

# Vector database
CHROMA_DB_PATH=./chroma_db

# Frontend
REACT_APP_API_URL=http://localhost:3001

# CV generation
CV_OUTPUT_DIR=./cvs
CV_COUNT=30
```

### Available Scripts

```bash
# Complete installation
npm run setup

# Generate CVs
npm run generate-cvs

# Run backend
npm run start-backend

# Run frontend
npm run start-frontend

# Run both
npm run dev

# Build frontend
npm run build
```

## 🎯 System Usage

### 1. Access the application

Open your browser and go to: `http://localhost:3000`

### 2. Example questions

The system can answer questions like:

- **"Who has experience with Python?"**
- **"What candidates graduated from UPC?"**
- **"Summarize the profile of [candidate name]"**
- **"Who speaks Spanish and English?"**
- **"Show me developers with more than 3 years of experience"**
- **"Who has AWS certifications?"**
- **"Search for candidates with React experience"**

### 3. Interpreting responses

- Responses are based solely on available CVs
- Sources used are shown (candidate names)
- If no information is available, the system will clearly indicate this

## 🏛️ Project Structure

### Backend (`/backend`)

```
backend/
├── server.js              # Main Express server
├── routes/
│   └── chat.js           # Chat endpoints
├── services/
│   ├── pdfProcessor.js   # PDF processing
│   ├── vectorStore.js    # Vector database
│   └── llmService.js     # LLM integration
└── data/                 # Processed data
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── InputForm.jsx
│   │   └── Header.js
│   ├── services/
│   │   └── api.js
│   └── App.js
└── public/
```

### CV Generator (`/cv-generator`)

```
cv-generator/
├── generateCVs.js        # Main script
├── generated-cvs/        # Generated CVs
│   ├── CV_*.pdf         # Individual PDFs
│   └── cv_data.json     # Structured data
└── package.json
```

## 🔍 RAG Pipeline

### 1. Data Extraction
- CVs are processed and extracted as structured text
- Text chunks are created for better retrieval

### 2. Embeddings
- Each chunk is converted to embeddings using OpenAI
- Stored in ChromaDB (local vector database)

### 3. Retrieval
- Questions are converted to embeddings
- Most similar chunks are searched

### 4. Generation
- Relevant chunks are sent to the LLM
- A response is generated based solely on that information

## 🛠️ Technologies Used

### Backend
- **Node.js** + **Express**
- **LangChain** (RAG pipeline)
- **ChromaDB** (vector database)
- **OpenAI Embeddings**
- **Google AI / OpenAI / OpenRouter** (LLM)

### Frontend
- **React** 18
- **Tailwind CSS**
- **Axios** (HTTP client)
- **Lucide React** (icons)

### CV Generation
- **jsPDF** (PDF generation)
- **Faker.js** (fake data)
- **PDF-parse** (text extraction)

## 🐛 Troubleshooting

### Backend connection error
```bash
# Verify backend is running
curl http://localhost:3001/api/health
```

### API key error
```bash
# Verify environment variables
echo $GOOGLE_AI_API_KEY
echo $OPENAI_API_KEY
```

### Dependency error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Clean data
```bash
# Clean CVs and vector database
rm -rf cv-generator/generated-cvs
rm -rf backend/data
rm -rf chroma_db
```

## 📊 Performance

- **CV Generation**: ~30 seconds for 30 CVs
- **RAG Processing**: ~10 seconds to initialize
- **Chat responses**: 2-5 seconds per question
- **Vector database**: Supports up to 10,000 documents

## 🔒 Security

- No real personal data is stored
- Generated CVs are completely fictional
- API keys are handled securely
- CORS configured for local development

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🆘 Support

If you have problems or questions:

1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Make sure you have a valid API key configured
4. Open an issue in the repository

---

**Enjoy using the AI CV Screener! 🎉**
