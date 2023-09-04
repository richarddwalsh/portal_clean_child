module.exports = {
    root: true,
    env: {
      browser: true,
      es2020: true,
      jquery:true
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
      ecmaVersion: 2020,
    },
    ignorePatterns: ["**/js/vendors/*.js","**/js/vendors/**/*.js","**/vendor/*.js","**/vendor/**/*.js"], // ignore externally added code
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      curly: 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    },
    settings: { },
  };
