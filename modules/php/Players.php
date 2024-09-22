<?php

namespace Elementum;

require_once('Player.php');

use Elementum;
use Elementum\Player;

class Players
{
    public static function getPlayerById(int $playerId)
    {
        $playerData = Elementum::get()->loadPlayersBasicInfos()[$playerId];
        return self::mapPlayerDataToPlayer($playerData);
    }

    private static function mapPlayerDataToPlayer(array $playerData): Player
    {
        return new Player($playerData['player_no'], $playerData['player_id'], $playerData['player_name'], $playerData['player_color']);
    }

    public static function getAllPlayersBesides(int $playerId)
    {
        $players = Elementum::get()->loadPlayersBasicInfos();
        unset($players[$playerId]);
        return array_map(function ($playerData) {
            return self::mapPlayerDataToPlayer($playerData);
        }, $players);
    }
}
