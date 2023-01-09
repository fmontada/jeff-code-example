export function extractEmail(message: string): string {
    if (!message) {
        return '';
    }

    const elm: string[] = message.split(': ');

    let email = '';
    if (elm.length > 1) {
        email = elm[1];
    }

    return email;
}
