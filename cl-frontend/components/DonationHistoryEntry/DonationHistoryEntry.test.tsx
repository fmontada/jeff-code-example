import { render, screen } from '@testing-library/react';
import React from 'react';

import { OrderCurrencyEnum } from '@/api/orders';
import { MOCK_ORDERS } from '@/mocks/orders';

import { DonationHistoryEntry } from './DonationHistoryEntry';
import { DonationHistoryEntryTestIds } from './DonationHistoryEntryTestIds';

describe('DonationHistoryEntry', (): void => {
    it('renders the component and its container', (): void => {
        render(<DonationHistoryEntry order={MOCK_ORDERS[0]} />);

        const donationHistoryContainer: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_CONTAINER,
        );

        expect(donationHistoryContainer).toBeInTheDocument();
    });

    it('renders the data information', (): void => {
        render(<DonationHistoryEntry order={MOCK_ORDERS[0]} />);

        const createdAt: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_CREATED_AT,
        );

        expect(createdAt).toHaveTextContent('Jul 19, 2022');

        const orderId: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_ORDER_ID,
        );

        expect(orderId).toHaveTextContent(
            'en-US account.donationHistory.order.title',
        );

        const totalEntries: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_TOTAL_ENTRIES,
        );

        expect(totalEntries).toHaveTextContent(
            'en-US account.donationHistory.totalEntries: 300',
        );

        const totalAmount: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_TOTAL_AMOUNT,
        );

        expect(totalAmount).toHaveTextContent(
            'en-US account.donationHistory.donationTotal: $2,500',
        );
    });

    it('renders the data in euros', (): void => {
        const ORDER_IN_EUROS = {
            ...MOCK_ORDERS[0],
            currency: OrderCurrencyEnum.Eur,
        };

        render(<DonationHistoryEntry order={ORDER_IN_EUROS} />);

        const totalAmount: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_TOTAL_AMOUNT,
        );

        expect(totalAmount).toHaveTextContent(
            'en-US account.donationHistory.donationTotal: €2,500',
        );
    });

    it('calculates the total of entries', (): void => {
        const ORDER_IN_EUROS = {
            ...MOCK_ORDERS[0],
            line_items: new Set([
                {
                    ...MOCK_ORDERS[0].line_items[0],
                    num_entries: 120,
                },
                {
                    ...MOCK_ORDERS[0].line_items[0],
                    num_entries: 180,
                },
            ]),
        };

        render(<DonationHistoryEntry order={ORDER_IN_EUROS} />);

        const totalEntries: HTMLElement = screen.getByTestId(
            DonationHistoryEntryTestIds.DONATION_HISTORY_TOTAL_ENTRIES,
        );

        expect(totalEntries).toHaveTextContent(
            'en-US account.donationHistory.totalEntries: 300',
        );
    });
});
