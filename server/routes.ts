import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  scrapeArticles, 
  getCachedArticles, 
  getArticleById, 
  hasCachedArticles,
  clearCache,
  type Category 
} from "./scraper";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // API endpoint to get articles (uses cache, auto-scrapes if empty)
  app.get("/api/articles", async (req, res) => {
    try {
      const category = req.query.category as Category | undefined;
      
      // Validate category if provided
      const validCategories: Category[] = ["International", "Sports", "Technology", "Health", "Science"];
      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      // Get articles from cache, or scrape if empty
      let articles = getCachedArticles();
      
      if (!hasCachedArticles()) {
        console.log("No cached articles, performing initial scrape...");
        articles = await scrapeArticles(undefined, 10);
      }
      
      // Filter by category if specified
      if (category) {
        articles = articles.filter(a => a.category === category);
      }
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // API endpoint to get a single article by ID (with cache fallback)
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // If cache is empty, scrape first
      if (!hasCachedArticles()) {
        console.log("Cache empty when fetching article, scraping...");
        await scrapeArticles(undefined, 10);
      }
      
      // Get article from cache
      const article = getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // API endpoint to manually trigger a fresh scrape
  app.post("/api/scrape", async (req, res) => {
    try {
      console.log("Manual scrape triggered...");
      clearCache();
      const articles = await scrapeArticles(undefined, 10);
      res.json({ 
        success: true, 
        message: `Scraped ${articles.length} articles`,
        count: articles.length 
      });
    } catch (error) {
      console.error("Error during manual scrape:", error);
      res.status(500).json({ error: "Failed to scrape articles" });
    }
  });

  return httpServer;
}
