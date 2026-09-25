import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/proresume_db";
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // Do not crash server immediately, allow fallback/reconnection
    return null;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
});
