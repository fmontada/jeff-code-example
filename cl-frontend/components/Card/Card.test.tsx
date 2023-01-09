import { render, screen } from '@testing-library/react';
import React from 'react';

import { Card } from './Card';
import { CardTestIds } from './CardTestIds';

describe('Card', (): void => {
    const cardContent: string = 'CARD CONTENT';

    it('renders the component and its child', (): void => {
        render(
            <Card>
                <p>{cardContent}</p>
            </Card>,
        );

        const cardElement: HTMLElement = screen.getByTestId(
            CardTestIds.CARD_CONTAINER,
        );

        expect(cardElement).toBeInTheDocument();
        expect(cardElement).toHaveTextContent(cardContent);
    });

    it('renders the component with a custom className', (): void => {
        const tempClassName: string = 'temp-class-name';

        render(
            <Card className={tempClassName}>
                <p>{cardContent}</p>
            </Card>,
        );

        const cardElement: HTMLElement = screen.getByTestId(
            CardTestIds.CARD_CONTAINER,
        );

        expect(cardElement).toBeInTheDocument();
        expect(cardElement).toHaveClass(tempClassName);
    });

    it('renders the component with a custom data-testid', (): void => {
        const tempTestId: string = 'temp-test-id';

        render(
            <Card data-testid={tempTestId}>
                <p>{cardContent}</p>
            </Card>,
        );

        const wrongCardElement: HTMLElement = screen.queryByTestId(
            CardTestIds.CARD_CONTAINER,
        );

        expect(wrongCardElement).not.toBeInTheDocument();

        const correctCardElement: HTMLElement = screen.getByTestId(tempTestId);
        expect(correctCardElement).toBeInTheDocument();
    });
});
