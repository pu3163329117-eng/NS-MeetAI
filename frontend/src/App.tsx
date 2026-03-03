import { useState } from 'react';
import Header from './components/Layout/Header';
import Home from './pages/Home';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main>
        <Home />
      </main>
      
      {/* 侧边栏 (移动端) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
            {/* 侧边栏内容 */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <h2 className="text-lg font-semibold text-gray-900">导航</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <span className="sr-only">关闭侧边栏</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                <a href="#" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                  仪表板
                </a>
                <a href="#" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  会议记录
                </a>
                <a href="#" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  任务管理
                </a>
                <a href="#" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  团队设置
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700"></div>
                <span className="text-lg font-bold text-gray-900">NS MeetAI</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">智能会议纪要助手</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} NS MeetAI. 保留所有权利。
              </p>
              <p className="mt-1 text-xs text-gray-500">
                由 Rain & NS Team 开发
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;