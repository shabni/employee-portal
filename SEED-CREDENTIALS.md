# Seeded Workspace Accounts

These are fictional demo accounts created by `prisma/seed.ts`.

**Password for every account:** `PortalDemo2026!`

| Name | Role | Username |
| --- | --- | --- |
| Avery Morgan | Executive | `avery.executive` |
| Jordan Lee | Director | `jordan.director` |
| Taylor Reed | Manager | `taylor.manager1` |
| Morgan Diaz | Manager | `morgan.manager2` |
| Casey Nguyen | Team Lead, Pod 1 | `casey.nguyen` |
| Riley Patel | Team Lead, Pod 2 | `riley.patel` |
| Quinn Brooks | Team Lead, Pod 3 | `quinn.brooks` |
| Sam Rivera | Developer, Pod 1 | `sam.rivera.p1` |
| Alex Kim | Developer, Pod 1 | `alex.kim.p1` |
| Jamie Turner | Developer, Pod 1 | `jamie.turner.p1` |
| Robin Chen | QA, Pod 1 | `robin.chen.p1` |
| Cameron Price | QA, Pod 1 | `cameron.price.p1` |
| Drew Foster | Developer, Pod 2 | `drew.foster.p2` |
| Taylor Wu | Developer, Pod 2 | `taylor.wu.p2` |
| Reese Carter | Developer, Pod 2 | `reese.carter.p2` |
| Blair Adams | QA, Pod 2 | `blair.adams.p2` |
| Dakota Cruz | QA, Pod 2 | `dakota.cruz.p2` |
| Jordan Hayes | Developer, Pod 3 | `jordan.hayes.p3` |
| Finley Scott | Developer, Pod 3 | `finley.scott.p3` |
| Peyton Green | Developer, Pod 3 | `peyton.green.p3` |
| Skyler Ross | QA, Pod 3 | `skyler.ross.p3` |
| Emerson Ward | QA, Pod 3 | `emerson.ward.p3` |

## Reporting Structure

```text
Avery Morgan (Executive)
└── Jordan Lee (Director)
    ├── Taylor Reed (Manager)
    │   ├── Casey Nguyen (Team Lead, Pod 1)
    │   │   ├── Sam Rivera, Alex Kim, Jamie Turner (Developers)
    │   │   └── Robin Chen, Cameron Price (QA)
    │   └── Riley Patel (Team Lead, Pod 2)
    │       ├── Drew Foster, Taylor Wu, Reese Carter (Developers)
    │       └── Blair Adams, Dakota Cruz (QA)
    └── Morgan Diaz (Manager)
        └── Quinn Brooks (Team Lead, Pod 3)
            ├── Jordan Hayes, Finley Scott, Peyton Green (Developers)
            └── Skyler Ross, Emerson Ward (QA)
```

The seeder creates attendance, task tracks, and daily reports for weekdays in the last complete calendar month. It uses varied Los Angeles office times and deterministic fictional records, so rerunning it updates the same seed data without adding duplicates.
