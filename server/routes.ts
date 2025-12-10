import type { Express } from "express";
import { createServer, type Server } from "http";
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
  
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // MANUAL SCRAPE TRIGGER - Only endpoint that initiates scraping
  app.get("/api/trigger-scrape", async (req, res) => {
    try {
      console.log("[API] Manual scrape triggered via /api/trigger-scrape");
      clearCache();
      const articles = await scrapeArticles(undefined, 20);
      res.json({
        success: true,
        message: `Successfully scraped ${articles.length} fresh articles`,
        count: articles.length,
        articles,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error during manual scrape:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to scrape articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get all cached articles - NO SCRAPING, uses cache only
  app.get("/api/scrape-all", async (req, res) => {
    try {
      // Return cached articles
      let articles = getCachedArticles();
      
      // If cache is empty, perform initial scrape only once
      if (!hasCachedArticles()) {
        console.log("[API] Cache empty on /api/scrape-all - performing initial scrape");
        articles = await scrapeArticles(undefined, 20);
      }
      
      res.json({
        success: true,
        count: articles.length,
        articles,
        cached: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get specific category - uses cache only
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

      let articles = getCachedArticles();
      
      // If cache is empty, perform initial scrape only once
      if (!hasCachedArticles()) {
        console.log(`[API] Cache empty on /api/scrape/${category} - performing initial scrape`);
        articles = await scrapeArticles(undefined, 20);
      }
      
      // Filter by category
      const categoryArticles = articles.filter(a => a.category === category);
      
      res.json({
        success: true,
        category,
        count: categoryArticles.length,
        articles: categoryArticles,
        cached: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get featured articles from cache
  app.get("/api/featured", async (req, res) => {
    try {
      let articles = getCachedArticles();
      
      // If cache is empty, perform initial scrape only once
      if (!hasCachedArticles()) {
        console.log("[API] Cache empty on /api/featured - performing initial scrape");
        articles = await scrapeArticles(undefined, 20);
      }
      
      const featured = articles.slice(0, 10);
      
      res.json({
        success: true,
        count: featured.length,
        articles: featured,
        cached: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching featured:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch featured articles",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get single article by ID from cache
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ 
          error: "Article not found",
          cached: true
        });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Legacy endpoint - uses cache
  app.get("/api/articles", async (req, res) => {
    try {
      const category = req.query.category as Category | undefined;
      const validCategories: Category[] = ["International", "Sports", "Technology", "Health", "Science"];
      
      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      let articles = getCachedArticles();
      
      // If cache is empty, perform initial scrape only once
      if (!hasCachedArticles()) {
        console.log(`[API] Cache empty on /api/articles - performing initial scrape`);
        articles = await scrapeArticles(undefined, 20);
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

  // Small convenience page so users can trigger a manual scrape from a browser
  // Visit /trigger in your browser to run the GET /api/trigger-scrape and see the JSON result.
  app.get("/trigger", async (req, res) => {
    res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Trigger Scrape</title>
    <style>body{font-family:Inter,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial;padding:24px;background:#f7fafc;color:#111}button{padding:10px 14px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer}pre{white-space:pre-wrap;background:#fff;border:1px solid #e5e7eb;padding:12px;border-radius:6px;max-height:60vh;overflow:auto}</style>
  </head>
  <body>
    <h1>Trigger Scrape</h1>
    <p>Click the button below to trigger a manual scrape. The JSON response will be shown below.</p>
    <button id="btn">Trigger Scrape</button>
    <p id="status"></p>
    <pre id="output">Waiting...</pre>
    <script>
      const btn = document.getElementById('btn');
      const out = document.getElementById('output');
      const status = document.getElementById('status');
      btn.addEventListener('click', async () => {
        status.textContent = 'Running...';
        out.textContent = '';
        btn.disabled = true;
        try {
          const res = await fetch('/api/trigger-scrape', { method: 'GET' });
          const text = await res.text();
          // try to pretty-print JSON, otherwise show as text
          try { const json = JSON.parse(text); out.textContent = JSON.stringify(json, null, 2); } catch(e) { out.textContent = text; }
          status.textContent = 'Status: ' + res.status;
        } catch (err) {
          out.textContent = String(err);
          status.textContent = 'Error';
        } finally {
          btn.disabled = false;
        }
      });
    </script>
  </body>
</html>
`);
  });

  return httpServer;
}
