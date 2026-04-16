import dns from "dns";
import mongoose from "mongoose";
import config from "./config/env.config";
import { createIndexes } from "./config/indexing";
import app from "./app";

// DNS configuration is now handled globally in src/config/env.config.ts
dns.setDefaultResultOrder("ipv4first");

mongoose
  .connect(config.mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    family: 4,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    await createIndexes();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Swagger docs: http://localhost:${config.port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
