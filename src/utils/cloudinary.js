import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log(cloudinary.config());

    if (!localFilePath) return;
    //upload the file on cloudinary
    console.log("hit uploadOnCloudinary 1");
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("localFilePath", localFilePath);
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    // fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error uploading file on cloudinary", error);

    // fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export default uploadOnCloudinary;
