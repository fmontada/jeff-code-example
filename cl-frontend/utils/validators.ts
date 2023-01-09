export function validateEmail(email: string) {
    return (
        String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ) && !String(email).includes('+')
    );
}

export function ensure<T>(x: T | null | undefined): T {
    if (x === null || x === undefined) {
        throw new Error(`Value must not be undefined or null`);
    } else {
        return x;
    }
}
