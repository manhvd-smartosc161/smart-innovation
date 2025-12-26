import { ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS } from '@/constants';

/**
 * File validation utility functions
 *
 * Provides helpers for validating file types and formatting file names.
 */

/**
 * Validates if a file is of an allowed type
 *
 * @param file - The file to validate
 * @returns true if the file type is allowed, false otherwise
 *
 * @example
 * ```typescript
 * const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
 * const isValid = isValidFileType(file); // true
 * ```
 */
export const isValidFileType = (file: File): boolean => {
  // Check MIME type
  if ((ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) {
    return true;
  }

  // Check file extension as fallback
  const fileName = file.name.toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
};

/**
 * Truncates a file name to a maximum length while preserving the extension
 *
 * @param fileName - The file name to truncate
 * @param maxLength - Maximum length of the truncated name (default: 30)
 * @returns Truncated file name with ellipsis if needed
 *
 * @example
 * ```typescript
 * const truncated = truncateFileName('very-long-file-name-document.pdf', 20);
 * // Returns: 'very-long-f....pdf'
 * ```
 */
export const truncateFileName = (
  fileName: string,
  maxLength: number = 30
): string => {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  // Find the last dot to separate name and extension
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1) {
    // No extension found, just truncate with ellipsis
    return fileName.substring(0, maxLength - 3) + '...';
  }

  const extension = fileName.substring(lastDotIndex);
  const nameWithoutExt = fileName.substring(0, lastDotIndex);

  // Calculate how much space we have for the name part
  const availableLength = maxLength - extension.length - 4; // 4 for '....'

  if (availableLength <= 0) {
    // If extension is too long, just truncate everything
    return fileName.substring(0, maxLength - 3) + '...';
  }

  return nameWithoutExt.substring(0, availableLength) + '....' + extension;
};
