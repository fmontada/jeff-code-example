import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Tooltip } from './Tooltip';
import { ToolTipTestIds } from './TooltipTestIds';

describe('Tooltip', (): void => {
    const TOOLTIP_CONTENT = 'TEST CONTENT';

    it('renders tooltip', (): void => {
        render(<Tooltip open={true}>{TOOLTIP_CONTENT}</Tooltip>);

        const tooltipElement: HTMLElement = screen.getByTestId(
            ToolTipTestIds.TOOLTIP_CONTAINER,
        );

        expect(tooltipElement).toBeInTheDocument();
        expect(tooltipElement).toHaveTextContent(TOOLTIP_CONTENT);
        expect(tooltipElement.querySelector('img')).toBeInTheDocument();
        expect(tooltipElement.querySelector('img')).toHaveAttribute(
            'alt',
            'en-US account.settings.toolTipMsg.altTextClose',
        );
    });

    it('does not render, when not opened', (): void => {
        render(<Tooltip open={false}>{TOOLTIP_CONTENT}</Tooltip>);

        const tooltipElement: HTMLElement = screen.queryByTestId(
            ToolTipTestIds.TOOLTIP_CONTAINER,
        );

        expect(tooltipElement).not.toBeInTheDocument();
    });

    it('closes upon clicking the close btn', (): void => {
        const handleClose = jest.fn();
        const component = render(
            <Tooltip open={true} onClose={handleClose}>
                {TOOLTIP_CONTENT}
            </Tooltip>,
        );

        expect(component.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();

        fireEvent.click(
            component.getByAltText(
                'en-US account.settings.toolTipMsg.altTextClose',
            ),
        );

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
