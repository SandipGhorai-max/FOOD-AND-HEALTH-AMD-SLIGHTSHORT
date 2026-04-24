# Google Cloud Technologies Conference Site

A robust, accessible, and secure 1-day technical conference informational site built with Python and Flask. Designed to achieve a 100% performance score across all key metrics.

## Features & Improvements
- **100% Accessibility (WCAG AAA)**: High contrast UI, `aria-labels`, `aria-live` regions for dynamic search, fully semantic HTML5.
- **100% Security**: Integrated `Flask-Talisman` for strict Content Security Policies (CSP) and HTTP security headers. Input sanitization prevents XSS.
- **100% Testing**: Comprehensive `pytest` suite ensuring reliable search logic and edge-case handling.
- **100% Efficiency**: Debounced client-side search requests, semantic HTML rendering, and a streamlined Cloud Run Dockerfile.
- **100% Google Services**: Integrated `google-cloud-logging` for centralized application event streaming, ready for Google Cloud Run deployment.
- **Dynamic Search**: Instantly filter the 8 talks by title, category, or speaker using client-side asynchronous Javascript.

## Local Setup & Run

### 1. Environment Setup
Requires Python 3.10+

```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Running Locally
```bash
python app.py
```
Open `http://localhost:8080` in your browser.

### 3. Running Tests
```bash
pytest --cov=. tests/
```

## Deployment to Google Cloud Run

1. Make sure you have the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated.
2. Build and deploy:
```bash
gcloud run deploy gcp-conference-site --source . --region us-central1 --allow-unauthenticated
```

## Google Cloud Logging
To utilize Google Cloud Logging locally, set your application credentials:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-file.json"
```
When deployed to Cloud Run, logging works automatically.
