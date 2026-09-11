# MODARYX MODS — production domain cutover

## Current production identity
- Public brand: **MODARYX MODS**
- Canonical origin: **https://modaryxmods.com**
- Hosting: **Cloudflare Pages**
- Pages project: `nova-forge-site-public` (internal technical identifier retained for compatibility)
- Production branch: `main`

## Proven production state
- `modaryxmods.com` is attached to Cloudflare Pages and active.
- Apex DNS points to the Pages host through Cloudflare.
- HTTPS has been proven reachable over HTTP/2.
- HTTP/3 is temporarily disabled after a user-visible QUIC path problem; this does not change DNS or DNSSEC.
- Mail MX/TXT records were preserved during the apex repair.

## DNSSEC state
Cloudflare DNSSEC is enabled, but the cutover is **not fully green** until the registrar installs the exact DS and the parent `.com` delegation is independently verified.

Expected DS for `modaryxmods.com`:
- Key tag: `2371`
- Algorithm: `13`
- Digest type: `2` (SHA-256)
- Digest: `41EAF4EC426EA2CAEFD422B0C0C21EDEB2AFF73AD1C55F42508A9850E2903B20`

IONOS support has been asked to install that DS without changing nameservers. Do not reuse any DS from the abandoned domain.

## Old domain
`getnovaforge.com` has automatic renewal disabled. Its Cloudflare zone remains intentionally untouched until the new domain has full DNSSEC parent-chain proof and the MODARYX production site is stable.

## Safety rule
Do **not** remove the old Cloudflare zone, change authoritative nameservers, or declare DNSSEC fully green until registrar DS installation and parent-chain verification are proven.

The MODARYX VF design/content branch may continue independently while this registrar step is pending. DNSSEC is not a blocker for building and validating the new site surface.
