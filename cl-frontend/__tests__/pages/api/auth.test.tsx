// eslint-disable-next-line import/named
import { createMocks } from 'node-mocks-http';

import handleAuthRequest from '@/pages/api/auth';

describe('/api/auth', () => {
    test('returns a 401 asking for auth', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        });

        handleAuthRequest(req, res);

        expect(res._getStatusCode()).toBe(401);
        expect(res._getData()).toEqual('Auth Required.');
    });
});
