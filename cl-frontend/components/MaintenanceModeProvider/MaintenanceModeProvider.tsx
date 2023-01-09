import { PropsWithChildren } from 'react';

import { MaintenanceModeView } from '@/components/MaintenanceModeView';

export function MaintenanceModeProvider(
    props: PropsWithChildren<Record<string, unknown>>,
): JSX.Element {
    const { children } = props;
    const inMaintenanceMode =
        process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED === '1';

    if (inMaintenanceMode) {
        return <MaintenanceModeView />;
    }

    return children as JSX.Element;
}
