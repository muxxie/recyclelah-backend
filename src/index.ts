import "dotenv/config";
import { storage } from "./storage"; // ✅ import storage
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { isAuthenticated } from "./supabaseAuth";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Request/response logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const jsonStr = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${
          jsonStr.length > 500
            ? jsonStr.substring(0, 500) + "...[truncated]"
            : jsonStr
        }`;
      }
      log(logLine);
    }
  });
  next();
});

// Example protected route using Supabase JWT middleware
app.get("/api/protected", isAuthenticated, (req, res) => {
  res.json({ message: "You are authenticated", user: (req as any).user });
});

// ✅ Seed data function
async function seedData() {
  await storage.seedFacilities([
    {
      name: "Green Earth Recycling",
      address: "123 Eco Lane, Kuala Lumpur",
      latitude: "3.1390",
      longitude: "101.6869",
      acceptedMaterials: ["plastic", "paper", "metal"],
      phone: "+60 3-2181 1234",
      operatingHours: "Mon-Sat 8am-6pm",
    },
    {
      name: "City Scrap Metal",
      address: "45 Industrial Blvd, Petaling Jaya",
      latitude: "3.1400",
      longitude: "101.6900",
      acceptedMaterials: ["metal", "ewaste"],
      phone: "+60 3-7960 5678",
      operatingHours: "Mon-Fri 9am-5pm",
    },
    {
      name: "EcoWaste Solutions",
      address: "88 Green Road, Shah Alam",
      latitude: "3.0733",
      longitude: "101.5185",
      acceptedMaterials: ["plastic", "paper", "glass", "other"],
      phone: "+60 3-5510 9012",
      operatingHours: "Daily 7am-7pm",
    },
    {
      name: "TechRecycle Hub",
      address: "12 Digital Ave, Cyberjaya",
      latitude: "2.9213",
      longitude: "101.6500",
      acceptedMaterials: ["ewaste", "metal"],
      phone: "+60 3-8888 4321",
      operatingHours: "Mon-Sat 9am-6pm",
    },
  ]);

  await storage.seedMarketPrices([
    { materialType: "plastic", pricePerKg: "0.50" },
    { materialType: "paper", pricePerKg: "0.30" },
    { materialType: "metal", pricePerKg: "1.20" },
    { materialType: "ewaste", pricePerKg: "2.00" },
    { materialType: "glass", pricePerKg: "0.10" },
    { materialType: "other", pricePerKg: "0.05" },
  ]);
}

(async () => {
  const httpServer = createServer(app);

  await registerRoutes(httpServer, app);

  // ✅ Run seeding after routes are registered
  await seedData();

  // Error handler
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
  log(`serving on port ${port}`);
});

})();
