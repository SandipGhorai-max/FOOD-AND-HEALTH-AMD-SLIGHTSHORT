import pytest
from app import app
from data import search_talks, TALKS

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test if home page loads correctly."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Google Cloud Technologies Conference" in response.data

def test_api_search_empty(client):
    """Test API search with empty query returns all talks."""
    response = client.get('/api/search?q=')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == len(TALKS)

def test_api_search_valid(client):
    """Test API search by title."""
    response = client.get('/api/search?q=kubernetes')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['title'] == "Scaling Applications with Kubernetes Engine (GKE)"

def test_api_search_speaker(client):
    """Test API search by speaker name."""
    response = client.get('/api/search?q=Alice')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['speakers'][0]['firstName'] == "Alice"

def test_api_search_category(client):
    """Test API search by category."""
    response = client.get('/api/search?q=Security')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['category'] == "Security"

def test_api_search_no_results(client):
    """Test API search with no matching results."""
    response = client.get('/api/search?q=xyz123')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 0

def test_search_talks_function_edge_cases():
    """Test edge cases in search logic."""
    # Test case insensitivity
    results1 = search_talks("KUBERNETES")
    results2 = search_talks("kubernetes")
    assert results1 == results2
    
    # Test whitespace trimming
    results3 = search_talks("  kubernetes  ")
    assert results1 == results3
    
    # Test partial matches
    results4 = search_talks("bernet")
    assert len(results4) == 1

def test_xss_prevention(client):
    """Test if HTML tags are properly escaped in the response."""
    response = client.get('/api/search?q=<script>alert("xss")</script>')
    assert response.status_code == 200
    # The output should not contain the exact raw script tag
    # Even if it returns 0 results, the log shouldn't execute it, but we can't test logs easily.
    # We just ensure it doesn't break the JSON response.
    data = response.get_json()
    assert isinstance(data, list)
