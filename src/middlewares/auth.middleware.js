import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.modal.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log(decodedToken);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Error verifying token:" + error);
  }
});
