export declare type OptionsType = {
    delay: number;
    playOnInit: boolean;
    stopOnInteraction: boolean;
    stopOnMouseEnter: boolean;
    stopOnLastSnap: boolean;
};
export declare const defaultOptions: OptionsType;
export declare type AutoplayOptionsType = Partial<OptionsType>;
