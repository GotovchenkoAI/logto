import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseline = '6c005a2ed74c76756e1ede9daceea46770aa1c80';
const output = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const changed = new Set([
  ...output(['diff', '--name-only', baseline, '--']).split('\n'),
  ...output(['ls-files', '--others', '--exclude-standard']).split('\n'),
]);
changed.delete('');

const allowed = (path) =>
  path === 'DJINN_UPSTREAM.md' ||
  path === 'package.json' ||
  path === '.github/workflows/publish-djinn-experience.yml' ||
  path === '.scripts/verify-djinn-experience-boundary.mjs' ||
  path.startsWith('packages/experience/src/Layout/AppLayout/') ||
  path ===
    'packages/experience/src/containers/VerificationCode/use-sign-in-flow-code-verification.ts' ||
  path === 'packages/experience/src/containers/VerificationCode/index.test.tsx' ||
  path === 'packages/experience/src/components/IdentifierSignInForm/index.tsx' ||
  path === 'packages/experience/src/components/IdentifierSignInForm/index.test.tsx' ||
  path === 'packages/experience/src/pages/SignIn/index.tsx' ||
  path === 'packages/experience/src/pages/SignIn/index.test.tsx' ||
  path.startsWith('packages/phrases-experience/src/locales/ru/');

const forbidden = [...changed].filter((path) => !allowed(path));
if (forbidden.length > 0) {
  throw new Error(`Djinn fork crossed the Experience-only boundary:\n${forbidden.join('\n')}`);
}

const brand = readFileSync(
  'packages/experience/src/Layout/AppLayout/DjinnBrandPanel.tsx',
  'utf8'
);
if (/@logto\/schemas|@\/apis|useApi|oauth|oidc|verificationId/i.test(brand)) {
  throw new Error('The Djinn brand shell must not own authentication protocol logic');
}

console.log(`PASS: ${changed.size} changed paths stay inside the Djinn Experience boundary`);
