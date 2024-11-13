<?php

namespace Elementum\SpellEffects;

use Elementum;
use Elementum\Spells\ScoringContext;

if (!defined('SPELL_EFFECT_TYPES')) {
    define('NO_EFFECT_SPELL_EFFECT_TYPE', 'noEffect');
    define('EACH_SYMBOL_SPELL_EFFECT_TYPE', 'eachSymbol');
    define('EACH_PAIR_OF_SAME_ELEMENT_SPELL_EFFECT_TYPE', 'eachPairOfSameElement');
    define('EACH_PAIR_SPELL_EFFECT_TYPE', 'eachPair');
    define('EACH_TRIPLE_OF_SAME_ELEMENT_SPELL_EFFECT_TYPE', 'eachTripleOfSameElement');
    define('ANY_ADJACENCY_SPELL_EFFECT_TYPE', 'anyAdjacency');
    define('FULL_ADJACENCY_SPELL_EFFECT_TYPE', 'fullAdjacency');
    define('MAJORITY_SPELL_EFFECT_TYPE', 'majority');
    define('SURROUNDING_SPELL_EFFECT_TYPE', 'surrounding');
    define('DOUBLE_SYMBOL_SPELL_EFFECT_TYPE', 'doubleSymbol');
    define('QUADRUPLE_SYMBOL_SPELL_EFFECT_TYPE', 'quadrupleSymbol');
    define('TAKE_CRYSTAL_SPELL_EFFECT_TYPE', 'take_crystal');
    define('OVERLOAD_SPELL_EFFECT_TYPE', 'overload');
    define('FLAT_POINTS_SPELL_EFFECT_TYPE', 'flatPoints');
    define('DESTROY_SPELL_EFFECT_TYPE', 'destroy');
    define('CRUSH_CRYSTALS_SPELL_EFFECT_TYPE', 'crushCrystals');
    define('COLLECTION_SPELL_EFFECT_TYPE', 'collection');
    define('ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE', 'elementumFromOtherSpell');
    define('SET_OF_4_SPELL_EFFECT_TYPE', 'setOf4Elements');
    define('VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE', 'virtualElementSources');
    define('RESISTANCE_SPELL_EFFECT_TYPE', 'resistance');
    define('COPY_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE', 'copyImmediateSpell');
    define('COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE', 'copyNonImmediateSpell');
    define('MOST_FULL_ROWS_SPELL_EFFECT_TYPE', 'mostFullRows');
    define('MOST_INCOMPLETE_ROWS_SPELL_EFFECT_TYPE', 'mostIncompleteRows');
    define('POWER_IN_CRYSTALS_SPELL_EFFECT_TYPE', 'powerInCrystals');
    define('EXCHANGE_WITH_SPELL_POOL_SPELL_EFFECT_TYPE', 'exchangeWithSpellPool');
    define('CHANGE_DRAFT_ORDER_OR_WIN_A_DRAW_SPELL_EFFECT_TYPE', 'changeDraftOrderOrWinADraw');
    define('PLAY_TWO_SPELLS_SPELL_EFFECT_TYPE', 'playTwoSpells');
    define('ADD_FROM_SPELL_POOL_SPELL_EFFECT_TYPE', 'addFromSpellPool');
}

class SpellEffect
{
    public string $type;

    protected function __construct($type)
    {
        $this->type = $type;
    }

    //TODO: public abstract function calculateScore
    public function calculateScore(ScoringContext $context)
    {
        Elementum::get()->debug("NOT IMPLEMENTED YET: calculateScore for effect $this->type");
        Elementum::get()->dump("context", $context);
        return 0;
    }
}

class NoEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(NO_EFFECT_SPELL_EFFECT_TYPE);
    }

    public function calculateScore(ScoringContext $context)
    {
        return 0;
    }
}

/**
 * Additive will add extra points to the effect, exclusive will replace the effect with the empowered effect
 */
class EmpoweredSpellEffect
{
    public SpellEffect $effect;
    public bool $additive;
    private function __construct(SpellEffect $effect, bool $additive)
    {
        $this->effect = $effect;
        $this->additive = $additive;
    }

    public static function additive(SpellEffect $effect)
    {
        return new EmpoweredSpellEffect($effect, true);
    }

    public static function exclusive(SpellEffect $effect)
    {
        return new EmpoweredSpellEffect($effect, false);
    }
}

class EachSymbolEffect extends SpellEffect
{
    public string $element;
    public int $points;

    public function __construct(string $element, int $points)
    {
        parent::__construct(EACH_SYMBOL_SPELL_EFFECT_TYPE);
        $this->element = $element;
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        $result = $context->getCountOfElementForCurrentPlayer($this->element);
        return $result ? $this->points : 0;
    }
}

class EachPairEffect extends SpellEffect
{
    public string $firstElement;
    public string $secondElement;
    public int $points;

