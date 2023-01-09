import { act, renderHook } from '@testing-library/react';

import { createStore } from './createStore';

interface ITestStore {
    test: boolean;
}

describe('createStore', (): void => {
    const defaultStoreContent = { test: true };
    const createdStore = createStore<ITestStore>(defaultStoreContent);

    afterEach(() => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        act(() => {
            result.current.set((store) => {
                store.test = true;
            });
        });
    });

    it('initializes a store with a default state', (): void => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        expect(result.current.test).toBe(true);
    });

    it('initializes a store with a set function', (): void => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        expect(result.current.set).toBeDefined();
    });

    it('changes values using the set function', (): void => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        expect(result.current.test).toBe(true);

        act(() => {
            result.current.set((store) => {
                store.test = false;
            });
        });

        expect(result.current.test).toBe(false);
    });
});
