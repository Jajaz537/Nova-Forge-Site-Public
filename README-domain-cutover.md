# modaryxmods.com cutover

Prepared branch for the future production domain `https://modaryxmods.com`.

Do not merge until all activation requirements in `domain-cutover.json` are satisfied.

Cloudflare Pages handles the static site. The Cloudflare zone for `modaryxmods.com` must be Active, the Pages custom domain must be attached, and HTTPS must be valid before production cutover.

The `www.modaryxmods.com` alias should redirect to the apex domain using a Cloudflare domain-level Redirect Rule; Cloudflare Pages `_redirects` does not support domain-level redirects.

DNSSEC must only be enabled after DNS, Pages and HTTPS are verified. `getnovaforge.com` must remain untouched until `modaryxmods.com` is fully validated end-to-end, including DNSSEC, and only then may the legacy Cloudflare configuration be removed.
