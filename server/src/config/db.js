import mongoose from "mongoose";
import { seedInitialDataIfNeeded } from "../utils/seedData.js";
import { sanitizeUriForLogging } from "../utils/sanitize.js";

let mongoMemoryServerInstance = null;
let dbStatus = {
  connected: false,
  isMemory: false,
  host: "disconnected",
  database: "",
  error: null,
};

export function getDbStatus() {
  return {
    ...dbStatus,
    readyState: mongoose.connection.readyState,
  };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/proresume_db";

  // 1. Try connecting to specified / local MongoDB
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(
      `[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`
    );
    dbStatus = {
      connected: true,
      isMemory: false,
      host: conn.connection.host,
      database: conn.connection.name,
      error: null,
    };

    await seedInitialDataIfNeeded();
    return conn;
  } catch (error) {
    const maskedUri = sanitizeUriForLogging(uri);
    console.warn(`[MongoDB] Primary connection to ${maskedUri} failed: ${error.message}`);
    dbStatus.error = error.message;

    // 2. Fallback to in-memory MongoDB for seamless development and testing
    try {
      console.log("[MongoDB] Starting embedded in-memory MongoDB engine for seamless development...");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoMemoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: "proresume_db",
        },
      });

      const memUri = mongoMemoryServerInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB Memory Engine] Running at ${memUri}`);

      dbStatus = {
        connected: true,
        isMemory: true,
        host: "in-memory-engine",
        database: "proresume_db",
        error: null,
      };

      await seedInitialDataIfNeeded();
      return conn;
    } catch (memError) {
      console.error(`[MongoDB Memory Engine Error]: ${memError.message}`);
      dbStatus = {
        connected: false,
        isMemory: false,
        host: "disconnected",
        database: "",
        error: memError.message,
      };
      return null;
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected.");
  dbStatus.connected = false;
});

mongoose.connection.on("error", (err) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
  dbStatus.error = err.message;
});
