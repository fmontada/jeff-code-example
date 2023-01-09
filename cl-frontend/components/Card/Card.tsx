import classNames from 'classnames';
import { ReactNode } from 'react';
import { IWithClassName, IWithDataTestId } from 'types/components';

import { CardTestIds } from './CardTestIds';

export interface ICardProps extends IWithClassName, IWithDataTestId {
    children: ReactNode;
    ignoreShadowClass?: boolean;
}

export function Card(props: ICardProps) {
    const {
        children,
        className = '',
        'data-testid': dataTestId = CardTestIds.CARD_CONTAINER,
        ignoreShadowClass = false,
    } = props;

    const cardClassNames = classNames({
        'shadow-card': !ignoreShadowClass,
        'bg-white-500 rounded-lg': true,
        [className]: true,
    });

    return (
        <div className={cardClassNames} data-testid={dataTestId}>
            {children}
        </div>
    );
}
