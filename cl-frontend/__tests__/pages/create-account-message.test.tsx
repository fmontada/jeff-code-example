import { render, screen } from '@testing-library/react';

import CreateAccountMessagePage from '@/pages/create-account-message';

describe('CreateAccountMessagePage', (): void => {
    beforeEach(() => {
        render(<CreateAccountMessagePage />);
    });

    it('renders image alt text', () => {
        const displayedImage = screen.getByRole('img');
        expect(displayedImage).toBeInTheDocument();
        expect(displayedImage).toHaveAttribute(
            'alt',
            'en-US createAccountMessage.emailAlt',
        );
    });

    it('renders verify text', () => {
        expect(
            screen.getByText('en-US createAccountMessage.message'),
        ).toBeInTheDocument();
    });

    it('renders first part of text', () => {
        expect(
            screen.getByText('en-US createAccountMessage.footNote.partOne'),
        ).toBeInTheDocument();
    });

    it('renders second part of text', () => {
        expect(
            screen.getByText('en-US createAccountMessage.footNote.partTwo'),
        ).toBeInTheDocument();
    });

    it('renders third text', () => {
        expect(
            screen.getByText('en-US createAccountMessage.footNote.partThree'),
        ).toBeInTheDocument();
    });
});
