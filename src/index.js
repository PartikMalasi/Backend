import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import connectDB from "./db/config.js";
console.log("MONGODB_URI:", process.env.MONGODB_URI);
connectDB();
