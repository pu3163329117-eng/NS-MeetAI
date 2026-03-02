#!/bin/bash

echo "🧪 NS-MeetAI 项目完整性测试"
echo "=========================="
echo "测试时间: $(date)"
echo ""

# 1. 检查目录结构
echo "1. 📁 检查目录结构..."
REQUIRED_DIRS=("frontend" "backend" "ai-processor" "uploads" "logs" "ai-logs")

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir 目录存在"
    else
        echo "  ❌ $dir 目录不存在"
    fi
done

echo ""

# 2. 检查关键文件
echo "2. 📄 检查关键文件..."
REQUIRED_FILES=(
    "package.json"
    "docker-compose.yml"
    "docker-compose.dev.yml"
    ".env.example"
    "README.md"
    "deploy.sh"
    "frontend/package.json"
    "frontend/vite.config.ts"
    "frontend/tailwind.config.js"
    "backend/package.json"
    "backend/src/server.ts"
    "ai-processor/package.json"
    "ai-processor/src/index.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file 文件存在"
    else
        echo "  ❌ $file 文件不存在"
    fi
done

echo ""

# 3. 检查Docker配置
echo "3. 🐳 检查Docker配置..."
if command -v docker &> /dev/null; then
    echo "  ✅ Docker 已安装"
    
    # 检查docker-compose配置
    if docker-compose config -q 2>/dev/null; then
        echo "  ✅ docker-compose.yml 配置有效"
    else
        echo "  ❌ docker-compose.yml 配置无效"
    fi
    
    if [ -f "docker-compose.dev.yml" ] && docker-compose -f docker-compose.dev.yml config -q 2>/dev/null; then
        echo "  ✅ docker-compose.dev.yml 配置有效"
    else
        echo "  ❌ docker-compose.dev.yml 配置无效"
    fi
else
    echo "  ⚠️  Docker 未安装（跳过Docker检查）"
fi

echo ""

# 4. 检查配置文件
echo "4. ⚙️ 检查配置文件..."

# 检查环境变量模板
if [ -f ".env.example" ]; then
    echo "  ✅ .env.example 存在"
    
    # 检查关键环境变量
    REQUIRED_ENV_VARS=("OPENAI_API_KEY" "DATABASE_URL" "JWT_SECRET")
    for var in "${REQUIRED_ENV_VARS[@]}"; do
        if grep -q "$var" .env.example; then
            echo "    ✅ $var 在模板中定义"
        else
            echo "    ⚠️  $var 未在模板中定义"
        fi
    done
else
    echo "  ❌ .env.example 不存在"
fi

echo ""

# 5. 检查项目配置
echo "5. 📦 检查项目配置..."

# 检查根package.json
if [ -f "package.json" ]; then
    echo "  ✅ 根package.json存在"
    
    # 检查工作区配置
    if grep -q '"workspaces": \["frontend"\]' package.json; then
        echo "    ✅ 工作区配置正确"
    else
        echo "    ❌ 工作区配置错误"
    fi
    
    # 检查脚本
    REQUIRED_SCRIPTS=("dev" "build" "docker:up" "docker:down")
    for script in "${REQUIRED_SCRIPTS[@]}"; do
        if grep -q "\"$script\"" package.json; then
            echo "    ✅ $script 脚本存在"
        else
            echo "    ⚠️  $script 脚本不存在"
        fi
    done
fi

echo ""

# 6. 检查前端配置
echo "6. 🎨 检查前端配置..."
if [ -f "frontend/vite.config.ts" ]; then
    if grep -q "'@': path.resolve" frontend/vite.config.ts; then
        echo "  ✅ Vite别名配置正确"
    else
        echo "  ❌ Vite别名配置错误"
    fi
fi

if [ -f "frontend/tailwind.config.js" ]; then
    if grep -q "border: 'hsl(var(--border))'" frontend/tailwind.config.js; then
        echo "  ✅ Tailwind CSS变量配置正确"
    else
        echo "  ❌ Tailwind CSS变量配置错误"
    fi
fi

echo ""

# 7. 检查后端配置
echo "7. 🔧 检查后端配置..."
if [ -f "backend/src/server.ts" ]; then
    echo "  ✅ 后端服务器文件存在"
    
    # 检查关键中间件
    if grep -q "helmet" backend/src/server.ts && \
       grep -q "cors" backend/src/server.ts && \
       grep -q "rateLimit" backend/src/server.ts; then
        echo "  ✅ 安全中间件配置完整"
    else
        echo "  ⚠️  安全中间件配置不完整"
    fi
fi

echo ""

# 8. 检查AI处理器配置
echo "8. 🤖 检查AI处理器配置..."
if [ -f "ai-processor/src/index.ts" ]; then
    echo "  ✅ AI处理器主文件存在"
    
    if [ -f "ai-processor/src/services/openai.service.ts" ]; then
        echo "  ✅ OpenAI服务文件存在"
    fi
    
    if [ -f "ai-processor/src/services/audio.processor.ts" ]; then
        echo "  ✅ 音频处理器文件存在"
    fi
    
    if [ -f "ai-processor/src/services/meeting.analyzer.ts" ]; then
        echo "  ✅ 会议分析器文件存在"
    fi
fi

echo ""

# 9. 总结
echo "📊 测试总结"
echo "=========="

TOTAL_CHECKS=0
PASSED_CHECKS=0

# 统计目录检查
for dir in "${REQUIRED_DIRS[@]}"; do
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    [ -d "$dir" ] && PASSED_CHECKS=$((PASSED_CHECKS + 1))
done

# 统计文件检查
for file in "${REQUIRED_FILES[@]}"; do
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    [ -f "$file" ] && PASSED_CHECKS=$((PASSED_CHECKS + 1))
done

# 计算通过率
if [ $TOTAL_CHECKS -gt 0 ]; then
    PASS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
else
    PASS_RATE=0
fi

echo "总检查项: $TOTAL_CHECKS"
echo "通过项: $PASSED_CHECKS"
echo "通过率: $PASS_RATE%"

echo ""

if [ $PASS_RATE -ge 80 ]; then
    echo "🎉 项目完整性良好，可以部署！"
    echo ""
    echo "🚀 部署命令："
    echo "  chmod +x deploy.sh"
    echo "  ./deploy.sh"
elif [ $PASS_RATE -ge 60 ]; then
    echo "⚠️  项目基本完整，建议修复缺失项后再部署"
else
    echo "❌ 项目不完整，需要修复大量问题"
fi

echo ""
echo "📋 建议："
echo "  1. 确保所有必需文件都存在"
echo "  2. 检查配置文件是否正确"
echo "  3. 测试Docker配置是否有效"
echo "  4. 创建 .env 文件并配置环境变量"
echo "  5. 运行部署脚本进行完整测试"