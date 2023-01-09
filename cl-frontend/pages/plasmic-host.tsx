import { PlasmicCanvasHost } from '@plasmicapp/loader-nextjs';
import Script from 'next/script';
import * as React from 'react';

import { PLASMIC } from '../plasmic-init';

export default function PlasmicHost() {
    return (
        PLASMIC && (
            <div>
                {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
                <Script
                    src="https://static1.plasmic.app/preamble.js"
                    strategy="beforeInteractive"
                />
                <PlasmicCanvasHost />
            </div>
        )
    );
}
