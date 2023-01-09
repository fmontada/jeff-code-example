import { render, screen } from '@testing-library/react';
import { default as i18n } from 'i18next';
import { useTranslation } from 'next-i18next';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

function MockComponent() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    return <p>{t('footer.copyright')}</p>;
}

describe('i18n', () => {
    it('renders a component with the en-US string', () => {
        render(<MockComponent />);

        const footerCopyright = screen.getByText('en-US footer.copyright');
        expect(footerCopyright).toBeInTheDocument();
    });

    it('renders a component with the de-DE string', () => {
        void i18n.changeLanguage('de-DE');

        render(<MockComponent />);

        const footerCopyright = screen.getByText('de-DE footer.copyright');
        expect(footerCopyright).toBeInTheDocument();

        const englishFooterCopyright = screen.queryByText(
            'en-US footer.copyright',
        );
        expect(englishFooterCopyright).not.toBeInTheDocument();
    });
});
