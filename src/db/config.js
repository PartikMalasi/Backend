import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `mongodb+srv://pratikmalasi:Partik%4005@cluster0.cnzeb.mongodb.net/${DB_NAME}`
    );
    console.log("Connected to MongoDB:", connectInstance.connection.host);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
