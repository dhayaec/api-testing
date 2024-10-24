export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const posts: Post[] = [
  {
    userId: 1,
    id: 1,
    title: 'Mocked Post 1',
    body: 'Test data One description',
  },
  {
    userId: 1,
    id: 2,
    title: 'Mocked Post 2',
    body: 'Test data Two description',
  },
];

export default posts;
