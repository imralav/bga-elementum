# General rules

1. Each player board is scored separately.
2. Spells are scored from left to right, column by column. So first column is scored first, then second column, etc.
3. Element sources loop back, so first column is connected to last column. It is important for neighbourhood scoring.
4. There are some spells that require extra player action. Described below.
5. Context of calculations is all player boards + depending on analysis below, extra decisions made by players.

# Handling extra player action

Cards that require extra player action:

## 13

player selects another card from his or her board and gets half of the points that the card is worth. Works only when empowered. Selected card also needs to be empowered.

## 24

Before scoring, I need to show the player all the cards that have neightbourhood effect, but it's not matched by the columns next to it. Player should choose which sides will get virtual element sources, making it possible to score the neightbourhood effect.

For example, fire spell with neighbouring air and water sources. If there are no air or water sources in the columns next to it, player can choose one or two of the sources to be matched by virtual element sources.
It doesn't have to be one card, it can be multiple cards. The limit is two element sources.

## 38

player selects another card "podczas punktacji" (card with a Goblet in the bottom left corner) and plays the card's effect.

# Solution

Each of those cards would probably need a dedicated state in the state machine.
To do: decide whether to enter those extra, dedicated states before scoring, or in the process of scoring.
Pros and cons:

1. Collecting extra data before scoring would simplify the scoring immensly, it's just necessary to remember those extra decisions.
2. Collecting extra data during scoring would mean saving current scoring state, which would be more complicated.
