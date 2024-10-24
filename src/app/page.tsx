'use client';
import { POSTS_URL } from 'constants/constants';
import React, { useEffect, useState } from 'react';
import { Post } from '../../mocks/postsData';

const Home: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(POSTS_URL);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Posts</h1>
      <div>
        {data.map((post) => (
          <div className="border-b-2 border-s-orange-400 pb-2" key={post.id}>
            <h2 className="text-2xl">{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
