import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  scrapeArticles,
  type Category 
} from "./scraper";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API endpoint to scrape all categories - FRESH ON EVERY REQUEST
  app.get("/api/scrape-all", async (req, res) => {
    try {
      console.log("[API] Fresh scrape requested for all categories");
      const articles = await scrapeArticles(undefined, 20);
      res.json({
        success: true,
        count: articles.length,
        articles,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error scraping all categories:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to scrape articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // API endpoint to scrape specific category - FRESH ON EVERY REQUEST
  app.get("/api/scrape/:category", async (req, res) => {
    try {
      const category = req.params.category as Category;
      const validCategories: Category[] = ["International", "Sports", "Technology", "Health", "Science"];
      
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          success: false,
          error: "Invalid category",
          validCategories 
        });
      }

      console.log(`[API] Fresh scrape requested for category: ${category}`);
      const articles = await scrapeArticles(category, 20);
      
      res.json({
        success: true,
        category,
        count: articles.length,
        articles,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error scraping category:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to scrape articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get featured articles (home page) - FRESH SCRAPE
  app.get("/api/featured", async (req, res) => {
    try {
      console.log("[API] Fresh scrape requested for featured articles");
      const articles = await scrapeArticles(undefined, 20);
      
      // Get top 5 articles from each category
      const featured = articles.slice(0, 10);
      
      res.json({
        success: true,
        count: featured.length,
        articles: featured,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch featured articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Legacy endpoint for backward compatibility
  app.get("/api/articles", async (req, res) => {
    try {
      const category = req.query.category as Category | undefined;
      const validCategories: Category[] = ["International", "Sports", "Technology", "Health", "Science"];
      
      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      console.log(`[API] Fresh scrape requested - ${category ? `category: ${category}` : 'all categories'}`);
      let articles = await scrapeArticles(category, 20);
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  return httpServer;
}
