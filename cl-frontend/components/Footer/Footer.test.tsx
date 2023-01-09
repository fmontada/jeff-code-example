import { render } from '@testing-library/react';
import React from 'react';

import { Footer } from './Footer';

describe('Footer', (): void => {
    it('renders', (): void => {
        const { container } = render(<Footer />);

        expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('renders the translation', (): void => {
        const { container } = render(<Footer />);

        expect(container.querySelector('footer')).toHaveTextContent(
            'en-US footer.copyright',
        );
    });

    it('includes the data-test-id prop', (): void => {
        const { container } = render(<Footer data-testid="testing-footer" />);

        expect(container.querySelector('footer')).toHaveAttribute(
            'data-testid',
            'testing-footer',
        );
    });

    it('includes the class passed by prop', (): void => {
        const { container } = render(
            <Footer className="testing-footer-class" />,
        );

        expect(container.querySelector('footer')).toHaveClass(
            'testing-footer-class',
        );
    });
});
