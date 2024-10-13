<?php

namespace Elementum;

use Elementum;

/**
 * Responsible for keeping track of the amount of Crystals on: main pile, pile per player and general amount of crystals on spells.
 * Remembering which spell has how many crystals on it is responsibility of {@link CrystalsOnSpells}.
 */
class PlayerCrystals extends  \APP_DbObject
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
        $result = Elementum::get()->getCollectionFromDB($sql, true);
        Elementum::get()->dump("=========================================crystals per player", $result);
        $elo = array_map('intval', $result);
        Elementum::get()->dump("=========================================after conversion", $elo);
        return $elo;
    }

    public static function moveFromPlayerToMainPile(int $playerId)
    {
        $sql = "update crystals set amount = amount - 1 where owner = '$playerId'";
        Elementum::get()->DbQuery($sql);
        $sql = "update crystals set amount = amount + 1 where owner = 'pile'";
        Elementum::get()->DbQuery($sql);
    }

    public static function moveFromMainPileToPlayer(int $playerId)
    {
        $sql = "update crystals set amount = amount + 1 where owner = '$playerId'";
        Elementum::get()->DbQuery($sql);
        $sql = 'update crystals set amount = amount - 1 where owner = \'pile\'';
        Elementum::get()->DbQuery($sql);
    }

    public static function moveOneCrystalsFromAllPlayersBackToMainPile(array $playerIds)
    {
        $sql = 'update crystals set amount = amount - 1 where owner in (\'' . implode('\',\'', $playerIds) . '\')';
        Elementum::get()->DbQuery($sql);
        $sql = 'update crystals set amount = amount + ' . count($playerIds) . " where owner = 'pile'";
        Elementum::get()->DbQuery($sql);
    }

    public static function moveCrystalsFromSpellsToPile(int $amount)
    {
        $sql = 'update crystals set amount = amount + ' . $amount . " where owner = 'pile'";
        Elementum::get()->DbQuery($sql);
        $sql = 'update crystals set amount = amount - ' . $amount . " where owner = 'spells'";
        Elementum::get()->DbQuery($sql);
    }

    public static function moveFromPlayerPileToSpells(int $playerId, int $amount)
    {
        $sql = "update crystals set amount = amount - $amount where owner = '$playerId'";
        Elementum::get()->DbQuery($sql);
        $sql = "update crystals set amount = amount + $amount where owner = 'spells'";
        Elementum::get()->DbQuery($sql);
    }
}
