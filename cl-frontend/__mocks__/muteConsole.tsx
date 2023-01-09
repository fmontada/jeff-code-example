export function muteConsole() {
    jest.spyOn(console, 'debug').mockImplementation(() => {
        return null;
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
        return null;
    });
}
