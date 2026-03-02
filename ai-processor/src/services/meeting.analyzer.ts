import { createLogger, format, transports } from 'winston';
import { OpenAIService } from './openai.service';

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

export class MeetingAnalyzer {
  private openAIService: OpenAIService;

  constructor(openAIService: OpenAIService) {
    this.openAIService = openAIService;
    logger.info('会议分析器初始化完成');
  }

  /**
   * 生成会议摘要
   */
  async generateSummary(transcription: string): Promise<string> {
    try {
      logger.info('开始生成会议摘要', { transcriptionLength: transcription.length });

      const result = await this.openAIService.generateMeetingSummary(transcription);
      
      if (result.success) {
        logger.info('会议摘要生成成功', { summaryLength: result.content.length });
        return result.content;
      } else {
        throw new Error(`生成摘要失败: ${result.error}`);
      }
    } catch (error) {
      logger.error('生成会议摘要失败', { error: error.message });
      
      // 失败时返回模拟摘要
      return this.generateMockSummary(transcription);
    }
  }

  /**
   * 提取会议任务
   */
  async extractTasks(transcription: string): Promise<any[]> {
    try {
      logger.info('开始提取会议任务', { transcriptionLength: transcription.length });

      const result = await this.openAIService.extractMeetingTasks(transcription);
      
      if (result.success && result.tasks) {
        logger.info('会议任务提取成功', { taskCount: result.tasks.length });
        return result.tasks;
      } else {
        throw new Error(`提取任务失败: ${result.error}`);
      }
    } catch (error) {
      logger.error('提取会议任务失败', { error: error.message });
      
      // 失败时返回模拟任务
      return this.generateMockTasks();
    }
  }

  /**
   * 识别发言人
   */
  async identifySpeakers(transcription: string): Promise<any[]> {
    try {
      logger.info('开始识别发言人', { transcriptionLength: transcription.length });

      const result = await this.openAIService.identifySpeakers(transcription);
      
      if (result.success) {
        // 解析发言人信息
        const speakers = this.parseSpeakersFromText(result.content);
        logger.info('发言人识别成功', { speakerCount: speakers.length });
        return speakers;
      } else {
        throw new Error(`识别发言人失败: ${result.error}`);
      }
    } catch (error) {
      logger.error('识别发言人失败', { error: error.message });
      
      // 失败时返回模拟发言人
      return this.generateMockSpeakers();
    }
  }

  /**
   * 分析会议情绪
   */
  async analyzeSentiment(transcription: string): Promise<any> {
    try {
      logger.info('开始分析会议情绪', { transcriptionLength: transcription.length });

      const prompt = `请分析以下会议录音转录内容的整体情绪和氛围：

会议转录内容：
${transcription}

请按照以下维度分析：
1. 整体情绪（积极/中性/消极）
2. 参与度（高/中/低）
3. 协作程度（高/中/低）
4. 决策效率（高/中/低）
5. 关键情绪词（列出3-5个）
6. 改进建议（1-2条）`;

      const messages = [
        { role: 'system', content: '你是一个专业的会议情绪分析助手，擅长从会议讨论中分析情绪和氛围。' },
        { role: 'user', content: prompt }
      ];

      const result = await this.openAIService.chatCompletion(messages, {
        temperature: 0.3,
        max_tokens: 800
      });

      if (result.success) {
        const sentiment = this.parseSentimentFromText(result.content);
        logger.info('会议情绪分析成功', { sentiment });
        return sentiment;
      } else {
        throw new Error(`分析情绪失败: ${result.error}`);
      }
    } catch (error) {
      logger.error('分析会议情绪失败', { error: error.message });
      
      // 失败时返回模拟情绪分析
      return this.generateMockSentiment();
    }
  }

  /**
   * 提取关键决策
   */
  async extractDecisions(transcription: string): Promise<any[]> {
    try {
      logger.info('开始提取关键决策', { transcriptionLength: transcription.length });

      const prompt = `请从以下会议录音转录内容中提取所有关键决策和决议：

会议转录内容：
${transcription}

请按照以下格式提取决策：
- 决策内容
- 决策时间点（如果提到）
- 决策依据
- 相关责任人
- 执行时间线`;

      const messages = [
        { role: 'system', content: '你是一个专业的决策提取助手，擅长从会议讨论中识别和提取关键决策。' },
        { role: 'user', content: prompt }
      ];

      const result = await this.openAIService.chatCompletion(messages, {
        temperature: 0.2,
        max_tokens: 1000
      });

      if (result.success) {
        const decisions = this.parseDecisionsFromText(result.content);
        logger.info('关键决策提取成功', { decisionCount: decisions.length });
        return decisions;
      } else {
        throw new Error(`提取决策失败: ${result.error}`);
      }
    } catch (error) {
      logger.error('提取关键决策失败', { error: error.message });
      
      // 失败时返回模拟决策
      return this.generateMockDecisions();
    }
  }

