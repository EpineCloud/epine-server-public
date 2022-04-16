module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  ignorePatterns: ['dist', 'src/openapi', 'docs', 'src/generated'],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
