module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'pnpm run tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `pnpm eslint --fix ${filenames.join(' ')}`,
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `pnpm prettier --write ${filenames.join(' ')}`,
}
