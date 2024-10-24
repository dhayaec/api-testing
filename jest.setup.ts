import { TextEncoder } from 'util';
import { server } from './mocks/server';

global.TextEncoder = TextEncoder;

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are added during the tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
