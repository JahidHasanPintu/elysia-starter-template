import { Client } from "minio";
import { Buffer } from "buffer";
import { getMinioConfig } from "../utils/env";

// MinIO client configuration

const minioConfig = getMinioConfig();
const minioClient = new Client({
  endPoint: minioConfig.MINIO_ENDPOINT_URL,
  port: +minioConfig.MINIO_PORT,
  useSSL: false,
  accessKey: minioConfig.MINIO_ACCESS_KEY,
  secretKey: minioConfig.MINIO_SECRET_KEY,
});

const BUCKET_NAME = minioConfig.MINIO_BUCKET_NAME;
const SIGNED_URL_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

// Ensure bucket exists
const ensureBucket = async (): Promise<void> => {
  const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
  if (!bucketExists) {
    await minioClient.makeBucket(BUCKET_NAME);
  }
};

/**
 * Convert File/Blob to Buffer
 * @param file - File or Blob object
 * @returns Promise<Buffer>
 */
const fileToBuffer = async (file: File | Blob): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/**
 * Upload a file to MinIO and return its signed URL
 * Supports both Buffer and File/Blob (from multipart form-data)
 * @param filename - The name to store the file as
 * @param file - The file to upload (Buffer, File, or Blob)
 * @param contentType - Optional MIME type of the file
 * @returns Promise with the signed URL of the uploaded file
 */
export const uploadFileAndGetUrl = async (
  filename: string,
  file: Buffer | File | Blob,
  contentType?: string,
): Promise<string> => {
  try {
    await ensureBucket();

    // Convert File/Blob to Buffer if needed
    const fileBuffer = Buffer.isBuffer(file) ? file : await fileToBuffer(file);

    // If file is from form-data and no contentType is provided, use its type
    const metadata: Record<string, string> = {};
    if (!contentType && "type" in file) {
      contentType = file.type;
    }
    if (contentType) {
      metadata["Content-Type"] = contentType;
    }

    // Upload the file
    await minioClient.putObject(
      BUCKET_NAME,
      filename,
      fileBuffer,
      fileBuffer.length,
      metadata,
    );

    // Generate and return signed URL
    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      filename,
      SIGNED_URL_EXPIRY,
    );

    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    throw new Error(`Failed to upload file: ${error}`);
  }
};

/**
 * Get a signed URL for an existing file
 * @param filename - The name of the file to get URL for
 * @returns Promise with the signed URL
 */
export const getSignedUrl = async (filename: string): Promise<string> => {
  try {
    // Check if file exists first
    await minioClient.statObject(BUCKET_NAME, filename);

    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      filename,
      SIGNED_URL_EXPIRY,
    );

    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    if (error instanceof Error)
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    throw new Error(`Failed to generate signed URL: ${error}`);
  }
};

/**
 * Delete a file from MinIO
 * @param filename - The name of the file to delete
 * @returns Promise<void>
 */
export const deleteFile = async (filename: string): Promise<void> => {
  try {
    await minioClient.removeObject(BUCKET_NAME, filename);
  } catch (error) {
    console.error("Error deleting file:", error);
    if (error instanceof Error)
      throw new Error(`Failed to delete file: ${error.message}`);
    throw new Error(`Failed to delete file: ${error}`);
  }
};

// Usage examples:

// Upload a file and get its URL
// const fileBuffer = Buffer.from('Hello World');
// const url = await uploadFileAndGetUrl('hello.txt', fileBuffer);
// console.log('Uploaded file URL:', url);

// Get signed URL for existing file
// const url = await getSignedUrl('hello.txt');
// console.log('Signed URL:', url);

// Delete a file
// await deleteFile('hello.txt');
// console.log('File deleted successfully');
