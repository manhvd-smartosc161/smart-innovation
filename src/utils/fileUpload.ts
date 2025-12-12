import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
} from '@/constants/fileUpload';

// Helper function to validate file type
export const isValidFileType = (file: File): boolean => {
  const fileExtension = file.name
    .substring(file.name.lastIndexOf('.'))
    .toLowerCase();
  return (
    (ALLOWED_FILE_TYPES as readonly string[]).includes(file.type) ||
    (ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(fileExtension)
  );
};

// Helper function to truncate filename in the middle
export const truncateFileName = (
  fileName: string,
  maxLength: number = 30
): string => {
  if (!fileName || fileName.length <= maxLength) {
    return fileName;
  }

  // Extract extension
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    // No extension, just truncate in the middle
    const start = Math.floor((maxLength - 4) / 2);
    const end = fileName.length - (maxLength - 4 - start);
    return `${fileName.slice(0, start)}....${fileName.slice(end)}`;
  }

  const nameWithoutExt = fileName.slice(0, lastDotIndex);
  const extension = fileName.slice(lastDotIndex);

  if (nameWithoutExt.length <= maxLength - extension.length - 4) {
    return fileName;
  }

  // Calculate how much space we have for the name part
  const availableLength = maxLength - extension.length - 4; // 4 for "...."
  const start = Math.floor(availableLength / 2);
  const end = nameWithoutExt.length - (availableLength - start);

  return `${nameWithoutExt.slice(0, start)}....${nameWithoutExt.slice(end)}${extension}`;
};