    public function __construct(string $firstElement, string $secondElement, int $points)
    {
        parent::__construct(EACH_PAIR_SPELL_EFFECT_TYPE);
        $this->firstElement = $firstElement;
        $this->secondElement = $secondElement;
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        $countForFirstElement = $context->getCountOfElementForCurrentPlayer($this->firstElement);
        $countForSecondElement = $context->getCountOfElementForCurrentPlayer($this->secondElement);
        $countOfPairsOfBothElement = min($countForFirstElement, $countForSecondElement);
        return $countOfPairsOfBothElement * $this->points;
    }
}

class EachTripleOfSameElementSpellEffect extends SpellEffect
{
    public string $element;
    public int $points;

    public function __construct(string $element, int $points)
    {
        parent::__construct(EACH_TRIPLE_OF_SAME_ELEMENT_SPELL_EFFECT_TYPE);
        $this->element = $element;
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        $count = $context->getCountOfElementForCurrentPlayer($this->element);
        return floor($count / 3) * $this->points;
    }
}

class AnyAdjacencySpellEffect extends SpellEffect
{
    public string $element;
    public int $points;

    public function __construct(string $element, int $points)
    {
        parent::__construct(ANY_ADJACENCY_SPELL_EFFECT_TYPE);
        $this->element = $element;
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context): int
    {
        $result = $context->isCurrentSpellAdjacentToElement($this->element);
        return $result ? $this->points : 0;
    }
}

class FullAdjacencySpellEffect extends SpellEffect
{
    public string $firstElement;
    public string $secondElement;
    public int $points;
    public function __construct(string $firstElement, string $secondElement, int $points)
    {
        parent::__construct(FULL_ADJACENCY_SPELL_EFFECT_TYPE);
        $this->firstElement = $firstElement;
        $this->secondElement = $secondElement;
        $this->points = $points;
    }


    public function calculateScore(ScoringContext $context): int
    {
        $firstElementAdjacent = $context->isCurrentSpellAdjacentToElement($this->firstElement);
        $secondElementAdjacent = $context->isCurrentSpellAdjacentToElement($this->secondElement);
        $bothAdjacent = $firstElementAdjacent && $secondElementAdjacent;
        return $bothAdjacent ? $this->points : 0;
    }
}

class MajorityEffect extends SpellEffect
{
    public string $element;
    public int $points;
    public function __construct(string $element, int $points)
    {
        parent::__construct(MAJORITY_SPELL_EFFECT_TYPE);
        $this->element = $element;
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        $result = $context->doesCurrentPlayerHaveMostOfElement($this->element);
        return $result ? $this->points : 0;
    }
}

class SurroundingEffect extends SpellEffect
{
    public int $pointsWhenSurroundedBy1Or2;
    public int $pointsWhenSurroundedBy3;
    public int $pointsWhenSurroundedBy4;

    public function __construct(int $pointsWhenSurroundedBy1Or2, int $pointsWhenSurroundedBy3, int $pointsWhenSurroundedBy4)
    {
        parent::__construct(SURROUNDING_SPELL_EFFECT_TYPE);
        $this->pointsWhenSurroundedBy1Or2 = $pointsWhenSurroundedBy1Or2;
        $this->pointsWhenSurroundedBy3 = $pointsWhenSurroundedBy3;
        $this->pointsWhenSurroundedBy4 = $pointsWhenSurroundedBy4;
    }

    public function calculateScore(ScoringContext $context)
    {
        $count = $context->howManySpellsIsCurrentSpellSurroundedBy();
        if ($count === 1 || $count === 2) {
            return $this->pointsWhenSurroundedBy1Or2;
        }
        if ($count === 3) {
            return $this->pointsWhenSurroundedBy3;
        }
        if ($count === 4) {
            return $this->pointsWhenSurroundedBy4;
        }
        return 0;
    }
}

class DoubleSymbolEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(DOUBLE_SYMBOL_SPELL_EFFECT_TYPE);
    }
}

class QuadrupleSymbolEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(QUADRUPLE_SYMBOL_SPELL_EFFECT_TYPE);
    }
}

class TakeCrystalEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(TAKE_CRYSTAL_SPELL_EFFECT_TYPE);
    }
}

class OverloadEffect extends SpellEffect
{
    public int $points;
    public function __construct(int $points)
    {
        parent::__construct(OVERLOAD_SPELL_EFFECT_TYPE);
        $this->points = $points;
    }
}

class FlatPointsSpellEffect extends SpellEffect
{
    public int $points;
    public function __construct(int $points)
    {
        parent::__construct(FLAT_POINTS_SPELL_EFFECT_TYPE);
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        return $this->points;
    }
}

class DestroySpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(DESTROY_SPELL_EFFECT_TYPE);
    }
}

class CrushCrystalsSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(CRUSH_CRYSTALS_SPELL_EFFECT_TYPE);
    }
}

