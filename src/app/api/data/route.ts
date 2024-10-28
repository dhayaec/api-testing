import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(JSON_PLACEHOLDER_HOST + POSTS_URL);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ data });
    } else {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
