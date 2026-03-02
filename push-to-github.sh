#!/bin/bash

echo "🚀 NS-MeetAI 推送到GitHub"
echo "========================"
echo "推送时间: $(date)"
echo ""

# 检查Git配置
echo "🔍 检查Git配置..."
if [ ! -d ".git" ]; then
    echo "❌ 错误：当前目录不是Git仓库"
    echo "正在初始化Git仓库..."
    git init
    git remote add origin https://github.com/pu3163329117-eng/NS-MeetAI.git
fi

# 检查远程仓库
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    echo "❌ 错误：未配置远程仓库"
    echo "正在配置远程仓库..."
    git remote add origin https://github.com/pu3163329117-eng/NS-MeetAI.git
fi

echo "✅ 远程仓库: $REMOTE_URL"

# 拉取最新代码
echo ""
echo "📥 拉取最新代码..."
git pull origin main --rebase 2>/dev/null || echo "⚠️  无法拉取代码，可能是新仓库"

# 添加所有文件
echo ""
echo "📁 添加文件到Git..."
git add .

# 检查是否有更改
if git diff --cached --quiet; then
    echo "⚠️  没有需要提交的更改"
    exit 0
fi

# 显示更改
echo ""
echo "📝 更改摘要："
git diff --cached --stat

# 提交更改
echo ""
echo "💾 提交更改..."
COMMIT_MESSAGE="feat: 完整修复NS-MeetAI项目

修复内容：
1. 🔧 修复工作区配置问题
2. 🎨 修复前端Vite和Tailwind配置
3. 🔧 创建完整的后端API服务
4. 🤖 创建完整的AI处理器模块
5. 🐳 完善Docker配置和部署脚本
6. 📚 更新完整项目文档
7. 🛡️ 添加安全配置和最佳实践
8. 📦 创建一键部署脚本

详细修复：
- 修复package.json工作区配置
- 修复vite.config.ts别名配置
- 修复tailwind.config.js CSS变量
- 创建Express + TypeScript后端
- 创建OpenAI集成的AI处理器
- 创建完整的docker-compose配置
- 添加生产环境部署脚本
- 更新完整README文档
- 添加安全中间件和配置
- 创建项目测试脚本"

git commit -m "$COMMIT_MESSAGE"

# 推送到GitHub
echo ""
echo "🚀 推送到GitHub..."
if git push origin main; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "🌐 GitHub仓库: https://github.com/pu3163329117-eng/NS-MeetAI"
    echo ""
    echo "📋 项目状态："
    echo "  ✅ 前端：React 18 + TypeScript + Vite + Tailwind"
    echo "  ✅ 后端：Express + TypeScript + PostgreSQL"
    echo "  ✅ AI处理器：OpenAI集成 + 音频处理"
    echo "  ✅ 部署：Docker Compose + Nginx + SSL"
    echo "  ✅ 文档：完整README + 部署指南"
    echo ""
    echo "🚀 部署命令："
    echo "  ./deploy.sh"
    echo ""
    echo "🧪 测试命令："
    echo "  ./test-project.sh"
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "💡 可能的原因："
    echo "  1. 没有GitHub仓库写入权限"
    echo "  2. 网络连接问题"
    echo "  3. 分支冲突"
    echo ""
    echo "🔧 解决方法："
    echo "  1. 检查GitHub权限"
    echo "  2. 手动推送：git push origin main --force"
    echo "  3. 创建新分支：git checkout -b fix/complete-project"
fi

echo ""
echo "📊 项目统计："
echo "  前端文件数: $(find frontend -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l)"
echo "  后端文件数: $(find backend -type f -name "*.ts" -o -name "*.js" | wc -l)"
echo "  AI处理器文件数: $(find ai-processor -type f -name "*.ts" -o -name "*.js" | wc -l)"
echo "  配置文件数: $(find . -maxdepth 2 -type f -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "Dockerfile*" | wc -l)"
echo "  总文件数: $(find . -type f ! -path "./.git/*" | wc -l)"
echo "  总代码行数: $(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" ! -path "./.git/*" -exec cat {} \; | wc -l)"