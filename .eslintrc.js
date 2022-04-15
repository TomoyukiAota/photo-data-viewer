// prettier-ignore
module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'react/jsx-no-target-blank': ['error', {
      "allowReferrer": true, // Assuming noopener alone is enough because IE will sunset soon (as of writing this, which is April 2022).
    }],
    'react/self-closing-comp': ['error', {
      'component': true,
      'html': true,
    }],
  },
};
