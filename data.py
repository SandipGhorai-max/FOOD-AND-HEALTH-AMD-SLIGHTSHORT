"""
Data module for the Google Cloud Technologies Conference.
Contains dummy data for 8 talks, 1 lunch break, and speaker details.
"""

from typing import List, Dict, Any

TALKS: List[Dict[str, Any]] = [
    {
        "id": "T01",
        "title": "Introduction to Google Cloud Platform",
        "category": "Infrastructure",
        "description": "A comprehensive overview of core GCP services including Compute Engine, Cloud Storage, and VPCs. Perfect for beginners to cloud computing.",
        "time": "09:00 AM - 10:00 AM",
        "speakers": [
            {
                "firstName": "Alice",
                "lastName": "Johnson",
                "linkedin": "https://linkedin.com/in/alicejohnson"
            }
        ]
    },
    {
        "id": "T02",
        "title": "Scaling Applications with Kubernetes Engine (GKE)",
        "category": "Containers & Orchestration",
        "description": "Learn how to deploy, manage, and scale containerized applications seamlessly using Google Kubernetes Engine.",
        "time": "10:00 AM - 11:00 AM",
        "speakers": [
            {
                "firstName": "Bob",
                "lastName": "Smith",
                "linkedin": "https://linkedin.com/in/bobsmith"
            },
            {
                "firstName": "Charlie",
                "lastName": "Davis",
                "linkedin": "https://linkedin.com/in/charliedavis"
            }
        ]
    },
    {
        "id": "T03",
        "title": "Serverless Data Warehousing with BigQuery",
        "category": "Data & Analytics",
        "description": "Deep dive into BigQuery architecture. Discover how to analyze petabytes of data with zero operational overhead using standard SQL.",
        "time": "11:00 AM - 12:00 PM",
        "speakers": [
            {
                "firstName": "Diana",
                "lastName": "Prince",
                "linkedin": "https://linkedin.com/in/dianaprince"
            }
        ]
    },
    {
        "id": "BREAK",
        "title": "Lunch Break",
        "category": "Networking",
        "description": "60 minutes to recharge, network with peers, and explore the sponsor booths.",
        "time": "12:00 PM - 01:00 PM",
        "speakers": []
    },
    {
        "id": "T04",
        "title": "Machine Learning on GCP: From Vertex AI to AutoML",
        "category": "AI & Machine Learning",
        "description": "Explore Google's unified ML platform. Learn how to train and deploy ML models faster with Vertex AI and custom tooling.",
        "time": "01:00 PM - 02:00 PM",
        "speakers": [
            {
                "firstName": "Eve",
                "lastName": "Torres",
                "linkedin": "https://linkedin.com/in/evetorres"
            }
        ]
    },
    {
        "id": "T05",
        "title": "Building Event-Driven Architectures with Cloud Run and Eventarc",
        "category": "Serverless",
        "description": "Discover how to build loosely coupled microservices utilizing Cloud Run and trigger them dynamically with Eventarc.",
        "time": "02:00 PM - 03:00 PM",
        "speakers": [
            {
                "firstName": "Frank",
                "lastName": "Castle",
                "linkedin": "https://linkedin.com/in/frankcastle"
            },
            {
                "firstName": "Grace",
                "lastName": "Hopper",
                "linkedin": "https://linkedin.com/in/gracehopper"
            }
        ]
    },
    {
        "id": "T06",
        "title": "Securing Your Cloud Environment: Best Practices",
        "category": "Security",
        "description": "Learn about IAM, Cloud KMS, and Security Command Center to fortify your GCP workloads against modern threats.",
        "time": "03:00 PM - 04:00 PM",
        "speakers": [
            {
                "firstName": "Heidi",
                "lastName": "Klum",
                "linkedin": "https://linkedin.com/in/heidiklum"
            }
        ]
    },
    {
        "id": "T07",
        "title": "Global Databases: Spanner vs. Cloud SQL",
        "category": "Databases",
        "description": "Understand the trade-offs between Cloud Spanner and Cloud SQL to choose the right relational database for your global applications.",
        "time": "04:00 PM - 05:00 PM",
        "speakers": [
            {
                "firstName": "Ivan",
                "lastName": "Drago",
                "linkedin": "https://linkedin.com/in/ivandrago"
            }
        ]
    },
    {
        "id": "T08",
        "title": "Modern App Dev: Firebase meets Google Cloud",
        "category": "Web & Mobile",
        "description": "Bridge the gap between frontend and backend. See how Firebase and Google Cloud together empower rapid application development.",
        "time": "05:00 PM - 06:00 PM",
        "speakers": [
            {
                "firstName": "Jack",
                "lastName": "Ryan",
                "linkedin": "https://linkedin.com/in/jackryan"
            }
        ]
    }
]

def search_talks(query: str) -> List[Dict[str, Any]]:
    """
    Search for talks by title, category, or speaker name (case-insensitive).
    Excludes the Lunch Break from search results unless queried specifically.
    """
    query = query.lower().strip()
    if not query:
        return TALKS

    results = []
    for talk in TALKS:
        # Check Title
        if query in talk["title"].lower():
            results.append(talk)
            continue
        # Check Category
        if query in talk["category"].lower():
            results.append(talk)
            continue
        # Check Speakers
        speaker_match = False
        for speaker in talk["speakers"]:
            full_name = f"{speaker['firstName']} {speaker['lastName']}".lower()
            if query in full_name or query in speaker['firstName'].lower() or query in speaker['lastName'].lower():
                speaker_match = True
                break
        if speaker_match:
            results.append(talk)

    return results
