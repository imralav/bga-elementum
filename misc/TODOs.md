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

- ChangeDraftOrderOrWinADrawSpellEffect: it's a special case, it's both immediate and scoring effect

2. Using PSR-4 autoloading standard for PHP

3. Game progression calculation

4. Scoring

5. 3 and 4 player versions with turn order change

6. Putting real images from publisher

7. OverloadEffect: do it somewhere in the future, it's an optional mode

## Done:

### Immediate effects:

- CrushCrystalsSpellEffect
- TakeCrystalSpellEffect
- DestroyCrystalSpellEffect
- AddSpellFromSpellPool
- CopyImmediateSpellEffect
- exchangeWithSpellPoolEffect
- playTwoSpellsEffect
