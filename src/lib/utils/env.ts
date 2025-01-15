import { z } from 'zod';

// Define the environment schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // MinIO
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string().min(8),
  MINIO_ENDPOINT_URL: z.string().url(),
  MINIO_BUCKET_NAME: z.string().url(),
});

// Create a type from the schema
type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates environment variables and returns a typed config object
 * Prints warnings for missing or invalid variables
 */
export const validateEnv = (): EnvConfig => {
  const warnings: string[] = [];

  // Parse environment with warning collection
  const config = envSchema.safeParse(process.env);

  if (!config.success) {
    console.warn('\n🚨 Environment Variable Warnings:');

    // Collect and categorize warnings
    config.error.errors.forEach((error) => {
      const path = error.path.join('.');
      const message = error.message;

      let warningMessage = `❌ ${path}: ${message}`;

      // Add specific functionality warnings
      if (path.startsWith('DB_') || path === 'DATABASE_URL') {
        warningMessage += '\n   ⚠️  Database functionality may not work properly';
      }
      if (path.startsWith('MINIO_')) {
        warningMessage += '\n   ⚠️  File storage functionality may not work properly';
      }

      warnings.push(warningMessage);
    });

    // Print all warnings
    warnings.forEach((warning) => console.warn(warning));
    console.warn('\n');

    throw new Error('Environment validation failed. Check warnings above.');
  }

  return config.data;
};

/**
 * Get validated environment config
 * Throws error if validation fails
 */
export const getConfig = (): EnvConfig => {
  return validateEnv();
};

// Optional: Export individual config getters with type safety
export const getDbConfig = (): Pick<EnvConfig, 'DATABASE_URL'> => {
  const config = getConfig();
  return {
    DATABASE_URL: config.DATABASE_URL,
  };
};

export const getMinioConfig = (): Pick<EnvConfig, 'MINIO_ACCESS_KEY' | 'MINIO_SECRET_KEY' | 'MINIO_ENDPOINT_URL' | 'MINIO_BUCKET_NAME'> => {
  const config = getConfig();
  return {
    MINIO_ACCESS_KEY: config.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: config.MINIO_SECRET_KEY,
    MINIO_ENDPOINT_URL: config.MINIO_ENDPOINT_URL,
    MINIO_BUCKET_NAME: config.MINIO_BUCKET_NAME,
  };
};

// Usage example:
try {
  const config = getConfig();
  // Your application code here
} catch (error) {
  // Handle validation errors
  process.exit(1);
}
