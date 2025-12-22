/**
 * Standardized error logging utility
 * Provides consistent error handling across the application
 */

/**
 * Logs an error with context information
 * @param {string} message - Error message
 * @param {Error|Object} error - Error object or error details
 * @param {Object} context - Additional context (component, function, etc.)
 */
export const logError = (message, error = null, context = {}) => {
  const contextStr = Object.keys(context).length > 0
    ? ` [${Object.entries(context).map(([key, value]) => `${key}: ${value}`).join(', ')}]`
    : '';

  if (error) {
    console.error(`${message}${contextStr}`, error);
  } else {
    console.error(`${message}${contextStr}`);
  }
};

/**
 * Logs a warning with context information
 * @param {string} message - Warning message
 * @param {Error|Object} error - Error object or error details
 * @param {Object} context - Additional context (component, function, etc.)
 */
export const logWarning = (message, error = null, context = {}) => {
  const contextStr = Object.keys(context).length > 0
    ? ` [${Object.entries(context).map(([key, value]) => `${key}: ${value}`).join(', ')}]`
    : '';

  if (error) {
    console.warn(`${message}${contextStr}`, error);
  } else {
    console.warn(`${message}${contextStr}`);
  }
};

/**
 * Logs an info message with context information
 * @param {string} message - Info message
 * @param {Object} context - Additional context (component, function, etc.)
 */
export const logInfo = (message, context = {}) => {
  const contextStr = Object.keys(context).length > 0
    ? ` [${Object.entries(context).map(([key, value]) => `${key}: ${value}`).join(', ')}]`
    : '';

  console.log(`${message}${contextStr}`);
};
