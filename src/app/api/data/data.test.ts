import { createMocks } from 'node-mocks-http';
import postsData from '../../../../mocks/postsData';
import { POSTS_URL } from '../../../constants/constants';
import handler from './route';

describe(`${POSTS_URL} API`, () => {
  it('returns mocked POSTS data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ data: postsData });
  });
});
