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
exports.TestIngestController = void 0;
const common_1 = require("@nestjs/common");
let TestIngestController = class TestIngestController {
    async testGet() {
        return { message: 'Test Ingest GET endpoint works!', timestamp: new Date().toISOString() };
    }
    async testPost() {
        return { message: 'Test Ingest POST endpoint works!', timestamp: new Date().toISOString() };
    }
};
exports.TestIngestController = TestIngestController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestIngestController.prototype, "testGet", null);
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestIngestController.prototype, "testPost", null);
exports.TestIngestController = TestIngestController = __decorate([
    (0, common_1.Controller)('admin/test-ingest')
], TestIngestController);
//# sourceMappingURL=test-ingest.controller.js.map