import { OzLogo } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

export { getStaticProps } from '@/utils/serverSideProps';

export enum CreateAccountMessageTestIds {
    EMAIL_VERIFY_CONTAINER = 'email-verify-container',
    MESSAGE_CONTAINER = 'message-container',
    FOOTNOTE_CONTAINER = 'footnote-container',
}

export default function CreateAccountMessage() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const omazeEmail = process.env.NEXT_PUBLIC_OMAZE_EMAIL;

    return (
        <div
            className="text-gray-900 font-gellix"
            data-testid={CreateAccountMessageTestIds.EMAIL_VERIFY_CONTAINER}
        >
            <header className="bg-navy-900 flex items-center justify-center w-full h-8">
                <Link href="/">
                    <a>
                        <OzLogo />
                    </a>
                </Link>
            </header>
            <main className="flex flex-col items-center p-0 mx-3 mb-7 mt-12">
                <div className="mt-11">
                    <Image
                        src="/assets/images/Email-icon@2x.png"
                        alt={t('createAccountMessage.emailAlt')}
                        height={88}
                        width={88}
                    />
                </div>
                <h1
                    data-testid={CreateAccountMessageTestIds.MESSAGE_CONTAINER}
                    className="font-bold text-center text-xl mt-4 mb-12"
                >
                    {t('createAccountMessage.message')}
                </h1>
                <div
                    className="box-border bg-navy-100 mt-12 px-3 py-2 text-center text-sm font-medium"
                    data-testid={CreateAccountMessageTestIds.FOOTNOTE_CONTAINER}
                >
                    <p>{t('createAccountMessage.footNote.partOne')}</p>
                    <p>{t('createAccountMessage.footNote.partTwo')}</p>
                    <p>
                        <a
                            className="font-bold underline"
                            href={`mailto: ${omazeEmail}`}
                        >
                            {omazeEmail}
                        </a>
                        {t('createAccountMessage.footNote.partThree')}
                    </p>
                </div>
            </main>
        </div>
    );
}
