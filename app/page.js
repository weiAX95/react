'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [gifUrl, setGifUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    createGif();
  }, []);

  const createGif = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/create-gif', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('GIF生成失败');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">本地图片GIF转换</h1>
          
          {loading ? (
            <div className="text-center py-4">
              <p>正在生成GIF...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">
              <p>出错了：{error}</p>
              <button 
                onClick={createGif}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重试
              </button>
            </div>
          ) : gifUrl ? (
            <div className="mt-4">
              <img src={gifUrl} alt="Generated GIF" className="w-full rounded-lg" />
              <a
                href={gifUrl}
                download="result.gif"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                下载GIF
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}