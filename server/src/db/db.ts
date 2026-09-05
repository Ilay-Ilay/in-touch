import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
    console.log("DATABASE:", connection.connection.db?.databaseName);
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    process.exit(1);
  }
}
