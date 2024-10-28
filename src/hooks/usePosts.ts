import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import { useEffect, useState } from 'react';
import { Post } from '../../mocks/postsData';

const usePosts = () => {
  const [data, setData] = useState<Post[]>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(JSON_PLACEHOLDER_HOST + POSTS_URL);
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

  return { data, error };
};

export default usePosts;
