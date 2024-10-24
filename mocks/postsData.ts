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
    title: 'Test data One',
    body: 'Test data One description',
  },
  {
    userId: 1,
    id: 2,
    title: 'Test data Two',
    body: 'Test data Two description',
  },
];

export default posts;
