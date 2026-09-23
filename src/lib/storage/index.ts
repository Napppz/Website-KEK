// ==============================================================================
// KEK INDONESIA PORTAL - STORAGE SERVICE ABSTRACTION
// ==============================================================================

export interface StorageUploadResult {
  url: string;
  filename: string;
  size?: number;
  mimeType?: string;
}

export interface IStorageProvider {
  uploadFile(file: File | Blob, path?: string): Promise<StorageUploadResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
  getPublicUrl(path: string): string;
}

/**
 * Default Local/URL Mock Provider
 * Menggunakan URL langsung dan path lokal publik (/documents, /reports, /images)
 */
class LocalMockStorageProvider implements IStorageProvider {
  async uploadFile(file: File | Blob, path: string = "uploads"): Promise<StorageUploadResult> {
    const filename = file instanceof File ? file.name : `file-${Date.now()}`;
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    return {
      url: `/${cleanPath}/${filename}`,
      filename,
      size: file.size,
      mimeType: file.type,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    console.log(`[StorageService] File deleted from storage: ${fileUrl}`);
    return true;
  }

  getPublicUrl(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
      return path;
    }
    return `/${path}`;
  }
}

export const storageService: IStorageProvider = new LocalMockStorageProvider();
