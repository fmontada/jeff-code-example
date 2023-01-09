module.exports = {
    '**/*.{js,ts,tsx}': [
        'npm run prettier:write',
        () => 'tsc --noEmit --incremental false',
        'eslint --fix',
        'jest --bail --findRelatedTests',
    ],
    '**/*.css': ['npm run prettier:write'],
    '**/*.md': ['npm run prettier:write'],
};
