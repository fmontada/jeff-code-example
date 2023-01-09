import { act, renderHook } from '@testing-library/react';

import { createPersistanceStore } from './createPersistanceStore';

interface ITestStore {
    test: boolean;
}

describe('createPersistanceStore', (): void => {
    const storeName = 'testStore';
    const defaultStoreContent = { test: true };
    const createdStore = createPersistanceStore<ITestStore>(
        defaultStoreContent,
        storeName,
    );

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

    it('initializes a persistance store with a default state', (): void => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        expect(result.current.test).toBe(true);
    });

    it('initializes a persistance store with a set function', (): void => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        expect(result.current.set).toBeDefined();
    });

    it('changes persisted values using the set function', (): void => {
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

    it('initializes a persistance store saving in localstorage', (): void => {
        const { result } = renderHook(() => {
            return createdStore();
        });

        expect(result.current.test).toBe(true);

        const storedData = localStorage.getItem(storeName);

        expect(storedData).toBeDefined();
        expect(JSON.parse(storedData).state.test).toBe(true);
    });
});
