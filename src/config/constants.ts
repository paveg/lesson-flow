/**
 * Application-wide constants
 */

/**
 * Platform fee rate (5%)
 * Applied to all transactions in production environment
 */
export const PLATFORM_FEE_RATE = 0.05

/**
 * Database connection pool settings
 */
export const DB_POOL_CONFIG = {
  // Development: Single connection to prevent hot-reload issues
  // Production: Higher limit for concurrent operations
  MAX_CONNECTIONS: process.env.NODE_ENV === "production" ? 10 : 1,
} as const
