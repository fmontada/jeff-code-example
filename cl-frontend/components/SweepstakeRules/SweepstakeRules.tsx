import { COLLAPSE_SIZES, COLLAPSE_STYLES, OzCollapse } from '@omaze/omaze-ui';
import { useSelector } from '@plasmicapp/host';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useRef } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';
import { IWithClassName, IWithDataTestId } from '@/types/components';
import { IStrapiSweepstake } from '@/types/strapi';

export type ISweepstakeRulesProps = IWithClassName & IWithDataTestId;

export function SweepstakeRules(props: ISweepstakeRulesProps) {
    const { className = '', 'data-testid': dataTestId } = props;
    const item: IStrapiSweepstake = useSelector('strapiItem');
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const { sweepstakeData } = useContext(SweepstakeContext);
    const isOpened = sweepstakeData?.status === SweepsStatus.Open;

    const sweepstakeRulesRef = useRef<HTMLDivElement>(null);
    const setSweepstakeStore = useSweepstakeStore((store) => store.set);

    useEffect(() => {
        if (!sweepstakeRulesRef?.current) {
            return;
        }

        setSweepstakeStore((store) => {
            store.sweepstakeRulesRef = sweepstakeRulesRef?.current;
        });
    }, [sweepstakeRulesRef]);

    return (
        <div
            className={`w-full p-3 bg-gray-50 font-gellix text-gray-900 mt-10 relative ${className}`}
            data-testid={dataTestId}
        >
            <div
                className="absolute top-2 md:-top-10 left-0"
                ref={sweepstakeRulesRef}
            />
            <OzCollapse
                containerClassName="w-full md:w-2/3 md:mx-auto"
                size={COLLAPSE_SIZES.SMALL}
                style={COLLAPSE_STYLES.CONTAINED}
                expanded={isOpened}
            >
                <OzCollapse.Title>
                    <h4 className="flex-1 mt-0 mb-3 tracking-wide text-base">
                        {t('sweepstake.rulesTitle')}
                    </h4>
                </OzCollapse.Title>
                <OzCollapse.Content>
                    <div
                        className="italic text-sm text-gray-900"
                        dangerouslySetInnerHTML={{
                            __html: item.attributes?.rules,
                        }}
                    />
                </OzCollapse.Content>
            </OzCollapse>
        </div>
    );
}
