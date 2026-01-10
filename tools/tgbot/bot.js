import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import config from './config.js';
import http from 'http';

// 加载环境变量
dotenv.config();

// 创建 bot 实例
const bot = new Telegraf(process.env.BOT_TOKEN);

// 定义图片 URL
const XIGUA_LOGO_URL = 'https://static.656932.com/tgbot/1ce9bcbf-34a3-4afb-b814-1abec9f7021c.jpeg';

// 创建健康检查服务器
const healthCheckServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const HEALTH_CHECK_PORT = process.env.HEALTH_CHECK_PORT || 3000;
healthCheckServer.listen(HEALTH_CHECK_PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🏥 健康检查服务运行在端口 ${HEALTH_CHECK_PORT}`);
  }
});

// 处理 /start 命令
bot.start(async (ctx) => {
  const userName = ctx.from.first_name || '朋友';
  
  try {
    await ctx.replyWithPhoto(
      XIGUA_LOGO_URL,
      {
        caption: `👋 你好 ${userName}！\n\n` +
                `欢迎使用我们的服务！\n\n` +
                `点击下方按钮访问网站\n\n` ,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ 
              text: '📱 直接观看', 
              web_app: { url: `https://${config.website}` }
            }],
            [{ 
              text: '🌐 浏览器打开', 
              url: `https://${config.website}` 
            }],
            [{ text: '❓ 帮助', callback_data: 'help' }]
          ]
        }
      }
    );
  } catch (error) {
    // 如果图片发送失败，发送普通文本消息
    if (process.env.NODE_ENV !== 'production') {
      console.error('发送图片失败:', error);
    }
    await ctx.reply(
      `👋 你好 ${userName}！\n\n` +
      `欢迎使用我们的服务！\n\n` +
      `点击下方按钮访问网站\n\n` +
      `输入 /help 查看更多命令`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ 
              text: '📱 直接观看', 
              web_app: { url: `https://${config.website}` }
            }],
            [{ 
              text: '🌐 浏览器打开', 
              url: `https://${config.website}` 
            }],
            [{ text: '❓ 帮助', callback_data: 'help' }]
          ]
        }
      }
    );
  }
});

// 处理 /help 命令
bot.help((ctx) => {
  ctx.reply(
    '📋 *可用命令：*\n\n' +
    '/start - 开始使用\n' +
    '/help - 显示帮助信息\n' +
    '/website - 获取网站链接',
    { parse_mode: 'Markdown' }
  );
});

// 处理 /website 命令
bot.command('website', (ctx) => {
  ctx.reply(
    `🌐 *访问我们的网站*\n\n点击下方按钮访问`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ 
            text: '🌐 浏览器打开', 
            url: `https://${config.website}`
          }]
        ]
      }
    }
  );
});

// 处理内联按钮回调
bot.action('help', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    '📋 *可用命令：*\n\n' +
    '/start - 开始使用\n' +
    '/help - 显示帮助信息\n' +
    '/website - 获取网站链接',
    { parse_mode: 'Markdown' }
  );
});

// 处理所有文本消息（自动回复）
bot.on('text', async (ctx) => {
  const message = ctx.message.text.toLowerCase();
  
  // 如果不是命令，则发送默认回复
  if (!message.startsWith('/')) {
    try {
      // 尝试发送带图片的回复
      await ctx.replyWithPhoto(
        XIGUA_LOGO_URL,
        {
          caption: `感谢你的消息！\n\n` +
                  `🎬 西瓜短剧 - 热门短剧，随心看\n\n` +
                  `点击下方按钮观看短剧`,
          reply_markup: {
            inline_keyboard: [
              [{ 
                text: '📱 站内观看', 
                web_app: { url: `https://${config.website}` }
              }],
              [{ 
                text: '🌐 浏览器打开', 
                url: `https://${config.website}` 
              }]
            ]
          }
        }
      );
    } catch (error) {
      // 只在开发环境记录详细错误
      if (process.env.NODE_ENV !== 'production') {
        console.error('发送图片失败:', error);
      }
      // 如果图片发送失败，发送普通文本消息
      await ctx.reply(
        `感谢你的消息！\n\n` +
        `🎬 西瓜短剧 - 热门短剧，随心看\n\n` +
        `点击下方按钮观看短剧`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ 
                text: '📱 站内观看', 
                web_app: { url: `https://${config.website}` }
              }],
              [{ 
                text: '🌐 浏览器打开', 
                url: `https://${config.website}` 
              }]
            ]
          }
        }
      );
    }
  }
});

// 处理新成员加入（关注）
bot.on('chat_member', (ctx) => {
  const oldStatus = ctx.chatMember.old_chat_member.status;
  const newStatus = ctx.chatMember.new_chat_member.status;
  
  // 当用户从非成员变为成员时
  if ((oldStatus === 'left' || oldStatus === 'kicked') && 
      (newStatus === 'member' || newStatus === 'administrator' || newStatus === 'creator')) {
    ctx.reply(
      `🎉 欢迎加入！\n\n` +
      `感谢关注我们！\n\n` +
      `点击下方按钮访问网站`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 访问网站', url: config.website }]
          ]
        }
      }
    );
  }
});

// 错误处理
bot.catch((err, ctx) => {
  // 生产环境只记录关键错误信息
  if (process.env.NODE_ENV === 'production') {
    console.error(`Error [${ctx.updateType}]:`, err.message || err);
  } else {
    console.error(`❌ 错误发生在 ${ctx.updateType}:`, err);
  }
});

// 启动 bot
bot.launch()
  .then(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`Bot started: @${bot.botInfo.username}`);
    } else {
      console.log('✅ Bot 已启动！');
      console.log(`📝 Bot 用户名: @${bot.botInfo.username}`);
      console.log(`🌐 配置的网站: ${config.website}`);
    }
  })
  .catch((err) => {
    console.error('Bot startup failed:', err.message || err);
  });

// 优雅退出
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  if (process.env.NODE_ENV !== 'production') {
    console.log('👋 Bot 已停止');
  }
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  if (process.env.NODE_ENV !== 'production') {
    console.log('👋 Bot 已停止');
  }
});

