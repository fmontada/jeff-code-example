import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEVELOPMENT_ENVIRONMENT = 'development';

export function middleware(request: NextRequest) {
    const isDevelopmentEnvironment =
        process.env.NODE_ENV === DEVELOPMENT_ENVIRONMENT;
    if (isDevelopmentEnvironment) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    const ALLOWED_ROUTES = (process.env.ALLOWED_ROUTES || '').split(',');

    if (ALLOWED_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const basicAuthHeader = request.headers.get('authorization');
    const hasBasicAuthHeader = !!basicAuthHeader;
    if (hasBasicAuthHeader) {
        const encodedBasicAuthHeader = basicAuthHeader.split(' ')[1];
        const [username, password] = atob(encodedBasicAuthHeader).split(':');

        const hasAuthorizedUsername =
            username === process.env.AUTHORIZATION_USER_NAME;
        const hasAuthorizedPassword =
            password === process.env.AUTHORIZATION_PASSWORD;
        const isAuthorized = hasAuthorizedUsername && hasAuthorizedPassword;
        if (isAuthorized) {
            return NextResponse.next();
        }
    }

    const url = request.nextUrl;
    url.pathname = '/api/auth';

    return NextResponse.rewrite(url);
}
