import type { NextRequest } from 'next/server';

import { middleware } from '@/pages/_middleware';

interface INextRequestTest extends Omit<NextRequest, 'nextUrl'> {
    nextUrl: URL;
}

describe('middleware', () => {
    describe('when in development environment', () => {
        const OLD_ENV = process.env;

        beforeAll(() => {
            process.env = { NODE_ENV: 'development' };
        });

        afterAll(() => {
            process.env = OLD_ENV;
        });

        it('does not require auth', () => {
            const request = {} as NextRequest;

            const response = middleware(request);

            expect(response.status).toEqual(200);
        });
    });

    describe('when in non-development environment', () => {
        const OLD_ENV = process.env;

        const nonDevEnvVariables = {
            NODE_ENV: 'production',
            AUTHORIZATION_USER_NAME: 'omaz3',
            AUTHORIZATION_PASSWORD: 'omazinglive',
            ALLOWED_ROUTES: '/api/allowed/route,/api/another/route',
        } as NodeJS.ProcessEnv;

        beforeAll(() => {
            process.env = nonDevEnvVariables;
        });

        afterAll(() => {
            process.env = OLD_ENV;
        });

        beforeEach(() => {
            jest.resetModules();
        });

        it('requires an authorization header', () => {
            const headers = new Headers();

            headers.append(
                'Authorization',
                `Basic ${btoa('omaz3:omazinglive')}`,
            );

            const init = {
                method: 'GET',
                headers,
            };

            const request = new Request('/', init) as INextRequestTest;
            request.nextUrl = new URL('/', 'http://localhost:3000');

            const response = middleware(request as NextRequest);

            expect(response.status).toEqual(200);
        });

        it('returns unauthorized with no header', () => {
            const headers = new Headers();

            const init = {
                method: 'GET',
                headers,
            };

            const request = new Request('/', init) as INextRequestTest;
            request.nextUrl = new URL('/', 'http://localhost:3000');

            const response = middleware(request as NextRequest);
            expect(response.headers.get('x-middleware-rewrite')).toContain(
                '/api/auth',
            );
        });

        it('allows if route is permitted', () => {
            const headers = new Headers();

            const init = {
                method: 'GET',
                headers,
            };

            const request = new Request('/', init) as INextRequestTest;
            request.nextUrl = new URL(
                '/api/allowed/route',
                'http://localhost:3000',
            );

            const response = middleware(request as NextRequest);

            expect(response.headers.get('x-middleware-rewrite')).toBeNull();
        });
    });
});
