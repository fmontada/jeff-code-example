import { produce } from 'immer';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { IStore } from '@/types/store';

export function createPersistanceStore<T>(
    initialState: Partial<T>,
    name: string,
    version: number = 1,
) {
    const newStore = create<T & IStore<T>>()(
        immer(
            devtools(
                persist(
                    (set) => ({
                        ...(initialState as T),
                        set: (setFn: (store: Partial<T>) => typeof set) =>
                            set(produce(setFn)),
                    }),
                    {
                        name,
                        version,
                    },
                ),
            ),
        ),
    );

    return newStore;
}
