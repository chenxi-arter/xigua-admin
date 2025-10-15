# 视频链接测试工具

这是一个用于测试数据库中视频链接可访问性的Node.js脚本。

## 安装依赖

```bash
npm install
```

## 配置环境变量

1. 复制环境变量示例文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，设置你的数据库连接信息：
```env
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=your_actual_password
DB_DATABASE=short_drama
```

## 使用方法

```bash
# 测试1000条记录（默认）
node test-urls-quick.js

# 测试指定数量的记录
node test-urls-quick.js 500

# 或者使用npm脚本
npm start
npm test
```

## 功能特点

- ✅ 随机抽查数据库中的视频链接
- ✅ 测试OSS和CDN链接的可访问性
- ✅ 显示详细的测试结果和统计信息
- ✅ 支持环境变量配置
- ✅ 适合运维人员使用的简化输出

## 测试结果

脚本会显示：
- 每个Episode的测试结果
- 总体统计信息（成功率、失败数等）
- 失败的URL详情

## 注意事项

- 确保数据库服务正在运行
- 确保数据库用户有足够的权限
- 网络连接正常，能够访问视频链接
