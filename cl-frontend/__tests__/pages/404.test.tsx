import { render, screen } from '@testing-library/react';

import Page404 from '@/pages/404';

describe('Page404', () => {
    it('renders a 404 not found page', () => {
        render(<Page404 />);

        expect(screen.getByText('en-US error.404.title')).toBeInTheDocument();
        expect(
            screen.getByText('en-US error.404.subtitle'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('en-US error.404.explanation'),
        ).toBeInTheDocument();

        const backToHomeButton = screen.getByRole('button', {
            name: 'en-US error.404.backToHome',
        });
        expect(backToHomeButton).toBeInTheDocument();
        expect(backToHomeButton.parentNode).toHaveAttribute('href', '/');
    });
});
