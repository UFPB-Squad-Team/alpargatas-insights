import mongoose from "mongoose";
import { config } from "./app";

const connectDataBase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    process.exit(1);
  }
};

export default connectDataBase;
