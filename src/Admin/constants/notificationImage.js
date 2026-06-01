/** Must match zaoCabBackend/constants/notificationUpload.js */
export const NOTIFICATION_IMAGE_MAX_MB = 5;
export const NOTIFICATION_IMAGE_MAX_BYTES = NOTIFICATION_IMAGE_MAX_MB * 1024 * 1024;
export const NOTIFICATION_IMAGE_ACCEPT = 'image/jpeg,image/jpg,image/png';

export const formatNotificationImageSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateNotificationImageFile = (file) => {
  if (!file) {
    return { ok: false, error: 'No file selected' };
  }
  if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) {
    return { ok: false, error: 'Only JPG, JPEG, and PNG images are allowed' };
  }
  if (file.size > NOTIFICATION_IMAGE_MAX_BYTES) {
    return {
      ok: false,
      error: `Image is too large (${formatNotificationImageSize(file.size)}). Maximum size is ${NOTIFICATION_IMAGE_MAX_MB} MB.`,
    };
  }
  return { ok: true };
};
