import { Head, Html, Main, NextScript } from 'next/document';

import { GtmNoScriptSnippet } from '@/components/GtmNoScriptSnippet';
import { GtmSnippet } from '@/components/GtmSnippet';
import { NewRelicSnippet } from '@/components/NewRelicSnippet';
import { SailthruSnippet } from '@/components/SailthruSnippet';

export default function Document() {
    return (
        <Html>
            <Head>
                <NewRelicSnippet />
                <SailthruSnippet />
                <GtmSnippet />
            </Head>
            <body className="font-gellix">
                <Main />
                <NextScript />
                <GtmNoScriptSnippet />
            </body>
        </Html>
    );
}
