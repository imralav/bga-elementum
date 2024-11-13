<?php

namespace Elementum\Spells;

use Elementum;
use Elementum\ElementumGameLogic;
use Elementum\PlayerBoardSummary;

//TODO: implement all the methods here
class ScoringContext
{
    public int $currentPlayerId;
    public Spell $currentSpell;
    public ElementumGameLogic $logic;

    public function __construct(int $currentPlayerId, Spell $currentSpell)
    {
        $this->currentPlayerId = $currentPlayerId;
        $this->currentSpell = $currentSpell;
        $this->logic = ElementumGameLogic::restoreFromDB();
    }

    /**
     * Counts elements on spells, which can be more than just the amount of spell, as some effects
     * give multiple elements from single spell.
     */
    public function doesCurrentPlayerHaveMostOfElement(string $element): bool
    {
        $playerBoards = $this->logic->getPlayerBoards();
        $currentPlayerBoard = $playerBoards[$this->currentPlayerId];

        return false;
    }

    public function getCountOfElementForCurrentPlayer(string $element): int
    {
        return 0;
    }

    public function getCountOfElementForPlayer(int $playerId, string $element): int
    {
        $playerBoards = $this->logic->getPlayerBoards();
        $playerBoard = $playerBoards[$playerId];
        $spellsForElement = $playerBoard->getSpellsOfElement($element);
        $elementCounts = array_map(function ($spellNumber) {
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            return $spell->getAmountOfElements();
        }, $spellsForElement);

        return array_sum($elementCounts);
    }

    public function isCurrentSpellAdjacentToElement(string $element): bool
    {
        //current spell of current player
        return false;
    }

    public function howManySpellsIsCurrentSpellSurroundedBy(): int
    {
        return 0;
    }

    public function getScoreForSpellToGetPointsFrom(): int
    {
        return 0;
    }

    public function getCurrentBoardSummary(): PlayerBoardSummary
    {
        return PlayerBoardSummary::empty();
    }

    public function doesCurrentPlayerHaveHighestMinimumCountOfAnyElement(): bool
    {
        return false;
    }

    public function howManyCrystalsAreOnCurrentSpell(): int
    {
        return 0;
    }
}
