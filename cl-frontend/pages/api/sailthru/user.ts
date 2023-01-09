import { default as axios } from 'axios';
import { default as md5 } from 'md5';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function GetSailthruUserApi(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (!req.query?.email) {
            throw new Error('No email specified');
        }

        if (req.method !== 'GET') {
            throw new Error('Method not allowed');
        }

        const publicKey = process.env.SAILTHRU_PUBLIC_KEY;
        const jsonRequest = JSON.stringify({
            id: decodeURIComponent(req.query.email as string),
        });
        const format = 'json';
        const secretKey = process.env.SAILTHRU_SECRET_KEY;
        const signature = md5(
            `${secretKey}${publicKey}${format}${jsonRequest}`,
        );
        const { data: user } = await axios.get(
            `https://api.sailthru.com/user?api_key=${publicKey}&format=json&json=${jsonRequest}&sig=${signature}`,
        );

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.response?.data?.errormsg });
    }
}
