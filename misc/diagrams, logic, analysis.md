# General state diagram

```mermaid
---
title: Elementum state diagram
---
stateDiagram-v2
    [*] --> gameSetup
    gameSetup --> prepareCurrentRound
    prepareCurrentRound --> playersDraft
    playersDraft --> spellPoolConflictResolution
    spellPoolConflictResolution --> immediateEffectsResolution
    immediateEffectsResolution --> placingPowerCrystals
    placingPowerCrystals --> checkRoundEndAndPassSpells
    prepareCurrentRound --> scoring: if last round was played
    checkRoundEndAndPassSpells --> playersDraft: if round is not over
    checkRoundEndAndPassSpells --> prepareCurrentRound: if round is over
    scoring --> gameEnd
    gameEnd --> [*]
```

Need to confirm if immediate effects and power crystals placement happens before or after Spell 53 is played. Does it happen twice if this Spell is played, once for each played Spell? Or only once, after two spells are played? Can both Spells be replaced in Spell pool? Can one be played regularly and other be used to replace a Spell in Spell pool?

## Game setup

```mermaid
---
title: Game setup
---
flowchart LR
    prepareElementalCards[Prepare elemental cards] --> prepareSpellDeck[Prepare spell deck]
    prepareSpellDeck --> createSpellPool[Create spell pool]
    createSpellPool --> givePowerCrystals[Give power crystals]
    givePowerCrystals -- 2 players --> prepareDeckForDraft[Prepare deck for draft]
    givePowerCrystals -- 3 or 4 players --> putDraftOrderToken[Put draft order token]
    putDraftOrderToken --> prepareDeckForDraft
```

## Player draft

Each player goes through the following states privately, in parallel, independent of other players.

```mermaid
---
title: Internal, private states for each player during draft
---
stateDiagram-v2
state playersDraft {
    [*] --> spellChoice
    spellChoice --> spellDestinationChoice: pickSpell
    spellDestinationChoice --> waitingForOtherPlayersToPickSpell: playSpell
    spellDestinationChoice --> waitingForOtherPlayersToPickSpell: useSpellPool
    spellDestinationChoice --> spellChoice: cancelSpellChoice
    waitingForOtherPlayersToPickSpell --> [*]: every Player made their choice
    waitingForOtherPlayersToPickSpell --> spellDestinationChoice: cancelDraftChoice
}
```

Required params:

| Transition   | Params                                                           |
| ------------ | ---------------------------------------------------------------- |
| pickSpell    | Spell number                                                     |
| playSpell    | -                                                                |
| useSpellPool | Spell number from Spell Pool to replace it with the picked Spell |

It must be evident in the UI if current draft comes from playing Spell 53, which allows to pick two Spells, but `playersDraft` shouldn't be aware of it, because it doesn't change the behavior of the draft, it's just some UI thing. So there are no extra arguments in this state or any of the internal states
