import { PlasmicTranslator } from '@plasmicapp/loader-nextjs';
import { Trans, useTranslation } from 'next-i18next';
import { ReactNode } from 'react';

// Defined as a hook; should be used and passed as translator
export function usePlasmicTranslator(): PlasmicTranslator {
    const { t } = useTranslation();
    function translator(key: string, opts: any): ReactNode | string {
        if (opts?.components) {
            return <Trans i18nKey={key} components={opts.components} />;
        } else if (opts) {
            return t(key, { defaultValue: opts.message });
        } else {
            return t(key);
        }
    }

    return translator;
}
