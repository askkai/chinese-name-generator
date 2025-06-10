"use client";

import { useState } from 'react';

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 确保只在开发环境中运行
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">🛠️</span>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-64">
          <h3 className="font-bold text-lg mb-2">开发工具</h3>
          <p className="text-sm mb-2">这是开发模式下的工具栏，可以在这里添加更多功能。</p>
          <div className="flex flex-col space-y-2">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => {
                console.log('当前页面元素:', document.body.innerHTML);
                alert('已将页面元素结构输出到控制台');
              }}
            >
              检查页面结构
            </button>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('已清除所有本地存储');
              }}
            >
              清除本地存储
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 