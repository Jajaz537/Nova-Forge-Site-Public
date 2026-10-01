# MODARYX — preuve Full (strict) ciblé sur l'apex — 18 septembre 2026

Statut : **PASS — `modaryxmods.com` utilise Full (strict) via Configuration Rule ciblée**

Cette preuve concerne uniquement le hostname apex `modaryxmods.com`. Le mode SSL global de la zone reste **Full** afin de ne pas imposer Strict à `_domainconnect.modaryxmods.com`, qui pointe vers une origine IONOS distincte.

## Règle appliquée

- règle créée : oui
- expression exacte : `(http.host eq "modaryxmods.com")`
- action : SSL/TLS encryption mode = Strict
- Cloudflare Trace sur l'apex : **Matched**
- statut HTTP apex : **200 OK**

## Micro-preuve HTTPS

Fonctionnels après activation de la règle :
- `/`
- `/catalog.html`
- `/security.html`
- CSS
- JavaScript
- image

Aucune erreur observée parmi :
- 521
- 522
- 525
- 526

Aucun rollback nécessaire.

## Isolation de _domainconnect

- `_domainconnect.modaryxmods.com` ne matche pas la règle apex.
- le mode SSL global reste **Full**.
- Automatic SSL/TLS reste actif.
- DNS, DNSSEC, nameservers, IONOS et mail restent inchangés.

## Cas /games/

Le contrôle externe de `/games/` a retourné la page 404 MODARYX normale, sans erreur TLS.

Ce résultat ne remet pas en cause la preuve Full (strict) :
- `games/index.html` existe sur la branche candidate `design/modaryx-premium-hd-20260914-work` ;
- `games/index.html` est absent du `main` actuel `026b401328487db9382be67be194c5454ef958e6`.

Le 404 observé est donc cohérent avec l'état de livraison courant et doit être traité séparément du transport TLS.

## Conclusion

**PASS — `modaryxmods.com` utilise maintenant Full (strict) via Configuration Rule ciblée.**

Ce PASS est borné au transport TLS de l'apex. Il ne vaut ni PASS VF du site, ni fusion de la PR, ni validation des autres preuves externes.
