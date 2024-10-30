// app/page.js
'use client';
import { useState, useEffect } from 'react';
// 更新导入语句，使用新的导入方式
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import './aws-config';

// 创建 API 客户端
const client = generateClient();

const getPageDataQuery = `
  query GetPageData {
    getPageData {
      id
      title
      content
      createdAt
    }
  }
`;

export default function Page() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      // 使用 client 替代 API
      const result = await client.graphql({
        query: getPageDataQuery,
        authMode: 'apiKey'
      });
      
      setData(result.data.getPageData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <div>Error loading data: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <p>Created at: {data.createdAt}</p>
    </div>
  );
}