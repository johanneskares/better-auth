Browser evidence for [Better Auth issue #11093](https://github.com/better-auth/better-auth/issues/11093) and [PR #11185](https://github.com/better-auth/better-auth/pull/11185).

Tested on September 5, 2026, using Chromium 152, separate browser sessions, and local in-memory SQLite databases. The test app used real Better Auth HTTP endpoints and the OAuth Provider browser client. No API responses were mocked. All displayed data is local test data.

Both builds used the same application callback from the PR's updated example. The original plugin source was `4d09d502254f1bfe65dafc8d813d803225429c4a`. The fixed source was `36ee4d32f6cb9af7e3f2c4f0c3bcd357aad37c22`.

- `before.png`: selecting Second Organization and continuing returned to selection twice. The active organization was saved, but the selection check still returned true.
- `after-consent.png`: the same steps with the PR code reached consent for Second Organization.
- `after.png`: accepting consent returned an authorization code with the expected state. The saved consent matched Second Organization.

Also verified: continuation with no selected organization stayed on selection. A new authorization after success asked for an organization again.

Scope: local reproduction through authorization-code issuance. This does not test a production app or token exchange.
