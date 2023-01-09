import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

export default function InfoNotProvided(): ReactElement {
    const fieldLabelClassNames: string = 'font-bold text-navy-900 text-base';
    const fieldEmptyClassNames: string = 'text-navy-900 text-sm italic mt-1/2';

    const { t } = useTranslation(COMMON_TRANSLATIONS);

    return (
        <div>
            <h4 className={fieldLabelClassNames}>
                {t('account.settings.personalInformation.fullName')}
            </h4>
            <div className={fieldEmptyClassNames}>
                {t('account.settings.notProvided')}
            </div>
            {/* <OzDivider className="mt-3 mb-2" />
            <h2 className={fieldLabelClassNames}>
                {t('account.settings.personalInformation.phoneNumber')}
            </h2>
            <div className={fieldEmptyClassNames}>
                {t('account.settings.notProvided')}
            </div>
            <OzDivider className="mt-3 mb-2" />
            <h2 className="mb-1/2 text-med font-bold">
                {t(
                    'account.settings.personalInformation.address.savedAddresses',
                )}
            </h2>
            <p className="mb-2 text-xs italic">
                {t('account.settings.personalInformation.address.addressNote')}
            </p>
            <h4 className={fieldLabelClassNames}>
                {t(
                    'account.settings.personalInformation.address.defaultAddress',
                )}
            </h4>
            <div className={fieldEmptyClassNames}>
                {t('account.settings.notProvided')}
            </div> */}
        </div>
    );
}
