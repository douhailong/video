// https://juejin.cn/post/6938687606687432740
module.exports = {
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/208
  tailwindFunctions: ['clsx'],
  plugins: [
    'prettier-plugin-packagejson',
    // 提交前再打开格式化
    // 'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss'
  ],
  // tailwindConfig: './tailwind.config.ts',
  tabWidth: 2,
  trailingComma: 'none',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  endOfLine: 'lf',
  printWidth: 90,
  bracketSpacing: true,
  arrowParens: 'always',
  useTabs: false,
  bracketSameLine: false // jsx括号换行
};
