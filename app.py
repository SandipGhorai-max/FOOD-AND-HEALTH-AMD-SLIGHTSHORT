"""
Main Flask application for the Google Cloud Technologies Conference.
"""

import os
import logging
from flask import Flask, render_template, request, jsonify
from markupsafe import escape
from data import TALKS, search_talks

# Attempt to initialize Google Cloud Logging
try:
    import google.cloud.logging
    client = google.cloud.logging.Client()
    client.setup_logging()
    logging.info("Google Cloud Logging successfully initialized.")
except Exception as e:
    logging.basicConfig(level=logging.INFO)
    logging.warning(f"Google Cloud Logging not initialized (using basic logging). Reason: {e}")

# Initialize Flask app
app = Flask(__name__)

# Initialize Flask-Talisman for strict CSP and security headers
try:
    from flask_talisman import Talisman
    csp = {
        'default-src': [
            '\'self\''
        ],
        'style-src': [
            '\'self\'',
            'https://fonts.googleapis.com'
        ],
        'font-src': [
            '\'self\'',
            'https://fonts.gstatic.com'
        ],
        'script-src': [
            '\'self\''
        ]
    }
    
    # Disable force_https if running locally or if Cloud Run proxy handles it
    is_testing = os.environ.get('TESTING', 'False').lower() == 'true'
    Talisman(app, content_security_policy=csp, force_https=not is_testing)
except ImportError:
    logging.warning("Flask-Talisman not installed. Running without strict CSP.")

@app.route('/')
def index():
    """Render the home page with the full schedule."""
    # Context data for the template
    context = {
        "date": "October 24, 2026",
        "location": "Google Cloud Next Arena, San Francisco, CA",
        "talks": TALKS
    }
    return render_template('index.html', **context)

@app.route('/api/search')
def search():
    """API endpoint to search talks by category, speaker, or title."""
    query = request.args.get('q', '')
    # Sanitize input to prevent XSS
    safe_query = escape(query)
    
    if safe_query:
        logging.info(f"User searched for: {safe_query}")
        
    results = search_talks(safe_query)
    return jsonify(results)

if __name__ == '__main__':
    # Use standard port 8080 for Cloud Run
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
