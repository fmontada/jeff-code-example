import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { Banner, BannerTypes } from '@/components/Banner';
import { Layout } from '@/components/Layout';
import { FIRST_TIME_LOGIN_CHECK } from '@/constants/auth0';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useUserStore } from '@/store/useUserStore';

export { getStaticProps } from '@/utils/serverSideProps';

export enum AccountTestIds {
    LOGIN_BANNER_CONTAINER = 'AccountPage__login-banner-container',
    SIGN_UP_BANNER_CONTAINER = 'AccountPage__sign-up-banner-container',
}

// @TODO: THIS IS PLACEHOLDER, NEEDS TO BE UPDATED WITH THE PROPER ACCOUNT PAGE - TEST ARE ALSO MISSING
export default function Index() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [fromAuth, setUserStore] = useUserStore(
        (store) => [store.fromAuth, store.set],
        shallow,
    );
    const showSuccessBanner = fromAuth && isAuthenticated;
    const isSignUp =
        !!user?.[
            `${process.env.NEXT_PUBLIC_AUTH0_NAMESPACE}/${FIRST_TIME_LOGIN_CHECK}`
        ];

    useEffect(() => {
        return function onDismountAccountPage() {
            setUserStore((store) => {
                store.fromAuth = false;
            });
        };
    }, []);

    if (isLoading) {
        // @TODO: I18N PENDING ONCE WE IMPLEMENT THE ACTUAL ACCOUNT PAGE
        return <div>Loading ...</div>;
    }

    if (!isAuthenticated) {
        router.replace('/');
        return null;
    }

    return (
        <Layout>
            <div className="flex flex-col items-center mt-4">
                <Image
                    src={user.picture}
                    alt={user.name}
                    height={100}
                    width={100}
                />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
            {showSuccessBanner ? (
                <Banner
                    data-testid={
                        isSignUp
                            ? AccountTestIds.SIGN_UP_BANNER_CONTAINER
                            : AccountTestIds.LOGIN_BANNER_CONTAINER
                    }
                    type={BannerTypes.SUCCESS}
                >
                    {isSignUp
                        ? t('account.signUpBanner')
                        : t('account.loginBanner')}
                </Banner>
            ) : null}
        </Layout>
    );
}
