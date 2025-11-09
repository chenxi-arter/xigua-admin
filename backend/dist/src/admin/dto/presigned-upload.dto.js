"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoUploadCompleteDto = exports.UploadCompleteDto = exports.GetVideoPresignedUrlDto = exports.GetPresignedUrlDto = void 0;
const class_validator_1 = require("class-validator");
class GetPresignedUrlDto {
    filename;
    contentType;
}
exports.GetPresignedUrlDto = GetPresignedUrlDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetPresignedUrlDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetPresignedUrlDto.prototype, "contentType", void 0);
class GetVideoPresignedUrlDto extends GetPresignedUrlDto {
    quality;
}
exports.GetVideoPresignedUrlDto = GetVideoPresignedUrlDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['360p', '480p', '720p', '1080p', '1440p', '2160p']),
    __metadata("design:type", String)
], GetVideoPresignedUrlDto.prototype, "quality", void 0);
class UploadCompleteDto {
    fileKey;
    publicUrl;
    fileSize;
}
exports.UploadCompleteDto = UploadCompleteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadCompleteDto.prototype, "fileKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadCompleteDto.prototype, "publicUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UploadCompleteDto.prototype, "fileSize", void 0);
class VideoUploadCompleteDto extends UploadCompleteDto {
    quality;
}
exports.VideoUploadCompleteDto = VideoUploadCompleteDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['360p', '480p', '720p', '1080p', '1440p', '2160p']),
    __metadata("design:type", String)
], VideoUploadCompleteDto.prototype, "quality", void 0);
//# sourceMappingURL=presigned-upload.dto.js.map