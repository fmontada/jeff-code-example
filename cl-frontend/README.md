# cl-frontend

This is the repo for the core loop frontend web application.

## Production Environment

The production web application can be accessed at [https://dogfood.omaze.com/](https://dogfood.omaze.com/). The `production` branch is deployed there.

The web application uses HTTP Basic Authentication to restrict access. The current username and password values for the environment can be found in the `AUTHORIZATION_USER_NAME` and `AUTHORIZATION_PASSWORD` [Environment Variables in Vercel](https://vercel.com/omaze/cl-frontend/settings/environment-variables).

## Staging Environment

The staging web application can be accessed at [https://dogfood.stg.omazedev.com/](https://dogfood.stg.omazedev.com/). The `integration` branch is deployed there.

The staging environment also uses HTTP Basic Authentication as described above in the [Production section](#production).

## QA Environment

Every PR that is opened will attempt to be deployed to Vercel as long as the linter and tests pass. On the PR there will be a comment from the `vercel` bot that includes the status of the build (Failed or Ready) and a link to visit the preview if it was able to deploy.

The QA environments also use HTTP Basic Authentication as described above in the [Production section](#production).

## Local configuration and execution

This expects you to have [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) already installed.

1. Clone the repo: `git clone git@github.com:Omaze/cl-frontend.git`
2. Change directory: `cd cl-frontend`
3. Install `node` version 16.x and `npm` version 8.x: `nvm install && nvm use`
4. Install the projects dependencies: `npm i`
5. Setup environment variables: `cp .env.sample .env`

-   Update `.env` file with the necessary values for your development environment (ask your tech lead for the values)

6. Run the tests: `npm test`
7. Run the development server locally: `npm run dev`

## Environment Variables

| env var                              | description                                |
| ------------------------------------ | ------------------------------------------ |
| NEXT_PUBLIC_PLASMIC_ID               | Plasmic Project ID                         |
| NEXT_PUBLIC_PLASMIC_TOKEN            | Plasmic Token                              |
| NEXT_PUBLIC_PLASMIC_TAG_VERSION      | Plasmic Tag Version (`prod`, `stg`, `dev`) |
| NEXT_PUBLIC_PLASMIC_PREVIEW          | Plasmic Preview (`true`, `false`)          |
| AUTHORIZATION_USER_NAME              | Basic HTTP Authentication User Name        |
| AUTHORIZATION_PASSWORD               | Basic HTTP Authentication Password         |
| NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID     | New Relic Account ID                       |
| NEXT_PUBLIC_NEW_RELIC_TRUST_KEY      | New Relic Trust Key                        |
| NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID | New Relic Application ID                   |
| NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY    | New Relic License Key                      |
| DEFAULT_LOCALE                       | Default Locale (`en`)                      |
| LOCALES                              | Comma Separated Locales (`"en,es"`)        |
| IMAGE_DOMAINS_LIST                   | Comma Separated Images Domains             |
| NEXT_PUBLIC_API_ENDPOINT             | Public Omaze API Endpoint                  |
| NEXT_PUBLIC_DOMAIN                   | Frontend Public Domain (for SEO purposes)  |
| NEXT_PUBLIC_OMAZE_EMAIL              | Omaze Support Email                        |
| NEXT_PUBLIC_ORDERS_API_ENDPOINT      | Omaze Orders API Endpoint                  |
| NEXT_PUBLIC_USER_API_ENDPOINT        | Omaze User API Endpoint                    |
| NEXT_PUBLIC_DOMAIN                   | Frontend Public Domain (for SEO purposes)  |
| NEXT_PUBLIC_AUTH0_DOMAIN             | Domain of our app Auth0                    |
| NEXT_PUBLIC_AUTH0_CLIENT_ID          | Client ID Auth0                            |
| NEXT_PUBLIC_AUTH0_CACHE_LOCATION     | Cache location of Auth0 data               |
| NEXT_PUBLIC_AUTH0_NAMESPACE          | Namespace used by Auth0                    |
| NEXT_PUBLIC_STRAPI_HOST              | Strapi host                                |
| NEXT_PUBLIC_STRAPI_PUBLIC_TOKEN      | Strapi access token                        |
| NEXT_PUBLIC_STRIPE_PUBLIC_KEY        | Stripe Public Key                          |
| STRIPE_PRIVATE_KEY                   | Stripe Private Key                         |
| NEXT_PUBLIC_STRIPE_API_VERSION       | Stripe API Version                         |
| NEXT_PUBLIC_SAILTHRU_CUSTOMER_ID     | Sailthru Customer ID                       |
| PLASMIC_PAGES_TO_IGNORE              | Comma Separated Plasmic Pages to ignore    |
| SWEEPS_PAGES_TO_IGNORE               | Comma Separated Sweeps Slugs to ignore     |
| NEXT_PUBLIC_RESTRICTED_REGIONS_LIST  | Comma Separated Regions to restrict app to |
| NEXT_PUBLIC_ROUTES_GEO_DISABLED_LIST | CS Routes with disabled geolocation banner |
| SWEEPS_PAGES_TO_IGNORE               | Comma Separated Sweeps Slugs to ignore     |
| SMTP_HOST                            | SMTP Host to send emails from              |
| SMTP_PORT                            | SMTP Port to use                           |
| SMTP_USERNAME                        | SMTP Authentication Username               |
| SMTP_PASSWORD                        | SMTP Authentication Password               |
| EMAIL_SENDER                         | Email Sender                               |
| NEXT_PUBLIC_MAINTENANCE_ENABLED      | Enables maintenance mode                   |
| NEXT_PUBLIC_MAINTENANCE_MESSAGE      | Message to show on maintenance mode        |
| NEXT_PUBLIC_GTM_ID                   | GTM Identifier                             |

## Development Scripts

| script         | description                    |
| -------------- | ------------------------------ |
| dev            | Run local development server   |
| build          | Build NextJS application       |
| start          | Start local development server |
| lint           | Run ESLint                     |
| prettier       | Run Prettier                   |
| prettier:write | Write Prettier changes         |
| test           | Run tests                      |
| test:watch     | Continuously run tests         |
| test:ci        | Run tests for CI               |

## Plasmic Project and Plasmic CMS

This application requires a Plasmic Project and Plasmic CMS instances exist.

There is a Plasmic Project [cl-frontend](https://studio.plasmic.app/projects/nv6Pd89jTXU6a1rLgw4VWk) and there are Plasmic CMS instances [cl-cms-prd](https://studio.plasmic.app/cms/4GTaCnawpc84TnCd7R2AY1/content/models/sQH65VJahRx8Xk7qymicyw), [cl-cms-stg](https://studio.plasmic.app/cms/hJq8P4S8cGnyNqGwrdHgtn/content/models/vcdH9CHb4Ny9xDFeN4MQiU/entries/38Rz5PsQEi7mVUE9JhtWNo), [cl-cms-qa](https://studio.plasmic.app/cms/8N4FyMdAQPkybm252SbPp8/content/models/3AjGfm8FGuf98umyfpXhMi/entries/vUuR2nw4FUdEapJuLWjtB1).
