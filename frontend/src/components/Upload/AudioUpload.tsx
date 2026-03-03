import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiCheck, FiX, FiMusic } from 'react-icons/fi';

interface AudioUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  onFileUpload,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError('');
    
    if (acceptedFiles.length === 0) {
      setError('请选择有效的音频文件');
      return;
    }

    const file = acceptedFiles[0];
    
    // 验证文件类型
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/m4a'];
    if (!validTypes.includes(file.type)) {
      setError('不支持的文件格式，请上传 MP3、WAV、OGG、WEBM 或 M4A 文件');
      return;
    }

    // 验证文件大小 (最大 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('文件大小不能超过 100MB');
      return;
    }

    setUploadedFile(file);
    
    try {
      await onFileUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
      setUploadedFile(null);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.webm', '.m4a']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 上传区域 */}
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">正在上传中...</p>
              <p className="text-sm text-gray-600">请稍候</p>
            </div>
            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}% 完成</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">文件已准备就绪</p>
              <p className="text-sm text-gray-600">点击开始处理会议录音</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiMusic className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <FiUpload className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? '松开以上传文件' : '上传会议录音'}
              </p>
              <p className="text-sm text-gray-600">
                拖放文件到此处，或点击选择文件
              </p>
            </div>
            <div className="text-xs text-gray-500">
              支持 MP3, WAV, OGG, WEBM, M4A 格式，最大 100MB
            </div>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <div className="flex items-center">
            <FiX className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {uploadedFile && !isUploading && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleRemoveFile}
            className="btn-secondary"
          >
            重新选择
          </button>
          <button
            onClick={() => uploadedFile && onFileUpload(uploadedFile)}
            className="btn-primary"
          >
            开始处理会议录音
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;