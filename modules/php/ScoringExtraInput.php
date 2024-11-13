<?php

namespace Elementum;

use Elementum;
use Elementum\Spells\Spell;

class ScoringExtraInput
{
    private const UNHANDLED_SPELLS_KEY = 'unhandledSpells';
    private const VIRTUAL_ELEMENTS_KEY = 'virtualElements';
    private const ELEMENTUM_FROM_OTHER_SPELL_KEY = 'elementumFromOtherSpell';
    private const COPY_SCORING_SPELL_KEY = 'copyScoringSpell';

    /**
     * @var array<string> list of spell effect types that require extra input
     */
    private const SPELLS_THAT_REQUIRE_EXTRA_INPUT = [ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE, VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE, COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE];

    //TODO: it's weird that most operations are static, but there is still an instance field and some instance operations.
    //TODO: Rething it.
    /**
     * @param array<int, int[]> $unhandledSpells map of player id to a list of spell numbers that need extra input
     */
    private array $unhandledSpells;

    /**
     * @param array<int, int[]> $unhandledSpells map of player id to a list of spell numbers that need extra input
     */
    private function __construct(array $unhandledSpells)
    {
        $this->unhandledSpells = $unhandledSpells;
    }

    /**
     * @param array<int,PlayerBoard> $playerBoards
     */
    public static function loadUnhandledSpells(array $playerBoards): ScoringExtraInput
    {
        $unhandledSpells = self::getUnhandledSpells();
        if ($unhandledSpells === null) {
            $unhandledSpells = self::extractSpellsThatNeedExtraInput($playerBoards);
            self::saveUnhandledSpells($unhandledSpells);
        }
        Elementum::get()->dump("=============unhandled spells", $unhandledSpells);
        return new ScoringExtraInput($unhandledSpells);
    }

    /**
     * @return array<int, int[]> | null map of player id to a list of spell numbers that need extra input
     */
    private static function getUnhandledSpells(): array | null
    {
        return Elementum::get()->globals->get(self::UNHANDLED_SPELLS_KEY);
    }

    /**
     * @param array<int, int[]> $unhandledSpells map of player id to a list of spell numbers that need extra input
     */
    private static function saveUnhandledSpells(array $unhandledSpells)
    {
        Elementum::get()->globals->set(self::UNHANDLED_SPELLS_KEY, $unhandledSpells);
    }

    /**
     * @param array<int,PlayerBoard> $playerBoards
     * @return array<int, int[]> map of player id to a list of spell numbers that need extra input
     */
    private static function extractSpellsThatNeedExtraInput(array $playerBoards): array
    {
        $spellsPlayedPerPlayer = [];
        foreach ($playerBoards as $playerId => $playerBoard) {
            $allSpellsForPlayer = $playerBoard->getAllPlayedSpells();
            $filteredSpells = array_values(array_filter($allSpellsForPlayer, function ($spell) {
                $spell = Elementum::get()->getSpellByNumber($spell);
                if (!self::spellRequiresExtraInput($spell)) {
                    return false;
                }
                return self::extraConditionsMet($spell);
            }));
            if (empty($filteredSpells)) {
                continue;
            }
            $spellsPlayedPerPlayer[$playerId] = $filteredSpells;
        }
        return $spellsPlayedPerPlayer;
    }

    private static function spellRequiresExtraInput(Spell $spell): bool
    {
        $typesPresentInGivenSpell = array_filter(self::SPELLS_THAT_REQUIRE_EXTRA_INPUT, function ($effectType) use ($spell) {
            return $spell->hasEffectOfType($effectType) || $spell->hasEmpoweredEffectOfType($effectType);
        });
        return !empty($typesPresentInGivenSpell);
    }

    private static function extraConditionsMet(Spell $spell): bool
    {
        switch ($spell->effect->type) {
            case VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE:
                return Empowerment::isSpellEmpowered($spell);
            default:
                return true;
        }
    }

    public function areThereAnyUnhandledSpells()
    {
        return !empty($this->unhandledSpells);
    }

    public function setupGameStateForNextExtraInputCollection()
    {
        $firstPlayerWithUnhandledSpells = (int) array_key_first($this->unhandledSpells);
        Elementum::get()->dump("=============first player with unhandled spells", $firstPlayerWithUnhandledSpells);
        $firstPlayerUnhandledSpells = $this->unhandledSpells[$firstPlayerWithUnhandledSpells];
        Elementum::get()->dump("=============first player unhandled spells", $firstPlayerUnhandledSpells);
        $firstSpellToCollect = $firstPlayerUnhandledSpells[0];
        Elementum::get()->dump("=============first spell to collect", $firstSpellToCollect);
        $spell = Elementum::get()->getSpellByNumber($firstSpellToCollect);
        Elementum::get()->dump("=============spell to collect", $spell);
        $gamestate = Elementum::get()->gamestate;
        $gamestate->changeActivePlayer($firstPlayerWithUnhandledSpells);
        switch ($spell->effect->type) {
            case ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE:
                $gamestate->nextState('pickSpellToGetHalfThePoints');
                break;
            case VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE:
                $gamestate->nextState('pickVirtualElementSources');
                break;
            case COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE:
                $gamestate->nextState('pickSpellWithScoringActivationToCopy');
                break;
            default:
                $gamestate->nextState('noExtraInputNeeded');
                break;
        }
    }

    public static function rememberSpellToGetHalfThePoints(int $playerId, int $spellNumber)
    {
        self::spellHandled($playerId, ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE);
        self::saveSelectedSpellToGetPointsFrom($spellNumber);
    }

    private static function spellHandled(int $playerId, string $effectType)
    {
        $unhandledSpells = self::getUnhandledSpells();
        $unhandledSpells[$playerId] = array_values(array_filter($unhandledSpells[$playerId], function ($spellNumber) use ($effectType) {
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            return $spell->effect->type != $effectType;
        }));
        if (empty($unhandledSpells[$playerId])) {
            unset($unhandledSpells[$playerId]);
        }
        self::saveUnhandledSpells($unhandledSpells);
    }

    private static function saveSelectedSpellToGetPointsFrom(int $spellNumber)
    {
        Elementum::get()->globals->set(self::ELEMENTUM_FROM_OTHER_SPELL_KEY, $spellNumber);
    }

    public static function rememberSpellToGetHalfThePointsNotPicked(int $playerId)
    {
        self::spellHandled($playerId, ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE);
    }

    /**
     * @param array<int, string> $virtualElements, map of spell number to element
     */
    public static function rememberVirtualElementSources(int $playerId, array $virtualElements)
    {
        self::spellHandled($playerId, VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE);
        self::saveSelectedVirtualElementSources($virtualElements);
    }

    /**
     * @param array<int, string> $virtualElements, map of spell number to element
     */
    public static function saveSelectedVirtualElementSources(array $virtualElements)
    {
        Elementum::get()->globals->set(self::VIRTUAL_ELEMENTS_KEY, $virtualElements);
    }

    public static function rememberVirtualElementSourcesNotPicked(int $playerId)
    {
        self::spellHandled($playerId, VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE);
    }

    public static function rememberSpellToCopy(int $playerId, int $spellNumber)
    {
        Elementum::get()->globals->set(self::COPY_SCORING_SPELL_KEY, $spellNumber);
        self::spellHandled($playerId, COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE);
    }

    public static function rememberSpellToCopyNotPicked(int $playerId)
    {
        self::spellHandled($playerId, COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE);
    }
}