class CollectionSpellEffect extends SpellEffect
{
    public $firstElement;
    public $secondElement;
    public $pointsWhen6Collected;
    public $pointsWhen8Collected;
    public $pointsWhen10Collected;
    public function __construct($firstElement, $secondElement, $pointsWhen6Collected, $pointsWhen8Collected, $pointsWhen10Collected)
    {
        parent::__construct(COLLECTION_SPELL_EFFECT_TYPE);
        $this->firstElement = $firstElement;
        $this->secondElement = $secondElement;
        $this->pointsWhen6Collected = $pointsWhen6Collected;
        $this->pointsWhen8Collected = $pointsWhen8Collected;
        $this->pointsWhen10Collected = $pointsWhen10Collected;
    }

    public function calculateScore(ScoringContext $context)
    {
        $countOfFirstElement = $context->getCountOfElementForCurrentPlayer($this->firstElement);
        $countOfSecondElement = $context->getCountOfElementForCurrentPlayer($this->secondElement);
        $totalCount = $countOfFirstElement + $countOfSecondElement;
        if ($totalCount >= 10) {
            return $this->pointsWhen10Collected;
        }
        if ($totalCount >= 8) {
            return $this->pointsWhen8Collected;
        }
        if ($totalCount >= 6) {
            return $this->pointsWhen6Collected;
        }
        return 0;
    }
}

class ElementumFromOtherSpellEffect extends SpellEffect
{
    public $pointsFactor;
    public function __construct($pointsFactor)
    {
        parent::__construct(ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE);
        $this->pointsFactor = $pointsFactor;
    }

    public function calculateScore(ScoringContext $context)
    {
        //TODO: is that the correct approach to get it from the context? 
        $score = $context->getScoreForSpellToGetPointsFrom();
        return $score * $this->pointsFactor;
    }
}

class SetOf4ElementsSpellEffect extends SpellEffect
{
    public $points;
    public function __construct($points)
    {
        parent::__construct(SET_OF_4_SPELL_EFFECT_TYPE);
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        $summary = $context->getCurrentBoardSummary();
        $minimum = $summary->getMinimumCountOfAnyElement();
        return  $minimum * $this->points;
    }
}

class VirtualElementSourcesSpellEffect extends SpellEffect
{
    public $amountOfVirtualSources;
    public function __construct($amountOfVirtualSources)
    {
        parent::__construct(VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE);
        $this->amountOfVirtualSources = $amountOfVirtualSources;
    }
}

class ResistanceSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(RESISTANCE_SPELL_EFFECT_TYPE);
    }
}

class CopyImmediateSpellSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(COPY_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE);
    }
}

class CopyNonImmediateSpellSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE);
    }

    public function calculateScore(ScoringContext $context)
    {
        //TODO:
        return 0;
    }
}

class MostFullRowsSpellEffect extends SpellEffect
{
    public $points;
    public function __construct($points)
    {
        parent::__construct(MOST_FULL_ROWS_SPELL_EFFECT_TYPE);
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        $result = $context->doesCurrentPlayerHaveHighestMinimumCountOfAnyElement();
        return $result ? $this->points : 0;
    }
}

class MostIncompleteRowsSpellEffect extends SpellEffect
{
    public $points;
    public function __construct($points)
    {
        parent::__construct(MOST_INCOMPLETE_ROWS_SPELL_EFFECT_TYPE);
        $this->points = $points;
    }

    public function calculateScore(ScoringContext $context)
    {
        //TODO: jak to ma działać dokładnie? co tu jest do sprawdzenia?
        return 0;
    }
}

class PowerInCrystalsSpellEffect extends SpellEffect
{
    public $pointsFor1Crystal;
    public $pointsFor2Crystals;
    public $pointsFor3Crystals;

    public function __construct($pointsFor1Crystal, $pointsFor2Crystals, $pointsFor3Crystals)
    {
        parent::__construct(POWER_IN_CRYSTALS_SPELL_EFFECT_TYPE);
        $this->pointsFor1Crystal = $pointsFor1Crystal;
        $this->pointsFor2Crystals = $pointsFor2Crystals;
        $this->pointsFor3Crystals = $pointsFor3Crystals;
    }

    public function calculateScore(ScoringContext $context)
    {
        $crystals = $context->howManyCrystalsAreOnCurrentSpell();
        if ($crystals === 1) {
            return $this->pointsFor1Crystal;
        }
        if ($crystals === 2) {
            return $this->pointsFor2Crystals;
        }
        if ($crystals === 3) {
            return $this->pointsFor3Crystals;
        }
        return 0;
    }
}

class ExchangeWithSpellPoolSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(EXCHANGE_WITH_SPELL_POOL_SPELL_EFFECT_TYPE);
    }
}

class ChangeDraftOrderOrWinADrawSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(CHANGE_DRAFT_ORDER_OR_WIN_A_DRAW_SPELL_EFFECT_TYPE);
    }
}

class PlayTwoSpellsSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(PLAY_TWO_SPELLS_SPELL_EFFECT_TYPE);
    }
}

class AddFromSpellPoolSpellEffect extends SpellEffect
{
    public function __construct()
    {
        parent::__construct(ADD_FROM_SPELL_POOL_SPELL_EFFECT_TYPE);
    }
}
