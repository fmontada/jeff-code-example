import { COLLAPSE_SIZES, COLLAPSE_STYLES, OzCollapse } from '@omaze/omaze-ui';
import { useSelector } from '@plasmicapp/host';
import { default as classnames } from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';

import { SweepsStatus } from '@/api/sweepstakes';
import { EnterNowButton } from '@/components/EnterNowButton';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { IWithClassName, IWithDataTestId } from '@/types/components';
import { IStrapiSweepstake } from '@/types/strapi';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';

import { SweepstakeDetailsTestIds } from './SweepstakeDetailsTestIds';

export function SweepstakeDetails(props: IWithDataTestId & IWithClassName) {
    const { className = '', 'data-testid': dataTestId } = props;

    const item: IStrapiSweepstake = useSelector('strapiItem');
    const { sweepstakeData } = useContext(SweepstakeContext);
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const isOpened = sweepstakeData?.status === SweepsStatus.Open;

    const sweepstakeDetailsContainerClass = classnames({
        'flex w-full collapsed-container justify-center items-center px-3 mt-3 lg:mt-0':
            true,
        'pb-10 md:pb-0': isOpened,
        'pb-5': !isOpened,
    });

    const buttonClassName = classnames({
        'items-center justify-between md:w-full': true,
        hidden: isOpened,
    });

    if (!sweepstakeData) {
        return null;
    }

    return (
        <div className={sweepstakeDetailsContainerClass}>
            <div
                className={`flex flex-col text-gray-900 font-gellix lg:w-3/4 mx-auto ${className}`}
                data-testid={
                    SweepstakeDetailsTestIds.SWEEPSTAKE_DETAILS_CONTENT
                }
            >
                <p className="text-xl md:text-3xl font-bold leading-relaxed my-1 md:mt-0">
                    {item.attributes?.details?.detailsTitle}
                </p>
                <p className="text-med md:text-lg md:leading-relaxed font-medium leading-relaxed mt-0 mb-3">
                    {item.attributes?.details?.detailsSupport}
                </p>
                <OzCollapse
                    buttonClassName={buttonClassName}
                    className="w-full"
                    containerClassName="w-full"
                    data-testid={dataTestId}
                    expanded={isOpened}
                    size={COLLAPSE_SIZES.SMALL}
                    style={COLLAPSE_STYLES.CONTAINED}
                >
                    {isOpened ? null : (
                        <OzCollapse.Title>
                            <h4
                                className="flex-1 tracking-wide text-sm"
                                data-testid={
                                    SweepstakeDetailsTestIds.SWEEPSTAKE_DETAILS_TITLE
                                }
                            >
                                {t('sweepstake.prizeDetails')}
                            </h4>
                        </OzCollapse.Title>
                    )}
                    <OzCollapse.Content>
                        {item.attributes?.details?.detailsBodyText ? (
                            <div className="text-base md:text-med md:leading-9 tracking-wide font-medium sweepstake-details-body-text no_tailwind_base">
                                <ReactMarkdown>
                                    {item.attributes.details.detailsBodyText}
                                </ReactMarkdown>
                            </div>
                        ) : null}
                        <p className="text-sm md:text-base font-normal italic leading-relaxed pt-4 mb-0">
                            {item.attributes?.details?.detailsLegalText}
                        </p>
                        <div className="flex flex-col mt-5">
                            {sweepstakeData.grand_prize?.close_date ? (
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-5 h-5 bg-[#EBF4F8] rounded-lg mr-2">
                                        <Image
                                            src="/assets/images/clock-icon.svg"
                                            alt=""
                                            height={22}
                                            width={22}
                                        />
                                    </div>

                                    <div
                                        className="tracking-wide inline whitespace-normal w-3/4"
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                isOpened
                                                    ? 'sweepstake.closesOnLabel'
                                                    : 'sweepstake.closednOnLabel',
                                                {
                                                    time: `<time class="inline" datetime="${
                                                        sweepstakeData
                                                            .grand_prize
                                                            .close_date
                                                    }">
                                                        ${formatDateToLocalString(
                                                            sweepstakeData
                                                                .grand_prize
                                                                .close_date,
                                                        )}
                                                    </time>`,
                                                },
                                            ),
                                        }}
                                    />
                                </div>
                            ) : null}
                            {isOpened ? (
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center justify-center w-5 h-5 bg-[#EBF4F8] rounded-lg mr-2">
                                        <Image
                                            src="/assets/images/announcement-icon.svg"
                                            alt=""
                                            height={22}
                                            width={22}
                                        />
                                    </div>
                                    <div
                                        className="tracking-wide inline whitespace-normal w-3/4"
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                'sweepstake.winnerAnnouncedLabel',
                                                {
                                                    time: `<time class="inline" datetime="${
                                                        sweepstakeData.winner_announce_date
                                                    }">
                                                    ${formatDateToLocalString(
                                                        sweepstakeData.winner_announce_date,
                                                    )}
                                                </time>`,
                                                },
                                            ),
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <EnterNowButton isSticky={false} />
                    </OzCollapse.Content>
                </OzCollapse>
            </div>
        </div>
    );
}
