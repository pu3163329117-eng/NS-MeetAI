import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 配置日志
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api', limiter);

// 解析请求体
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NS-MeetAI Backend',
    version: '0.1.0'
  });
});

// API版本信息
app.get('/api/version', (req, res) => {
  res.json({
    name: 'NS-MeetAI API',
    version: '0.1.0',
    description: '智能会议纪要AI助手后端API',
    documentation: '/api-docs'
  });
});

// 会议相关API
app.get('/api/meetings', (req, res) => {
  res.json({
    message: '获取会议列表',
    data: []
  });
});

app.post('/api/meetings', (req, res) => {
  const { title, date, participants } = req.body;
  
  if (!title || !date) {
    return res.status(400).json({
      error: '缺少必要参数',
      required: ['title', 'date']
    });
  }
  
  res.status(201).json({
    message: '会议创建成功',
    data: {
      id: 'mock-' + Date.now(),
      title,
      date,
      participants: participants || [],
      createdAt: new Date().toISOString()
    }
  });
});

// 文件上传API
app.post('/api/upload', (req, res) => {
  // 这里应该使用multer处理文件上传
  // 暂时返回模拟数据
  res.json({
    message: '文件上传成功（模拟）',
    data: {
      fileId: 'file-' + Date.now(),
      filename: 'meeting-audio.mp3',
      size: 1024 * 1024, // 1MB
      uploadedAt: new Date().toISOString(),
      transcriptionStatus: 'pending'
    }
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到请求的资源',
    path: req.path,
    method: req.method
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('服务器错误:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  logger.info(`🚀 后端服务器运行在 http://localhost:${PORT}`);
  logger.info(`📊 健康检查: http://localhost:${PORT}/health`);
  logger.info(`📚 API文档: http://localhost:${PORT}/api/version`);
});