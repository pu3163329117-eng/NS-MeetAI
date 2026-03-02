import OpenAI from 'openai';
import { createLogger, format, transports } from 'winston';

// 配置日志
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

export class OpenAIService {
  private openai: OpenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY 环境变量未设置');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    logger.info('OpenAI服务初始化完成', { model: this.model });
  }

  /**
   * 获取模型信息
   */
  getModelInfo() {
    return {
      provider: 'openai',
      model: this.model,
      maxTokens: 4096,
      supports: ['chat', 'completion', 'embeddings']
    };
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    try {
      await this.openai.models.list();
      return {
        status: 'healthy',
        provider: 'openai',
        model: this.model,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('OpenAI健康检查失败', { error: error.message });
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 聊天补全
   */
  async chatCompletion(messages: any[], options: any = {}) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        top_p: options.top_p || 1,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
      });

      return {
        success: true,
        content: response.choices[0]?.message?.content || '',
        usage: response.usage,
        model: response.model
      };
    } catch (error) {
      logger.error('OpenAI聊天补全失败', { error: error.message });
      return {
        success: false,
        error: error.message,
        content: ''
      };
    }
  }

  /**
   * 生成会议摘要
   */
  async generateMeetingSummary(transcription: string, options: any = {}) {
    const prompt = `请为以下会议录音转录内容生成一个结构化的摘要：

会议转录内容：
${transcription}

请按照以下格式生成摘要：
1. 会议主题
2. 主要讨论点（分条列出）
3. 重要决定
4. 待办事项/任务
5. 下一步行动计划

要求：
- 使用中文
- 保持专业和简洁
- 突出关键信息
- 提取具体行动项`;

    const messages = [
      { role: 'system', content: '你是一个专业的会议记录助手，擅长从会议录音中提取关键信息并生成结构化摘要。' },
      { role: 'user', content: prompt }
    ];

    return this.chatCompletion(messages, {
      temperature: 0.3, // 更低的温度以获得更确定的输出
      max_tokens: 1500
    });
  }

  /**
   * 提取会议任务
   */
  async extractMeetingTasks(transcription: string) {
    const prompt = `请从以下会议录音转录内容中提取所有提到的任务和待办事项：

会议转录内容：
${transcription}

请按照以下格式提取任务：
- 任务描述
- 负责人（如果提到）
- 截止时间（如果提到）
- 优先级（高/中/低）

如果某项信息未提及，请标记为"未指定"。`;

    const messages = [
      { role: 'system', content: '你是一个专业的任务提取助手，擅长从会议讨论中识别和提取具体的任务项。' },
      { role: 'user', content: prompt }
    ];

    const result = await this.chatCompletion(messages, {
      temperature: 0.2,
      max_tokens: 1000
    });

    if (result.success) {
      // 解析任务列表
      const tasks = this.parseTasksFromText(result.content);
      return {
        success: true,
        tasks: tasks,
        raw: result.content
      };
    }

    return result;
  }

  /**
   * 识别发言人
   */
  async identifySpeakers(transcription: string) {
    const prompt = `请分析以下会议录音转录内容，识别不同的发言人和他们的发言特点：

会议转录内容：
${transcription}

请按照以下格式分析：
1. 识别出几个不同的发言人
2. 每个发言人的发言特点（如：提问者、决策者、技术专家等）
3. 每个发言人的主要贡献
4. 发言频率和时长估计`;

    const messages = [
      { role: 'system', content: '你是一个专业的会议分析助手，擅长识别和分析不同发言人的角色和贡献。' },
      { role: 'user', content: prompt }
    ];

    return this.chatCompletion(messages, {
      temperature: 0.3,
      max_tokens: 1200
    });
  }

  /**
   * 从文本解析任务
   */
  private parseTasksFromText(text: string): any[] {
    const tasks: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentTask: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 检测任务开始
      if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\./)) {
        if (currentTask) {
          tasks.push(currentTask);
        }
        
        currentTask = {
          description: trimmedLine.replace(/^[-•\d\.\s]+/, '').trim(),
          assignee: '未指定',
          deadline: '未指定',
          priority: '中',
          status: '待开始'
        };
      }
      
      // 检测负责人
      else if (trimmedLine.toLowerCase().includes('负责人') || trimmedLine.toLowerCase().includes('assignee')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentTask) {
          currentTask.assignee = match[1].trim();
        }
      }
      
      // 检测截止时间
      else if (trimmedLine.toLowerCase().includes('截止') || trimmedLine.toLowerCase().includes('deadline')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentTask) {
          currentTask.deadline = match[1].trim();
        }
      }
      
      // 检测优先级
      else if (trimmedLine.toLowerCase().includes('优先级') || trimmedLine.toLowerCase().includes('priority')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentTask) {
          currentTask.priority = match[1].trim();
        }
      }
    }
    
    // 添加最后一个任务
    if (currentTask) {
      tasks.push(currentTask);
    }
    
    return tasks;
  }
}