# AI CV Screener 🚀

Un sistema completo de screening de CVs con IA que utiliza un pipeline RAG (Retrieval-Augmented Generation) para responder preguntas sobre candidatos basándose únicamente en la información de sus CVs.

## ✨ Características

- **Generación automática de CVs**: Crea 30 CVs únicos y realistas en formato PDF
- **Pipeline RAG completo**: Extrae, procesa y almacena información de CVs en una base de datos vectorial
- **Chat inteligente**: Interfaz de chat que responde preguntas basándose únicamente en los CVs
- **Búsqueda semántica**: Encuentra información relevante usando embeddings
- **Interfaz moderna**: Frontend React con diseño responsive y UX optimizada
- **APIs gratuitas**: Utiliza Google AI Studio, OpenAI o OpenRouter según disponibilidad

## 🏗️ Arquitectura

```
ai-cv-screener/
├── cv-generator/          # Generador de CVs falsos
├── backend/              # API con pipeline RAG
├── frontend/             # Interfaz de chat React
├── cvs/                  # CVs generados (PDFs)
└── chroma_db/           # Base de datos vectorial
```

## 🚀 Instalación Rápida

### 1. Clonar y configurar

```bash
git clone <repository-url>
cd ai-cv-screener
```

### 2. Configurar variables de entorno

```bash
cp env.example .env
```

Edita `.env` y añade tus API keys:
```env
# Usa al menos una de estas opciones:
GOOGLE_AI_API_KEY=tu_google_ai_key
OPENAI_API_KEY=tu_openai_key
OPENROUTER_API_KEY=tu_openrouter_key
```

### 3. Instalar dependencias y generar CVs

```bash
npm run setup
```

### 4. Ejecutar el sistema

```bash
# Terminal 1: Backend
npm run start-backend

# Terminal 2: Frontend
npm run start-frontend
```

O ejecutar ambos simultáneamente:
```bash
npm run dev
```

## 📋 Requisitos Previos

- **Node.js** 18+ 
- **npm** o **yarn**
- **API Key** de al menos uno de estos servicios:
  - [Google AI Studio](https://aistudio.google.com/apikey) (Recomendado - Gratuito)
  - [OpenAI](https://platform.openai.com/api-keys)
  - [OpenRouter](https://openrouter.ai/keys)

## 🔧 Configuración Detallada

### Variables de Entorno

```env
# API Keys (usa al menos una)
GOOGLE_AI_API_KEY=your_google_ai_api_key
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Configuración del servidor
PORT=3001
NODE_ENV=development

# Base de datos vectorial
CHROMA_DB_PATH=./chroma_db

# Frontend
REACT_APP_API_URL=http://localhost:3001

# Generación de CVs
CV_OUTPUT_DIR=./cvs
CV_COUNT=30
```

### Scripts Disponibles

```bash
# Instalación completa
npm run setup

# Generar CVs
npm run generate-cvs

# Ejecutar backend
npm run start-backend

# Ejecutar frontend
npm run start-frontend

# Ejecutar ambos
npm run dev

# Construir frontend
npm run build
```

## 🎯 Uso del Sistema

### 1. Acceder a la aplicación

Abre tu navegador y ve a: `http://localhost:3000`

### 2. Ejemplos de preguntas

El sistema puede responder preguntas como:

- **"¿Quién tiene experiencia con Python?"**
- **"¿Qué candidatos se graduaron de UPC?"**
- **"Resume el perfil de [nombre del candidato]"**
- **"¿Quién habla español e inglés?"**
- **"Muéstrame desarrolladores con más de 3 años de experiencia"**
- **"¿Quién tiene certificaciones en AWS?"**
- **"Busca candidatos con experiencia en React"**

### 3. Interpretar respuestas

- Las respuestas se basan únicamente en los CVs disponibles
- Se muestran las fuentes utilizadas (nombres de candidatos)
- Si no hay información disponible, el sistema lo indicará claramente

## 🏛️ Estructura del Proyecto

### Backend (`/backend`)

```
backend/
├── server.js              # Servidor Express principal
├── routes/
│   └── chat.js           # Endpoints de chat
├── services/
│   ├── pdfProcessor.js   # Procesamiento de PDFs
│   ├── vectorStore.js    # Base de datos vectorial
│   └── llmService.js     # Integración con LLM
└── data/                 # Datos procesados
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

### Generador de CVs (`/cv-generator`)

```
cv-generator/
├── generateCVs.js        # Script principal
├── generated-cvs/        # CVs generados
│   ├── CV_*.pdf         # PDFs individuales
│   └── cv_data.json     # Datos estructurados
└── package.json
```

## 🔍 Pipeline RAG

### 1. Extracción de Datos
- Los CVs se procesan y extraen en texto estructurado
- Se crean chunks de texto para mejor recuperación

### 2. Embeddings
- Cada chunk se convierte en embeddings usando OpenAI
- Se almacenan en ChromaDB (base vectorial local)

### 3. Retrieval
- Las preguntas se convierten en embeddings
- Se buscan los chunks más similares

### 4. Generation
- Los chunks relevantes se envían al LLM
- Se genera una respuesta basada únicamente en esa información

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express**
- **LangChain** (pipeline RAG)
- **ChromaDB** (base vectorial)
- **OpenAI Embeddings**
- **Google AI / OpenAI / OpenRouter** (LLM)

### Frontend
- **React** 18
- **Tailwind CSS**
- **Axios** (HTTP client)
- **Lucide React** (iconos)

### Generación de CVs
- **jsPDF** (generación de PDFs)
- **Faker.js** (datos falsos)
- **PDF-parse** (extracción de texto)

## 🐛 Solución de Problemas

### Error de conexión con el backend
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:3001/api/health
```

### Error de API key
```bash
# Verificar variables de entorno
echo $GOOGLE_AI_API_KEY
echo $OPENAI_API_KEY
```

### Error de dependencias
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Limpiar datos
```bash
# Limpiar CVs y base vectorial
rm -rf cv-generator/generated-cvs
rm -rf backend/data
rm -rf chroma_db
```

## 📊 Rendimiento

- **Generación de CVs**: ~30 segundos para 30 CVs
- **Procesamiento RAG**: ~10 segundos para inicializar
- **Respuestas de chat**: 2-5 segundos por pregunta
- **Base vectorial**: Soporta hasta 10,000 documentos

## 🔒 Seguridad

- No se almacenan datos personales reales
- Los CVs generados son completamente ficticios
- Las API keys se manejan de forma segura
- CORS configurado para desarrollo local

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de solución de problemas
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de tener una API key válida configurada
4. Abre un issue en el repositorio

---

**¡Disfruta usando el AI CV Screener! 🎉**
