import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import { User } from '@/api/user';
import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { InfoProvidedTestIds } from './InfoProvidedTestIds';

export interface IInfoProvidedProps {
    userInfo: User;
}

export default function InfoProvided({
    userInfo,
}: IInfoProvidedProps): ReactElement {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const fieldLabelClassNames: string = 'font-bold text-navy-900 text-base';
    const fieldValueClassNames: string =
        'text-navy-900 text-base leading-relaxed mt-1/2 not-italic';

    return (
        <div data-testid={InfoProvidedTestIds.INFO_PROVIDED_MAIN_CONTAINER}>
            <h4
                className={fieldLabelClassNames}
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_FULL_NAME}
            >
                {t('account.settings.personalInformation.fullName')}
            </h4>
            <div
                className={fieldValueClassNames}
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_USER_NAME}
            >
                {userInfo.first_name} {userInfo.last_name}
            </div>
            {/* <OzDivider className="mt-3 mb-2" />
            <h2
                className={fieldLabelClassNames}
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_PHONE_NUMBER}
            >
                {t('account.settings.personalInformation.phoneNumber')}
            </h2>
            <div
                className="flex items-center text-gray-900 leading-relaxed mt-1/2"
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_PHONE_CONTAINER}
            >
                <OzPhoneNumberFlag
                    phoneNumber={userInfo.phone}
                    className="mr-2"
                />
                <OzPhoneNumberDisplay
                    className="font-gellix font-medium text-base text-navy-900"
                    phoneNumber={userInfo.phone}
                />
            </div>
            <OzDivider className="mt-3 mb-2" />
            <h2
                className="mb-1/2 text-med font-bold"
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_SAVED_ADDRESS}
            >
                {t(
                    'account.settings.personalInformation.address.savedAddresses',
                )}
            </h2>
            <p
                className="mb-2 text-xs italic"
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_ADDRESS_NOTE}
            >
                {t('account.settings.personalInformation.address.addressNote')}
            </p>
            <h4
                className={fieldLabelClassNames}
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_DEFAULT_ADDRESS}
            >
                {t(
                    'account.settings.personalInformation.address.defaultAddress',
                )}
            </h4>
            <address
                className={fieldValueClassNames}
                data-testid={InfoProvidedTestIds.INFO_PROVIDED_USER_ADDRESS}
            >
                {userInfo.defaultAddress}
            </address>
            <OzDivider className="mt-3 mb-1" />
            <OzCollapse
                data-testid={
                    InfoProvidedTestIds.INFO_PROVIDED_COLLAPSE_COMPONENT
                }
                size={COLLAPSE_SIZES.BASE}
                style={COLLAPSE_STYLES.TEXT}
                expanded={false}
            >
                <OzCollapse.Title>
                    <h4 className={fieldLabelClassNames}>
                        {t(
                            'account.settings.personalInformation.address.additionalAddresses',
                        )}
                    </h4>
                </OzCollapse.Title>
                <OzCollapse.Content>
                    <ul>
                        {userInfo.addresses.map((obj) => (
                            <li key={obj.id}>{obj.address}</li>
                        ))}
                    </ul>
                </OzCollapse.Content>
            </OzCollapse> */}
        </div>
    );
}
