<?php

namespace Elementum\PlayerMoveChoices;

use Elementum;

class DraftChoice
{
    protected $playerId;
    protected $choice;
    protected $spellPoolCardNumber;

    public function __construct($playerId, $choice, $spellPoolCardNumber = null)
    {
        $this->playerId = $playerId;
        $this->choice = $choice;
        $this->spellPoolCardNumber = $spellPoolCardNumber;
    }

    public function getPlayerId()
    {
        return $this->playerId;
    }

    public function getChoice()
    {
        return $this->choice;
    }

    public function getSpellPoolCardNumber()
    {
        return $this->spellPoolCardNumber;
    }
}

class DraftChoices extends \APP_DbObject
{
    public static function playPickedSpell($playerId)
    {
        Elementum::get()->DbQuery("INSERT INTO draftChoice (player_id, choice) VALUES ('{$playerId}', 'play')");
    }

    public static function useSpellPool($playerId, $spellPoolCardNumber)
    {
        Elementum::get()->DbQuery("INSERT INTO draftChoice (player_id, choice, spell_pool_card_number) VALUES ('{$playerId}', 'useSpellPool', '{$spellPoolCardNumber}')");
    }

    public static function cancelDraftChoice($playerId)
    {
        Elementum::get()->DbQuery("DELETE FROM draftChoice WHERE player_id = '{$playerId}'");
    }

    public static function getAllDraftChoices()
    {
        $results = Elementum::get()->getCollectionFromDB("SELECT player_id, choice, spell_pool_card_number FROM draftChoice");
        return self::mapResultsToDraftChoices($results);
    }

    private static function getAllByChoice($choice)
    {
        $results = Elementum::get()->getCollectionFromDB("SELECT player_id, choice, spell_pool_card_number FROM draftChoice WHERE choice = '{$choice}'");
        return self::mapResultsToDraftChoices($results);
    }

    private static function mapResultsToDraftChoices($results)
    {
        return array_map(function ($result) {
            return new DraftChoice(
                $result['player_id'],
                $result['choice'],
                $result['spell_pool_card_number'] ?? null
            );
        }, $results);
    }

    public static function getAllSpellPoolChoices()
    {
        return DraftChoices::getAllByChoice('useSpellPool');
    }

    public static function cancelAllDraftChoices()
    {
        Elementum::get()->DbQuery("DELETE FROM draftChoice");
    }

    public static function getAllThatChoseToPlaySpell()
    {
        return DraftChoices::getAllByChoice('play');
    }

    public static function hasNooneChosenToUseSpellPool()
    {
        $useSpellPoolChoices = DraftChoices::getAllSpellPoolChoices();
        return count($useSpellPoolChoices) === 0;
    }
}
