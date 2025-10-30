module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow commit subjects written in Russian (or any language) to retain
    // their natural capitalization instead of forcing lower-case English.
    'subject-case': [0],
  },
}