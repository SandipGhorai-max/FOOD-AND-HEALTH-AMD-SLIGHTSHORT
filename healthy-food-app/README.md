# NourishAI - Smart Eating Application

An intelligent, production-ready digital solution to help individuals make better food choices and build sustainable healthy eating habits. 

## Features
- **Context-Aware Recommendations**: Leverages real-time data (time of day, weather) and behavioral insights.
- **Behavioral Design**: Tracks streaks and awards points for healthy choices to build habits.
- **Accessible UI**: High-contrast, ARIA-enabled semantic HTML interface.
- **Google Services Ready**: Designed with mock integration layers for Maps, Fit, and Firebase, easily swapped for live credentials.

## Technology Stack
- **Backend**: Node.js, Express, Jest (Testing)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (Mobile-first, Accessibility focused)
- **Security**: Helmet (CSP, security headers), CORS

## Local Development
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Access at: `http://localhost:3000`
4. Run tests: `npm test`

## Deployment
This project is containerized using Docker, making it highly suitable for Google Cloud Run or any container orchestration platform.
```bash
docker build -t nourish-ai .
docker run -p 8080:8080 nourish-ai
```
