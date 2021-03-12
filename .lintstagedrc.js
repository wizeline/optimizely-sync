module.exports = {
  '*.{css,js,json,md,ts}': 'prettier --write',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
