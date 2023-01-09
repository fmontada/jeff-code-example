import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export function renderWithQueryClient(children: React.ReactNode) {
    const queryClient = new QueryClient();

    return render(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>,
    );
}
