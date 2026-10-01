# Spice Souk (prototype)

A merge-and-serve puzzle game set in an Arabic spice market. Games Lab, started 2026-09-30.

- **Play:** open `index.html` in a browser (phone-sized works best). Single file, no build step.
- **Published copy:** https://claude.ai/artifact/LhfAPJRvTjiq3RpzsojunM
- **Loop:** open a sack for a spice pot → merge two of the same into the next spice (9 tiers:
  Cumin → Chili → Turmeric → Loomi → Cardamom → Cinnamon → Sumac → Saffron → Rose) → serve
  customers the spices their dish needs → coins, stars, levels.
- **Rewards:** combo within 15s, a souk chest every 5 stars, a stall decoration per level,
  new souks at level 4 (Marrakech) and 7 (Istanbul), daily gift, spice book with real facts.
- **Placeholders:** the "watch an ad" button is a 3-second stand-in; progress saves in the
  browser only.

## Not built yet
Shelf sorting (the second twist), a guided first level, balancing, title screen and icon,
real ads / in-app purchase, the iOS wrapper for the App Store.

## Home
Parked here until it has its own repository (`okhathak/spice-souk`, private). Move it there
and delete this folder when that exists.

## Souk duel (added 2026-09-30)

Tap **Duel**: one player starts a duel and gets a 4-digit code, friends join with it, and everyone plays the same tray and the same customers for 90 seconds. The winner gets +80 coins, everyone else +20. Live duels need the game opened in claude.ai (it uses the artifact `room` capability); opened as a local file or on GitHub Pages, only **Practise alone** works.

## Restock crate (added 2026-09-30)

Every 4 customers served, a spice crate arrives (the crate button pulses beside the chest). Sort 12 pots onto 4 shelves in 20 seconds: a streak of 3 or more earns extra coins per pot, a wrong shelf costs a second, and a crate sorted with no mistakes pays +20 coins and +5 energy. Crates never appear during a duel.

## Play online

https://okhathak.github.io/spice-souk/ (GitHub Pages, served from `main`). Solo play works there; live duels need the game opened inside claude.ai.
