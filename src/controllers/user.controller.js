import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.modal.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //get user data from request body
  const { fullName, email, password, username } = req.body;
  console.log(fullName, email, password, username);

  // validation- not empty
  if (!fullName || !email || !password || !username) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exists
  const existUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existUser) {
    throw new ApiError(409, "User already exists");
  }

  // check for images and avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;
  if (req.files?.avatar.length > 1 || req.files?.coverImage.length > 1) {
    console.log(avatarLocalPath, coverLocalPath);
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar are required");
  }
  // upload images to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error uploading avatar");
  }
  // create user
  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password and refresh token from response
  // check for user creation
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }
  // send response

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const generateRefreshTokenAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  //todo req se data
  // username or email se login
  // find the user
  // check password
  // generate token

  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { refreshToken, accessToken } =
    await generateRefreshTokenAndAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    secure: true,
    httpOnly: true,
  };

  res
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken").clearCookie("accessToken").json({
    message: "User logged out successfully",
  });

  // db se bhi delete krna h refresh token
  user = req.user;

  const updateRefreshToken = await User.findByIdAndUpdate(
    user._id,
    { refreshToken: "" },
    { new: true }
  );

  const options = {
    secure: true,
    httpOnly: true,
  };

  return res
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
