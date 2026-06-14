import { baseUrl } from '../Url/baseUrl';

/**
 * Documents may be stored as full S3 HTTPS URLs or legacy filenames under uploads/.
 */
export const resolveDocumentImageUrl = (imageRef, docType = 'aadhar') => {
  if (imageRef == null || imageRef === '') return null;

  const raw = String(imageRef).trim().replace(/^["']|["']$/g, '');
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (/^\/\//.test(raw)) {
    return `https:${raw}`;
  }

  const base = String(baseUrl || '').replace(/\/$/, '');
  const path = raw.replace(/^\/+/, '');

  if (
    path.startsWith('uploads/') ||
    path.startsWith('aadhar/') ||
    path.startsWith('driverLicense/') ||
    path.startsWith('policeVerification/') ||
    path.startsWith('vehicleRc/')
  ) {
    return `${base}/${path}`;
  }

  const folder =
    docType === 'drivingLicense' ? 'driverLicense' : docType || 'aadhar';

  return `${base}/${folder}/${encodeURIComponent(path)}`;
};
