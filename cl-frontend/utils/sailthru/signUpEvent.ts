import { SAILTHRU_ACTIONS } from '@/constants/sailthru';
import { ISailthru } from '@/store/useAppStore';

export function signUpEvent(
    sailthru: ISailthru,
    email: string,
    source: string = 'web',
    vars: Record<string, string> = { source: 'web' },
) {
    if (!email || !sailthru) {
        return;
    }

    sailthru.integration(SAILTHRU_ACTIONS.USER_SIGN_UP, {
        email,
        source,
        vars,
    });
}
