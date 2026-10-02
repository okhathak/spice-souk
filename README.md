# Spice Souk (prototype)

A merge-and-serve puzzle game set in an Arabic spice market. Games Lab, started 2026-09-30.

- **Play:** open `index.html` in a browser (phone-sized works best). Single file, no build step.
- **Published copy:** https://claude.ai/artifact/LhfAPJRvTjiq3RpzsojunM
- **Loop:** open a sack for a spice pot → merge two of the same into the next spice (9 tiers:
  Cumin → Chili → Turmeric → Loomi → Cardamom → Cinnamon → Sumac → Saffron → Rose) → serve
  customers the spices their dish needs → coins, stars, levels.
- **Rewards:** combo within 15s, a souk chest every 5 stars, a stall decoration per level,
  new souks at level 4 (the Lantern Medina) and 7 (the Bazaar of Domes), daily gift, spice book with real facts.
- **Placeholders:** the "watch an ad" button is a 3-second stand-in; progress saves in the
  browser only.

## Not built yet
Shelf sorting (the second twist), a guided first level, balancing, title screen and icon,
real ads / in-app purchase, the iOS wrapper for the App Store.

## Home
Parked here until it has its own repository (`okhathak/spice-souk`, private). Move it there
and delete this folder when that exists.

## Souk duel (added 2026-09-30)

Tap **Duel**: one player starts a duel and gets a 4-digit code, friends join with it, and everyone plays the same tray and the same customers for 90 seconds. The winner gets +80 coins, everyone else +20. Live duels now work straight from the public link (updated 2026-10-02): the host taps **Start a duel → Send invite link**, friends open the link (`?duel=<code>`) and tap **Join**, up to 6 players. Phones connect to each other directly over WebRTC using [PeerJS](https://peerjs.com) (MIT, vendored as `peerjs.min.js`) and its free public signalling server; no account, no scores stored anywhere. A very strict network (some office or hotel Wi-Fi) can block the direct connection — mobile data usually works. Inside claude.ai the artifact `room` capability is used instead.

## Restock crate (added 2026-09-30)

Every 4 customers served, a spice crate arrives (the crate button pulses beside the chest). Sort 12 pots onto 4 shelves in 20 seconds: a streak of 3 or more earns extra coins per pot, a wrong shelf costs a second, and a crate sorted with no mistakes pays +20 coins and +5 energy. Crates never appear during a duel.

## Play online

https://okhathak.github.io/spice-souk/ (GitHub Pages, served from `main`). Solo play and live duels both work there.

## Challenge a friend (added 2026-10-01)

Tap **Duel → Play a challenge round**. After 90 seconds, put your name in and tap **Challenge a friend**: it shares (or copies) a link like `?c=<seed>-<score>-<name>`. The friend gets the same tray and the same customers, sees your score to beat, and can send theirs back. No account and no server; it works on GitHub Pages.

## Purpose, stakes and daily goals (added 2026-10-01)

- **Restore Jaddi Saeed's stall.** The hammer button (top right) opens the stall: 8 parts to restore with coins, each drawn on the stall, each with a line from Jaddi Saeed and a perk (customers wait longer, or tip more). Restore all 8 to travel on: the Old Spice Souq, then the Lantern Medina, then the Bazaar of Domes.
- **Stakes.** Customers served while smiling tip 25% (more with perks); served while frowning they pay 25% less; left too long they walk out and the combo breaks. From level 3, an occasional VIP pays double but waits less. Patience pauses while a menu is open or the app is in the background.
- **Daily goals.** The scroll shows three goals a day; finish all three for coins and energy, and a streak that grows the gift.

## Fight voices (added 2026-10-02)

When two customers argue in the line, you hear them: each one shouts in their own language using the phone's built-in speech voices (Arabic, Russian, Japanese, Korean, Chinese, Persian in their own script; French, Spanish, German, Portuguese, Italian, Turkish natively; romanised lines and English lines in an English voice, with an Indian, British or American accent where the phone has one). Women's and men's voices are pitched differently, and each customer always sounds the same. A line in a script the phone has no voice for stays silent rather than being misread. It follows the **Sound** switch; nothing is downloaded and nothing leaves the phone.

