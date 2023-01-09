import { Order } from '@/api/orders';
import { useUserStore } from '@/store/useUserStore';
import { getOrdersApi } from '@/utils/api';

export async function getUserOrdersQuery(): Promise<Order[]> {
    try {
        const ordersApi = getOrdersApi();
        const authorizationToken = useUserStore?.getState()?.authorizationToken;
        const {
            data: { orders },
        } = await ordersApi.getV1OrdersSelf(authorizationToken);
        return orders;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
