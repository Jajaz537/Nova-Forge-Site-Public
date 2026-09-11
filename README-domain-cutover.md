# getnovaforge.com cutover

Prepared branch for the future production domain `https://getnovaforge.com`.

Do not merge until all activation requirements in `domain-cutover.json` are satisfied.

Cloudflare Pages handles the static site. HTTPS must be active before production cutover. The `www.getnovaforge.com` alias must be redirected to the apex domain using a Cloudflare domain-level Redirect Rule; Cloudflare Pages `_redirects` does not support domain-level redirects.
