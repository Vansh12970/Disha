import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


// Configurations of cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (loacalFilePath) => {
    try {
        if (!loacalFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(loacalFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        //console.log("File is uploaded on cloudinary",
        //response.url);
        fs.unlinkSync(localFilePath)
        return response;
        
    } catch(error) {
        fs.unlinkSync(localFilePath)
        //remove the locally saves temporary file asupload operation failed
        return null;
    }
}

export { uploadOnCloudinary }