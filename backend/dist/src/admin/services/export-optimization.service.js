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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_progress_entity_1 = require("../../video/entity/watch-progress.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const episode_reaction_entity_1 = require("../../video/entity/episode-reaction.entity");
const favorite_entity_1 = require("../../user/entity/favorite.entity");
const comment_entity_1 = require("../../video/entity/comment.entity");
let ExportOptimizationService = class ExportOptimizationService {
    wpRepo;
    userRepo;
    reactionRepo;
    favoriteRepo;
    commentRepo;
    constructor(wpRepo, userRepo, reactionRepo, favoriteRepo, commentRepo) {
        this.wpRepo = wpRepo;
        this.userRepo = userRepo;
        this.reactionRepo = reactionRepo;
        this.favoriteRepo = favoriteRepo;
        this.commentRepo = commentRepo;
    }
    async getPlayStatsOptimized(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const query = `
      SELECT 
        DATE_FORMAT(date_val, '%Y-%m-%d') as date,
        COALESCE(SUM(play_count), 0) as playCount,
        COALESCE(AVG(avg_duration), 0) as avgWatchDuration,
        COALESCE(AVG(completion_rate), 0) as completionRate,
        COALESCE(SUM(like_count), 0) as likeCount,
        COALESCE(SUM(favorite_count), 0) as favoriteCount
      FROM (
        -- 生成日期序列
        SELECT DATE_ADD(?, INTERVAL seq DAY) as date_val
        FROM (
          SELECT 0 as seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
          SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
          SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
          SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL 
          SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL 
          SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL 
          SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL 
          SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL 
          SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL 
          SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
        ) seq_table
        WHERE DATE_ADD(?, INTERVAL seq DAY) <= ?
      ) dates
      LEFT JOIN (
        SELECT 
          DATE(wp.updated_at) as wp_date,
          COUNT(*) as play_count,
          AVG(wp.stop_at_second) as avg_duration,
          AVG(CASE WHEN wp.stop_at_second >= e.duration * 0.9 THEN 1 ELSE 0 END) as completion_rate
        FROM watch_progress wp
        INNER JOIN episodes e ON wp.episode_id = e.id
        WHERE wp.updated_at BETWEEN ? AND ?
          AND e.duration > 0
        GROUP BY DATE(wp.updated_at)
      ) wp_stats ON dates.date_val = wp_stats.wp_date
      LEFT JOIN (
        SELECT 
          DATE(created_at) as reaction_date,
          COUNT(*) as like_count
        FROM episode_reactions
        WHERE created_at BETWEEN ? AND ?
          AND reaction_type = 'like'
        GROUP BY DATE(created_at)
      ) reaction_stats ON dates.date_val = reaction_stats.reaction_date
      LEFT JOIN (
        SELECT 
          DATE(created_at) as favorite_date,
          COUNT(*) as favorite_count
        FROM favorites
        WHERE created_at BETWEEN ? AND ?
        GROUP BY DATE(created_at)
      ) favorite_stats ON dates.date_val = favorite_stats.favorite_date
      GROUP BY date
      ORDER BY date ASC
    `;
        const results = await this.wpRepo.query(query, [
            start, start, end,
            start, end,
            start, end,
            start, end
        ]);
        return results.map((row) => ({
            date: this.formatDate(row.date),
            playCount: parseInt(row.playCount) || 0,
            avgWatchDuration: Math.round(parseFloat(row.avgWatchDuration) || 0),
            completionRate: parseFloat(parseFloat(row.completionRate || 0).toFixed(4)),
            likeCount: parseInt(row.likeCount) || 0,
            shareCount: 0,
            favoriteCount: parseInt(row.favoriteCount) || 0,
        }));
    }
    async getUserStatsOptimized(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const query = `
      SELECT 
        DATE_FORMAT(date_val, '%Y-%m-%d') as date,
        COALESCE(new_users, 0) as newUsers,
        COALESCE(dau, 0) as dau,
        COALESCE(avg_duration, 0) as avgWatchDuration,
        0 as nextDayRetention
      FROM (
        SELECT DATE_ADD(?, INTERVAL seq DAY) as date_val
        FROM (
          SELECT 0 as seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
          SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
          SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
          SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL 
          SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL 
          SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL 
          SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL 
          SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL 
          SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL 
          SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
        ) seq_table
        WHERE DATE_ADD(?, INTERVAL seq DAY) <= ?
      ) dates
      LEFT JOIN (
        SELECT 
          DATE(created_at) as user_date,
          COUNT(*) as new_users
        FROM users
        WHERE created_at BETWEEN ? AND ?
        GROUP BY DATE(created_at)
      ) user_stats ON dates.date_val = user_stats.user_date
      LEFT JOIN (
        SELECT 
          DATE(updated_at) as wp_date,
          COUNT(DISTINCT user_id) as dau,
          AVG(stop_at_second) as avg_duration
        FROM watch_progress
        WHERE updated_at BETWEEN ? AND ?
        GROUP BY DATE(updated_at)
      ) wp_stats ON dates.date_val = wp_stats.wp_date
      ORDER BY date ASC
    `;
        const results = await this.userRepo.query(query, [
            start, start, end,
            start, end,
            start, end
        ]);
        return results.map((row) => ({
            date: this.formatDate(row.date),
            newUsers: parseInt(row.newUsers) || 0,
            nextDayRetention: 0,
            dau: parseInt(row.dau) || 0,
            avgWatchDuration: Math.round(parseFloat(row.avgWatchDuration) || 0),
            newUserSource: '自然增长',
        }));
    }
    async getSeriesDetailsOptimized(startDate, endDate, categoryId, limit = 10000) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const categoryFilter = categoryId ? `AND s.category_id = ${categoryId}` : '';
        const query = `
      SELECT 
        DATE_FORMAT(wp.updated_at, '%Y-%m-%d') as date,
        s.id as seriesId,
        s.title as seriesTitle,
        COALESCE(c.name, '未分类') as categoryName,
        (SELECT COUNT(*) FROM episodes WHERE series_id = s.id) as episodeCount,
        COUNT(DISTINCT wp.id) as playCount,
        AVG(CASE WHEN wp.stop_at_second >= e.duration * 0.9 THEN 1 ELSE 0 END) as completionRate,
        AVG(wp.stop_at_second) as avgWatchDuration,
        COALESCE(SUM(CASE WHEN er.reaction_type = 'like' THEN 1 ELSE 0 END), 0) as likeCount,
        COALESCE(SUM(CASE WHEN er.reaction_type = 'dislike' THEN 1 ELSE 0 END), 0) as dislikeCount,
        0 as shareCount,
        COALESCE((
          SELECT COUNT(*) 
          FROM favorites f 
          WHERE f.series_id = s.id 
            AND DATE(f.created_at) = DATE(wp.updated_at)
        ), 0) as favoriteCount,
        COALESCE((
          SELECT COUNT(*) 
          FROM comments cm 
          WHERE cm.episode_short_id IN (
            SELECT short_id FROM episodes WHERE series_id = s.id
          )
          AND DATE(cm.created_at) = DATE(wp.updated_at)
        ), 0) as commentCount
      FROM watch_progress wp
      INNER JOIN episodes e ON wp.episode_id = e.id
      INNER JOIN series s ON e.series_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN episode_reactions er ON er.episode_id = e.id 
        AND DATE(er.created_at) = DATE(wp.updated_at)
      WHERE wp.updated_at BETWEEN ? AND ?
        ${categoryFilter}
        AND e.duration > 0
      GROUP BY DATE(wp.updated_at), s.id, s.title, c.name
      ORDER BY date DESC, playCount DESC
      LIMIT ?
    `;
        const results = await this.wpRepo.query(query, [start, end, limit]);
        return results.map((row) => ({
            date: row.date,
            seriesId: row.seriesId,
            seriesTitle: row.seriesTitle,
            categoryName: row.categoryName,
            episodeCount: parseInt(row.episodeCount) || 0,
            playCount: parseInt(row.playCount) || 0,
            completionRate: parseFloat(parseFloat(row.completionRate || 0).toFixed(4)),
            avgWatchDuration: Math.round(parseFloat(row.avgWatchDuration) || 0),
            likeCount: parseInt(row.likeCount) || 0,
            dislikeCount: parseInt(row.dislikeCount) || 0,
            shareCount: 0,
            favoriteCount: parseInt(row.favoriteCount) || 0,
            commentCount: parseInt(row.commentCount) || 0,
        }));
    }
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }
};
exports.ExportOptimizationService = ExportOptimizationService;
exports.ExportOptimizationService = ExportOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(watch_progress_entity_1.WatchProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(episode_reaction_entity_1.EpisodeReaction)),
    __param(3, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(4, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExportOptimizationService);
//# sourceMappingURL=export-optimization.service.js.map