// https://juejin.cn/post/6938687606687432740
module.exports = {
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/208
  plugins: [
    'prettier-plugin-packagejson'
    // 'prettier-plugin-organize-imports',
    // "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ['clsx'],
  tailwindConfig: './tailwind.config.ts',
  tabWidth: 2,
  trailingComma: 'none',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  endOfLine: 'lf',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  useTabs: false,
  bracketSameLine: false, // jsx括号换行
  arrowParens: 'always'
};
