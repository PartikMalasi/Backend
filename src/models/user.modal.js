import mongoose, { Schema } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bycrypt from "bcrypt";
const userScheme = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/",
      required: true,
    },
    coverImage: {
      type: String,
      default: "https://www.gravatar.com/avatar/",
    },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userScheme.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bycrypt.hash(this.password, 10);
  next();
});

userScheme.methods.isPasswordCorrect = async function (password) {
  return await bycrypt.compare(password, this.password);
};

userScheme.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, fullName: this.fullName },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userScheme.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
export const User = mongoose.model("User", userScheme);
