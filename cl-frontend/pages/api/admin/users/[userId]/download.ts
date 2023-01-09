/* eslint-disable @typescript-eslint/no-unused-vars */
import { convertArrayToCSV } from 'convert-array-to-csv';
import { Parser } from 'json2csv';
import type { NextApiRequest, NextApiResponse } from 'next';
import { default as nodemailer } from 'nodemailer';

import { Order } from '@/api/orders';
import { Sweepstakes } from '@/api/sweepstakes';
import { User } from '@/api/user';
import { getOrdersApi, getSweepstakesApi, getUserApi } from '@/utils/api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).end();
    }

    const { userId } = req.query;
    if (!userId) {
        res.status(400).end('userId required');
        return;
    }

    const token = req.headers.authorization;
    if (!token) {
        res.status(400).end('Not allowed');
        return;
    }

    const bearerToken = token.split(' ')[1];

    try {
        const [lineItemsData, userData] = await Promise.all([
            getLineItemsOfUserOrders(userId as string, bearerToken),
            getUserData(userId as string, bearerToken),
        ]);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        } as unknown as nodemailer.TransportOptions);

        await transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: userData.email,
            subject: 'Omaze GDPR Request',
            text: `Hello ${userData.first_name},

We have attached the account information we have from you as requested, if you did not request this please ignore this email.`,
            attachments: [
                {
                    filename: 'orders.csv',
                    content: convertArrayToCSV(lineItemsData),
                },
                {
                    filename: 'userData.csv',
                    content: objectToCsv(userData),
                },
            ],
        });

        res.status(200).end('Email sent');
    } catch (error) {
        console.log(error);
        return res.status(400).end(error.message);
    }
}

async function getUserData(userId: string, bearerToken: string) {
    const usersApi = getUserApi();

    const { data } = await usersApi.getV1UsersByIdAdmin(
        userId as string,
        `Bearer ${bearerToken}`,
    );

    if (!data) {
        throw new Error('Unable to fetch user');
    }

    const formattedUser: Omit<User, 'address'> & { address: string } = {
        ...data,
        address: '',
    };

    if (data.address) {
        formattedUser.address = `${data.address.address_line_1} ${data.address.address_line_2} ${data.address.city}, ${data.address.state}, ${data.address.postal_code}, ${data.address.country}`;
    }

    return formattedUser;
}

async function getSweepstakeFromOrders(orders: Order[]) {
    const sweepstakesApi = getSweepstakesApi();

    const sweepsList = orders.reduce((list: string[], order) => {
        const sweeps = Array.from(order.line_items).reduce(
            (lineItemsSweeps: string[], item) => {
                return [...lineItemsSweeps, item.sweepstakes_id];
            },
            [],
        );

        return [...list, ...sweeps];
    }, []);

    const listOfUniqueSweeps = Array.from(new Set(sweepsList));

    const { data: sweepsData } = await sweepstakesApi.getSweepstakes(
        undefined,
        undefined,
        listOfUniqueSweeps.join(','),
    );

    return sweepsData.sweepstakes;
}

function convertSweepstakesArrayToMap(sweepsArray: Sweepstakes[]) {
    const mapOfSweepstakes = new Map<string, Sweepstakes>();

    for (const sweep of sweepsArray) {
        mapOfSweepstakes.set(sweep.id, sweep);
    }

    return mapOfSweepstakes;
}

async function getLineItemsOfUserOrders(userId: string, bearerToken: string) {
    const ordersApi = getOrdersApi();
    const orders = [];
    let page = 1;

    while (true) {
        const { data } = await ordersApi.getV1OrdersAdmin(
            `Bearer ${bearerToken}`,
            100,
            undefined,
            userId,
            page,
        );

        if (!data) {
            throw new Error('Unable to fetch orders');
        }

        if (data.orders.length === 0) {
            break;
        }

        orders.push(...data.orders);
        page += 1;
    }

    const sweepstakesList = await getSweepstakeFromOrders(orders);
    const mapOfSweepstakes = convertSweepstakesArrayToMap(sweepstakesList);

    const originalOrders = orders;
    const lineItemsData = originalOrders.reduce(
        (lineItemsArray: any[], order: Order) => {
            const newLinesToInsert = Array.from(order.line_items).map(
                (lineItem) => {
                    const sweepstake = mapOfSweepstakes.get(
                        lineItem.sweepstakes_id,
                    );

                    const {
                        line_items,
                        payment_method,
                        ...orderWithoutLineItems
                    } = order;

                    return flattenObject({
                        ...orderWithoutLineItems,
                        ...lineItem,
                        ...sweepstake,
                    });
                },
            );
            return [...lineItemsArray, ...newLinesToInsert];
        },
        [],
    );

    return sanitizeLineItemsArray(lineItemsData);
}

function flattenObject(data: Record<string, any>) {
    const flattenedObject: Record<string, any> = {};

    for (const key in data) {
        if (typeof data[key] === 'object') {
            const flattenedChild = flattenObject(data[key]);
            for (const childKey in flattenedChild) {
                flattenedObject[`${key}_${childKey}`] =
                    flattenedChild[childKey];
            }
        } else {
            flattenedObject[key] = data[key];
        }
    }

    return flattenedObject;
}

function objectToCsv(data: any) {
    const json2csv = new Parser({ fields: Object.keys(data) });
    const csv = json2csv.parse(data);
    return csv;
}

function sanitizeLineItemsArray(lineItemsData: any[]) {
    const listOfKeys = [];
    for (const lineItem of lineItemsData) {
        listOfKeys.push(...Object.keys(lineItem));
    }

    const uniqueSetOfKeys = Array.from(new Set(listOfKeys));

    const newArray = [];
    for (const lineItem of lineItemsData) {
        const newLineItem = {};

        for (const key of uniqueSetOfKeys) {
            if (!lineItem.hasOwnProperty(key)) {
                newLineItem[key] = ' ';
            } else if (typeof lineItem[key] === 'object') {
                newLineItem[key] = JSON.stringify(lineItem[key]);
            } else {
                newLineItem[key] = lineItem[key];
            }
        }

        newArray.push(newLineItem);
    }

    return newArray;
}
