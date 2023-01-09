import '@omaze/omaze-ui/dist/omaze-ui.cjs.development.css';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import nextI18NextConfig from '../next-i18next.config.js';
import '../styles/globals.css';

import { Sweepstakes } from '@/api/sweepstakes';
import { AccountProvider } from '@/components/AccountProvider';
import { Auth0Provider } from '@/components/Auth0';
import { GeoLocationProvider } from '@/components/GeoLocationProvider';
import { MaintenanceModeProvider } from '@/components/MaintenanceModeProvider';
import { SailthruProvider } from '@/components/SailthruProvider/';
import { SweepstakesProvider } from '@/components/SweepstakesProvider';

const queryClient = new QueryClient();

export interface IAppPropsDefaults {
    sweepstakes: Sweepstakes[];
}

function MyApp({ Component, pageProps }: AppProps<IAppPropsDefaults>) {
    return (
        <QueryClientProvider client={queryClient}>
            <Auth0Provider>
                <AccountProvider>
                    <SailthruProvider>
                        <MaintenanceModeProvider>
                            <GeoLocationProvider>
                                <SweepstakesProvider
                                    sweepstakes={pageProps.sweepstakes}
                                >
                                    <Component {...pageProps} />
                                </SweepstakesProvider>
                            </GeoLocationProvider>
                        </MaintenanceModeProvider>
                    </SailthruProvider>
                </AccountProvider>
            </Auth0Provider>
        </QueryClientProvider>
    );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
