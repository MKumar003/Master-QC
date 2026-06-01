import random

# In a real application, this module would either:
# 1. Scrape social media platforms (TikTok, Reels, Shorts)
# 2. Use a third-party API like Trendkite or similar
# 3. Or use Gemini to analyze current news/trends from search
# For this prototype, we simulate daily AI-curated trends

def get_daily_trends():
    """Returns AI-curated daily trends for the Trends Dashboard."""
    
    # Base simulated trends
    trends = [
        {
            "id": "t1",
            "category": "video",
            "name": "Fast-Paced Zoom Transitions",
            "description": "High energy zoom-ins synced to beat drops.",
            "popularity": random.randint(85, 98),
        },
        {
            "id": "t2",
            "category": "audio",
            "name": "ASMR Product Sounds",
            "description": "Crisp, isolated sounds of products over lo-fi background tracks.",
            "popularity": random.randint(75, 95),
        },
        {
            "id": "t3",
            "category": "design",
            "name": "Neo-Brutalism",
            "description": "Raw, unpolished design with high contrast, harsh shadows, and bold typography.",
            "popularity": random.randint(80, 92),
            "hex": "#E0FE10"
        },
        {
            "id": "t4",
            "category": "color",
            "name": "Cyberpunk Neon",
            "description": "Deep purples mixed with bright cyan and magenta accents.",
            "popularity": random.randint(88, 99),
            "hex": "#06b6d4"
        },
        {
            "id": "t5",
            "category": "typography",
            "name": "Kinetic Typography",
            "description": "Text that moves and stretches to emphasize words in short-form video.",
            "popularity": random.randint(70, 85),
        },
        {
            "id": "t6",
            "category": "video",
            "name": "POV & Vlog Style",
            "description": "Authentic, slightly shaky camera work to feel like a personal vlog.",
            "popularity": random.randint(82, 94),
        }
    ]
    
    # Sort by popularity descending
    trends.sort(key=lambda x: x["popularity"], reverse=True)
    return trends
