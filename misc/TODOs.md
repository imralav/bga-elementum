# Main tasks

0. How does Spell 24 work? It adds virtual element sources, but how does it work exactly?
1. Implement immediate card effects.
2. Implement empowering cards after playing them.
3. Implement passive card effects.
4. Scoring after all cards are finished. Waiting for information from game's author about the details unless I figure it out

# Refactorings

- Decide what to do with SQL access, active record or repository pattern?
- Rethink frontend architecture, it might use some improvements.
  - Example: register listener on card only once, and then react to clicks differently based on status, somewhere else
- State pattern on frontend, state object updated on state enter/exit, state object has methods for each event, for example, how to react to a spell being clicked. When during spell picking state, it sends a request. Otherwise it is ignored

# Ideas after studying GosuX

1. More constants in material. State indexes, card indexes etc can be extracted to constants.

# Checklist of spell effects

## To do:

1. Immediate effects:

- playTwoSpellsEffect: it should probably be put at the end of spellsPlayedThisTurn
- ChangeDraftOrderOrWinADrawSpellEffect: it's a special case, it's both immediate and scoring effect
- OverloadEffect: do it somewhere in the future, it's an optional mode

2. Merge CrystalsOnSpells and PlayerCrystals. It should be one bigger JSON Structure saved in global variables.

3. Using PSR-4 autoloading standard for PHP

## Done:

### Immediate effects:

- CrushCrystalsSpellEffect
- TakeCrystalSpellEffect
- DestroyCrystalSpellEffect
- AddSpellFromSpellPool
- CopyImmediateSpellEffect
- exchangeWithSpellPoolEffect
