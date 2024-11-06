import { bucket } from "../config/firebaseConfig.js";

/**
 * Uploads a file to Firebase Storage
 * @param {string} filePath - Local path of the file to upload
 * @param {string} destinationPath - Destination path in Firebase Storage
 * @returns {Promise<string>} - URL of the uploaded file
 */
export const uploadToFirebasePhoto = async (filePath, destinationPath) => {
  try {
    // Upload file to Firebase Storage
    const fileUpload = await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    // Make the file public
    await fileUpload[0].makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to Firebase:", error);
    throw new Error("Failed to upload file to storage");
  }
};

/**
 * Deletes a file from Firebase Storage
 * @param {string} fileUrl - Public URL or file path of the file to delete
 */
export const deleteExistingPhoto = async (fileUrl) => {
  try {
    let filePath;

    // Check if the input is a complete URL or just a filename/path
    if (fileUrl.startsWith("http")) {
      // Extract the file path from the URL
      const urlParts = new URL(fileUrl);
      filePath = urlParts.pathname.split("/").slice(2).join("/");
    } else {
      // If it's not a URL, assume it's already a file path or name
      // Remove any leading slashes
      filePath = fileUrl.replace(/^\/+/, "");

      // If it's just a filename without a folder structure,
      // you might want to add the appropriate prefix
      if (!filePath.includes("/")) {
        filePath = `candidate_photos/${filePath}`;
      }
    }

    // Delete the file
    const file = bucket.file(filePath);
    const [exists] = await file.exists();

    if (exists) {
      await file.delete();
      console.log(`Successfully deleted file: ${filePath}`);
    } else {
      console.log(`File does not exist: ${filePath}`);
    }
  } catch (error) {
    console.error("Error deleting file from Firebase:", error);
    // Log the actual error for debugging
    console.error("Original error:", error);

    // Don't throw the error to prevent blocking the update process
    // Just log it and continue
    console.log(`Warning: Failed to delete file ${fileUrl}`);
  }
};
