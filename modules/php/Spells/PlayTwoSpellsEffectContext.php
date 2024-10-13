<?php

namespace Elementum\SpellEffects;

use Elementum;

class PlayTwoSpellsEffectContext
{
    private const CONTEXT_KEY = 'playTwoSpellsEffect_context';

    public static function rememberEffectPlayedBy(int $playerId)
    {
        Elementum::get()->globals->set(self::CONTEXT_KEY, ['playerId' => $playerId]);
    }

    public static function clear()
    {
        Elementum::get()->globals->set(self::CONTEXT_KEY, null);
    }

    public static function wasPlayed()
    {
        return Elementum::get()->globals->get(self::CONTEXT_KEY) !== null;
    }

    public static function getPlayerId()
    {
        $context = Elementum::get()->globals->get(self::CONTEXT_KEY);
        return $context['playerId'];
    }
}
