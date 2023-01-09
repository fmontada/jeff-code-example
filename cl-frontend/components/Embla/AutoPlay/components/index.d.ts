import { EmblaPluginType } from 'embla-carousel';

import { AutoplayOptionsType, OptionsType } from './Options';

export declare type AutoplayType = EmblaPluginType<OptionsType> & {
    play: () => void;
    stop: () => void;
    reset: () => void;
};
declare function Autoplay(
    userOptions?: AutoplayOptionsType,
    userNode?: (emblaRoot: HTMLElement) => HTMLElement | null,
): AutoplayType;
declare namespace Autoplay {
    var globalOptions: Partial<OptionsType> | undefined;
}
export default Autoplay;
