#!/bin/bash

echo "🚀 NS-MeetAI 一键部署脚本"
echo "========================"
echo "部署时间: $(date)"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误：请先安装Docker Compose"
    exit 1
fi

# 检查环境变量
echo "🔍 检查环境配置..."
if [ ! -f ".env" ]; then
    echo "⚠️  警告：.env 文件不存在"
    echo "正在从示例文件创建..."
    cp .env.example .env
    echo ""
    echo "📝 请编辑 .env 文件配置以下内容："
    echo "  1. OPENAI_API_KEY (必需)"
    echo "  2. 其他可选配置"
    echo ""
    echo "按回车继续，或按 Ctrl+C 取消..."
    read
    nano .env
fi

# 检查关键配置
if ! grep -q "OPENAI_API_KEY=" .env; then
    echo "❌ 错误：.env 文件中缺少 OPENAI_API_KEY"
    echo "请编辑 .env 文件添加你的OpenAI API密钥"
    exit 1
fi

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p uploads logs ai-logs postgres-data redis-data nginx/ssl

# 生成SSL证书（如果不存在）
if [ ! -f "nginx/ssl/localhost.crt" ] || [ ! -f "nginx/ssl/localhost.key" ]; then
    echo "🔐 生成本地SSL证书..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/localhost.key -out nginx/ssl/localhost.crt \
        -subj "/C=CN/ST=Beijing/L=Beijing/O=NS-MeetAI/CN=localhost" 2>/dev/null
    echo "✅ SSL证书生成完成"
fi

# 创建nginx配置
echo "🌐 配置nginx..."
mkdir -p nginx
cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 安全头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # CSP策略
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com;" always;
    
    # 文件上传限制
    client_max_body_size 50M;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # 访问日志
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # HTTP重定向到HTTPS
    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
    }
    
    # HTTPS服务器
    server {
        listen 443 ssl http2;
        server_name localhost;
        
        # SSL证书
        ssl_certificate /etc/nginx/ssl/localhost.crt;
        ssl_certificate_key /etc/nginx/ssl/localhost.key;
        
        # SSL配置
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # HSTS
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        
        # 前端静态文件
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
            
            # 缓存静态资源
            location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
                expires 30d;
                add_header Cache-Control "public, immutable";
            }
        }
        
        # 后端API代理
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # API不缓存
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # AI处理器代理
        location /ai/ {
            proxy_pass http://ai-processor:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # 健康检查
        location /health {
            proxy_pass http://backend:3000/health;
            access_log off;
        }
    }
}
EOF

# 选择部署模式
echo ""
echo "🎯 选择部署模式："
echo "  1) 开发模式 (热重载，包含管理工具)"
echo "  2) 生产模式 (优化性能，包含监控)"
echo ""
read -p "请输入选择 (1/2): " DEPLOY_MODE

# 构建和启动服务
echo ""
echo "🐳 构建Docker镜像..."
if [ "$DEPLOY_MODE" = "1" ]; then
    echo "🔧 启动开发模式..."
    docker-compose -f docker-compose.dev.yml build
    docker-compose -f docker-compose.dev.yml up -d
    COMPOSE_FILE="docker-compose.dev.yml"
else
    echo "🏭 启动生产模式..."
    docker-compose build
    docker-compose up -d
    COMPOSE_FILE="docker-compose.yml"
fi

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 服务状态检查："
docker-compose -f $COMPOSE_FILE ps

# 健康检查
echo ""
echo "🏥 健康检查："
echo "后端API:"
curl -s http://localhost:3000/health | python3 -m json.tool 2>/dev/null || echo "  后端服务可能还在启动中..."

echo ""
echo "前端服务:"
if curl -s -f http://localhost:5173 > /dev/null 2>&1; then
    echo "  ✅ 前端开发服务器运行正常 (端口 5173)"
else
    echo "  ⚠️  前端服务可能还在启动中..."
fi

# 显示访问信息
echo ""
echo "✅ NS-MeetAI 部署完成！"
echo ""
echo "🌐 访问地址："

if [ "$DEPLOY_MODE" = "1" ]; then
    echo "  前端开发服务器: http://localhost:5173"
    echo "  后端API: http://localhost:3000"
    echo "  数据库管理 (pgAdmin): http://localhost:5050"
    echo "  Redis管理: http://localhost:8081"
    echo "  邮箱: admin@ns-meetai.com"
    echo "  密码: admin123"
else
    echo "  生产环境: https://localhost"
    echo "  后端API: https://localhost/api"
    echo "  健康检查: https://localhost/health"
fi

echo ""
echo "🔧 管理命令："
echo "  查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "  停止服务: docker-compose -f $COMPOSE_FILE down"
echo "  重启服务: docker-compose -f $COMPOSE_FILE restart"
echo "  进入容器: docker-compose -f $COMPOSE_FILE exec frontend sh"
echo ""
echo "📝 日志文件位置："
echo "  后端日志: ./logs/"
echo "  AI处理器日志: ./ai-logs/"
echo "  Nginx日志: ./nginx/logs/"
echo "  数据库数据: ./postgres-data/"
echo "  Redis数据: ./redis-data/"
echo ""
echo "🚀 开始使用NS-MeetAI吧！"
echo ""
echo "📋 下一步建议："
echo "  1. 访问前端界面测试功能"
echo "  2. 上传测试音频文件验证AI处理"
echo "  3. 检查日志确保一切正常"
echo "  4. 配置域名和真实SSL证书（生产环境）"
echo ""
echo "💡 提示：首次启动可能需要几分钟时间下载和构建镜像"