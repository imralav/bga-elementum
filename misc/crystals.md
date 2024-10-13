# General architecture

Each crystal pile is handled by a BGA Zone component.
There will be piles:

1. One main pile, main repository of crystals
2. Per player on player panel
3. Per spell, on each spell separately

Main pile and piles for players are initiated immediately on setup.
Piles for spells are initiated when a crystal is placed on a spell. If a spell is destroyed, the pile is destroyed as well and crystals go back to main pile.

# Crystals per spells

1. When loading a game, an array of spell number => crystal amount is received. According to it:

- piles on spells are created
- crystals are moved from main pile

2. When players puts a crystal on a spell:

- new pile on this spell is created if it doesn't exist
- crystal is moved from player's pile to spell's pile
