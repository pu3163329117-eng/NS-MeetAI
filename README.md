# NS MeetAI - 智能会议纪要助手

![NS-MeetAI](https://img.shields.io/badge/NS--MeetAI-%E6%99%BA%E8%83%BD%E4%BC%9A%E8%AE%AE%E7%BA%AA%E8%A6%81-blue)
![version](https://img.shields.io/badge/version-0.1.0-green)
![license](https://img.shields.io/badge/license-MIT-blue)

一个基于AI的智能会议纪要生成工具，支持录音转文字、智能摘要、任务识别和多格式导出。

## ✨ 核心功能

- 🎤 **智能录音转文字**：支持多种音频格式，高精度转录
- 📝 **AI智能摘要**：自动生成结构化会议摘要
- ✅ **任务自动提取**：识别会议中的待办事项和责任人
- 👥 **发言人识别**：分析不同发言人的角色和贡献
- 📁 **多格式导出**：支持PDF、Word、Markdown等格式
- 🔒 **安全可靠**：端到端加密，数据隐私保护

## 🚀 快速开始（本地运行）

### 方式一：仅运行前端（推荐体验UI）

无需 Docker，直接本地运行前端：

```bash
# 克隆项目
git clone https://github.com/pu3163329117-eng/NS-MeetAI.git
cd NS-MeetAI/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器自动打开 http://localhost:5173
```

### 方式二：使用 Docker 运行完整项目

如果你有 Docker 环境：

```bash
# 克隆项目
cd NS-MeetAI

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置OPENAI_API_KEY等

# 启动所有服务
docker-compose up -d

# 访问应用
# 前端：http://localhost
# 后端API：http://localhost:3000
```

## 📁 项目结构

```
NS-MeetAI/
├── frontend/           # React 18 + TypeScript 前端 (可独立运行)
│   ├── src/
│   │   ├── components/ # React组件
│   │   ├── pages/      # 页面组件
│   │   ├── styles/     # 样式文件
│   │   └── types/      # TypeScript类型
│   └── package.json
├── backend/            # Node.js + Express 后端API
├── ai-processor/       # AI处理模块（OpenAI集成）
├── docker-compose.yml  # Docker编排配置
└── README.md
```

## 🛠️ 技术栈

**前端**
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- React Icons
- React Dropzone (文件上传)
- Zustand (状态管理)

**后端**
- Node.js + Express
- PostgreSQL (数据库)
- Redis (缓存)
- Prisma (ORM)

**AI处理**
- OpenAI GPT-4 (摘要生成)
- Whisper API (语音转文字)

## 📸 界面预览

运行 `npm run dev` 后可以看到：
- 首页 - 上传会议录音
- 特性介绍 - 核心功能展示
- 使用场景 - 团队会议/客户沟通/培训学习

## 🔧 开发

```bash
cd frontend

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📄 License

MIT License - 由 Rain & NS Team 开发
