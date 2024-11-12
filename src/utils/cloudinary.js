import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded to Cloudinary", result.url);
    fs.unlinkSync(localFilePath);
    return result;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath);
    //remove temp file
    return null;
  }
};

export default uploadOnCloudinary;
