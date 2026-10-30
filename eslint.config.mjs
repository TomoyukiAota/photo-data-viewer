import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

export default [
  { ignores: ['.next*/**', '.claude/**', '.upgrade-artifacts/**', 'tests/**', 'node_modules/**'] },
  ...nextVitals,
  prettier,
  {
    rules: {
      'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
      'react/self-closing-comp': ['error', { component: true, html: true }],
    },
  },
];