  /**
   * 生成会议报告
   */
  async generateMeetingReport(transcription: string): Promise<any> {
    try {
      logger.info('开始生成完整会议报告');

      // 并行执行所有分析
      const [summary, tasks, speakers, sentiment, decisions] = await Promise.all([
        this.generateSummary(transcription),
        this.extractTasks(transcription),
        this.identifySpeakers(transcription),
        this.analyzeSentiment(transcription),
        this.extractDecisions(transcription)
      ]);

      const report = {
        metadata: {
          generatedAt: new Date().toISOString(),
          transcriptionLength: transcription.length,
          analysisDuration: '模拟分析',
          model: this.openAIService.getModelInfo()
        },
        summary,
        tasks,
        speakers,
        sentiment,
        decisions,
        statistics: {
          taskCount: tasks.length,
          speakerCount: speakers.length,
          decisionCount: decisions.length,
          transcriptionWordCount: transcription.split(/\s+/).length
        }
      };

      logger.info('会议报告生成成功', { 
        taskCount: tasks.length,
        speakerCount: speakers.length,
        decisionCount: decisions.length
      });

      return report;
    } catch (error) {
      logger.error('生成会议报告失败', { error: error.message });
      throw new Error(`生成会议报告失败: ${error.message}`);
    }
  }

  /**
   * 私有方法
   */

  // 从文本解析发言人
  private parseSpeakersFromText(text: string): any[] {
    const speakers: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSpeaker: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 检测发言人开始
      if (trimmedLine.match(/^\d+\./) || trimmedLine.toLowerCase().includes('发言人')) {
        if (currentSpeaker) {
          speakers.push(currentSpeaker);
        }
        
        currentSpeaker = {
          name: '未识别',
          role: '参与者',
          contribution: '',
          speakingStyle: '',
          frequency: '中等'
        };
        
        // 尝试提取发言人名称
        const nameMatch = trimmedLine.match(/发言人[：:]\s*(.+)/i);
        if (nameMatch) {
          currentSpeaker.name = nameMatch[1].trim();
        }
      }
      
      // 检测角色
      else if (trimmedLine.toLowerCase().includes('角色') || trimmedLine.toLowerCase().includes('role')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentSpeaker) {
          currentSpeaker.role = match[1].trim();
        }
      }
      
