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
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const base_module_controller_1 = require("./base-module.controller");
const category_service_1 = require("./services/category.service");
let HomeController = class HomeController extends base_module_controller_1.BaseModuleController {
    categoryService;
    constructor(videoService, categoryService) {
        super(videoService);
        this.categoryService = categoryService;
    }
    getDefaultChannelId() {
        return 1;
    }
    getModuleVideosMethod() {
        return (channeid, page) => this.videoService.getHomeModules(channeid, page);
    }
    async getCategories() {
        return this.categoryService.getRawCategories();
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getCategories", null);
exports.HomeController = HomeController = __decorate([
    (0, common_1.Controller)('home'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        category_service_1.CategoryService])
], HomeController);
//# sourceMappingURL=home.controller.js.map