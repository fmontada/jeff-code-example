import { produce } from 'immer';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { IStore } from '@/types/store';

export function createStore<T>(initialState: Partial<T>) {
    return create<T & IStore<T>>()(
        immer(
            devtools((set) => ({
                ...(initialState as T),
                set: (setFn: (store: Partial<T>) => typeof set) =>
                    set(produce(setFn)),
            })),
        ),
    );
}
