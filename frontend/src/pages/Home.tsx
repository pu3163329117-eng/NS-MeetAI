import React, { useState } from 'react';
import AudioUpload from '@/components/Upload/AudioUpload';
import { FiUpload, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';

const Home: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // 这里实际应该调用API
    console.log('上传文件:', file.name, file.size);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 3000));
  };

  const features = [
    {
      icon: <FiUpload className="h-6 w-6" />,
      title: '一键上传',
      description: '支持多种音频格式，拖拽即可上传',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: <FiClock className="h-6 w-6" />,
      title: '智能处理',
      description: 'AI自动转录、摘要、任务提取',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: '团队协作',
      description: '任务分配、进度跟踪、团队共享',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: <FiCheckCircle className="h-6 w-6" />,
      title: '专业输出',
      description: '多种格式导出，符合企业规范',
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            让每一次会议都
            <span className="block text-primary-600">更有价值</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            NS MeetAI 智能会议纪要助手，利用AI技术自动转录会议录音，
            提取关键信息，识别任务项，生成结构化会议纪要。
          </p>
        </div>

        {/* 上传区域 */}
        <div className="mt-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">开始使用</h2>
              <p className="mt-2 text-gray-600">上传您的会议录音，体验AI智能处理</p>
            </div>
            
            <AudioUpload
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>
        </div>

        {/* 功能特性 */}
        <div className="mt-20">
          <h2 className="text-center text-3xl font-bold text-gray-900">核心功能</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            专为企业会议设计，提升会议效率和质量
          </p>
          
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className={`inline-flex rounded-lg p-3 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 使用场景 */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 p-8 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold">适用场景</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="text-3xl font-bold">团队会议</div>
                <p className="mt-2 text-primary-100">日常站会、项目评审、头脑风暴</p>
              </div>
              <div>
                <div className="text-3xl font-bold">客户沟通</div>
                <p className="mt-2 text-primary-100">需求讨论、方案汇报、商务谈判</p>
              </div>
              <div>
                <div className="text-3xl font-bold">培训学习</div>
                <p className="mt-2 text-primary-100">内部培训、知识分享、在线课程</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">立即体验智能会议纪要</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            上传您的第一个会议录音，体验AI带来的效率提升
          </p>
          <div className="mt-8">
            <button
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
              className="btn-primary px-8 py-3 text-lg"
            >
              开始免费体验
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            无需注册，立即使用 • 支持中文和英文 • 100%数据安全
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;