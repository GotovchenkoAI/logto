import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseline = '91e55698a42f99438cd41ec2b16a1fc51dbdab8a';
const output = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const changed = new Set([
  ...output(['diff', '--name-only', baseline, '--']).split('\n'),
  ...output(['ls-files', '--others', '--exclude-standard']).split('\n'),
]);
changed.delete('');

const allowed = (path) =>
  path === 'DJINN_UPSTREAM.md' ||
  path === 'Dockerfile.djinn-experience' ||
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

const dockerfile = readFileSync('Dockerfile.djinn-experience', 'utf8');
if (!dockerfile.includes('ARG LOGTO_BASE_IMAGE')) {
  throw new Error('The official Logto runtime image must be supplied explicitly');
}
const builderCopies = dockerfile
  .split('\n')
  .filter((line) => line.startsWith('COPY --from=experience-builder'));
if (
  builderCopies.length !== 2 ||
  !dockerfile.includes('/src/logto/packages/experience/dist') ||
  !dockerfile.includes('/etc/logto/packages/experience/dist') ||
  !dockerfile.includes('/src/logto/packages/phrases-experience/lib') ||
  !dockerfile.includes('/etc/logto/packages/phrases-experience/lib')
) {
  throw new Error(
    'The release image must overlay only the compiled Experience bundle and phrase pack'
  );
}

const brand = readFileSync(
  'packages/experience/src/Layout/AppLayout/DjinnBrandPanel.tsx',
  'utf8'
);
if (/@logto\/schemas|@\/apis|useApi|oauth|oidc|verificationId/i.test(brand)) {
  throw new Error('The Djinn brand shell must not own authentication protocol logic');
}

console.log(`PASS: ${changed.size} changed paths stay inside the Djinn Experience boundary`);
