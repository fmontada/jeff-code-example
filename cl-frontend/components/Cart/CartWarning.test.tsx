import { render, screen } from '@testing-library/react';

import { CartTestIds } from './CartTestIds';
import { CartWarning } from './CartWarning';

describe('CartWarning', (): void => {
    beforeEach(() => {
        render(<CartWarning />);
    });

    it('renders a cart warning', () => {
        const cartWarningContainer = screen.getByTestId(
            CartTestIds.CART_WARNING_CONTAINER,
        );

        expect(cartWarningContainer).toBeInTheDocument();
    });
});
