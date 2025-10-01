"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCategoriesController = exports.AdminEpisodesController = exports.AdminBannersController = exports.AdminUsersController = void 0;
__exportStar(require("./admin-users.controller"), exports);
__exportStar(require("./admin-banners.controller"), exports);
__exportStar(require("./admin-episodes.controller"), exports);
__exportStar(require("./admin-series.controller"), exports);
__exportStar(require("./admin-dashboard.controller"), exports);
__exportStar(require("./admin-categories.controller"), exports);
var admin_users_controller_1 = require("./admin-users.controller");
Object.defineProperty(exports, "AdminUsersController", { enumerable: true, get: function () { return admin_users_controller_1.AdminUsersController; } });
var admin_banners_controller_1 = require("./admin-banners.controller");
Object.defineProperty(exports, "AdminBannersController", { enumerable: true, get: function () { return admin_banners_controller_1.AdminBannersController; } });
var admin_episodes_controller_1 = require("./admin-episodes.controller");
Object.defineProperty(exports, "AdminEpisodesController", { enumerable: true, get: function () { return admin_episodes_controller_1.AdminEpisodesController; } });
var admin_categories_controller_1 = require("./admin-categories.controller");
Object.defineProperty(exports, "AdminCategoriesController", { enumerable: true, get: function () { return admin_categories_controller_1.AdminCategoriesController; } });
//# sourceMappingURL=index.js.map