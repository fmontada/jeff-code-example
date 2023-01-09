import { useUserStore } from '@/store/useUserStore';

export async function fetchJson<T>(
    url: string,
    opts?: RequestInit,
): Promise<T> {
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = useUserStore?.getState()?.authorizationToken;

    if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
    }

    opts = opts || {};
    opts.headers = opts.headers
        ? {
              ...defaultHeaders,
              ...opts.headers,
          }
        : defaultHeaders;

    const req = await fetch(url, opts);

    if (req.status > 399) {
        let json: Record<string, unknown>;
        const textContent = await req.text();

        try {
            json = await JSON.parse(textContent);
        } catch (e) {
            json = { body: textContent };
        }

        throw new Error('API error: ' + JSON.stringify(json));
    }

    return (await req.json()) as T;
}
