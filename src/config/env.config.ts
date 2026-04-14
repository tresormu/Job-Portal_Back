import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const parseCorsOrigins = (): string[] | undefined => {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) return undefined;
  const origins = raw.split(",").map((o) => o.trim()).filter(Boolean);
  return origins.length > 0 ? origins : undefined;
};

const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: parseCorsOrigins(),

  mongoUri: requireEnv("MONGO_URI"),

  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "30d") as import("ms").StringValue,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  },

  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_USER,
  },

  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
} as const;

export default config;
