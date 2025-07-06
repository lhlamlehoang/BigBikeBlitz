# 🏍️ Big Bike Blitz - Premium Motorcycle Marketplace

A modern, professional motorcycle e-commerce platform built with React, TypeScript, and Spring Boot. Experience the thrill of premium motorcycles with our curated selection of BMW, Honda, Yamaha, Kawasaki, and Suzuki bikes.

![Big Bike Blitz](https://img.shields.io/badge/Big%20Bike%20Blitz-Premium%20Motorcycles-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.13.0-blue)

## ✨ Features

### 🛍️ **E-commerce Excellence**
- **Product Catalog**: Browse premium motorcycles with detailed specifications
- **Advanced Search**: Filter by brand, type, price range, and specifications
- **Shopping Cart**: Seamless cart management with quantity controls
- **Order Management**: Track orders and view purchase history
- **Secure Payments**: Integrated payment processing (ready for Stripe/PayPal)

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Professional Styling**: Clean, modern interface with Ant Design
- **Smooth Animations**: Engaging user interactions and transitions
- **Dark/Light Mode**: Theme customization (coming soon)
- **Accessibility**: WCAG compliant design patterns

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and user role management
- **Password Security**: Encrypted password storage
- **Session Management**: Secure user sessions
- **CSRF Protection**: Cross-site request forgery prevention

### 📊 **Analytics & Performance**
- **User Analytics**: Track user behavior and interactions
- **Performance Monitoring**: Core Web Vitals tracking
- **SEO Optimization**: Meta tags, structured data, and sitemaps
- **Error Tracking**: Comprehensive error monitoring
- **Performance Metrics**: Page load times and user experience metrics

### 🤖 **AI-Powered Features**
- **Intelligent Chat Assistant**: AI-powered customer support and product recommendations
- **Product Knowledge Base**: Comprehensive motorcycle information and specifications
- **Smart Search**: AI-enhanced product search with natural language processing
- **Personalized Recommendations**: Machine learning-based product suggestions
- **Automated Data Collection**: Web scraping for real-time product information
- **Conversation Management**: Context-aware chat sessions with memory
- **Multi-Model Support**: Integration with various AI models (Claude, GPT, etc.)

### 🚀 **Professional Features**
- **Newsletter Signup**: Lead generation and customer engagement
- **Cookie Consent**: GDPR-compliant privacy management
- **Error Boundaries**: Graceful error handling
- **Loading States**: Professional loading indicators
- **Search Functionality**: Advanced product search with filters

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **TypeScript 5.0** - Type-safe development
- **Ant Design 5.13.0** - Professional UI components
- **React Router 6.22.3** - Client-side routing
- **Axios 1.10.0** - HTTP client
- **Vite 4.0** - Fast build tool
- **Tailwind CSS 3.0** - Utility-first CSS framework

### Backend
- **Spring Boot 3.x** - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL/PostgreSQL** - Database (configurable)
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### AI Agent
- **Python 3.10+** - AI and machine learning framework
- **Anthropic Claude** - Advanced language model integration
- **ChromaDB** - Vector database for knowledge storage
- **FastAPI** - High-performance API framework
- **SQLite** - Local database for conversation history
- **Beautiful Soup** - Web scraping capabilities
- **Celery** - Asynchronous task processing
- **Redis** - Message broker and caching

## 🚀 Quick Start

### Option 1: One-Step Docker Setup (Recommended)
```bash
# Everything is pre-configured! Just run:
docker-compose up --build
```

**Or use the startup scripts:**
```bash
# Linux/macOS:
chmod +x start.sh
./start.sh

# Windows:
start.bat
```

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:8080
- AI Agent: http://localhost:8000
- AI Health Check: http://localhost:8000/api/health

### Option 2: Manual Setup
If you prefer to run services individually:

#### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- MySQL 8.0+ or PostgreSQL 13+
- Python 3.10+

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
mvn install

# Run the application
mvn spring-boot:run
```

### AI Agent Setup

```bash
# Navigate to ai_agent directory
cd ai_agent

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Initialize the knowledge base
python knowledge_base.py

# Start the AI agent
python main.py
```

### Environment Configuration

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Big Bike Blitz
```

**Backend (application.properties)**
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bigbikeblitz
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

**AI Agent (.env)**
```env
# AI Model Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key
OLLAMA_BASE_URL=http://localhost:11434

# Database Configuration
DATABASE_URL=sqlite:///ai_agent.db

# Knowledge Base Configuration
CHROMA_PERSIST_DIRECTORY=./knowledge_base
EMBEDDING_MODEL=text-embedding-ada-002

# Web Scraping Configuration
SCRAPING_DELAY=1
MAX_RETRIES=3

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=ai_agent.log
```

## 📁 Project Structure

```
BigBikeBlitz/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── auth/           # Authentication logic
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Spring Boot backend application
│   ├── src/main/java/
│   │   ├── controller/     # REST API controllers
│   │   ├── model/         # Data models
│   │   ├── repository/    # Data access layer
│   │   ├── security/      # Security configuration
│   │   └── config/        # Application configuration
│   └── pom.xml           # Backend dependencies
├── ai_agent/              # AI-powered chatbot and assistant
│   ├── main.py            # Main AI agent application
│   ├── chat_manager.py    # Conversation management
│   ├── knowledge_base.py  # Knowledge base operations
│   ├── database.py        # Database operations
│   ├── website_scraper.py # Web scraping functionality
│   ├── product_data.py    # Product data management
│   ├── ollama_client.py   # AI model integration
│   ├── config.py          # Configuration settings
│   ├── requirements.txt   # Python dependencies
│   ├── knowledge_base/    # Vector database storage
│   └── venv/             # Python virtual environment
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile.backend     # Backend Docker configuration
├── Dockerfile.frontend    # Frontend Docker configuration
├── Dockerfile.ai_agent    # AI Agent Docker configuration
├── start.sh              # Linux/macOS startup script
├── start.bat             # Windows startup script
├── setup-docker.sh       # Environment setup script (Linux/macOS)
├── setup-docker.bat      # Environment setup script (Windows)
└── README.md             # Project documentation
```

## 🎯 Key Features Implementation

### SEO Optimization
- Comprehensive meta tags for all pages
- Open Graph and Twitter Card support
- Structured data markup
- Sitemap generation
- Performance optimization

### User Experience
- Professional loading states
- Error boundaries for graceful error handling
- Responsive design across all devices
- Smooth animations and transitions
- Intuitive navigation

### Security
- JWT-based authentication
- Role-based access control
- Secure password handling
- CSRF protection
- Input validation and sanitization

### Analytics & Monitoring
- User interaction tracking
- Performance monitoring
- Error tracking
- Core Web Vitals measurement
- Custom event tracking

## 🤖 AI Agent Features

### Intelligent Chat System
- **Natural Language Processing**: Understands user queries in natural language
- **Context Awareness**: Maintains conversation context across sessions
- **Product Recommendations**: Suggests motorcycles based on user preferences
- **Technical Support**: Provides detailed motorcycle specifications and advice
- **Multi-turn Conversations**: Handles complex, multi-step interactions

### Knowledge Management
- **Vector Database**: Stores and retrieves motorcycle information efficiently
- **Real-time Updates**: Automatically updates product information
- **Web Scraping**: Collects current motorcycle data from various sources
- **Data Validation**: Ensures accuracy and consistency of information
- **Scalable Storage**: Handles large amounts of product data

### AI Model Integration
- **Claude Integration**: Advanced language model for natural conversations
- **Multi-Model Support**: Can switch between different AI models
- **Response Generation**: Creates human-like, informative responses
- **Error Handling**: Graceful handling of AI model failures
- **Rate Limiting**: Manages API calls efficiently

### Conversation Management
- **Session Persistence**: Saves conversation history for continuity
- **User Preferences**: Learns and remembers user preferences
- **Chat History**: Maintains detailed conversation logs
- **Export Capabilities**: Allows users to export conversation data
- **Privacy Controls**: Secure handling of user data

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- Conventional commits

### Testing
```bash
# Frontend tests
npm test

# Backend tests
mvn test
```

### Building for Production
```bash
# Frontend build
npm run build

# Backend build
mvn clean package
```

## 🚀 Deployment

### Docker Deployment (One-Step Setup)
```bash
# Everything is pre-configured! Just run:
docker-compose up --build
```

**That's it!** The application will:
- Build all containers automatically
- Set up the database with sample data
- Start all services (Frontend, Backend, AI Agent)
- Work in demo mode without requiring API keys
- Be available at the URLs below

### Optional: Custom Configuration
If you want to use real AI models, create a `.env` file:

```env
# AI Agent Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OLLAMA_BASE_URL=http://localhost:11434

# Optional: Additional AI Model Keys
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

### Docker Services
The application runs the following services:
- **MySQL Database** (Port 3306) - Database for the backend
- **Backend API** (Port 8080) - Spring Boot REST API
- **Frontend** (Port 80) - React application with Nginx
- **AI Agent** (Port 8000) - FastAPI AI chatbot service

### Manual Deployment
1. Build frontend: `npm run build`
2. Build backend: `mvn clean package`
3. Deploy to your preferred hosting platform

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading for better performance
- **Image Optimization**: Compressed and optimized images
- **Caching**: Browser and server-side caching
- **CDN**: Content delivery network ready
- **Gzip Compression**: Reduced file sizes

## 🔒 Security Features

- **HTTPS**: Secure communication
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **Rate Limiting**: API rate limiting

## 📊 Analytics & Monitoring

- **User Behavior Tracking**: Page views, clicks, conversions
- **Performance Metrics**: Load times, Core Web Vitals
- **Error Monitoring**: Real-time error tracking
- **Business Intelligence**: Sales analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@bigbikeblitz.com
- **Phone**: +1 (555) 123-4567

## 🙏 Acknowledgments

- Ant Design for the beautiful UI components
- Spring Boot team for the robust backend framework
- React team for the amazing frontend library
- All contributors and supporters

---

**Made with ❤️ for motorcycle enthusiasts**

*Big Bike Blitz - Your Premier Motorcycle Destination* 