import { ICON_COLOR, ICON_SIZE, ICON_TYPE, OzIcon } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import React, { ReactNode } from 'react';
import { IWithClassName, IWithDataTestId } from 'types/components';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { ToolTipTestIds } from './TooltipTestIds';

export interface ITooltipProps extends IWithClassName, IWithDataTestId {
    children: ReactNode;
    open?: boolean;
    onClose?: () => void;
}

export function Tooltip(props: ITooltipProps) {
    const {
        children,
        open,
        onClose,
        'data-testid': dataTestId = ToolTipTestIds.TOOLTIP_CONTAINER,
    } = props;

    const { t } = useTranslation(COMMON_TRANSLATIONS);

    if (!open) {
        return null;
    }

    return (
        <div className="absolute" data-testid={dataTestId}>
            <div className="flex rounded-sm text-xs font-gellix italic z-50 type-caption bg-teal-50 text-gray-900 text-left w-[18rem] shadow-gray-300 drop-shadow-md">
                <div className="p-2 basis-0 grow">{children}</div>
                <div className="mt-2 mr-2 w-3/2 relative">
                    <button onClick={onClose} onKeyDown={onClose}>
                        <OzIcon
                            className="absolute top-0 right-0 cursor-pointer text-gray-900 w-3/2 h-3/2"
                            alt={t('account.settings.toolTipMsg.altTextClose')}
                            color={ICON_COLOR.DARK}
                            size={ICON_SIZE.MEDIUM}
                            type={ICON_TYPE.OZ_CLOSE}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
