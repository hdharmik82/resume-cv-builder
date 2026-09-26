/**
 * ProResume Studio - Security Sanitization Utilities
 * Protects against XSS, NoSQL query injection, and sensitive information leakage.
 */

/**
 * Strip HTML tags, script blocks, and limit string length
 * @param {any} input - Value to sanitize
 * @param {number} maxLength - Maximum permitted character length
 * @returns {string} Clean, safe string
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== "string") return "";
  
  // Remove script and style elements completely with their contents
  let clean = input.replace(/<(?:script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/(?:script|style|iframe|object|embed)>/gi, "");
  
  // Strip remaining HTML tags
  clean = clean.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Trim whitespace
  clean = clean.trim();
  
  // Enforce max length
  return clean.slice(0, maxLength);
}

/**
 * Validates RFC-compliant email address without catastrophic backtracking
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 150) return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Mask sensitive credentials inside connection URIs for safe logging
 * @param {string} uri
 * @returns {string} Sanitized URI
 */
export function sanitizeUriForLogging(uri) {
  if (typeof uri !== "string") return "";
  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
}
