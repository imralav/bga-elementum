<?php

namespace Elementum;

use Elementum;
use Elementum\Crystals;

/**
 * Responsible for:
 * 1. Tracking which spells from last turn are immediate and need to be resolved
 * 2. Deciding what to do with each of those spells. Has deep knowledge of their effects and can decide which private state to start for each player.
 * 3. Collecting decisions from private states (e.g. which card to discard) and applying them to the game state.
 */
class ImmediateEffectsResolution
{
    /**
     * @var array<int, int> $spellsPlayedThisTurn, maps Player ID to Spell Number
     */
    private array $spellsPlayedThisTurn;

    /**
     * Constant for the key used to store spells played this turn in globals
     */
    private const SPELLS_PLAYED_THIS_TURN_KEY = 'spellsPlayedThisTurn';

    private const IMMEDIATE_EFFECTS_NOT_REQUIRING_PLAYER_INPUT = [
        TAKE_CRYSTAL_SPELL_EFFECT_TYPE,
        CRUSH_CRYSTALS_SPELL_EFFECT_TYPE
    ];

    /**
     * @param array<int, int> $spellsPlayedThisTurn, maps Player ID to Spell Number
     */
    public static function rememberImmediateSpellsPlayedThisTurn(array $spellsPlayedThisTurn)
    {
        $immediateSpellsPlayedThisTurn = array_filter($spellsPlayedThisTurn, function ($playerId) use ($spellsPlayedThisTurn) {
            return Elementum::get()->isImmediateSpell($spellsPlayedThisTurn[$playerId]);
        }, ARRAY_FILTER_USE_KEY);
        Elementum::get()->globals->set(self::SPELLS_PLAYED_THIS_TURN_KEY, $immediateSpellsPlayedThisTurn);
    }

    public function __construct()
    {
        $this->spellsPlayedThisTurn = Elementum::get()->globals->get(self::SPELLS_PLAYED_THIS_TURN_KEY);
    }

    public static function loadResolver()
    {
        return new ImmediateEffectsResolution();
    }

    public function noImmediateEffectsLeftToResolve()
    {
        return empty($this->spellsPlayedThisTurn);
    }

    public function resolveEffectsThatDontNeedPlayerInput()
    {
        $effectsRequiringInput = [];
        foreach ($this->spellsPlayedThisTurn as $playerId => $spellNumber) {
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            $effect = $spell->effect;
            if ($this->effectDoesNotRequirePlayerInput($effect->type)) {
                $this->resolveEffectNotRequiringPlayerInput($playerId, $effect->type);
            } else {
                $effectsRequiringInput[$playerId] = $spellNumber;
            }
        }
        $this->spellsPlayedThisTurn = $effectsRequiringInput;
    }

    private function effectDoesNotRequirePlayerInput(string $effectType)
    {
        return in_array($effectType, self::IMMEDIATE_EFFECTS_NOT_REQUIRING_PLAYER_INPUT);
    }

    private function resolveEffectNotRequiringPlayerInput(int $playerId, string $effectType)
    {
        if ($effectType === TAKE_CRYSTAL_SPELL_EFFECT_TYPE) {
            Crystals::incrementFor($playerId);
            Notifications::notifyPlayerTookCrystal($playerId);
        } else if ($effectType === CRUSH_CRYSTALS_SPELL_EFFECT_TYPE) {
            $allPlayers = Elementum::get()->loadPlayersBasicInfos();
            $allPlayerIds = array_keys($allPlayers);
            Crystals::decrementMany($allPlayerIds);
            Notifications::notifyEveryoneLostCrystal();
        }
    }
}
