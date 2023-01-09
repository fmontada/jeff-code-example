import { ReactNode } from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { IWithDataTestId } from '@/types/components';

import { LayoutTestIds } from './LayoutTestIds';

export interface ILayoutProps extends IWithDataTestId {
    children: ReactNode;
    containerClassName?: string;
    layoutClassName?: string;
}

export function Layout(props: ILayoutProps) {
    const {
        children,
        containerClassName = '',
        'data-testid': dataTestId = undefined,
        layoutClassName = '',
    } = props;

    const computedContainerClassName =
        containerClassName || 'container mx-auto';
    const computedLayoutClassName = `min-h-screen flex flex-col justify-between ${layoutClassName}`;

    return (
        <div className={computedLayoutClassName} data-testid={dataTestId}>
            <Header data-testid={LayoutTestIds.HEADER} />
            <div
                className={computedContainerClassName}
                data-testid={LayoutTestIds.CONTENT}
            >
                {children}
            </div>
            <Footer data-testid={LayoutTestIds.FOOTER} />
        </div>
    );
}
