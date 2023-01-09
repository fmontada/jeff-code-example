import { BUTTON_SIZE, BUTTON_STYLE, OzButton, OzModal } from '@omaze/omaze-ui';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import shallow from 'zustand/shallow';

import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useUserStore } from '@/store/useUserStore';
import { IGeolocationPosition } from '@/types/user';

import { GeoLocationProviderTestIds } from './GeoLocationProviderTestIds';

export function GeoLocationProvider(
    props: PropsWithChildren<Record<string, unknown>>,
): JSX.Element {
    const { children } = props;
    const [setUserStore] = useUserStore((store) => [store.set], shallow);
    const [showModal, setShowModal] = useState<boolean>(false);
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const router = useRouter();
    const [dismissed, setDismissed] = useState<boolean>(false);

    useEffect(() => {
        async function fetchGeoLocationData() {
            const { data } = await axios.get<IGeolocationPosition>(
                '/api/geolocation',
            );

            const commaListOfRestrictedRegions =
                process.env.NEXT_PUBLIC_RESTRICTED_REGIONS_LIST || '';

            if (!commaListOfRestrictedRegions) {
                return;
            }

            const restrictedRegionsArray = commaListOfRestrictedRegions
                .toLowerCase()
                .split(',');

            const commaListOfRestrictedRoutes =
                process.env.NEXT_PUBLIC_ROUTES_GEO_DISABLED_LIST || '';
            const isRouteRestricted = commaListOfRestrictedRoutes
                .split(',')
                .includes(router?.asPath);

            if (
                !isRouteRestricted &&
                (!data.region ||
                    !restrictedRegionsArray.includes(data.region.toLowerCase()))
            ) {
                setShowModal(true);
            }

            setUserStore((store) => {
                store.geoLocation = data;
            });
        }

        if (dismissed || !router) {
            return;
        }

        fetchGeoLocationData();
    }, [dismissed, router]);

    function closeModal() {
        setShowModal(false);
        setDismissed(true);
    }

    return (
        <>
            <OzModal isOpen={showModal} hideModal={closeModal} showMask>
                <OzModal.Body>{t('geolocation.banner.title')}</OzModal.Body>
                <OzModal.Actions>
                    <div
                        className="flex justify-center w-full"
                        data-testid={
                            GeoLocationProviderTestIds.GEO_LOCATION_MODAL
                        }
                    >
                        <Link href="https://omaze.com" passHref>
                            <a>
                                <OzButton
                                    style={BUTTON_STYLE.LINK}
                                    size={BUTTON_SIZE.MEDIUM}
                                >
                                    {t('geolocation.banner.link')}
                                </OzButton>
                            </a>
                        </Link>
                    </div>
                </OzModal.Actions>
            </OzModal>
            {children}
        </>
    );
}
