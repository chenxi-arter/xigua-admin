"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_MODERATION_REQUIREMENTS = exports.LEGAL_LOGGING_CONFIG = exports.LEGAL_DISCLAIMER = void 0;
exports.LEGAL_DISCLAIMER = {
    SYSTEM_DISCLAIMER_INTERNATIONAL: `
This system provides only a technical framework and does not include any video content.

USERS MUST ENSURE:
1. Legal copyright or authorization for all content under applicable laws
2. All operating licenses and qualifications required by local jurisdiction
3. Compliance with all applicable laws including but not limited to:
   - Copyright and intellectual property laws
   - Data protection and privacy laws
   - Content regulation and broadcasting laws
4. Implementation of appropriate content moderation mechanisms

DEVELOPER DISCLAIMER:
The developer provides only technical services and does not participate in content operations.
The developer bears no legal responsibility for content uploaded by users or operational activities.
  `.trim(),
    SYSTEM_DISCLAIMER_CN: `
本系统仅提供技术框架，不包含任何视频内容。

使用方必须确保：
1. 拥有所有内容的合法版权或授权（依据所在国家/地区法律）
2. 具备所在国家/地区法律法规要求的所有运营资质
3. 遵守所在国家/地区的相关法律法规，包括但不限于：
   - 著作权和知识产权法
   - 数据保护和隐私法
   - 内容监管和广播法
4. 建立完善的内容审核机制

开发者声明：
开发者仅提供技术服务，不参与内容运营。
开发者不对使用方上传的内容及运营行为承担任何法律责任。
  `.trim(),
    DEVELOPER_STATEMENT: `
DEVELOPER STATEMENT / 开发者声明:

1. Provides only technical framework and implementation
   仅提供技术框架和功能实现

2. Does not participate in content selection, editing, uploading or operations
   不参与内容的选择、编辑、上传或运营

3. Bears no responsibility for content legality under any jurisdiction
   不对内容合法性承担责任（任何司法管辖区）

4. Bears no responsibility for operational behavior
   不对运营行为承担责任

5. Users are responsible for compliance with all applicable laws
   使用方负责遵守所有适用法律
  `.trim(),
    REQUIRED_USER_TERMS: {
        contentLegality: 'User guarantees legal copyright or authorization for all uploaded content under applicable laws / 用户保证上传的所有内容拥有合法版权或授权',
        compliance: 'User agrees to comply with all applicable laws and regulations in their jurisdiction / 用户同意遵守所在司法管辖区的所有相关法律法规',
        liability: 'User bears full legal responsibility for content legality / 用户对内容合法性承担全部法律责任',
        indemnification: 'User is responsible for ensuring all content and operations comply with applicable laws / 用户负责确保所有内容和运营符合适用法律',
    },
    REQUIRED_QUALIFICATIONS: {
        general: [
            'Business registration / 营业执照或商业注册',
            'Content broadcasting license (if required by local law) / 内容广播许可证（如当地法律要求）',
            'Copyright authorization for all content / 所有内容的版权授权',
            'Data protection compliance certification (e.g., GDPR, CCPA) / 数据保护合规认证',
        ],
        china: [
            'ICP备案 (ICP Filing)',
            '信息网络传播视听节目许可证 (Online Audio-Video Program Transmission License)',
            '网络文化经营许可证 (Online Culture Business License)',
        ],
        eu: [
            'GDPR Compliance / GDPR合规',
            'Content Provider License (if applicable) / 内容提供商许可证',
            'Copyright Directive Compliance / 版权指令合规',
        ],
        us: [
            'DMCA Compliance / DMCA合规',
            'FCC Regulations Compliance (if applicable) / FCC法规合规',
            'State Business License / 州商业许可证',
        ],
    },
    RELEVANT_LAWS: {
        international: [
            'Berne Convention for the Protection of Literary and Artistic Works / 伯尔尼公约',
            'WIPO Copyright Treaty / WIPO版权条约',
            'Universal Copyright Convention / 世界版权公约',
        ],
        china: [
            '《中华人民共和国著作权法》 (Copyright Law of PRC)',
            '《中华人民共和国网络安全法》 (Cybersecurity Law of PRC)',
            '《个人信息保护法》 (Personal Information Protection Law)',
            '《互联网视听节目服务管理规定》 (Internet Audio-Video Program Service Regulations)',
        ],
        eu: [
            'GDPR (General Data Protection Regulation)',
            'Copyright Directive (EU) 2019/790',
            'Digital Services Act (DSA)',
            'Audiovisual Media Services Directive (AVMSD)',
        ],
        us: [
            'Digital Millennium Copyright Act (DMCA)',
            'Communications Decency Act Section 230',
            'California Consumer Privacy Act (CCPA)',
            'Children\'s Online Privacy Protection Act (COPPA)',
        ],
    },
};
exports.LEGAL_LOGGING_CONFIG = {
    CRITICAL_ACTIONS: [
        'content_upload',
        'content_publish',
        'content_delete',
        'user_register',
        'admin_action',
        'content_report',
    ],
    RETENTION_DAYS: 180,
    REQUIRED_FIELDS: [
        'timestamp',
        'userId',
        'action',
        'contentId',
        'ipAddress',
        'userAgent',
        'result',
    ],
};
exports.CONTENT_MODERATION_REQUIREMENTS = {
    MODERATION_TYPES: {
        PRE_PUBLISH: 'pre_publish',
        POST_PUBLISH: 'post_publish',
        REAL_TIME: 'real_time',
    },
    CONTENT_TO_REVIEW: [
        'video',
        'title',
        'description',
        'cover_image',
        'user_comment',
    ],
    PROHIBITED_CONTENT: [
        '色情淫秽内容',
        '暴力血腥内容',
        '政治敏感内容',
        '侵权盗版内容',
        '虚假信息',
        '违法广告',
        '赌博诈骗',
    ],
};
//# sourceMappingURL=legal.constants.js.map