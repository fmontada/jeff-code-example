export interface IStore<T> {
    set: (setFn: (store: Partial<T>) => any) => any;
}
