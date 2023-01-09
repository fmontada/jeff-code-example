import { render, screen } from '@testing-library/react';

import Page500 from '@/pages/500';

describe('Page500', () => {
    it('renders a 500 not found page', () => {
        render(<Page500 />);

        expect(screen.getByText('en-US error.500.title')).toBeInTheDocument();
        expect(
            screen.getByText('en-US error.500.subtitle'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('en-US error.500.explanation'),
        ).toBeInTheDocument();

        const backToHomeButton = screen.getByRole('button', {
            name: 'en-US error.500.backToHome',
        });
        expect(backToHomeButton).toBeInTheDocument();
        expect(backToHomeButton.parentNode).toHaveAttribute('href', '/');
    });
});
