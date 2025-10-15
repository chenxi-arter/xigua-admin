#!/usr/bin/env node
/**
 * 快速视频链接测试脚本（运维版本）
 * 
 * 用途：快速测试数据库中视频链接的可访问性
 * 特点：简化输出，适合运维人员使用
 * 
 * 使用方法：
 * node scripts/test-urls-quick.js [limit]
 * 
 * 示例：
 * node scripts/test-urls-quick.js 50
 */

const mysql = require('mysql2/promise');
const axios = require('axios');

// 数据库连接配置
function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '123456',
    database: process.env.DB_DATABASE || process.env.DB_NAME || 'short_drama',
    charset: 'utf8mb4'
  };
}

// 测试单个URL
async function testUrl(url, timeout = 5000) {
  if (!url || url.trim() === '') {
    return { success: false, error: 'URL为空' };
  }

  try {
    await axios.head(url, {
      timeout: timeout,
      maxRedirects: 3,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error.response?.status ? `HTTP ${error.response.status}` : error.message
    };
  }
}

// 主函数
async function main() {
  const limit = parseInt(process.argv[2]) || 1000;
  
  console.log(`🧪 快速测试视频链接 (限制: ${limit}条)`);
  console.log('=' .repeat(50));

  try {
    // 连接数据库
    const config = getDbConfig();
    console.log('🔗 数据库连接配置:', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database
    });
    
    const connection = await mysql.createConnection(config);
    console.log('✅ 数据库连接成功');

    // 查询URL数据
    console.log('📊 查询数据库...');
    
    // 随机抽查查询
    const [rows] = await connection.execute(`
      SELECT 
        id,
        episode_id,
        quality,
        oss_url,
        cdn_url,
        origin_url,
        subtitle_url
      FROM episode_urls 
      ORDER BY RAND()
      LIMIT ${limit}
    `);

    await connection.end();

    if (rows.length === 0) {
      console.log('❌ 没有找到URL记录');
      return;
    }

    console.log(`📊 找到 ${rows.length} 条记录，开始测试...\n`);

    // 统计变量
    let totalUrls = 0;
    let successCount = 0;
    let failedUrls = [];

    // 测试每个URL
    for (const row of rows) {
      const urls = [
        { type: 'OSS', url: row.oss_url },
        { type: 'CDN', url: row.cdn_url }
      ];

      console.log(`📺 Episode ID: ${row.episode_id} (${row.quality})`);

      for (const urlInfo of urls) {
        if (urlInfo.url) {
          totalUrls++;
          const result = await testUrl(urlInfo.url);
          
          if (result.success) {
            successCount++;
            console.log(`  ✅ ${urlInfo.type}: OK`);
          } else {
            console.log(`  ❌ ${urlInfo.type}: ${result.error}`);
            failedUrls.push({
              id: row.id,
              type: urlInfo.type,
              url: urlInfo.url,
              error: result.error
            });
          }
        }
      }
      console.log();
    }

    // 显示总结
    console.log('📊 测试结果总结');
    console.log('-'.repeat(30));
    console.log(`总URL数: ${totalUrls}`);
    console.log(`成功: ${successCount}`);
    console.log(`失败: ${totalUrls - successCount}`);
    console.log(`成功率: ${totalUrls > 0 ? (successCount / totalUrls * 100).toFixed(1) : 0}%`);

    if (failedUrls.length > 0) {
      console.log('\n❌ 失败的URL:');
      failedUrls.forEach(failed => {
        console.log(`  ID: ${failed.id}, ${failed.type}: ${failed.error}`);
      });
    }

    console.log('\n✅ 测试完成');

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}
