import mongoose from "mongoose";
import dns from "dns";

// Prioritize IPv4 resolution to prevent IPv6 negotiation timeout delays on Linux
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignored in runtimes where not available
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = (async () => {
      const MONGODB_URI = process.env.MONGODB_URI;

      if (!MONGODB_URI) {
        throw new Error(
          "Please define the MONGODB_URI environment variable inside .env.local"
        );
      }

      console.log("[MongoDB] Connecting to MongoDB Atlas cluster...");
      const m = await mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        family: 4,
        dbName: "tasktracker",
      });

      console.log(
        `[MongoDB] Successfully connected to database "${m.connection.name}" at host: ${m.connection.host}`
      );
      return m;
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    cached!.conn = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;
