import { SAILTHRU_ACTIONS } from '@/constants/sailthru';

import { createStore } from './createStore';

export interface ISailthru {
    integration: (action: SAILTHRU_ACTIONS | string, data: any) => void;
    init?: ({ customerId }: { customerId: string }) => void;
}

export interface IAppStore {
    sailthru: ISailthru | null;
}

export const useAppStore = createStore<IAppStore>({
    sailthru: null,
});
