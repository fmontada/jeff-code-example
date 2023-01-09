import { render, screen } from '@testing-library/react';
import React from 'react';

import { UserStatus } from '@/api/user';

import InfoProvided from './InfoProvided';
import { InfoProvidedTestIds } from './InfoProvidedTestIds';

describe('InfoProvided', (): void => {
    beforeEach(() => {
        const userMock = {
            id: 'test-id',
            name: 'test_name',
            email: 'test@test.com',
            status: UserStatus.Active,
            error: 'test-error',
        };

        render(<InfoProvided userInfo={userMock} />);
    });

    it('renders InfoProvided', () => {
        const infoProvidedCointainer: HTMLElement = screen.getByTestId(
            InfoProvidedTestIds.INFO_PROVIDED_MAIN_CONTAINER,
        );
        expect(infoProvidedCointainer).toBeInTheDocument();
    });

    it('renders correct field labels', () => {
        expect(
            screen.getByTestId(InfoProvidedTestIds.INFO_PROVIDED_FULL_NAME),
        ).toHaveTextContent(
            'en-US account.settings.personalInformation.fullName',
        );
    });
});
