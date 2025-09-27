import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param token This is not used for Firebase Storage but kept for function signature consistency.
 * @returns The URL of the uploaded file.
 */
export async function uploadFile(file: File, token: string): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not configured. Please check your .env file.');
  }

  const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw new Error("File upload failed.");
  }
}
