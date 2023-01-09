export function mockTruthyMediaQueryMatch(): void {
    global.matchMedia = (query: string): MediaQueryList => {
        return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        };
    };
}

export function mockFalsyMediaQueryMatch(): void {
    global.matchMedia = (query: string): MediaQueryList => {
        return {
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        };
    };
}
