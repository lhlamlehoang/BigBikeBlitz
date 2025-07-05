# BigBikeBlitz

BigBikeBlitz is a full-stack web application for browsing, managing, and purchasing bikes and accessories. It features a modern React frontend and a robust Java Spring Boot backend.

## Features
- User authentication and registration
- Product catalog with detailed pages
- Shopping cart and order management
- Admin panel for product and order management
- File upload support
- Responsive design

## Tech Stack
- **Frontend:** React, TypeScript, Ant Design, Vite
- **Backend:** Java, Spring Boot, Spring Security, Maven
- **Database:** (Configure in backend, e.g., H2, MySQL, PostgreSQL)
- **Other:** Docker support, RESTful APIs

## Project Structure
```
BigBikeBlitz/
  backend/      # Java Spring Boot backend
  frontend/     # React frontend
  docker-compose.yml
  Dockerfile.backend
  Dockerfile.frontend
```

## Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- Maven
- Docker (optional, for containerized setup)

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Compose (Full Stack)
```bash
docker-compose up --build
```

## Contribution Guidelines
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License. 