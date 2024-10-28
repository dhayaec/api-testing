'use client';
import usePosts from '@/hooks/usePosts';
import React from 'react';
import { Post } from '../../mocks/postsData';

function PostItem(props: { post: Post }) {
  return (
    <div className="border-b-2 border-s-orange-400 pb-2">
      <h2 className="text-2xl">{props.post.title}</h2>
      <p>{props.post.body}</p>
    </div>
  );
}

const Home: React.FC = () => {
  const { data, error } = usePosts();

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Posts</h1>
      <div>
        {data.map((post) => (
          <PostItem key={post.id} post={post}></PostItem>
        ))}
      </div>
    </div>
  );
};

export default Home;
