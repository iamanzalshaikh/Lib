// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import 'dotenv/config'; // Make sure dotenv is loaded

// Debug: Check if environment variables are loaded
console.log('🔍 Checking Cloudinary Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ EXISTS' : '❌ MISSING');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to Upload File to Cloudinary
const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            console.log('❌ No file path provided');
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log('❌ File does not exist:', filePath);
            return null;
        }

        console.log('📤 Uploading file to Cloudinary:', filePath);

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: 'library-books', // Optional: organize uploads in folders
        });

        console.log('✅ Cloudinary Upload Successful:', result.secure_url);

        // Delete local file after successful upload
        fs.unlinkSync(filePath);
        console.log('🗑️ Local file deleted:', filePath);

        return result.secure_url;
    } catch (error) {
        console.error('❌ Cloudinary Upload Error:', error.message);
        
        // Clean up local file even if upload fails
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log('🗑️ Local file cleaned up after error');
            } catch (unlinkError) {
                console.error('❌ Failed to cleanup local file:', unlinkError.message);
            }
        }
        
        return null;
    }
};

export { uploadOnCloudinary, cloudinary };