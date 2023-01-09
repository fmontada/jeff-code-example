import { Prize } from '@/api/sweepstakes';

function sortSubprizesByCloseDate(
    subprizeA: Prize,
    subprizeB: Prize,
    order: 'asc' | 'desc' = 'asc',
    closedAtEnd = true,
) {
    const isSubprizeAClosed = new Date(subprizeA.close_date) < new Date();
    const isSubprizeBClosed = new Date(subprizeB.close_date) < new Date();
    const compareWhichIsCloser =
        new Date(subprizeA.close_date).getTime() -
        new Date(subprizeB.close_date).getTime();

    const isDesc = order === 'desc';

    if (isSubprizeAClosed && closedAtEnd) {
        return isDesc ? -1 : 1;
    }

    if (isSubprizeBClosed && closedAtEnd) {
        return isDesc ? 1 : -1;
    }

    const orderMultiplier = isDesc ? -1 : 1;
    return compareWhichIsCloser * orderMultiplier;
}

export function sortSubprizesByCloseDateAscNoPushBack(
    subprizeA: Prize,
    subprizeB: Prize,
) {
    return sortSubprizesByCloseDate(subprizeA, subprizeB, 'asc', false);
}

export function sortSubprizesByCloseDateAsc(
    subprizeA: Prize,
    subprizeB: Prize,
) {
    return sortSubprizesByCloseDate(subprizeA, subprizeB, 'asc');
}

export function sortSubprizesByCloseDateDesc(
    subprizeA: Prize,
    subprizeB: Prize,
) {
    return sortSubprizesByCloseDate(subprizeA, subprizeB, 'desc');
}

export function filterSubprizeAfterDate(subprize: Prize, date: Date) {
    const isOpen = new Date(subprize.close_date) >= date;
    return isOpen;
}

export function filterOpenedSubprizes(subprize: Prize) {
    const today = new Date();
    return filterSubprizeAfterDate(subprize, today);
}
