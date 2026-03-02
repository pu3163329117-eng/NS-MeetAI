# NS-MeetAI - 智能会议纪要AI助手

![NS-MeetAI Logo](https://img.shields.io/badge/NS--MeetAI-智能会议纪要-blue)
![Version](https://img.shields.io/badge/version-0.1.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

一个基于AI的智能会议纪要生成工具，支持录音转文字、智能摘要、任务识别和多格式导出。

## ✨ 功能特性

- 🎤 **智能录音转文字**：支持多种音频格式，高精度转录
- 📝 **AI智能摘要**：自动生成结构化会议摘要
- ✅ **任务自动提取**：识别会议中的待办事项和责任人
- 👥 **发言人识别**：分析不同发言人的角色和贡献
- 📁 **多格式导出**：支持PDF、Word、Markdown等格式
- 🔒 **安全可靠**：端到端加密，数据隐私保护
- 🐳 **容器化部署**：支持Docker一键部署

## 🏗️ 系统架构

```
NS-MeetAI/
├── frontend/          # React 18 + TypeScript前端
├── backend/           # Node.js + Express后端API
├── ai-processor/      # AI处理模块（OpenAI集成）
├── db/               # PostgreSQL数据库
├── redis/            # Redis缓存
└── nginx/            # 反向代理和负载均衡
```

## 🚀 快速开始

### 环境要求
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (仅开发需要)

### 一键部署（生产环境）
```bash
# 克隆项目
git clone https://github.com/pu3163329117-eng/NS-MeetAI.git
cd NS-MeetAI

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置OPENAI_API_KEY等

# 启动所有服务
docker-compose up -d

# 访问应用
# 前端：http://localhost
# 后端API：http://localhost:3000
# 健康检查：http://localhost:3000/health
```

### 开发环境
```bash
# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 访问开发工具
# 前端开发：http://localhost:5173
# 后端API：http://localhost:3000
# 数据库管理：http://localhost:5050 (pgAdmin)
# Redis管理：http://localhost:8081 (Redis Commander)
```

## 📁 项目结构

```
NS-MeetAI/
├── frontend/                 # 前端应用
│   ├── src/                 # 源代码
│   │   ├── components/      # React组件
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API服务
│   │   ├── styles/         # 样式文件
│   │   └── utils/          # 工具函数
│   ├── public/             # 静态资源
│   ├── package.json        # 前端依赖
│   ├── vite.config.ts      # Vite配置
│   ├── tailwind.config.js  # Tailwind配置
│   └── Dockerfile          # 生产Dockerfile
├── backend/                 # 后端API
│   ├── src/                # 源代码
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   └── utils/          # 工具函数
│   ├── prisma/             # 数据库架构
│   ├── package.json        # 后端依赖
│   ├── Dockerfile          # 生产Dockerfile
│   └── .env.example        # 环境变量示例
├── ai-processor/           # AI处理模块
│   ├── src/                # 源代码
│   │   ├── services/       # AI服务
│   │   │   ├── openai.service.ts    # OpenAI集成
│   │   │   ├── audio.processor.ts   # 音频处理
│   │   │   └── meeting.analyzer.ts  # 会议分析
│   │   └── index.ts        # 主入口
│   ├── package.json        # AI处理器依赖
│   ├── Dockerfile          # 生产Dockerfile
│   └── .env.example        # 环境变量示例
├── docker-compose.yml      # 生产环境配置
├── docker-compose.dev.yml  # 开发环境配置
├── .env.example            # 全局环境变量示例
└── README.md               # 项目文档
```

## 🔧 配置说明

### 环境变量配置
复制 `.env.example` 为 `.env` 并修改以下关键配置：

```bash
# OpenAI配置（必需）
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DATABASE_URL=postgresql://postgres:password@db:5432/ns_meetai

# 安全配置
JWT_SECRET=your-jwt-secret-key-change-this
SESSION_SECRET=your-session-secret-key-change-this

# CORS配置
CORS_ORIGIN=http://localhost:5173
```

### 服务端口
- **前端**：80 (生产) / 5173 (开发)
- **后端API**：3000
- **AI处理器**：3001
- **数据库**：5432
- **Redis**：6379
- **pgAdmin**：5050 (开发)
- **Redis Commander**：8081 (开发)

## 📊 API文档

### 健康检查
```http
GET /health
```
响应：
```json
{
  "status": "healthy",
  "timestamp": "2026-03-02T01:49:00.000Z",
  "service": "NS-MeetAI Backend",
  "version": "0.1.0"
}
```

### 上传会议录音
```http
POST /api/upload
Content-Type: multipart/form-data

file: <音频文件>
meeting_title: 项目周会
meeting_date: 2026-03-02
participants: ["张三", "李四", "王五"]
```

### 获取会议列表
```http
GET /api/meetings
```

### 获取会议详情
```http
GET /api/meetings/:id
```

## 🛡️ 安全特性

- 🔒 **HTTPS加密**：全站HTTPS支持
- 🛡️ **安全HTTP头**：CSP、HSTS、X-Frame-Options等
- ⚡ **速率限制**：防止暴力攻击
- 🧹 **输入验证**：防止SQL注入和XSS攻击
- 📝 **完整日志**：审计和安全监控
- 🔐 **JWT认证**：安全的API认证

## 🐳 Docker部署

### 构建镜像
```bash
# 构建所有服务
docker-compose build

# 构建特定服务
docker-compose build frontend
docker-compose build backend
docker-compose build ai-processor
```

### 启动服务
```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
docker-compose logs -f frontend
docker-compose logs -f backend

# 停止服务
docker-compose down

# 停止并清理数据
docker-compose down -v
```

### 开发环境
```bash
# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 查看开发日志
docker-compose -f docker-compose.dev.yml logs -f

# 进入容器
docker-compose -f docker-compose.dev.yml exec frontend sh
docker-compose -f docker-compose.dev.yml exec backend sh
```

## 🧪 测试

### 单元测试
```bash
# 运行所有测试
npm test

# 运行前端测试
cd frontend && npm test

# 运行后端测试
cd backend && npm test

# 运行AI处理器测试
cd ai-processor && npm test
```

### 集成测试
```bash
# 使用Docker运行集成测试
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### 代码质量
```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit
```

## 📈 监控和维护

### 健康检查
```bash
# 检查服务健康状态
curl http://localhost:3000/health
curl http://localhost:3001/health

# 检查数据库连接
docker-compose exec db pg_isready -U postgres

# 检查Redis连接
docker-compose exec redis redis-cli ping
```

### 日志管理
```bash
# 查看实时日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f ai-processor

# 导出日志
docker-compose logs > logs/all.log
docker-compose logs frontend > logs/frontend.log
```

### 备份和恢复
```bash
# 备份数据库
docker-compose exec db pg_dumpall -U postgres > backup/ns_meetai_$(date +%Y%m%d).sql

# 备份上传文件
tar -czf backup/uploads_$(date +%Y%m%d).tar.gz uploads/

# 恢复数据库
docker-compose exec -T db psql -U postgres -d ns_meetai < backup/ns_meetai_20240302.sql
```

## 🤝 贡献指南

### 开发流程
1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

### 代码规范
- 使用TypeScript编写类型安全的代码
- 遵循ESLint代码规范
- 编写单元测试和集成测试
- 更新相关文档

### 提交信息规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具变动

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

- 📧 邮箱：support@ns-meetai.com
- 🐛 问题反馈：[GitHub Issues](https://github.com/pu3163329117-eng/NS-MeetAI/issues)
- 📚 文档：[项目Wiki](https://github.com/pu3163329117-eng/NS-MeetAI/wiki)
- 💬 讨论：[GitHub Discussions](https://github.com/pu3163329117-eng/NS-MeetAI/discussions)

## 🙏 致谢

感谢以下开源项目和技术：
- [OpenAI](https://openai.com/) - 提供强大的AI能力
- [React](https://reactjs.org/) - 前端框架
- [Express](https://expressjs.com/) - 后端框架
- [PostgreSQL](https://www.postgresql.org/) - 数据库
- [Redis](https://redis.io/) - 缓存
- [Docker](https://www.docker.com/) - 容器化
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架

---

**NS-MeetAI** - 让会议记录变得更智能、更高效！ 🚀