import type { NextApiRequest, NextApiResponse } from 'next';

const UNAUTHORIZED_STATUS_CODE = 401;

export default function handler(_: NextApiRequest, res: NextApiResponse) {
    res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"');
    res.statusCode = UNAUTHORIZED_STATUS_CODE;
    res.end('Auth Required.');
}
