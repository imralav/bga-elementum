<?php

namespace Elementum\Utils;

use Elementum;

class Logger
{
    private static function buildPrefix()
    {
        $elementum = Elementum::get();
        $currentPlayerId = $elementum->getCurrentPlayerId();
        $activePlayerId = $elementum->getActivePlayerId();
        $state = $elementum->gamestate->state();
        return "[currentPlayerId: $currentPlayerId, activePlayerId: $activePlayerId, state: $state]";
    }

    public static function debug(string $message)
    {
        $prefix = self::buildPrefix();
        Elementum::get()->debug("$prefix $message");
    }
}
