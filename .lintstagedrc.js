module.exports = {
  '*.{css,js,json,md,ts}': 'prettier --write',
  '*.{js,ts}': 'eslint --ext .js,.ts --max-warnings=0 --fix',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
