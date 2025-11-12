declare module 'expo-image-picker' {
  export enum MediaTypeOptions {
    Images = 'Images',
    Videos = 'Videos',
    All = 'All',
  }

  export interface PermissionResponse {
    granted: boolean;
  }

  export interface ImagePickerAsset {
    uri: string;
    width?: number;
    height?: number;
    mimeType?: string | null;
    base64?: string | null;
    fileName?: string | null;
    fileSize?: number | null;
  }

  export interface ImagePickerResult {
    canceled: boolean;
    assets: ImagePickerAsset[];
  }

  export interface ImagePickerOptions {
    mediaTypes?: MediaTypeOptions | MediaTypeOptions[];
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
    base64?: boolean;
    exif?: boolean;
    allowsMultipleSelection?: boolean;
    selectionLimit?: number;
  }

  export function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function launchImageLibraryAsync(
    options?: ImagePickerOptions
  ): Promise<ImagePickerResult>;
}

export {};

