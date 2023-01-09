import { Order } from '@/api/orders';
import { useUserStore } from '@/store/useUserStore';
import { getOrdersApi } from '@/utils/api';

export async function getUserOrderDetailQuery({ queryKey }): Promise<Order> {
    try {
        const [, orderId] = queryKey;

        const ordersApi = getOrdersApi();
        const authorizationToken = useUserStore?.getState()?.authorizationToken;
        const { data: order } = await ordersApi.getV1OrdersByIdSelf(
            orderId,
            authorizationToken,
        );
        return order;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
