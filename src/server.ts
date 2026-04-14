import mongoose from "mongoose";
import config from "./config/env.config";
import { createIndexes } from "./config/indexing";
import app from "./app";

mongoose
  .connect(config.mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    await createIndexes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Swagger docs: http://localhost:${config.port}/api-docs`);
});
