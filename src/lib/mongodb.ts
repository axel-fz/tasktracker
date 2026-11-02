import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memServer?: unknown;
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

      if (MONGODB_URI) {
        try {
          const m = await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 2000,
          });
          return m;
        } catch (err) {
          console.warn(
            "[MongoDB] Direct connection to MONGODB_URI failed, attempting in-memory fallback:",
            (err as Error).message
          );
        }
      }

      // Development / fallback in-memory MongoDB server
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        if (!cached!.memServer) {
          cached!.memServer = await MongoMemoryServer.create();
        }
        const memServer = cached!.memServer as { getUri: () => string };
        const memUri = memServer.getUri();
        const m = await mongoose.connect(memUri, { bufferCommands: false });
        return m;
      } catch (memErr) {
        console.error("[MongoDB] In-memory MongoDB failed:", memErr);
        throw new Error("Unable to establish a MongoDB connection.");
      }
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;
