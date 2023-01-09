import { render, screen } from '@testing-library/react';
import React from 'react';

import { LoadingModal } from './LoadingModal';
import { LoadingModalTestIds } from './LoadingModalTestIds';

describe('LoadingModal', (): void => {
    it('renders the component', (): void => {
        render(<LoadingModal />);

        const loadingModal: HTMLElement = screen.getByTestId(
            LoadingModalTestIds.LOADING_MODAL_CONTAINER,
        );

        expect(loadingModal).toBeInTheDocument();
        expect(loadingModal).toHaveTextContent('en-US general.loading');
    });
});
