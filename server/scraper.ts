import axios from 'axios';
import * as cheerio from 'cheerio';

export type Category = "International" | "Sports" | "Technology" | "Health" | "Science";

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  category: Category;
  timestamp: string;
}

interface NewsSource {
  url: string;
  name: string;
  selectors: {
    articles: string;
    title: string;
    link: string;
    image?: string;
    excerpt?: string;
  };
}

const NEWS_SOURCES: Record<Category, NewsSource[]> = {
  International: [
    {
      url: 'https://www.bbc.com/news/world',
      name: 'BBC News',
      selectors: {
        articles: 'article[data-testid="card-headline"], div[data-testid="edinburgh-card"]',
        title: 'h2, h3, [data-testid="card-headline"]',
        link: 'a[href]',
        image: 'img',
      }
    },
    {
      url: 'https://www.reuters.com/world/',
      name: 'Reuters',
      selectors: {
        articles: 'article, div[class*="story-card"]',
        title: 'h3, h2, a[data-testid="Heading"]',
        link: 'a[href*="/world/"]',
        image: 'img',
      }
    }
  ],
  Sports: [
    {
      url: 'https://www.bbc.com/sport',
      name: 'BBC Sport',
      selectors: {
        articles: 'article, div[data-testid="card"]',
        title: 'h2, h3',
        link: 'a[href]',
        image: 'img',
      }
    }
  ],
  Technology: [
    {
      url: 'https://www.bbc.com/news/technology',
      name: 'BBC Tech',
      selectors: {
        articles: 'article[data-testid="card-headline"], div[data-testid="edinburgh-card"]',
        title: 'h2, h3',
        link: 'a[href]',
        image: 'img',
      }
    },
    {
      url: 'https://techcrunch.com/',
      name: 'TechCrunch',
      selectors: {
        articles: 'article, div[class*="post-block"]',
        title: 'h2, h3',
        link: 'a[href]',
        image: 'img',
      }
    }
  ],
  Health: [
    {
      url: 'https://www.bbc.com/news/health',
      name: 'BBC Health',
      selectors: {
        articles: 'article, div[data-testid="card"]',
        title: 'h2, h3',
        link: 'a[href]',
        image: 'img',
      }
    }
  ],
  Science: [
    {
      url: 'https://www.bbc.com/news/science-environment',
      name: 'BBC Science',
      selectors: {
        articles: 'article, div[data-testid="card"]',
        title: 'h2, h3',
        link: 'a[href]',
        image: 'img',
      }
    }
  ]
};

// In-memory cache for articles
let articlesCache: Article[] = [];
let lastScrapeTime: number = 0;

// Get cached articles
export function getCachedArticles(): Article[] {
  return articlesCache;
}

// Get article by ID from cache
export function getArticleById(id: string): Article | undefined {
  return articlesCache.find(a => a.id === id);
}

// Check if cache has articles
export function hasCachedArticles(): boolean {
  return articlesCache.length > 0;
}

// Clear the cache (for manual refresh)
export function clearCache(): void {
  articlesCache = [];
  lastScrapeTime = 0;
}

// Escape HTML entities to prevent XSS
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char] || char);
}

async function scrapeSource(source: NewsSource, category: Category, limit: number = 10): Promise<Article[]> {
  try {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const articles: Article[] = [];
    const seenTitles = new Set<string>();

    $(source.selectors.articles).each((index, element) => {
      if (articles.length >= limit) return false;

      const $article = $(element);
      const $title = $article.find(source.selectors.title).first();
      const $link = $article.find(source.selectors.link).first();
      const $image = source.selectors.image ? $article.find(source.selectors.image).first() : null;

      const title = $title.text().trim();
      let link = $link.attr('href') || '';
      const imageSrc = $image?.attr('src') || $image?.attr('data-src') || '';

      // Skip if no title or duplicate
      if (!title || seenTitles.has(title)) return;

      // Normalize URL
      if (link && !link.startsWith('http')) {
        const baseUrl = new URL(source.url);
        link = new URL(link, baseUrl.origin).href;
      }

      // Normalize image URL
      let imageUrl = imageSrc;
      if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = new URL(source.url);
        imageUrl = new URL(imageUrl, baseUrl.origin).href;
      }

      // Skip articles without proper links
      if (!link || link === source.url) return;

      seenTitles.add(title);

      // Escape title for safe HTML rendering
      const safeTitle = escapeHtml(title);

      articles.push({
        id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title, // Keep raw for display
        content: generateContent(safeTitle, category),
        imageUrl: imageUrl || getPlaceholderImage(category),
        source: source.name,
        sourceUrl: link,
        category: category,
        timestamp: new Date().toISOString(),
      });
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

function generateContent(safeTitle: string, category: Category): string {
  return `
    <p class="mb-4"><strong>${escapeHtml(category)} Update:</strong> ${safeTitle}</p>
    
    <p class="mb-4">In a significant development, new information has emerged regarding this ongoing story. Sources indicate that the situation continues to evolve, with experts closely monitoring the developments.</p>
    
    <h3 class="text-xl font-bold mt-6 mb-3">Latest Updates</h3>
    <p class="mb-4">According to recent reports, the implications of this news extend beyond initial assessments. Industry analysts and stakeholders are evaluating the potential impact on various sectors and communities affected by these developments.</p>
    
    <ul class="list-disc pl-5 mb-4 space-y-2">
      <li>Key officials have been briefed on the situation and are coordinating responses.</li>
      <li>Independent verification of facts is ongoing as more details become available.</li>
      <li>Experts recommend following official channels for the most accurate information.</li>
    </ul>

    <p class="mb-4">The story continues to develop, and further updates are expected as more information becomes available. Stakeholders across multiple sectors are watching closely to understand the full implications.</p>

    <h3 class="text-xl font-bold mt-6 mb-3">What This Means</h3>
    <p class="mb-4">As the situation unfolds, analysts suggest that the long-term effects will become clearer in the coming days and weeks. The response from various parties will likely shape the trajectory of this issue moving forward.</p>
    
    <p class="mb-4">Stay informed with The Daily Pulse for continuous coverage as this story develops. We will provide updates as new information emerges from reliable sources.</p>
  `;
}

function getPlaceholderImage(category: Category): string {
  const placeholders: Record<Category, string> = {
    International: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=800&h=450&fit=crop',
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
    Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
    Health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    Science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop',
  };
  return placeholders[category];
}

// Scrape articles and store in cache
export async function scrapeArticles(category?: Category, articlesPerSource: number = 10): Promise<Article[]> {
  const categoriesToScrape: Category[] = category 
    ? [category] 
    : ["International", "Sports", "Technology", "Health", "Science"];

  const newArticles: Article[] = [];

  for (const cat of categoriesToScrape) {
    const sources = NEWS_SOURCES[cat];
    
    // Scrape from all sources for this category in parallel
    const sourcePromises = sources.map(source => scrapeSource(source, cat, articlesPerSource));
    const results = await Promise.allSettled(sourcePromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        newArticles.push(...result.value);
      }
    });
  }

  // Sort by timestamp (newest first)
  const sortedArticles = newArticles.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Store in cache
  articlesCache = sortedArticles;
  lastScrapeTime = Date.now();
  
  console.log(`Scraped ${sortedArticles.length} articles at ${new Date().toISOString()}`);
  
  return sortedArticles;
}
