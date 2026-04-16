import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configure DNS servers as a global fallback for the dns module.
 * This helps resolve SRV records in environments like WSL/Docker/Restricted Networks.
 */
const configureDns = () => {
  const fallbackServers = ["8.8.8.8", "1.1.1.1"];
  const rawDns = process.env.DNS_SERVERS;
  const servers = rawDns
    ? rawDns.split(",").map((s) => s.trim()).filter(Boolean)
    : fallbackServers;

  try {
    dns.setServers(servers);
    console.log(`[Config] DNS servers set to: ${servers.join(", ")}`);
  } catch (error) {
    console.warn("[Config] Failed to set DNS servers, using system default.");
  }
};

// Apply DNS configuration immediately
configureDns();

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
  port: Number(process.env.PORT || 5000),
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

  frontendUrl: process.env.FRONTEND_URL,
} as const;

export default config;