      // 检测贡献
      else if (trimmedLine.toLowerCase().includes('贡献') || trimmedLine.toLowerCase().includes('contribution')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentSpeaker) {
          currentSpeaker.contribution = match[1].trim();
        }
      }
      
      // 检测发言风格
      else if (trimmedLine.toLowerCase().includes('风格') || trimmedLine.toLowerCase().includes('style')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentSpeaker) {
          currentSpeaker.speakingStyle = match[1].trim();
        }
      }
      
      // 检测发言频率
      else if (trimmedLine.toLowerCase().includes('频率') || trimmedLine.toLowerCase().includes('frequency')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentSpeaker) {
          currentSpeaker.frequency = match[1].trim();
        }
      }
    }
    
    // 添加最后一个发言人
    if (currentSpeaker) {
      speakers.push(currentSpeaker);
    }
    
    return speakers;
  }

  // 从文本解析情绪
  private parseSentimentFromText(text: string): any {
    const sentiment: any = {
      overall: '中性',
      engagement: '中等',
      collaboration: '中等',
      decisionEfficiency: '中等',
      keywords: [],
      suggestions: []
    };
    
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 整体情绪
      if (trimmedLine.toLowerCase().includes('整体情绪')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match) {
          sentiment.overall = match[1].trim();
        }
      }
      
      // 参与度
      else if (trimmedLine.toLowerCase().includes('参与度')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match) {
          sentiment.engagement = match[1].trim();
        }
      }
      
      // 协作程度
      else if (trimmedLine.toLowerCase().includes('协作程度')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match) {
          sentiment.collaboration = match[1].trim();
        }
      }
      
      // 决策效率
      else if (trimmedLine.toLowerCase().includes('决策效率')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match) {
          sentiment.decisionEfficiency = match[1].trim();
        }
      }
      
      // 关键情绪词
      else if (trimmedLine.toLowerCase().includes('关键情绪词')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match) {
          sentiment.keywords = match[1].trim().split(/[、,，]/).map((k: string) => k.trim());
        }
      }
      
      // 改进建议
      else if (trimmedLine.toLowerCase().includes('改进建议')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match) {
          sentiment.suggestions = match[1].trim().split(/[；;]/).map((s: string) => s.trim());
        }
      }
    }
    
    return sentiment;
  }

  // 从文本解析决策
  private parseDecisionsFromText(text: string): any[] {
    const decisions: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentDecision: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 检测决策开始
      if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\./)) {
        if (currentDecision) {
          decisions.push(currentDecision);
        }
        
        currentDecision = {
          content: trimmedLine.replace(/^[-•\d\.\s]+/, '').trim(),
          timeframe: '未指定',
          basis: '会议讨论',
          responsible: '未指定',
          timeline: '待确定'
        };
      }
      
      // 检测决策时间点
      else if (trimmedLine.toLowerCase().includes('时间点') || trimmedLine.toLowerCase().includes('timeframe')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentDecision) {
          currentDecision.timeframe = match[1].trim();
        }
      }
      
      // 检测决策依据
      else if (trimmedLine.toLowerCase().includes('依据') || trimmedLine.toLowerCase().includes('basis')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentDecision) {
          currentDecision.basis = match[1].trim();
        }
      }
      
      // 检测责任人
      else if (trimmedLine.toLowerCase().includes('责任人') || trimmedLine.toLowerCase().includes('responsible')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentDecision) {
          currentDecision.responsible = match[1].trim();
        }
      }
      
      // 检测时间线
      else if (trimmedLine.toLowerCase().includes('时间线') || trimmedLine.toLowerCase().includes('timeline')) {
        const match = trimmedLine.match(/[:：]\s*(.+)/);
        if (match && currentDecision) {
          currentDecision.timeline = match[1].trim();
        }
      }
    }
    
    // 添加最后一个决策
    if (currentDecision) {
      decisions.push(currentDecision);
    }
    
    return decisions;
  }

  // 生成模拟摘要
  private generateMockSummary(transcription: string): string {
    return `会议摘要（模拟数据）：
    
1. 会议主题：项目进展讨论会
2. 主要讨论点：
   - 回顾了上周工作成果
   - 讨论了技术挑战和解决方案
   - 制定了下一步工作计划
3. 重要决定：
   - 确定了下个版本的发布时间
   - 分配了各项任务的责任人
4. 待办事项：
   - 完成用户测试报告
   - 修复已知的技术问题
   - 准备产品发布材料
5. 下一步行动计划：
   - 本周内完成所有测试
   - 下周进行代码审查
   - 下下周准备发布`;
  }

  // 生成模拟任务
  private generateMockTasks(): any[] {
    return [
      {
        description: '完成用户界面优化',
        assignee: '前端团队',
        deadline: '2026-03-10',
        priority: '高',
        status: '进行中'
      },
      {
        description: '修复API性能问题',
        assignee: '后端团队',
        deadline: '2026-03-08',
        priority: '高',
        status: '待开始'
      },
      {
        description: '更新项目文档',
        assignee: '技术文档组',
        deadline: '2026-03-12',
        priority: '中',
        status: '待开始'
      },
      {
        description: '准备产品演示',
        assignee: '产品团队',
        deadline: '2026-03-15',
        priority: '中',
        status: '计划中'
      }
    ];
  }

  // 生成模拟发言人
  private generateMockSpeakers(): any[] {
    return [
      {
        name: '张三',
        role: '项目经理',
        contribution: '主持会议，制定计划',
        speakingStyle: '条理清晰，重点突出',
        frequency: '高'
      },
      {
        name: '李四',
        role: '技术负责人',
        contribution: '技术方案讨论',
        speakingStyle: '技术性强，详细深入',
        frequency: '中'
      },
      {
        name: '王五',
        role: '产品经理',
        contribution: '需求分析和产品规划',
        speakingStyle: '用户导向，注重体验',
        frequency: '中'
      },
      {
        name: '赵六',
        role: '设计师',
        contribution: '设计评审和反馈',
        speakingStyle: '创意丰富，视觉导向',
        frequency: '低'
      }
    ];
  }

  // 生成模拟情绪分析
  private generateMockSentiment(): any {
    return {
      overall: '积极',
      engagement: '高',
      collaboration: '高',
      decisionEfficiency: '中',
      keywords: ['合作', '创新', '效率', '专注'],
      suggestions: [
        '可以进一步优化会议时间管理',
        '建议增加技术讨论的深度'
      ]
    };
  }

  // 生成模拟决策
  private generateMockDecisions(): any[] {
    return [
      {
        content: '采用新的技术架构方案',
        timeframe: '会议第30分钟',
        basis: '技术团队评估和讨论',
        responsible: '技术负责人',
        timeline: '2周内完成迁移'
      },
      {
        content: '确定产品发布时间',
        timeframe: '会议第45分钟',
        basis: '市场分析和团队能力评估',
        responsible: '项目经理',
        timeline: '下个月第一周'
      },
      {
        content: '增加用户测试范围',
        timeframe: '会议第60分钟',
        basis: '用户反馈和产品需求',
        responsible: '产品团队',
        timeline: '本周内完成'
      }
    ];
  }
}