const OFFSET = 10;
const RULES_OFFSET = 100;

function getTopPositionFromRef(ref): number {
    return ref.getBoundingClientRect().top + window.scrollY - OFFSET;
}

export function onSectionScrollUpdateNavigationIndex({
    heroImageRef,
    prizeDetailsRef,
    charityDetailsRef,
    sweepstakeRulesRef,
    donationVariantsRef,
    setActiveTabIndex,
}): void {
    const topHeroImageTopPosition = getTopPositionFromRef(heroImageRef);
    const prizeDetailsTopPosition = getTopPositionFromRef(prizeDetailsRef);
    const charityDetailsTopPosition = getTopPositionFromRef(charityDetailsRef);
    const sweepstakeRulesTopPosition =
        getTopPositionFromRef(sweepstakeRulesRef);
    const donationVariantTopPosition =
        getTopPositionFromRef(donationVariantsRef);

    if (
        window.scrollY >= topHeroImageTopPosition &&
        window.scrollY <= prizeDetailsTopPosition
    ) {
        setActiveTabIndex(0);
    }
    if (
        window.scrollY >= prizeDetailsTopPosition &&
        window.scrollY <= charityDetailsTopPosition
    ) {
        setActiveTabIndex(1);
    }
    if (
        window.scrollY >= charityDetailsTopPosition &&
        window.scrollY <= donationVariantTopPosition
    ) {
        setActiveTabIndex(2);
    }
    if (
        window.scrollY >= donationVariantTopPosition &&
        window.scrollY <= sweepstakeRulesTopPosition
    ) {
        setActiveTabIndex(-1);
    }
    if (window.scrollY >= sweepstakeRulesTopPosition - RULES_OFFSET) {
        setActiveTabIndex(3);
    }
}
