<?php

namespace Elementum;

use Elementum;

class ScoringExtraInput
{
    private const UNHANDLED_SPELLS_KEY = 'unhandledSpells';
    private const VIRTUAL_ELEMENTS_KEY = 'virtualElements';

    /**
     * @var array<string> list of spell effect types that require extra input
     */
    private const SPELLS_THAT_REQUIRE_EXTRA_INPUT = [ELEMENTUM_FROM_OTHER_SPELL_SPELL_EFFECT_TYPE, VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE, COPY_NON_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE];

    //TODO: it's weird that most operations are static, but there is still some instance field
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
        Elementum::get()->dump("=============unhandled spells", $unhandledSpells);
        if ($unhandledSpells === null) {
            $unhandledSpells = self::extractSpellsPlayedPerPlayerThatNeedExtraInput($playerBoards);
            Elementum::get()->dump("=============unhandled spells after extraction", $unhandledSpells);
            self::saveUnhandledSpells($unhandledSpells);
        }
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
    private static function extractSpellsPlayedPerPlayerThatNeedExtraInput(array $playerBoards): array
    {
        $spellsPlayedPerPlayer = [];
        foreach ($playerBoards as $playerId => $playerBoard) {
            $allSpellsForPlayer = $playerBoard->getAllPlayedSpells();
            Elementum::get()->dump("=============all spells for player $playerId", $allSpellsForPlayer);
            $filteredSpells = array_values(array_filter($allSpellsForPlayer, function ($spell) {
                $spell = Elementum::get()->getSpellByNumber($spell);
                return in_array($spell->effect->type, self::SPELLS_THAT_REQUIRE_EXTRA_INPUT);
            }));
            if (empty($filteredSpells)) {
                continue;
            }
            $spellsPlayedPerPlayer[$playerId] = $filteredSpells;
        }
        return $spellsPlayedPerPlayer;
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

    public static function rememberSpellToGetHalfThePoints(int $playerId, int $spellNumber) {}

    public static function rememberSpellToGetHalfThePointsNotPicked(int $playerId) {}

    /**
     * @param array<int, string> $virtualElements, map of spell number to element
     */
    public static function rememberVirtualElementSources(int $playerId, array $virtualElements)
    {
        self::handleVirtualElementSourcesSpell($playerId);
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
        self::handleVirtualElementSourcesSpell($playerId);
    }

    public static function handleVirtualElementSourcesSpell(int $playerId)
    {
        $unhandledSpells = self::getUnhandledSpells();
        $unhandledSpells[$playerId] = array_values(array_filter($unhandledSpells[$playerId], function ($spellNumber) {
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            return $spell->effect->type != VIRTUAL_ELEMENT_SOURCES_SPELL_EFFECT_TYPE;
        }));
        if (empty($unhandledSpells[$playerId])) {
            unset($unhandledSpells[$playerId]);
        }
        self::saveUnhandledSpells($unhandledSpells);
    }

    public static function rememberSpellToCopy(int $playerId, int $spellNumber) {}

    public static function rememberSpellToCopyNotPicked(int $playerId) {}
}
