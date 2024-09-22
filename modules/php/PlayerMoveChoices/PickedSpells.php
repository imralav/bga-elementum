<?php

namespace Elementum\PlayerMoveChoices;

use Elementum;

class PickedSpells extends \APP_DbObject
{
    public static function pickSpell($playerId, $spellNumber)
    {
        self::cancelSpellPick($playerId);
        Elementum::get()->DbQuery("INSERT INTO pickedSpells (player_id, spell_number) VALUES ('{$playerId}', '{$spellNumber}')");
    }

    public static function getPickedSpells()
    {
        return Elementum::get()->getCollectionFromDB("SELECT player_id, spell_number FROM pickedSpells", true);
    }

    public static function getPickedSpellOf($playerId)
    {
        return Elementum::get()->getUniqueValueFromDB("SELECT spell_number FROM pickedSpells WHERE player_id = '{$playerId}'");
    }

    public static function unpickAllSpells()
    {
        Elementum::get()->DbQuery("DELETE FROM pickedSpells");
    }

    public static function cancelSpellPick($playerId)
    {
        Elementum::get()->DbQuery("DELETE FROM pickedSpells WHERE player_id = '{$playerId}'");
    }

    public static function cancelAllSpellPicks()
    {
        Elementum::get()->DbQuery("DELETE FROM pickedSpells");
    }
}
