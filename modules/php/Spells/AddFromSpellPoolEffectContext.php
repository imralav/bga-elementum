<?php

namespace Elementum\SpellEffects;

use Elementum;

class AddFromSpellPoolEffectContext
{
    private const SELECTED_SPELL_KEY = 'addFromSpellPool_selectedSpell';

    public static function rememberSelectedSpell(int $playerId, int $spellNumber)
    {
        Elementum::get()->globals->set(self::SELECTED_SPELL_KEY, ['playerId' => $playerId, 'spellNumber' => $spellNumber]);
    }

    public static function getSelectedSpell(int $playerId): int
    {
        $selectedSpell = Elementum::get()->globals->get(self::SELECTED_SPELL_KEY);
        return $selectedSpell['playerId'] === $playerId ? $selectedSpell['spellNumber'] : -1;
    }

    public static function forgetSelectedSpell()
    {
        Elementum::get()->globals->set(self::SELECTED_SPELL_KEY, null);
    }
}
