// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'EXE201 Food App',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Authentication
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET || 'your-jwt-secret-key',
  },
  
  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  // File upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'text/plain'],
  },
} as const;

// Environment variables validation
export const validateEnv = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_BASE_URL',
  ];
  
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing environment variables: ${missingVars.join(', ')}`
    );
    console.warn('Using default values. Please set these variables in your .env.local file');
  }
  
  return missingVars.length === 0;
};

// Initialize environment validation
if (typeof window === 'undefined') {
  validateEnv();
}
