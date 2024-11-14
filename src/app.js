import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//router
import userRouter from "./routes/user.router.js";
app.use("/api/v1/users", userRouter);
app.use(express.static("public"));

export default app;
