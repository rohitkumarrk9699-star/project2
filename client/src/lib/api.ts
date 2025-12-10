import { Article, Category } from "./mockData";

const API_BASE = "/api";

// Fetch articles with no caching - FRESH scrape on every request
export async function fetchArticlesFromAPI(category?: Category): Promise<Article[]> {
  try {
    const url = category 
      ? `${API_BASE}/scrape/${encodeURIComponent(category)}`
      : `${API_BASE}/scrape-all`;
    
    console.log(`[Client] Fetching fresh articles from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle both old format (array) and new format (object with articles property)
    const articles = Array.isArray(data) ? data : data.articles || [];
    
    console.log(`[Client] Received ${articles.length} articles`);
    
    return articles;
  } catch (error) {
    console.error('[Client] Error fetching articles:', error);
    throw error;
  }
}

// Legacy endpoint for backward compatibility
export async function fetchArticlesFromLegacyAPI(category?: Category): Promise<Article[]> {
  const url = category 
    ? `${API_BASE}/articles?category=${encodeURIComponent(category)}`
    : `${API_BASE}/articles`;
  
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchArticleByIdFromAPI(id: string): Promise<Article> {
  const response = await fetch(`${API_BASE}/articles/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.statusText}`);
  }
  
  return response.json();
}

export async function triggerScrape(): Promise<{ success: boolean; count: number; articles: Article[] }> {
  const response = await fetch(`${API_BASE}/scrape-all`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to trigger scrape: ${response.statusText}`);
  }
  
  return response.json();
}
