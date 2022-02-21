// prettier-ignore
module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'react/self-closing-comp': ['error', {
      'component': true,
      'html': true,
    }],
  },
};
