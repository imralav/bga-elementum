<?php

namespace Elementum;

use Elementum;
use Elementum\PlayerCrystals;
use Elementum\SpellEffects\PlayTwoSpellsEffectContext;

/**
 * Responsible for:
 * 1. Tracking which spells from last turn are immediate and need to be resolved
 * 2. Deciding what to do with each of those spells. Has deep knowledge of their effects and can decide which private state to start for each player.
 * 3. Collecting decisions from private states (e.g. which card to discard) and applying them to the game state.
 */
class ImmediateEffectsResolution
{
    /**
     * @var array<int, int> $immediateSpellsToResolve, maps Player ID to Spell Number
     */
    private array $immediateSpellsToResolve;

    /**
     * Constant for the key used to store spells played this turn in globals
     */
    private const IMMEDIATE_SPELLS_TO_RESOLVE_KEY = 'immediateSpellsToResolve';

    private const IMMEDIATE_EFFECTS_NOT_REQUIRING_PLAYER_INPUT = [
        TAKE_CRYSTAL_SPELL_EFFECT_TYPE,
        CRUSH_CRYSTALS_SPELL_EFFECT_TYPE,
        PLAY_TWO_SPELLS_SPELL_EFFECT_TYPE
    ];

    /**
     * @param array<int, int> $immediateSpellsToResolve, maps Player ID to Spell Number
     */
    public static function rememberImmediateSpellsPlayedThisTurn(array $immediateSpellsToResolve)
    {
        $immediateSpellsPlayedThisTurn = array_filter($immediateSpellsToResolve, function ($playerId) use ($immediateSpellsToResolve) {
            return Elementum::get()->isImmediateSpell($immediateSpellsToResolve[$playerId]);
        }, ARRAY_FILTER_USE_KEY);
        Elementum::get()->globals->set(self::IMMEDIATE_SPELLS_TO_RESOLVE_KEY, $immediateSpellsPlayedThisTurn);
    }

    public static function spellResolvedFor(int $playerId)
    {
        Elementum::get()->debug("====================Spell resolved for player $playerId");
        $immediateSpellsPlayedThisTurn = Elementum::get()->globals->get(self::IMMEDIATE_SPELLS_TO_RESOLVE_KEY);
        unset($immediateSpellsPlayedThisTurn[$playerId]);
        Elementum::get()->dump("====================immediateSpellsPlayedThisTurn to save", $immediateSpellsPlayedThisTurn);
        Elementum::get()->globals->set(self::IMMEDIATE_SPELLS_TO_RESOLVE_KEY, $immediateSpellsPlayedThisTurn);
    }

    public static function addImmediateSpellToBeResolvedFirst(int $playerId, int $spellNumber)
    {
        $immediateSpellsPlayedThisTurn = Elementum::get()->globals->get(self::IMMEDIATE_SPELLS_TO_RESOLVE_KEY);
        $newEntry = [$playerId => $spellNumber];
        $immediateSpellsPlayedThisTurn = $newEntry + $immediateSpellsPlayedThisTurn;
        Elementum::get()->globals->set(self::IMMEDIATE_SPELLS_TO_RESOLVE_KEY, $immediateSpellsPlayedThisTurn);
    }

    public function __construct()
    {
        $this->immediateSpellsToResolve = Elementum::get()->globals->get(self::IMMEDIATE_SPELLS_TO_RESOLVE_KEY);
    }

    public static function loadResolver()
    {
        return new ImmediateEffectsResolution();
    }

    public function noImmediateEffectsLeftToResolve()
    {
        Elementum::get()->dump("===============are there no immediate effects left to resolve?", $this->immediateSpellsToResolve);
        return empty($this->immediateSpellsToResolve);
    }

    public function resolveEffectsThatDontNeedPlayerInput()
    {
        $effectsRequiringInput = [];
        Elementum::get()->dump("===============spells to look for dont need player input", $this->immediateSpellsToResolve);
        foreach ($this->immediateSpellsToResolve as $playerId => $spellNumber) {
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            $effect = $spell->effect;
            if ($this->effectDoesNotRequirePlayerInput($effect->type)) {
                $this->resolveEffectNotRequiringPlayerInput($playerId, $effect->type);
            } else {
                $effectsRequiringInput[$playerId] = $spellNumber;
            }
        }
        $this->immediateSpellsToResolve = $effectsRequiringInput;
        Elementum::get()->dump("===============spells left to resolve", $this->immediateSpellsToResolve);
    }

    private function effectDoesNotRequirePlayerInput(string $effectType)
    {
        return in_array($effectType, self::IMMEDIATE_EFFECTS_NOT_REQUIRING_PLAYER_INPUT);
    }

    private function resolveEffectNotRequiringPlayerInput(int $playerId, string $effectType)
    {
        if ($effectType === TAKE_CRYSTAL_SPELL_EFFECT_TYPE) {
            PlayerCrystals::moveFromMainPileToPlayer($playerId);
            self::spellResolvedFor($playerId);
            Notifications::notifyPlayerTookCrystal($playerId);
        } else if ($effectType === CRUSH_CRYSTALS_SPELL_EFFECT_TYPE) {
            $allPlayers = Elementum::get()->loadPlayersBasicInfos();
            $allPlayerIds = array_keys($allPlayers);
            PlayerCrystals::moveOneCrystalsFromAllPlayersBackToMainPile($allPlayerIds);
            self::spellResolvedFor($playerId);
            Notifications::notifyEveryoneLostCrystal();
        } else if ($effectType === PLAY_TWO_SPELLS_SPELL_EFFECT_TYPE) {
            PlayTwoSpellsEffectContext::rememberEffectPlayedBy($playerId);
            self::spellResolvedFor($playerId);
        }
    }

    /**
     * This function will prepare the next state transition for the next player who needs to make a decision.
     */
    public function setupGameStateForNextImmediateEffect()
    {
        $nextPlayerId = array_key_first($this->immediateSpellsToResolve);
        $spellNumber = $this->immediateSpellsToResolve[$nextPlayerId];
        $spell = Elementum::get()->getSpellByNumber($spellNumber);
        $effect = $spell->effect;
        $elementum = Elementum::get();
        switch ($effect->type) {
            case DESTROY_SPELL_EFFECT_TYPE:
                $elementum->gamestate->changeActivePlayer($nextPlayerId);
                $elementum->gamestate->nextState('destroyTargetSelection');
                break;
            case ADD_FROM_SPELL_POOL_SPELL_EFFECT_TYPE:
                $elementum->gamestate->changeActivePlayer($nextPlayerId);
                $elementum->gamestate->nextState('addFromSpellPool');
                break;
            case COPY_IMMEDIATE_SPELL_SPELL_EFFECT_TYPE:
                $elementum->gamestate->changeActivePlayer($nextPlayerId);
                $elementum->gamestate->nextState('copyImmediateSpell');
                break;
            case EXCHANGE_WITH_SPELL_POOL_SPELL_EFFECT_TYPE:
                $elementum->gamestate->changeActivePlayer($nextPlayerId);
                $elementum->gamestate->nextState('exchangeWithSpellPool');
                break;
            default:
                $elementum->gamestate->nextState('placingPowerCrystals');
                break;
        }
    }
}
