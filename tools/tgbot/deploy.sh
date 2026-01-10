#!/bin/bash

# Telegram Bot PM2 部署脚本
# 使用方法: ./deploy.sh [选项]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${GREEN}[信息]${NC} $1"
}

print_error() {
    echo -e "${RED}[错误]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[警告]${NC} $1"
}

# 检查环境变量
check_env() {
    if [ ! -f .env ]; then
        print_error ".env 文件不存在"
        print_info "正在从 env.example 创建 .env 文件..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "请编辑 .env 文件，填入你的 BOT_TOKEN"
            exit 1
        else
            print_error "env.example 文件也不存在"
            exit 1
        fi
    fi
    
    # 检查 BOT_TOKEN 是否已设置
    if ! grep -q "BOT_TOKEN=.*[^[:space:]]" .env; then
        print_error ".env 文件中的 BOT_TOKEN 未设置"
        print_info "请编辑 .env 文件，填入你的 BOT_TOKEN"
        exit 1
    fi
    
    print_info "✅ 环境变量检查通过"
}

# 创建必要的目录
create_dirs() {
    print_info "创建必要的目录..."
    mkdir -p logs data
    print_info "✅ 目录创建完成"
}

# PM2 部署
deploy_pm2() {
    print_info "开始 PM2 部署..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    # 检查 PM2
    if ! command -v pm2 &> /dev/null; then
        print_info "PM2 未安装，正在安装..."
        npm install -g pm2
    fi
    
    check_env
    create_dirs
    
    print_info "安装依赖..."
    npm install --production
    
    print_info "停止旧进程..."
    pm2 delete telegram-bot 2>/dev/null || true
    
    print_info "启动应用..."
    pm2 start ecosystem.config.cjs
    
    print_info "保存 PM2 配置..."
    pm2 save
    
    print_info "设置开机自启..."
    pm2 startup | grep -o 'sudo .*' | sh || print_warning "请手动执行 'pm2 startup' 命令"
    
    print_info "查看应用状态..."
    pm2 status
    
    print_info "✅ PM2 部署完成！"
    print_info "使用 'pm2 logs telegram-bot' 查看日志"
    print_info "使用 'pm2 monit' 监控应用"
}

# 更新应用
update_app() {
    print_info "开始更新应用..."
    
    if pm2 list | grep -q telegram-bot; then
        print_info "检测到 PM2 部署，使用 PM2 方式更新..."
        
        print_info "拉取最新代码..."
        git pull || print_warning "Git pull 失败，请手动更新代码"
        
        print_info "安装依赖..."
        npm install --production
        
        print_info "重启应用..."
        pm2 restart telegram-bot
        
        print_info "✅ 更新完成！"
    else
        print_error "未检测到已部署的应用"
        print_info "请先使用 './deploy.sh --pm2' 进行部署"
        exit 1
    fi
}

# 显示帮助
show_help() {
    echo "Telegram Bot 部署脚本"
    echo ""
    echo "使用方法: ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  --pm2       使用 PM2 部署"
    echo "  --update    更新已部署的应用"
    echo "  --help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh --pm2       # PM2 部署"
    echo "  ./deploy.sh --update    # 更新应用"
}

# 主函数
main() {
    case "${1:-}" in
        --pm2)
            deploy_pm2
            ;;
        --update)
            update_app
            ;;
        --help|help|-h)
            show_help
            ;;
        *)
            print_error "未知选项: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
