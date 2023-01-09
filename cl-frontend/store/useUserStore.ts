import { IGeolocationPosition } from '@/types/user';

import { createStore } from './createStore';

export interface IUserStore {
    authorizationToken: string | null;
    fromAuth: boolean;
    geoLocation: IGeolocationPosition;
}

export const useUserStore = createStore<IUserStore>({
    authorizationToken: null,
    fromAuth: false,
    geoLocation: null,
});
