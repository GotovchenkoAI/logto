# Djinn Logto Experience

This repository is the upstream-tracking Djinn build of Logto. Authentication protocol logic
remains owned by Logto; Djinn changes are limited to the user-facing Experience shell and Russian
copy.

## Upstream baseline

- repository: `https://github.com/logto-io/logto`
- tag: `v1.41.0`
- commit: `91e55698a42f99438cd41ec2b16a1fc51dbdab8a`

The production image must be built from this repository and pinned by digest. Upgrades start from a
fresh upstream tag, replay the small Experience-only patch, and rerun the Djinn one-code browser
contract before promotion.

The release build uses `Dockerfile.djinn-experience`. `LOGTO_BASE_IMAGE` is mandatory and must be
the official baseline with its resolved digest, for example
`ghcr.io/logto-io/logto:1.41.0@sha256:…`. The final stage overlays only the compiled Experience
bundle and its user-facing phrase pack on that provider image.

## Boundary

Allowed Djinn-owned changes:

- layout, styles, icons and brand assets;
- Russian user-facing phrases;
- UI tests for those surfaces.

Not allowed here:

- OTP generation or verification;
- OIDC/OAuth transaction semantics;
- user linking or session logic;
- application authorization.
