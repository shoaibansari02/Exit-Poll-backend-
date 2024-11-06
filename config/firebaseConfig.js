import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Recreate the configuration object
const firebaseAdminConfig = {
  type: "service_account",
  project_id: "d-lunch-box",
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Reinitialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
      storageBucket: `${firebaseAdminConfig.project_id}.appspot.com`,
    });
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase:", error.message);
  }
}

// Export the bucket
export const bucket = admin.storage().bucket();

// Optional: Export a verification function
export async function verifyFirebaseSetup() {
  try {
    console.log("Bucket Name:", bucket.name);
    console.log("Project ID:", bucket.projectId);

    // Try to list files
    const [files] = await bucket.getFiles();
    console.log("Bucket access successful");
    console.log(
      "Files in bucket:",
      files.map((file) => file.name)
    );
  } catch (error) {
    console.error("Firebase setup verification failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack,
    });
  }
}
