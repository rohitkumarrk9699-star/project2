import { Article, Category } from "./mockData";

const API_BASE = "/api";

export async function fetchArticlesFromAPI(category?: Category): Promise<Article[]> {
  const url = category 
    ? `${API_BASE}/articles?category=${encodeURIComponent(category)}`
    : `${API_BASE}/articles`;
  
  const response = await fetch(url);
  
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

export async function triggerScrape(): Promise<{ success: boolean; message: string; count: number }> {
  const response = await fetch(`${API_BASE}/scrape`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to trigger scrape: ${response.statusText}`);
  }
  
  return response.json();
}
