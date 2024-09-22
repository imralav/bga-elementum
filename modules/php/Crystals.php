<?php

namespace Elementum;

use Elementum;

class Crystals extends  \APP_DbObject
{
    public const INITIAL_CRYSTALS_AMOUNT = 14;
    public const INITIAL_CRYSTALS_PER_PLAYER = 2;

    private function __construct() {}

    public static function initNewPile()
    {
        $sql = "insert into crystals (owner, amount) values ('pile', " . self::INITIAL_CRYSTALS_AMOUNT . ')';
        Elementum::get()->DbQuery($sql);
    }

    public static function dealInitialCrystalsTo($playerId)
    {
        $sql = 'insert into crystals (owner, amount) values (' . $playerId . ', ' . self::INITIAL_CRYSTALS_PER_PLAYER . ')';
        Elementum::get()->DbQuery($sql);
        $sql = 'update crystals set amount = amount - ' . self::INITIAL_CRYSTALS_PER_PLAYER . " where owner = 'pile'";
        Elementum::get()->DbQuery($sql);
    }

    public static function getCrystalsFor($playerId)
    {
        $sql = "select amount from crystals where owner = '$playerId'";
        return Elementum::get()->getUniqueValueFromDB($sql);
    }

    public static function getAmountOfCrystalsOnPile()
    {
        $sql = 'select amount from crystals where owner = \'pile\'';
        return intval(Elementum::get()->getUniqueValueFromDB($sql));
    }

    /**
     * @return array<int, int> [playerId => amount]
     */
    public static function getCrystalsPerPlayer()
    {
        $sql = 'select owner, amount from crystals where owner != \'pile\'';
        return Elementum::get()->getCollectionFromDB($sql, true);
    }

    public static function decrementFor($playerId)
    {
        $sql = "update crystals set amount = amount - 1 where owner = '$playerId'";
        Elementum::get()->DbQuery($sql);
        Crystals::incrementCrystalsOnPile();
    }

    private static function incrementCrystalsOnPile()
    {
        $sql = 'update crystals set amount = amount + 1 where owner = \'pile\'';
        Elementum::get()->DbQuery($sql);
    }
}
