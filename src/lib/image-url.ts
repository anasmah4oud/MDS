import type { SyntheticEvent } from 'react';

const DEFAULT_PACKAGE_IMAGE = 'https://placehold.co/1920x1080/0f172a/3b82f6?text=البارع';

function extractGoogleDriveFileId(url: string): string | null {
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch?.[1]) return openMatch[1];

  return null;
}

export function normalizePackageImageUrl(url?: string | null): string {
  if (!url) return DEFAULT_PACKAGE_IMAGE;

  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_PACKAGE_IMAGE;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('drive.google.com/file/d/')) {
      const fileId = extractGoogleDriveFileId(trimmed);
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    if (trimmed.includes('drive.google.com/open?id=')) {
      const fileId = extractGoogleDriveFileId(trimmed);
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    return trimmed;
  }

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  return DEFAULT_PACKAGE_IMAGE;
}

export function getFallbackPackageImage(): string {
  return DEFAULT_PACKAGE_IMAGE;
}

export function handleBrokenPackageImage(event: SyntheticEvent<HTMLImageElement>): void {
  const target = event.currentTarget;
  target.src = DEFAULT_PACKAGE_IMAGE;
}
