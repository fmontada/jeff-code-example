import { ISailthru } from './store/useAppStore';

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        Sailthru: ISailthru;
        dataLayer: any;
    }
}
