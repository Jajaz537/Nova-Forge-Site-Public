import json, sqlite3, pathlib, sys

root=pathlib.Path(".")
paths=[
 "migrations/0001_modaryx_dev_foundation.sql",
 "migrations/0002_modaryx_auth_sessions.sql",
 "migrations/0003_modaryx_moderation_publication.sql",
 "migrations/0004_modaryx_v2_core_model.sql",
]
db=sqlite3.connect(":memory:")
db.execute("PRAGMA foreign_keys = ON")
for p in paths:
    db.executescript((root/p).read_text(encoding="utf-8"))

tables={row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
expected=set(json.loads((root/"qa/modaryx-v2-d1-core-contract.json").read_text())["tables"])
missing=expected-tables
if missing: raise SystemExit("missing tables: "+",".join(sorted(missing)))

# V1 must still exist.
for name in ["modaryx_profiles","modaryx_community_submissions","modaryx_sessions","modaryx_moderation_receipts"]:
    if name not in tables: raise SystemExit("v1 table lost: "+name)

now="2026-10-06T08:30:00Z"
db.execute("INSERT INTO modaryx_v2_games VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
 "mx_game_aetherlands","aetherlands","Aetherlands","catalog-enabled","[]",'["1.4.2"]',"[]",'["mx_type_mod"]',"[]","[]","client",'{"manual":true}',"{}",now,now))
db.execute("INSERT INTO modaryx_v2_content_types VALUES (?,?,?,?,?,?,?,?)",(
 "mx_type_mod","mx_game_aetherlands","Mod","gameplay","contextual",'{"files":true}',now,now))
db.execute("INSERT INTO modaryx_v2_creators VALUES (?,?,?,?,?,?,?,?,?,?)",(
 "mx_creator_boreal",None,"atelier-boreal","Atelier Boréal","",None,"[]","unverified",now,now))
db.execute("INSERT INTO modaryx_v2_teams VALUES (?,?,?,?,?,?,?,?)",(
 "mx_team_boreal","Atelier Boréal","","public","[]","[]",now,now))
db.execute("INSERT INTO modaryx_v2_content_items VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
 "mx_content_dawn","sentiers-de-laube","Sentiers de l’aube","Résumé","Description","mx_game_aetherlands","mx_type_mod",
 '["mx_creator_boreal"]',"mx_team_boreal","[]",'["exploration"]',"published",None,None,"declared",None,"approved","public",None,now,now))
db.execute("INSERT INTO modaryx_v2_releases VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
 "mx_release_dawn_1","mx_content_dawn","1.0.0","stable","published",now,'["1.4.2"]',"[]",'["windows"]',"[]","client","Initial","verified","creator","available",1,None,"mx_receipt_release_001",now,now))
db.execute("UPDATE modaryx_v2_content_items SET current_release_id=? WHERE content_id=?",("mx_release_dawn_1","mx_content_dawn"))

# Fail-closed release distribution.
try:
    db.execute("INSERT INTO modaryx_v2_releases VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
     "mx_release_bad","mx_content_dawn","1.0.1","stable","withdrawn",now,"[]","[]","[]","[]","client","","declared",None,"withdrawn",1,"withdrawn",None,now,now))
    raise SystemExit("withdrawn downloadable release accepted")
except sqlite3.IntegrityError:
    pass

# Measured compatibility must carry a receipt.
try:
    db.execute("INSERT INTO modaryx_v2_compatibility_claims VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
      "mx_claim_bad","mx_content_dawn","mx_release_dawn_1","mx_game_aetherlands","1.4.2",None,"windows","client","compatible","measured",None,"test",now,""))
    raise SystemExit("measured claim without receipt accepted")
except sqlite3.IntegrityError:
    pass

# Verified provenance must carry a receipt.
try:
    db.execute("INSERT INTO modaryx_v2_file_artifacts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
      "mx_file_bad","mx_release_dawn_1","bad.zip","bad.zip",1,"application/zip",0,"a"*64,None,"absent",None,None,"verified",None,"available",1,now))
    raise SystemExit("verified provenance without receipt accepted")
except sqlite3.IntegrityError:
    pass

# Shared profile must carry consent receipt.
try:
    db.execute("INSERT INTO modaryx_v2_game_profiles VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",(
      "mx_game_profile_bad",None,"mx_game_aetherlands","1.4.2","[]","{}","[]","[]","local-only","shared-public",None,now,now))
    raise SystemExit("shared profile without consent accepted")
except sqlite3.IntegrityError:
    pass

# Duplicate dependency relation must fail.
db.execute("INSERT INTO modaryx_v2_content_items VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(
 "mx_content_core","core-lib","Core Lib","Résumé","Description","mx_game_aetherlands","mx_type_mod",
 '["mx_creator_boreal"]',None,"[]","[]","published",None,None,"declared",None,"approved","public",None,now,now))
dep=("mx_dep_1","mx_content_dawn",">=1","mx_content_core",">=1","required","Core","manifest","declared",now)
db.execute("INSERT INTO modaryx_v2_dependencies VALUES (?,?,?,?,?,?,?,?,?,?)",dep)
try:
    db.execute("INSERT INTO modaryx_v2_dependencies VALUES (?,?,?,?,?,?,?,?,?,?)",("mx_dep_2",)+dep[1:])
    raise SystemExit("duplicate dependency relation accepted")
except sqlite3.IntegrityError:
    pass

db.commit()
print("V2_D1_TABLE_COUNT",len(expected))
print("PASS_V2_D1_CORE_MIGRATION_LOCAL")
