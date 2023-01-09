/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process');
const { resolve } = require('path');
require('dotenv').config();

function generateApi(endpoint: string, folderName: string) {
    exec(
        `openapi-generator-cli generate -i ${endpoint} -g typescript-axios -o api-generated/${folderName} --additional-properties usePromises=true,useES6=true --skip-validate-spec`,
        (error) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
        },
    );
}

// @TODO: We need to generate the API from the actual endpoint when available.
// generateApi(`${process.env.NEXT_PUBLIC_ORDERS_API_ENDPOINT}/docs/openapi.json`, 'orders');
generateApi(resolve(`${__dirname}/api-schemas/orders.json`), 'orders');
generateApi(
    resolve(`${__dirname}/api-schemas/sweepstakes.json`),
    'sweepstakes',
);
generateApi(resolve(`${__dirname}/api-schemas/user.json`), 'user');

export { generateApi };
