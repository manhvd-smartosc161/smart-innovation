// Allowed file types (MIME types)
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

// Allowed file extensions
export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.txt',
  '.jpg',
  '.jpeg',
  '.png',
] as const;

// Display text for allowed files (for tooltip)
export const ALLOWED_FILES_DISPLAY = [
  'PDF (.pdf)',
  'Text (.txt)',
  'Images (.jpg, .jpeg, .png)',
] as const;

// Accept attribute value for file input
export const FILE_UPLOAD_ACCEPT = '.pdf,.txt,.jpg,.jpeg,.png';
