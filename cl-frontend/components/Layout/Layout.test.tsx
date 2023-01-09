import { screen } from '@testing-library/react';
import React from 'react';

import { renderWithQueryClient } from '@/mocks/renderWithQueryClient';

import { Layout } from './Layout';
import { LayoutTestIds } from './LayoutTestIds';

describe('Layout', (): void => {
    it('renders the children with its content', (): void => {
        renderWithQueryClient(
            <Layout>
                <div data-testid="TESTING">CONTENT</div>
            </Layout>,
        );

        const childrenWithContent: HTMLElement =
            screen.queryByTestId('TESTING');

        expect(childrenWithContent).toBeInTheDocument();
        expect(childrenWithContent).toHaveTextContent('CONTENT');
    });

    it('renders the layout with a custom data test id', (): void => {
        renderWithQueryClient(
            <Layout data-testid="NEW_TEST_ID">{null}</Layout>,
        );

        const childrenWithContent: HTMLElement =
            screen.queryByTestId('NEW_TEST_ID');

        expect(childrenWithContent).toBeInTheDocument();
    });

    it('renders the header', (): void => {
        renderWithQueryClient(<Layout>{null}</Layout>);

        const header: HTMLElement = screen.queryByTestId(LayoutTestIds.HEADER);

        expect(header).toBeInTheDocument();
        expect(header.tagName).toBe('HEADER');
    });

    it('renders the footer', (): void => {
        renderWithQueryClient(<Layout>{null}</Layout>);

        const footer: HTMLElement = screen.queryByTestId(LayoutTestIds.FOOTER);

        expect(footer).toBeInTheDocument();
        expect(footer.tagName).toBe('FOOTER');
    });

    it('renders a custom container class name', (): void => {
        renderWithQueryClient(
            <Layout containerClassName="custom_class">{null}</Layout>,
        );

        const contentContainer: HTMLElement = screen.queryByTestId(
            LayoutTestIds.CONTENT,
        );

        expect(contentContainer).toBeInTheDocument();
        expect(contentContainer.tagName).toBe('DIV');
        expect(contentContainer.classList).toContain('custom_class');
        expect(contentContainer.classList).toHaveLength(1);
    });

    it('renders a custom layout class name', (): void => {
        renderWithQueryClient(
            <Layout
                data-testid="TESTING_LAYOUT_ID"
                layoutClassName="custom_layout_class"
            >
                {null}
            </Layout>,
        );

        const layout: HTMLElement = screen.queryByTestId('TESTING_LAYOUT_ID');

        expect(layout).toBeInTheDocument();
        expect(layout.tagName).toBe('DIV');
        expect(layout.classList).toContain('custom_layout_class');
        expect(layout.classList).not.toHaveLength(1);
    });
});
