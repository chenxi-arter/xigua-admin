export declare class GetPresignedUrlDto {
    filename: string;
    contentType: string;
}
export declare class GetVideoPresignedUrlDto extends GetPresignedUrlDto {
    quality?: string;
}
export declare class UploadCompleteDto {
    fileKey: string;
    publicUrl: string;
    fileSize?: number;
}
export declare class VideoUploadCompleteDto extends UploadCompleteDto {
    quality?: string;
}
