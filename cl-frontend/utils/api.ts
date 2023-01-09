import axios, { AxiosInstance } from 'axios';

import { Configuration } from '@/api/orders';
import { CartApi, ExperiencesApi, OrdersApi } from '@/api/orders/api';
import { SweepstakesApi } from '@/api/sweepstakes/api';
import { UserApi } from '@/api/user/api';
import { useUserStore } from '@/store/useUserStore';

export interface INewable<T> {
    new (
        configuration: Configuration | undefined,
        basePath: string | undefined,
        axiosInstance: AxiosInstance | undefined,
    ): T;
}

export function getGenericApi<T>(GenericApi: INewable<T>, basePath: string): T {
    const token = useUserStore?.getState()?.authorizationToken;

    const instanceConfiguration = new Configuration({
        accessToken: token,
    });

    const axiosCopy = axios.create();
    axiosCopy.interceptors.request.use(function (config) {
        if (token) {
            const tokenCode = token.includes('Bearer')
                ? token.split(' ')[1]
                : token;
            config.headers.Authorization = tokenCode
                ? `Bearer ${tokenCode}`
                : undefined;
        }

        return config;
    });

    const instancedApi = new GenericApi(
        instanceConfiguration,
        basePath,
        axiosCopy,
    );
    return instancedApi;
}

export function getCartApi(): CartApi {
    return getGenericApi(CartApi, process.env.NEXT_PUBLIC_ORDERS_API_ENDPOINT);
}

export function getUserApi(): UserApi {
    return getGenericApi(
        UserApi,
        process.env.NEXT_PUBLIC_USER_API_ENDPOINT,
    ) as UserApi;
}

export function getSweepstakesApi(): SweepstakesApi {
    return getGenericApi(SweepstakesApi, process.env.NEXT_PUBLIC_API_ENDPOINT);
}

export function getOrdersApi(): OrdersApi {
    return getGenericApi(
        OrdersApi,
        process.env.NEXT_PUBLIC_ORDERS_API_ENDPOINT,
    );
}

export function getExperiencesApi(): ExperiencesApi {
    return getGenericApi(
        ExperiencesApi,
        process.env.NEXT_PUBLIC_ORDERS_API_ENDPOINT,
    );
}
