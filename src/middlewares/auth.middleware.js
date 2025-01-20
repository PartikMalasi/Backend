import { asyncHandler } from "./async.middleware";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password i-refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(500, "Error verifying token");
  }
});
