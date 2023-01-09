import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from './StudioI18n';

export function WrapIfI18NextProvider({
    children,
    wrap,
}: {
    children: any;
    wrap: boolean;
}) {
    if (!wrap) {
        return children;
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
