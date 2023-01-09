import { Prize } from '@/api/sweepstakes';

import { IPlasmicEntryImageProps } from './plasmic';
import { ISubprizes } from './strapi';

export interface IWithDataTestId {
    'data-testid'?: string;
}

export interface IWithClassName {
    className?: string;
}

export interface IImageProps {
    image: IPlasmicEntryImageProps;
    imageAlt: string;
}

export type IUseGetClosestSubprizeResponse = Prize & Omit<ISubprizes, 'id'>;
