import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import { OpenAIService } from './services/openai.service';
import { AudioProcessor } from './services/audio.processor';
import { MeetingAnalyzer } from './services/meeting.analyzer';

// 加载环境变量
dotenv.config();

// 配置日志
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/ai-processor.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// AI处理器类
export class AIProcessor {
  private openAIService: OpenAIService;
  private audioProcessor: AudioProcessor;
  private meetingAnalyzer: MeetingAnalyzer;

  constructor() {
    this.openAIService = new OpenAIService();
    this.audioProcessor = new AudioProcessor();
    this.meetingAnalyzer = new MeetingAnalyzer(this.openAIService);
  }

  /**
   * 处理会议音频
   */
  async processMeetingAudio(audioPath: string, options: any = {}) {
    try {
      logger.info('开始处理会议音频', { audioPath, options });

      // 1. 音频转文字
      const transcription = await this.audioProcessor.transcribeAudio(audioPath);
      logger.info('音频转文字完成', { length: transcription.length });

      // 2. 生成会议摘要
      const summary = await this.meetingAnalyzer.generateSummary(transcription);
      logger.info('会议摘要生成完成', { length: summary.length });

      // 3. 提取会议任务
      const tasks = await this.meetingAnalyzer.extractTasks(transcription);
      logger.info('会议任务提取完成', { count: tasks.length });

      // 4. 识别发言人
      const speakers = await this.meetingAnalyzer.identifySpeakers(transcription);
      logger.info('发言人识别完成', { count: speakers.length });

      return {
        success: true,
        data: {
          transcription,
          summary,
          tasks,
          speakers,
          metadata: {
            audioDuration: options.duration,
            processedAt: new Date().toISOString(),
            model: this.openAIService.getModelInfo()
          }
        }
      };
    } catch (error) {
      logger.error('处理会议音频失败', { error: error.message, audioPath });
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    try {
      const aiHealth = await this.openAIService.healthCheck();
      return {
        status: 'healthy',
        services: {
          openai: aiHealth,
          audio: 'available',
          analyzer: 'available'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// 导出服务
export { OpenAIService, AudioProcessor, MeetingAnalyzer };

// 如果直接运行，启动健康检查
if (require.main === module) {
  const processor = new AIProcessor();
  
  processor.healthCheck().then(health => {
    logger.info('AI处理器健康检查', health);
    
    if (health.status === 'healthy') {
      logger.info('✅ AI处理器启动成功，等待处理任务...');
    } else {
      logger.error('❌ AI处理器启动失败', health);
      process.exit(1);
    }
  });
}