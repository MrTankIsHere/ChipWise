import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI)
    throw new Error("Missing MONGO_URI in .env.local");

let cached = (global).mongoose;         // caching db connection
if (!cached) cached = (global).mongoose = { conn: null, promise: null };        // if connection is not cached, then cache it

export async function connectDB() {
    if (cached.conn) return cached.conn;              // already connected? reuse it
    if (!cached.promise) cached.promise = mongoose.connect(MONGO_URI); // else, start connecting (once)
    cached.conn = await cached.promise;                // wait for it, then cache the result
    return cached.conn;
}
