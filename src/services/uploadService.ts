

const API_BASE_URL = 'https://e-electro-backend.onrender.com/api';

/**
 * Uploads a file to the backend server.
 * @param file The file to upload.
 * @param token The Firebase auth token for authorization.
 * @returns The URL of the uploaded file.
 */
export async function uploadFile(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'File upload failed.');
  }

  const result = await response.json();
  if (!result.url) {
    throw new Error('File URL not returned from server after upload.');
  }

  return result.url;
}
