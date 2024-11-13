# General rules

1. Each player board is scored separately, can be done in parallel.
2. Spells are scored from left to right, column by column. So first column is scored first, then second column, etc.
3. Element sources loop back, so first column is connected to last column. It is important for neighbourhood scoring.
4. There are some spells that require extra player action. Described below.
5. Context of calculations is all player boards + depending on analysis below, extra decisions made by players.
6. There are no effects that would change the shape of the board during scoring, so it's safe to make the extra actions before scoring.

# Handling extra player action

Cards that require extra player action:

## 13

player selects another card from his or her board and gets half of the points that the card is worth

State `pickSpellToGetHalfThePoints`.

## 24

Before scoring, I need to show the player all the cards that have neightbourhood effect, but it's not matched by the columns next to it. Player should choose which sides will get virtual element sources, making it possible to score the neightbourhood effect.

For example, fire spell with neighbouring air and water sources. If there are no air or water sources in the columns next to it, player can choose one or two of the sources to be matched by virtual element sources.
It doesn't have to be one card, it can be multiple cards. The limit is two element sources.

It must be empowered to work!

State `pickVirtualElementSources`.

## 38

player selects another card "podczas punktacji" (card with a Goblet in the bottom left corner) and plays the card's effect.

State `pickSpellWithScoringActivationToCopy`.

## Model for extra action state

Due to the fact that Spell 38 can select another card that needs extra action,

# Solution

Each of those cards would probably need a dedicated state in the state machine.
To do: decide whether to enter those extra, dedicated states before scoring, or in the process of scoring.
Pros and cons:

1. Collecting extra data before scoring would simplify the scoring immensly, it's just necessary to remember those extra decisions.
2. Collecting extra data during scoring would mean saving current scoring state, which would be more complicated.

# Flow of scoring

```
1. Collect extra input from players and remember choices, don't calculate anything yet.
2. For each player
    3. For each element source of this player
        4. For each spell of this source
            5. Calculate the score of the spell
                After step 1, every spell now has all the necessary data to calculate the score.
            6. Produce the event with the score of the spell
3. Return all the events to frontend and display scoring animation
4. After animation ends, end the game
    How to react after animation ends? Probably game should already end when returning the events, but UI will show this fact only after scoring animation ends. See how it's done in stone age.
```

# Context needed during scoring

1. Info about extra input taken before scoring for each spell that needed it.
2. Current player board to iterate through and calculate the score of each spell.

# Capabilities/questions

Each spell, during scoring, might need the following capabilities:

## How many Spells of element X are on current players board? How many spells of either X or Y are on current players board?

Example: Cards that count each symbol, like 1 Colligit. Then, for empowered effects that count every 3 elements too.
Another exampke: Spell 12, which counts both Earth and Water elements.

## How many pairs of element X and Y are on board?

Example: Cards that count pairs of symbols, like 3 Collatio.

## Is current spell next to two spells of specific X and Y elements?

This is including virtual element source from Spell 24. We consider only left and right direction here.

Example: Neightboring effects, like in 4 Vicinari

## Is current spell to the left or right of a spell of specific X element?

This is including virtual element source from Spell 24

Example: Spell 5

## Does current player have the most spells of element X?

This includes 1 free draw from spell 51.

Example: Spell 6

## How many spells are around current spell, in directions: up, down, left, right?

We don't care about which specific directions are filled, only how many of them are filled.

Example: Spell 7.

## How many elements does a given spell have?

Every spell counts as at least one element, but some spells have more.

Example: spell 8 counts as 2 Fire elements, which becomes 4 when empowered.

## What's the score of a given spell?

Spell 13 allows to select another spell and get half of its score. SPell 38 allows to copy the effect of another spell with activation "SCORING".

## How many sets of all elements are on the board?

Exampe: spell 23. We need to see how many full rows are there on the board. We can just take the min number of spells among all columns.

## Does current player have the most filled rows?

Example: spell 37. We need to see how many full rows are there on the board. We can just take the min number of spells among all columns. Then compare it to the same min number of spells on other players boards. If current player has the most, then score is added. (Remember about draw from spell 51)

## How many crystals are placed on this spell?

Example: Spell 39 is scored based on the number of crystals on it.

## How many columns are not fully filled?

Example: Spell 50 is tricky. I'll go with the interpretation that I am looking for the amount of columns without any spells.

It might mean instead that we should count the amount of columns that have less spells that the most filled column in given board. In case all of them are the same, the result is 0. If 3 of them have 3 spells and one of them has 2 spells, then the result is 1 and so on. Then we take the max among all the players.

TODO: confirm which way is correct.
