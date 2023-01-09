import classNames from 'classnames';

export function SecondaryHeaderTab({
    'data-testid': dataTestId,
    onClick,
    text,
    isActive,
}) {
    const tabClassNames: string = classNames({
        'border-b-4 pb-1/2 inline-block md:text-med whitespace-nowrap': true,
        'border-transparent hover:border-navy-200': !isActive,
        'border-teal-800': isActive,
    });

    return (
        <a className={tabClassNames} data-testid={dataTestId} onClick={onClick}>
            {text}
        </a>
    );
}
