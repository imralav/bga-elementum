# Main tasks

0. How does Spell 24 work? It adds virtual element sources, but how does it work exactly?
1. Implement immediate card effects.
2. Implement empowering cards after playing them.
3. Implement passive card effects.
4. Scoring after all cards are finished. Waiting for information from game's author about the details unless I figure it out

# Refactorings

- Decide what to do with SQL access, active record or repository pattern? (Recently I tend to favor global variables instead of custom database tables)
- ElementumGameLogic turned out to be an unnecessary proxy. It should be split into smaller classes, dedicted to one task, like initiating game, tracking rounds and so on. Then it should be invoked directly from `elementum.game.php`. Or maybe command handler can be introduced, as most of the logic is related to state machine actions, and command handler seems like a good fit for it.

# Ideas after studying GosuX

1. More constants in material. State indexes, card indexes etc can be extracted to constants.

# To do:

0. Analyze scoring, see what new states are needed, whether they need to be taken during scoring, or can be done before scoring starts

   1.1. Analyze how to properly collect extra input for Spell 24

1. Scoring

2. Effects:

- ChangeDraftOrderOrWinADrawSpellEffect: it's a special case, it's both immediate and scoring effect
- Defense, card 26. It protects from negative effects, so need to add conditionality on all negative things like spell destruction and so on. Also add some indicator on UI.
- Spell 51. Is it possible to choose the draw to win? Or is it first draw that happens?

3. Game progression calculation

4. 3 and 4 player versions with turn order change

5. Putting real images from publisher

6. Translations

7. Reasonable logs for future bug fixing

8. Properly toggle clickability of spells on hand, board and in spell pool. Oftentimes they are clickable when they should not be. Use different effect for that. Right now spell get a bit bigger. Maybe add white shadow around them.

9. There was some bug that after copying an immediate spell, target spell being "destroy spell", the destroyed spell moved up to despawn, but didn't disappear. It was a bug.

10. OverloadEffect: do it somewhere in the future, it's an optional mode
