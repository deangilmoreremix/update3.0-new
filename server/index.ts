import express, { type Request, Response, NextFunction } from "express";
import { createClerkClient } from '@clerk/backend';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Create Clerk client with authorized parties configuration
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  jwtKey: process.env.CLERK_JWT_KEY,
});

// Custom middleware to handle Clerk authentication with authorized parties
app.use(async (req, res, next) => {
  try {
    // Get the session token from the request
    const sessionToken = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.__session;
    
    if (sessionToken) {
      // Verify the session with authorized parties
      const requestState = await clerkClient.authenticateRequest(req, {
        authorizedParties: [
          'https://smart-crm.videoremix.io',
          'https://*.replit.dev',
          'https://*.repl.it',
          'http://localhost:5000',
          'http://localhost:3000'
        ]
      });
      
      // Add user info to request if authenticated
      if (requestState.isSignedIn) {
        req.userId = requestState.userId;
      }
    }
    
    next();
  } catch (error) {
    console.error('Clerk authentication error:', error);
    next(); // Continue without authentication for now
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
