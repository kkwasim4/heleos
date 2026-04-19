import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { MoneroRPCService } from "./src/MoneroRPC/moneroService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const moneroService = new MoneroRPCService();
  
  app.use(express.json());

  // Simple In-memory usage store (IP -> { count, lastReset, isUnlimited })
  const usageStore = new Map<string, { count: number, lastReset: number, isUnlimited?: boolean }>();

  const getClientIp = (req: express.Request) => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
  };

  app.get("/api/usage", (req, res) => {
    const ip = getClientIp(req);
    let entry = usageStore.get(ip);
    const now = Date.now();

    if (!entry || (now - entry.lastReset > 24 * 60 * 60 * 1000)) {
      entry = { count: 0, lastReset: now, isUnlimited: entry?.isUnlimited || false };
      usageStore.set(ip, entry);
    }

    res.json({ 
      count: entry.count, 
      limit: 15,
      isUnlimited: !!entry.isUnlimited,
      nextReset: entry.lastReset + (24 * 60 * 60 * 1000)
    });
  });

  app.post("/api/usage/verify-code", (req, res) => {
    const { code } = req.body;
    const ip = getClientIp(req);
    
    // Secret GUIX CODE from environment variables
    const secretCode = process.env.GUIX_SECRET_CODE || "Kkwasim4";
    
    if (code === secretCode) {
      let entry = usageStore.get(ip);
      const now = Date.now();
      
      if (!entry) {
        entry = { count: 0, lastReset: now, isUnlimited: true };
      } else {
        entry.isUnlimited = true;
      }
      
      usageStore.set(ip, entry);
      return res.json({ success: true, isUnlimited: true });
    }
    
    res.status(401).json({ success: false, error: "Invalid integrity code" });
  });

  app.post("/api/usage/increment", (req, res) => {
    const ip = getClientIp(req);
    let entry = usageStore.get(ip);
    const now = Date.now();

    if (!entry || (now - entry.lastReset > 24 * 60 * 60 * 1000)) {
      entry = { count: 0, lastReset: now, isUnlimited: entry?.isUnlimited || false };
    }

    // Skip limit for unlimited users
    if (entry.isUnlimited) {
      entry.count += 1;
      usageStore.set(ip, entry);
      return res.json({ count: entry.count, limit: 15, isUnlimited: true });
    }

    if (entry.count >= 15) {
      return res.status(403).json({ error: "Trial limit reached", count: entry.count });
    }

    entry.count += 1;
    usageStore.set(ip, entry);
    res.json({ count: entry.count, limit: 15, isUnlimited: false });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Monero RPC Proxy/API
  app.get("/api/monero/stats", async (req, res) => {
    try {
      const stats = await moneroService.getSummaryStats();
      res.json(stats);
    } catch (error) {
      console.error("Monero RPC Error:", error);
      res.status(500).json({ error: "Failed to fetch Monero stats" });
    }
  });

  app.get("/api/monero/price", async (req, res) => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/monero?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true");
      const data = await response.json();
      res.json({
        price: data.market_data.current_price.usd,
        change24h: data.market_data.price_change_percentage_24h,
        sparkline: data.market_data.sparkline_7d.price.slice(-24)
      });
    } catch (error) {
      console.error("CoinGecko Error:", error);
      res.status(500).json({ error: "Failed to fetch price" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Uncaught Server Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
