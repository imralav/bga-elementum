<?php

namespace Elementum;

use Elementum;
use Elementum\Spells\ScoringContext;

class Scoring
{
    /**
     * @return array<int, array<int, int>> map of player id to a map of spell number to score for given spell
     */
    public static function calculate()
    {
        $logic = ElementumGameLogic::restoreFromDB();
        $playerBoards = $logic->getPlayerBoards();
        $score = [];
        foreach ($playerBoards as $playerId => $playerBoard) {
            $score[$playerId] = [];
            $allSpellsForPlayer = $playerBoard->getAllPlayedSpells();
            foreach ($allSpellsForPlayer as $spellNumber) {
                $spell = Elementum::get()->getSpellByNumber($spellNumber);
                $context = new ScoringContext();
                $score[$playerId][$spellNumber] = $spell->calculateScore($context);
            }
        }
        return $score;
    }
}
