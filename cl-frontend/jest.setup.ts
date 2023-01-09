// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { default as i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { ENGLISH_US_LOCALE } from '@/constants/translations';

const { Response, Headers, Request } = require('whatwg-fetch');

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

beforeAll((): void => {
    void i18n.use(initReactI18next).init({
        lng: ENGLISH_US_LOCALE,
        interpolation: { escapeValue: false },
        resources: {},
        parseMissingKeyHandler: (key: string): string => {
            return i18n.language + ' ' + key;
        },
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
        set: (): void => {
            return;
        },
    });

    class LocalStorageMock {
        private store: { [key: string]: string } = {};
        public length: number = 0;

        public constructor() {
            this.store = {};
        }

        public clear(): void {
            this.store = {};
            this.length = 0;
        }

        public getItem(key: string): any {
            return this.store[key] || null;
        }

        public setItem(key: string, value: string): void {
            this.store[key] = String(value);
            this.length = Object.keys(this.store).length;
        }

        public removeItem(key: string): void {
            delete this.store[key];
            this.length = Object.keys(this.store).length;
        }

        public key(index: number): string | null {
            return this.store[index] || null;
        }
    }

    global.localStorage = new LocalStorageMock();
});

beforeEach((): void => {
    void i18n.changeLanguage(ENGLISH_US_LOCALE);
});
