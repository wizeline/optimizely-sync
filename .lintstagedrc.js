module.exports = {
  '*.{css,js,json,md,ts}': 'prettier --write',
  '*.{js,ts}': 'eslint --fix',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
