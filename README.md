# NS-MeetAI - 智能会议纪要AI助手

## 🎯 项目简介

NS-MeetAI 是一个基于AI的智能会议纪要生成工具，能够自动转录会议录音、提取关键信息、识别任务项，并生成结构化的会议纪要。

## ✨ 核心功能

- 🎤 **实时录音转文字**：支持多种音频格式，实时转录
- 🧠 **智能摘要生成**：自动提取会议要点和决策
- 📋 **任务识别分配**：识别待办事项并关联责任人
- 📊 **情绪分析**：分析会议氛围和参与度
- 📁 **多格式导出**：支持Markdown、Word、PDF格式
- 🔗 **平台集成**：支持飞书、Zoom、Teams等平台

## 🏗️ 技术架构

```
NS-MeetAI/
├── frontend/          # React 18 + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript
├── ai-processor/      # OpenAI API + Whisper + GPT-4
├── docs/              # 项目文档
└── tests/             # 单元测试和集成测试
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- OpenAI API Key

### 安装步骤
```bash
# 克隆项目
git clone <repository-url>
cd NS-MeetAI

# 安装依赖
npm run setup

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的API密钥

# 启动开发服务器
npm run dev
```

## 📁 项目结构

```
NS-MeetAI/
├── frontend/
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义Hooks
│   │   └── utils/         # 工具函数
├── backend/
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── services/      # 业务逻辑
│   │   ├── models/        # 数据模型
│   │   └── middleware/    # 中间件
├── ai-processor/
│   ├── src/
│   │   ├── transcription/ # 语音转文字
│   │   ├── summarization/ # 摘要生成
│   │   └── task-extraction/ # 任务提取
└── docs/
    ├── API.md            # API文档
    ├── ARCHITECTURE.md   # 架构设计
    └── DEVELOPMENT.md    # 开发指南
```

## 🔧 开发指南

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
npm install
npm run dev
```

### AI处理器开发
```bash
cd ai-processor
npm install
npm run dev
```

## 📊 功能路线图

### MVP (第1周)
- [ ] 基础录音上传和转文字
- [ ] 简单摘要生成
- [ ] 基础用户界面

### V1.0 (第2周)
- [ ] 实时语音处理
- [ ] 智能任务提取
- [ ] 多格式导出

### V1.1 (第3周)
- [ ] 平台集成（飞书、Zoom）
- [ ] 团队协作功能
- [ ] 高级分析报告

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 团队

- **Rain** - 项目发起人
- **Aiden** - 技术负责人
- **Diana** - 文档负责人
- **Oscar** - 运营负责人
- **文歆** - 项目协调

## 📞 联系方式

如有问题或建议，请通过项目 Issues 页面提交。

---

**让每一次会议都更有价值！** 🚀