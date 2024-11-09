<?php

namespace Elementum;

use Elementum\Spells\Spell;

class Empowerment
{
    public static function isSpellEmpowered(Spell $spell): bool
    {
        if (!$spell->canBeEmpowered()) {
            return false;
        }
        $spellHasAtLeastOneCrystal = CrystalsOnSpells::getCrystalsOnSpell($spell->number) > 0;
        return $spellHasAtLeastOneCrystal;
    }
}
