<?php

namespace Elementum\SpellEffects;

use Elementum;

class ExchangeWithSpellPoolEffectContext
{
    private const SELECTED_SPELL_ON_BOARD_KEY = 'exchangeWithSpellPool_selectedSpellOnBoard';
    private const SELECTED_SPELL_FROM_POOL_KEY = 'exchangeWithSpellPool_selectedSpellFromPool';

    public static function rememberSelectedSpellOnBoard(int $playerId, int $spellNumber)
    {
        Elementum::get()->globals->set(self::SELECTED_SPELL_ON_BOARD_KEY, ['playerId' => $playerId, 'spellNumber' => $spellNumber]);
    }

    public static function rememberSelectedSpellFromPool(int $playerId, int $spellNumber)
    {
        Elementum::get()->globals->set(self::SELECTED_SPELL_FROM_POOL_KEY, ['playerId' => $playerId, 'spellNumber' => $spellNumber]);
    }

    public static function getSelectedSpellOnBoard(int $playerId): int
    {
        $selectedSpell = Elementum::get()->globals->get(self::SELECTED_SPELL_ON_BOARD_KEY);
        return $selectedSpell['playerId'] === $playerId ? $selectedSpell['spellNumber'] : -1;
    }

    public static function getSelectedSpellFromPool(int $playerId): int
    {
        $selectedSpell = Elementum::get()->globals->get(self::SELECTED_SPELL_FROM_POOL_KEY);
        return $selectedSpell['playerId'] === $playerId ? $selectedSpell['spellNumber'] : -1;
    }

    public static function forgetSelectedSpells()
    {
        Elementum::get()->globals->set(self::SELECTED_SPELL_ON_BOARD_KEY, null);
        Elementum::get()->globals->set(self::SELECTED_SPELL_FROM_POOL_KEY, null);
    }
}
