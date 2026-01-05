"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeCommentService = void 0;
const common_1 = require("@nestjs/common");
const default_avatar_util_1 = require("../../common/utils/default-avatar.util");
let FakeCommentService = class FakeCommentService {
    enabled = process.env.ENABLE_FAKE_COMMENTS !== 'false';
    minFakeComments = parseInt(process.env.MIN_FAKE_COMMENTS || '30', 10);
    maxFakeComments = parseInt(process.env.MAX_FAKE_COMMENTS || '50', 10);
    commentTemplates = [
        '这部短剧太上头了！完全停不下来！',
        '剧情紧凑不拖沓，节奏超好！',
        '短小精悍，每一集都是精华！',
        '演员演技在线，代入感超强！',
        '这才是短剧该有的水平！',
        '一口气刷完，意犹未尽！',
        '编剧太会写了，每集都有爆点！',
        '这部短剧绝了，强烈推荐！',
        '质量超高，短剧天花板！',
        '看完只想说：绝绝子！',
        '比预期好太多了！',
        '这才是良心剧啊！',
        '零差评神剧！',
        '全程无尿点！',
        '节奏把控堪称完美！',
        '这个反转太惊喜了！没想到！',
        '剧情走向出人意料，爱了爱了！',
        '伏笔埋得好深啊，细节满满！',
        '前后呼应做得太好了！',
        '这集信息量好大，看得过瘾！',
        '编剧脑洞真大，创意十足！',
        '逻辑在线，不像其他短剧那么水！',
        '剧情节奏把控得很好！',
        '这个设定太有意思了！',
        '故事完整度很高，不烂尾！',
        '世界观设定很完整！',
        '剧情张力十足！',
        '每一帧都是剧情！',
        '反转接反转，精彩！',
        '细节经得起推敲！',
        '情节丝丝入扣！',
        '故事层次分明！',
        '逻辑自洽，很严谨！',
        '铺垫到位，爆发有力！',
        '叙事手法很新颖！',
        '看哭了，太感人了😭',
        '笑死我了哈哈哈哈',
        '看得我心潮澎湃！',
        '太上头了，根本停不下来！',
        '代入感太强了，仿佛身临其境！',
        '情绪到位，演员演技炸裂！',
        '这段太虐了，心疼😭',
        '甜甜甜，甜到我了🍬',
        '爽剧！看得超爽！',
        '紧张得我都不敢看了！',
        '笑到肚子疼！',
        '泪目了家人们😭',
        '感动到无法呼吸！',
        '看得我热血沸腾！',
        '情绪拉满！',
        '共情感太强了！',
        '破防了破防了！',
        'DNA动了！',
        '这谁顶得住啊！',
        '情感戏真实！',
        '男主演技真的好！',
        '女主颜值演技双在线！',
        '配角也很出彩！',
        '演员选得真好，很契合角色！',
        '男主好帅，女主好美！',
        '反派演得太到位了，恨得牙痒痒！',
        '小演员演技自然，不尴尬！',
        '这个演员是谁？演得真好！',
        '演员和角色太适配了！',
        '主角气质拿捏了！',
        '演技派实力在线！',
        '眼神戏绝了！',
        '哭戏太有感染力了！',
        '表情管理很到位！',
        '台词功底扎实！',
        '角色塑造立体饱满！',
        '演员之间化学反应爆棚！',
        '每个角色都很鲜活！',
        '反派演得入木三分！',
        '配角不抢戏但很亮眼！',
        '制作精良，画面质感很好！',
        '短剧也可以拍得这么精致！',
        '服化道很用心！',
        '剪辑节奏舒服！',
        '配乐很搭，加分！',
        '特效做得不错！',
        '摄影师会拍！',
        '细节处理得很到位！',
        '镜头语言讲究！',
        '色调很舒服！',
        '运镜流畅！',
        '场景布置用心！',
        '道具考据认真！',
        '后期制作精良！',
        '音效设计棒！',
        '画面构图美！',
        '光影运用好！',
        '转场自然！',
        '视听语言高级！',
        '质感拉满！',
        '比其他短剧好太多了！',
        '终于看到一部不烂的短剧了！',
        '这才是短剧该有的样子！',
        '和某些注水剧比强太多！',
        '质量碾压一众短剧！',
        '秒杀同类型短剧！',
        '短剧界的清流！',
        '吊打市面上90%的短剧！',
        '拉高了短剧的天花板！',
        '重新定义了短剧标准！',
        '同期最佳没跑了！',
        '这才叫精品短剧！',
        '短剧也能拍出大片感！',
        '小成本大制作的典范！',
        '业界良心之作！',
        '催更催更！快更新！',
        '等得好着急啊！',
        '坐等下一集！',
        '更新太慢了，不够看！',
        '一天一集不够啊！',
        '已经追到最新了，求快更！',
        '这剧追定了！',
        '已加入追剧列表！',
        '更新速度能不能快点！',
        '等更新等到心急！',
        '什么时候出续集啊！',
        '强烈要求加更！',
        '不够看啊，意犹未尽！',
        '看一集少一集，不舍得！',
        '希望能拍番外！',
        '期待第二季！',
        '后续剧情太期待了！',
        '想知道接下来怎么样！',
        '悬念拉满，坐等更新！',
        '每周最期待的就是更新！',
        '墙裂推荐给大家！',
        '已经安利给朋友了！',
        '不看后悔系列！',
        '良心推荐，必看！',
        '这个必须五星！',
        '赶紧去看，不会失望！',
        '闭眼入，质量保证！',
        '强推！不看血亏！',
        '安利给身边所有人！',
        '已经推荐给全家人了！',
        '看到就是赚到！',
        '入股不亏！',
        '值得二刷三刷！',
        '必看榜单第一名！',
        '错过可惜系列！',
        '年度必看短剧！',
        '吹爆这部剧！',
        '跪求更多人看到！',
        '被严重低估了！',
        '宝藏短剧！',
        '二刷了，还是好看！',
        '又来看一遍！',
        '百看不厌！',
        '这是我第三遍看了！',
        '每次看都有新发现！',
        '二刷发现更多细节！',
        '来来回回看了好几遍！',
        'N刷预警！',
        '越看越有味道！',
        '回味无穷！',
        '忍不住又来了！',
        '经典就是经得起重看！',
        '每一遍都有不同感受！',
        '重温经典！',
        '看多少遍都不腻！',
        '前方高能！',
        '名场面来了！',
        '开虐了开虐了😭',
        '这段名场面！',
        '高潮部分绝了！',
        '这段要反复看！',
        '经典片段！',
        '这幕太震撼了！',
        '这场戏拍得绝！',
        '这个镜头爱了！',
        '高燃片段！',
        '这段封神！',
        '燃炸了！',
        '这段值得单曲循环！',
        '名台词诞生！',
        '甜甜甜🍬',
        '笑死哈哈哈',
        '泪目😭',
        '啊啊啊啊！',
        'OMG！',
        '绝绝子！',
        '爆了！',
        '这波可以！',
        '神转折！',
        'YYDS！',
        '绝美！',
        '上头！',
        '爱了爱了！',
        '绝了绝了！',
        '太可了！',
        '哇塞！',
        '牛批！',
        '炸裂！',
        '震撼！',
        '惊艳！',
        '好看！', '绝了！', '爱了！', '上头！', '精彩！',
        '赞👍', '牛！', '哇！', '可以！', '不错！', '棒！', '顶！',
        '完美！', '精品！', '神剧！', '满分！', '优秀！',
        '杰作！', '大爱！', '真香！', '无敌！', '炸了！',
        '节奏快，不拖沓，很爽！',
        '每集都有爆点，没有尿点！',
        '短小精悍，值得一看！',
        '虽然短但很精彩！',
        '短剧就该这样拍！',
        '浓缩的都是精华！',
        '时间控制得刚刚好！',
        '节奏紧凑不拖泥带水！',
        '信息密度很高！',
        '每一秒都不浪费！',
        '快节奏但不乱！',
        '张弛有度！',
        '起承转合流畅！',
        '剧情推进合理！',
        '节奏掌控力强！',
        '结局不错，不烂尾！',
        '完结撒花🎉',
        '圆满大结局！',
        '结局有点意犹未尽啊！',
        '希望有第二季！',
        '结局收得漂亮！',
        '完美收官！',
        '结局出乎意料！',
        '结局升华了！',
        'ending给满分！',
        '结局不负期待！',
        '神结局！',
        '结局反转绝了！',
        '收尾完整！',
        '结局意味深长！',
        '剧本扎实，逻辑在线！',
        '人物塑造立体，不脸谱化！',
        '台词有水平，不尴尬！',
        '导演功力不错！',
        '完成度很高！',
        '这个编剧我粉了！',
        '编剧太有才了！',
        '台词金句频出！',
        '对白很自然！',
        '剧本打磨用心！',
        '编剧功力深厚！',
        '故事讲得好！',
        '叙事能力强！',
        '文本质量高！',
        '台词接地气！',
        '这部短剧绝对是宝藏！',
        '熬夜也要看完！',
        '上班偷偷看，太好看了！',
        '意外发现的宝藏剧！',
        '相见恨晚！',
        '追剧追到停不下来！',
        '刷到就是赚到！',
        '无意中发现的神剧！',
        '挖到宝了！',
        '被标题骗进来，被内容留下来！',
        '低调的好剧！',
        '沧海遗珠！',
        '被埋没的佳作！',
        '小众但精品！',
        '冷门神剧！',
        '情节环环相扣，精彩！',
        '这个题材很新颖！',
        '短剧界的一股清流！',
        '题材选得好！',
        '角度独特！',
        '很有创意！',
        '题材新鲜！',
        '脑洞大开！',
        '设定有趣！',
        '视角新颖！',
        '创意满分！',
        '别出心裁！',
        '构思巧妙！',
        '切入点好！',
        '主题深刻！',
        '这也太好看了吧？',
        '为什么现在才看到？',
        '怎么才这么点播放量？',
        '这么好的剧为啥没火？',
        '有人和我一样在循环看吗？',
        '下一集什么时候更新啊？',
        '有没有同款推荐？',
        '谁能不爱这部剧？',
        '这不是神剧是什么？',
        '还有谁？',
        '这谁不爱啊？',
        '真的有人不喜欢吗？',
        '编剧是天才吧？',
        '演员是从哪找的？',
        '能再拍一部吗？',
        '蹲了好久终于更新了！',
        '准时来打卡！',
        '每周必看！',
        '追更狗来了！',
        '终于等到更新！',
        '月底最期待的更新！',
        '守着更新看！',
        '追了一个月了！',
        '从头追到尾！',
        '一路追过来的！',
        '一气呵成看完的！',
        '全程目不转睛！',
        '沉浸式观看体验！',
        '看得很过瘾！',
        '观感极佳！',
        '视觉享受！',
        '看得很舒服！',
        '体验感满分！',
        '观影氛围绝了！',
        '代入感超强！',
        '男女主CP感太强了！',
        '这对CP我磕了！',
        '官方发糖，甜死了！',
        'CP互动好甜啊！',
        '男女主眼神都是戏！',
        '这对太配了吧！',
        '糖分超标警告！',
        'CP粉狂喜！',
        '男女主化学反应绝了！',
        '这糖我吃定了！',
        '配一脸！',
        '锁死这对CP！',
        '甜甜的恋爱！',
        '恋爱脑疯狂输出！',
        '被这对甜到了！',
        '发糖不要钱系列！',
        '磕到了磕到了！',
        '嗑糖嗑到饱！',
        '官方比同人还甜！',
        '这对我先锁了！',
        '背景音乐太配了！',
        'BGM选得绝！',
        '配乐加分！',
        '主题曲好听！',
        '插曲太戳了！',
        '音乐渲染氛围到位！',
        '这首歌单曲循环了！',
        '片头曲抓耳！',
        '片尾曲余韵悠长！',
        'OST都好听！',
        '音乐总监有品味！',
        '配乐恰到好处！',
        '每首歌都很应景！',
        '听歌就能回忆起剧情！',
        '音乐烘托情绪很棒！',
        '男主人设太帅了！',
        '女主角色立住了！',
        '配角人物丰满！',
        '反派有魅力！',
        '人物弧光完整！',
        '角色成长线清晰！',
        '每个角色都有血有肉！',
        '角色性格鲜明！',
        '主角不圣母不白莲！',
        '人物关系复杂有意思！',
        '群像戏拿捏了！',
        '反派不脸谱化！',
        '配角抢戏但不讨厌！',
        '女主独立自主，爱了！',
        '男主不霸总套路！',
        '前方高能预警！！！',
        '名场面截图！',
        '这里笑死我了hhhh',
        '护眼时间到！',
        '啊啊啊啊啊啊！！！',
        '有被帅到！',
        '有被甜到！',
        '有被虐到！',
        '刀了刀了！',
        '发糖了发糖了！',
        '要开始了要开始了！',
        'awsl（啊我死了）',
        '爷青回！',
        '爷青结！',
        '有内味了！',
        'yyds（永远的神）！',
        'emo了！',
        '绝绝子真的绝绝子！',
        '太哇塞了吧！',
        'u1s1（有一说一）确实好看',
        'nsdd（你说得对）！',
        '这波不亏！',
        '我裂开了！',
        '我的DNA动了！',
        '破防了家人们！',
        '这谁能不爱？',
        '拿捏住了！',
        '属实有点东西！',
        '格局打开！',
        '这波在大气层！',
        '🔥🔥🔥太燃了！',
        '😭😭😭哭死！',
        '😂😂😂笑喷！',
        '💯💯💯满分！',
        '👍👍👍必须赞！',
        '❤️❤️❤️爱了！',
        '🌟🌟🌟五星！',
        '🎉🎉🎉完结撒花！',
        '🍬🍬🍬甜炸！',
        '😍😍😍太棒了！',
        '🤩🤩🤩惊艳！',
        '😱😱😱震撼！',
        '🥺🥺🥺破防！',
        '🤭🤭🤭嘿嘿！',
        '😤😤😤追定了！',
        '必须五星好评！',
        '打卡支持！',
        '播放量冲！',
        '评分拉满！',
        '数据刷起来！',
        '必须打满分！',
        '好评走起！',
        '支持正版！',
        '为数据贡献一份力！',
        '冲榜！',
        '已分享朋友圈！',
        '已发微博安利！',
        '必须分享给姐妹！',
        '发群里安利了！',
        '已加入我的片单！',
        '收藏了！',
        '点赞了！',
        '转发了！',
    ];
    nicknameTemplates = [
        '追剧小能手', '剧荒患者', '夜猫子观众', '短剧爱好者', '影视迷',
        '熬夜党', '剧迷一枚', '电视剧狂热粉', '追剧达人', '观剧无数',
        '剧透克星', '二倍速看剧', '沙发土豆', '周末追剧人', '深夜观影',
        '剧集收藏家', '弹幕大佬', '观剧专业户', '剧情分析师', '短剧探索者',
        '午夜追剧人', '剧情推理家', '观影老手', '追剧新人', '剧评人',
        '热剧追踪者', '剧迷老王', '观剧小白', '影视评论员', '追剧疯子',
        '剧透预警', '观剧指南针', '短剧猎人', '影视考古学家', '追剧狂魔',
        '观剧养生党', '剧情狙击手', '周末观影人', '深夜剧场', '追剧小分队',
        '观剧不眨眼', '剧迷联盟', '影视侦探', '追剧马拉松', '观剧专家',
        '短剧发烧友', '剧情解析员', '周末宅家党', '深夜追更人', '观影爱好者',
    ];
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    seededRandom(seed) {
        let currentSeed = seed;
        return () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };
    }
    generateFakeComments(episodeShortId, count) {
        if (!this.enabled || count <= 0) {
            return [];
        }
        const seed = this.hashCode(episodeShortId);
        const random = this.seededRandom(seed);
        const fakeComments = [];
        const usedCommentIndices = new Set();
        const usedNicknameIndices = new Set();
        for (let i = 0; i < count; i++) {
            let commentIndex = 0;
            do {
                commentIndex = Math.floor(random() * this.commentTemplates.length);
            } while (usedCommentIndices.has(commentIndex) && usedCommentIndices.size < this.commentTemplates.length);
            usedCommentIndices.add(commentIndex);
            let nicknameIndex = 0;
            do {
                nicknameIndex = Math.floor(random() * this.nicknameTemplates.length);
            } while (usedNicknameIndices.has(nicknameIndex) && usedNicknameIndices.size < this.nicknameTemplates.length);
            usedNicknameIndices.add(nicknameIndex);
            const daysAgo = Math.floor(random() * 60);
            const hoursAgo = Math.floor(random() * 24);
            const minutesAgo = Math.floor(random() * 60);
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - daysAgo);
            createdAt.setHours(createdAt.getHours() - hoursAgo);
            createdAt.setMinutes(createdAt.getMinutes() - minutesAgo);
            const fakeUserId = -(seed + i + 1);
            const avatarUrl = default_avatar_util_1.DefaultAvatarUtil.getAvatarBySeed(fakeUserId);
            fakeComments.push({
                id: -(seed + i + 1000000),
                content: this.commentTemplates[commentIndex],
                appearSecond: 0,
                replyCount: 0,
                createdAt,
                username: `user_${Math.abs(fakeUserId)}`,
                nickname: this.nicknameTemplates[nicknameIndex],
                photoUrl: avatarUrl,
                recentReplies: [],
                isFake: true,
            });
        }
        fakeComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return fakeComments;
    }
    mixComments(episodeShortId, realComments, realTotal, page, size) {
        if (!this.enabled) {
            return {
                comments: realComments,
                total: realTotal,
                page,
                size,
                totalPages: Math.ceil(realTotal / size),
                fakeCount: 0,
            };
        }
        const seed = this.hashCode(episodeShortId);
        const random = this.seededRandom(seed);
        const fakeCount = this.minFakeComments + Math.floor(random() * (this.maxFakeComments - this.minFakeComments + 1));
        const allFakeComments = this.generateFakeComments(episodeShortId, fakeCount);
        const totalComments = realTotal + fakeCount;
        const totalPages = Math.ceil(totalComments / size);
        const skip = (page - 1) * size;
        const take = size;
        const allComments = [...realComments, ...allFakeComments];
        const pageComments = allComments.slice(skip, skip + take);
        return {
            comments: pageComments,
            total: totalComments,
            page,
            size,
            totalPages,
            fakeCount,
        };
    }
    isEnabled() {
        return this.enabled;
    }
    getFakeCommentCount(episodeShortId) {
        if (!this.enabled) {
            return 0;
        }
        const seed = this.hashCode(episodeShortId);
        const random = this.seededRandom(seed);
        return this.minFakeComments + Math.floor(random() * (this.maxFakeComments - this.minFakeComments + 1));
    }
    getFakeCommentCounts(episodeShortIds) {
        const countMap = new Map();
        if (!this.enabled || episodeShortIds.length === 0) {
            episodeShortIds.forEach(shortId => countMap.set(shortId, 0));
            return countMap;
        }
        episodeShortIds.forEach(shortId => {
            const seed = this.hashCode(shortId);
            const random = this.seededRandom(seed);
            const fakeCount = this.minFakeComments + Math.floor(random() * (this.maxFakeComments - this.minFakeComments + 1));
            countMap.set(shortId, fakeCount);
        });
        return countMap;
    }
    getConfig() {
        return {
            enabled: this.enabled,
            minFakeComments: this.minFakeComments,
            maxFakeComments: this.maxFakeComments,
            templateCount: this.commentTemplates.length,
            nicknameCount: this.nicknameTemplates.length,
        };
    }
};
exports.FakeCommentService = FakeCommentService;
exports.FakeCommentService = FakeCommentService = __decorate([
    (0, common_1.Injectable)()
], FakeCommentService);
//# sourceMappingURL=fake-comment.service.js.map