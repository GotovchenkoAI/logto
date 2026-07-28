# Djinn Logto Experience

This repository is the upstream-tracking Djinn build of Logto. Authentication protocol logic
remains owned by Logto; Djinn changes are limited to the user-facing Experience shell and Russian
copy.

## Upstream baseline

- repository: `https://github.com/logto-io/logto`
- branch: `master`, unreleased (the last tag it carries is `v1.41.0`)
- commit: `defa67c4c5bc22b2f9c3d57b4408c8334665a5d6`

The production image must be built from this repository and pinned by digest. Upgrades merge a
fresh upstream point, keep the Experience-only patch on top, and rerun the Djinn one-code browser
contract before promotion.

The release build uses the upstream `Dockerfile` and produces a self-contained image: every
package, including core and its dependencies, comes from this tree.

Previously the release overlaid our compiled Experience bundle onto the official
`ghcr.io/logto-io/logto:1.41.0` image. That stopped being safe once core moved past the tag —
upstream took core to koa 3 and oidc-provider v9, and the official image still ships the
dependencies and sibling packages of 1.41.0. Overlaying a newer core onto them would leave the
build version-mismatched at runtime and short of the newer database migrations. Building the whole
image removes the mismatch, at the cost of a longer CI build and an image we own end to end rather
than a thin layer on the provider's.

## Boundary

Allowed Djinn-owned changes:

- layout, styles, icons and brand assets;
- Russian user-facing phrases;
- UI tests for those surfaces.
- narrow Experience orchestration that removes the separate registration choice: after Logto
  verifies an unknown email identifier, the existing Logto registration action continues with
  that same verification.

Not allowed here:

- OTP generation or verification;
- OIDC/OAuth transaction semantics;
- user linking or session logic;
- application authorization.

The unified email flow must not generate, inspect or verify OTP values itself. It may only react to
Logto's typed `user.user_not_exist` outcome and invoke Logto's existing
`registerWithVerifiedIdentifier` action. Terms acceptance remains enforced by Logto before account
creation.

One change sits outside Experience on purpose: `packages/core/src/middleware/koa-security-headers.ts`.
The sign-in screen is shown in a modal on our own site, and permission to frame it lives in a
response header that core assembles; upstream has no configuration hook for it.

## Reading the boundary

Upstream is merged into this branch rather than replayed onto it, so the diff against upstream is
exactly the Djinn patch:

```bash
git fetch upstream master
git diff --name-only upstream/master
```

Everything that lists should be Experience, Russian phrases, or the one core file named above.
Anything else is the fork quietly widening, and it will make the next upstream merge harder.
