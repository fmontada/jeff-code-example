import { User } from '@/api/user';
import { useUserStore } from '@/store/useUserStore';
import { getUserApi } from '@/utils/api';

export async function getUserQuery(): Promise<User> {
    try {
        const usersApi = getUserApi();

        const token = useUserStore?.getState()?.authorizationToken;
        const { data: user } = await usersApi.getV1UserSelf(token);
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
