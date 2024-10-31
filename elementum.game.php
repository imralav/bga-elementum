<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Elementum implementation : © <Your name here> <Your email address here>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * elementum.game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 *
 */

require_once(APP_GAMEMODULE_PATH . 'module/table/table.game.php');
require_once('modules/php/ElementumGameLogic.php');
require_once('modules/php/PlayerMoveChoices/PickedSpells.php');
require_once('modules/php/PlayerMoveChoices/DraftChoices.php');
require_once('modules/php/Spells/AddFromSpellPoolEffectContext.php');
require_once('modules/php/Spells/ExchangeWithSpellPoolEffectContext.php');
require_once('modules/php/Spells/PlayTwoSpellsEffectContext.php');
require_once('modules/php/CrystalsOnSpells.php');
require_once('modules/php/ScoringExtraInput.php');

use Elementum\PlayerCrystals;
use Elementum\PlayerMoveChoices\DraftChoices;
use Elementum\ElementumGameLogic;
use Elementum\Notifications;
use Elementum\PlayerMoveChoices\PickedSpells;
use \Bga\GameFramework\Actions\CheckAction;
use Elementum\ImmediateEffectsResolution;
use Elementum\SpellEffects\AddFromSpellPoolEffectContext;
use Elementum\SpellEffects\ExchangeWithSpellPoolEffectContext;
use Elementum\Spells\Spell;
use Elementum\Spells\SpellActivation;
use Elementum\CrystalsOnSpells;
use Elementum\Scoring;
use Elementum\ScoringExtraInput;
use Elementum\SpellEffects\PlayTwoSpellsEffectContext;

/**
 * TODO: fajne linki o typowaniu w PHP:
 * https://psalm.dev/articles/php-or-type-safety-pick-any-two
 * https://dev.to/anwar_nairi/reinforce-the-type-safety-of-your-php-arrays-fh7
 * https://developer.vonage.com/en/blog/type-safety-done-right-php-array-hacking
 */
class Elementum extends Table
{
    public $spellsExcludedIn2PlayerGame;
    public $basicSpells;
    public $allSpells;
    public static $instance = null;
    function __construct()
    {
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        self::$instance = $this;

        $this->initGameStateLabels(array(
            "currentRound" => 10,
        ));
    }

    public static function get()
    {
        return self::$instance;
    }

    protected function getGameName()
    {
        // Used for translations and stuff. Please do not modify.
        return "elementum";
    }

    public function getDeck()
    {
        return $this->getNew("module.common.deck");
    }

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame($players, $options = array())
    {
        $this->initiatePlayers($players);
        ElementumGameLogic::init2PlayerGame();
        $this->activeNextPlayer();
    }

    private function initiatePlayers($players)
    {
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach ($players as $player_id => $player) {
            $color = array_shift($default_colors);
            $values[] = "('" . $player_id . "','$color','" . $player['player_canal'] . "','" . addslashes($player['player_name']) . "','" . addslashes($player['player_avatar']) . "')";
        }
        $sql .= implode(',', $values);
        $this->DbQuery($sql);
        $this->reattributeColorsBasedOnPreferences($players, $gameinfos['player_colors']);
        $this->reloadPlayersBasicInfos();
    }

    /*
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();

        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = $this->getCollectionFromDb($sql);

        $result = $this->getElementumSpecificGameDatas($result);
        return $result;
    }

    private function getElementumSpecificGameDatas($result)
    {
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $result['spellsLeftInDeck'] = $elementumGameLogic->getAmountOfSpellsLeftInDeck();
        $result['spellPool'] = $elementumGameLogic->getSpellPool();
        $result['crystalsPerPlayer'] = PlayerCrystals::getCrystalsPerPlayer();
        $result['crystalsInPile'] = PlayerCrystals::getAmountOfCrystalsOnPile();
        $result['crystalsPerSpell'] = CrystalsOnSpells::getCrystalsOnSpells();
        $result['playerBoards'] = array_map(
            function ($playerBoards) {
                return array("board" => $playerBoards->board, "elementSources" => $playerBoards->elementSources);
            },
            $elementumGameLogic->getPlayerBoards()
        );

        $current_player_id = $this->getCurrentPlayerId();    // !! We must only return informations visible by this player !!
        $result['currentPlayerHand'] = $elementumGameLogic->getHandOf($current_player_id);
        $result['pickedSpell'] = PickedSpells::getPickedSpellOf($current_player_id);
        $result['allSpells'] = $this->allSpells;
        $result['currentRound'] = $elementumGameLogic->getCurrentRound();
        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        //TODO: 1. pamiętać z iloma kartami w talii rozpoczęto
        //TODO: 2. wyliczać ile kart zostało w talii / z iloma rozpoczęto
        return 0;
    }


    //////////////////////////////////////////////////////////////////////////////
    //////////// Utility functions
    ////////////    

    /**
     * @return \Elementum\Spells\Spell 
     */
    public static function getSpellByNumber($spellNumber): Spell
    {
        return self::get()->allSpells[$spellNumber - 1];
    }

    public static function isImmediateSpell(int $spellNumber)
    {
        return self::get()->allSpells[$spellNumber - 1]->spellActivation == SpellActivation::IMMEDIATE;
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Player actions
    //////////// 
    #[CheckAction(false)]
    function actCancelDraftChoice()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        DraftChoices::cancelDraftChoice($currentPlayerId);
        $this->debug("Player cancelled their draft choice. player id: $currentPlayerId");
        $this->gamestate->setPlayersMultiactive([$currentPlayerId], null);
        $this->gamestate->initializePrivateState($currentPlayerId);
    }

    function actPickSpell(int $spellNumber)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player picked a Spell. Spell number: $spellNumber player id: $currentPlayerId");
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        if ($elementumGameLogic->doesPlayerHaveSpellInHand($currentPlayerId, $spellNumber)) {
            PickedSpells::pickSpell($currentPlayerId, $spellNumber);
            $pickedSpell = self::getSpellByNumber($spellNumber);
            $this->notifyPlayer($currentPlayerId, 'spellPicked', 'You picked ${spellNumber}: ${spellName}', ['spellNumber' => $spellNumber, 'spellName' => $pickedSpell->name]);
            $this->gamestate->nextPrivateState($currentPlayerId, 'pickSpell');
        } else {
            throw new BgaUserException("You don't have the Spell $spellNumber in your hand");
        }
    }

    function actPlaySpell()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player played a Spell. Player id: $currentPlayerId");
        $pickedSpellNumber = PickedSpells::getPickedSpellOf($currentPlayerId);
        $pickedSpell = self::getSpellByNumber($pickedSpellNumber);
        DraftChoices::playPickedSpell($currentPlayerId);
        $this->notifyPlayer($currentPlayerId, 'spellPicked', 'You decided to play ${spellNumber}: ${spellName}', ['spellNumber' => $pickedSpellNumber, 'spellName' => $pickedSpell->name]);
        if ($pickedSpell->isUniversalElement()) {
            $this->gamestate->nextPrivateState($currentPlayerId, 'chooseUniversalElementDestination');
        } else {
            $this->finishDraftForPlayer($currentPlayerId);
        }
    }

    private function finishDraftForPlayer(int $playerId)
    {
        $this->gamestate->unsetPrivateState($playerId);
        $this->gamestate->setPlayerNonMultiactive($playerId, 'everyPlayerMadeTheirChoice');
    }

    function actUseSpellPool(int $spellFromPoolNumber)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $crystals = PlayerCrystals::getCrystalsFor($currentPlayerId);
        if ($crystals < 1) {
            throw new BgaUserException("You don't have enough crystals to use the Spell Pool");
        }
        $this->debug("Player decided to use spell pool. Spell number from the Pool: $spellFromPoolNumber, Player id: $currentPlayerId");
        $spellFromPool = self::getSpellByNumber($spellFromPoolNumber);
        $pickedSpellNumber = PickedSpells::getPickedSpellOf($currentPlayerId);
        $pickedSpell = self::getSpellByNumber($pickedSpellNumber);
        DraftChoices::useSpellPool($currentPlayerId, $spellFromPoolNumber);
        Notifications::notifyPlayerReplacingSpellPoolCard($pickedSpell, $spellFromPool, $currentPlayerId);
        if ($spellFromPool->isUniversalElement()) {
            $this->gamestate->nextPrivateState($currentPlayerId, 'chooseUniversalElementDestination');
        } else {
            $this->finishDraftForPlayer($currentPlayerId);
        }
    }

    function actCancelSpellChoice()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        PickedSpells::cancelSpellPick($currentPlayerId);
        $this->debug("Player cancelled their spell choice. player id: $currentPlayerId");
        $this->gamestate->nextPrivateState($currentPlayerId, 'cancelSpellChoice');
    }

    function actCancelDestinationChoice()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player cancelled their destination choice. player id: $currentPlayerId");
        $this->gamestate->nextPrivateState($currentPlayerId, 'cancelDestinationChoice');
    }

    function actPickTargetElement(string $element)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        // $pickedSpellNumber = PickedSpells::getPickedSpellOf($currentPlayerId);
        // $pickedSpell = self::getSpellByNumber($pickedSpellNumber);
        DraftChoices::pickTargetElement($currentPlayerId, $element);
        $this->debug("Player picked target element. Element: $element, Player id: $currentPlayerId");
        // $this->notifyPlayer($currentPlayerId, 'spellPlayedOnBoard', 'You played ${spellName} on your board', ['spellName' => $pickedSpell->name]);
        Notifications::notifyPlayerPickedAnElement($currentPlayerId, $element);
        $this->finishDraftForPlayer($currentPlayerId);
    }

    //////////////////////////////////////////////////////////////////////////////
    /////////// Actions for DestroyTarget effect
    ///////////
    function actSelectDestroyTarget(int $spellNumber, int $victimPlayerId)
    {
        $currentPlayerId = $this->getActivePlayerId();
        $this->debug("Player $currentPlayerId selected a Spell to destroy. Spell number: $spellNumber, Victim Player id: $victimPlayerId");
        $spell = self::getSpellByNumber($spellNumber);
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $elementumGameLogic->destroySpell($spellNumber, $victimPlayerId);
        $this->clearCrystalsFromDestroyedSpell($spellNumber);
        ImmediateEffectsResolution::spellResolvedFor($currentPlayerId);
        Notifications::notifyPlayerDestroyedSpell($currentPlayerId, $spell, $victimPlayerId);
        $this->gamestate->nextState('destroyTargetSelected');
    }

    private function clearCrystalsFromDestroyedSpell(int $spellNumber)
    {
        $crystalsToMove = CrystalsOnSpells::getCrystalsOnSpell($spellNumber);
        CrystalsOnSpells::removeAllCrystalsOnSpell($spellNumber);
        PlayerCrystals::moveCrystalsFromSpellsToPile($crystalsToMove);
    }

    //////////////////////////////////////////////////////////////////////////////
    /////////// Actions for AddFromSpellPool effect
    ///////////
    function actAddFromSpellPool_SelectSpell(int $spellNumber)
    {
        $activePlayerId = $this->getActivePlayerId();
        $this->debug("Player $activePlayerId is adding a spell from the spell pool. Spell number: $spellNumber");
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $spell = self::getSpellByNumber($spellNumber);
        if ($spell->isUniversalElement()) {
            AddFromSpellPoolEffectContext::rememberSelectedSpell($activePlayerId, $spellNumber);
            ImmediateEffectsResolution::spellResolvedFor($activePlayerId);
            $this->gamestate->nextState('universalSpellSelection');
        } else {
            $elementumGameLogic->addSpellFromPoolAtElement($activePlayerId, $spellNumber, $spell->element);
            Notifications::notifyPlayerAddedSpellFromPool($activePlayerId, $spell, $spell->element);
            ImmediateEffectsResolution::spellResolvedFor($activePlayerId);
            $this->gamestate->nextState('spellPoolSpellSelected');
        }
    }

    function actAddFromSpellPool_PickTargetElement(string $element)
    {
        $activePlayerId = $this->getActivePlayerId();
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $spellNumber = AddFromSpellPoolEffectContext::getSelectedSpell($activePlayerId);
        $spell = self::getSpellByNumber($spellNumber);
        $elementumGameLogic->addSpellFromPoolAtElement($activePlayerId, $spellNumber, $element);
        Notifications::notifyPlayerAddedSpellFromPool($activePlayerId, $spell, $element);
        ImmediateEffectsResolution::spellResolvedFor($activePlayerId);
        AddFromSpellPoolEffectContext::forgetSelectedSpell($activePlayerId);
        $this->gamestate->nextState('universalSpellDestination');
    }

    function actAddFromSpellPool_CancelDestinationChoice()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player cancelled their destination choice. player id: $currentPlayerId");
        $this->gamestate->nextState('cancel');
    }

    ///////////////////////////////////////////////////////////////////////////////
    /////////// Actions for CopyImmediateSpell effect
    ///////////
    function actCopyImmediateSpell_selectSpell(int $spellNumber)
    {
        $activePlayerId = $this->getActivePlayerId();
        $this->debug("Player $activePlayerId is copying an immediate spell. Spell number: $spellNumber");
        $spell = self::getSpellByNumber($spellNumber);
        if ($spell->isImmediate()) {
            ImmediateEffectsResolution::spellResolvedFor($activePlayerId);
            ImmediateEffectsResolution::addImmediateSpellToBeResolvedFirst($activePlayerId, $spellNumber);
            Notifications::notifyPlayerSelectedSpellToCopy($activePlayerId, $spell);
            $this->gamestate->nextState('spellCopied');
        } else {
            throw new BgaUserException("The selected spell is not an immediate spell");
        }
    }

    ///////////////////////////////////////////////////////////////////////////////
    /////////// Actions for ExchangeWithSpellPool effect
    ///////////
    function actExchangeWithSpellPool_SelectSpellOnBoard(int $spellNumber)
    {
        $activePlayerId = $this->getActivePlayerId();
        $this->debug("Player $activePlayerId is exchanging a spell with the spell pool. Spell number: $spellNumber");
        ExchangeWithSpellPoolEffectContext::rememberSelectedSpellOnBoard($activePlayerId, $spellNumber);
        $this->gamestate->nextState('spellOnBoardSelected');
    }

    function actExchangeWithSpellPool_SelectSpellFromPool(int $spellNumberFromPool)
    {
        $activePlayerId = $this->getActivePlayerId();
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $spellFromPool = self::getSpellByNumber($spellNumberFromPool);
        if ($spellFromPool->isUniversalElement()) {
            ExchangeWithSpellPoolEffectContext::rememberSelectedSpellFromPool($activePlayerId, $spellNumberFromPool);
            $this->gamestate->nextState('universalSpellDestination');
        } else {
            $spellNumberOnBoard = ExchangeWithSpellPoolEffectContext::getSelectedSpellOnBoard($activePlayerId);
            $spellOnBoard = self::getSpellByNumber($spellNumberOnBoard);
            $elementumGameLogic->exchangeSpellWithPoolAtElement($activePlayerId, $spellOnBoard, $spellFromPool, $spellFromPool->element);
            $this->moveCrystalsFromMovedSpellToPile($spellNumberOnBoard);
            Notifications::notifyPlayerExchangedSpellWithPool($activePlayerId, $spellOnBoard, $spellFromPool, $spellFromPool->element);
            ImmediateEffectsResolution::spellResolvedFor($activePlayerId);
            ExchangeWithSpellPoolEffectContext::forgetSelectedSpells($activePlayerId);
            $this->gamestate->nextState('spellsExchanged');
        }
    }

    function actExchangeWithSpellPool_CancelSpellOnBoardChoice()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player cancelled their spell pool exchange. player id: $currentPlayerId");
        $this->gamestate->nextState('cancel');
    }

    function actExchangeWithSpellPool_PickTargetElement(string $element)
    {
        $activePlayerId = $this->getActivePlayerId();
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $spellNumberFromPool = ExchangeWithSpellPoolEffectContext::getSelectedSpellFromPool($activePlayerId);
        $spellNumberOnBoard = ExchangeWithSpellPoolEffectContext::getSelectedSpellOnBoard($activePlayerId);
        $spellFromPool = self::getSpellByNumber($spellNumberFromPool);
        $spellOnBoard = self::getSpellByNumber($spellNumberOnBoard);
        $elementumGameLogic->exchangeSpellWithPoolAtElement($activePlayerId, $spellOnBoard, $spellFromPool, $element);
        $this->moveCrystalsFromMovedSpellToPile($spellNumberOnBoard);
        Notifications::notifyPlayerExchangedSpellWithPool($activePlayerId, $spellOnBoard, $spellFromPool, $element);
        ImmediateEffectsResolution::spellResolvedFor($activePlayerId);
        ExchangeWithSpellPoolEffectContext::forgetSelectedSpells($activePlayerId);
        $this->gamestate->nextState('spellsExchanged');
    }

    private function moveCrystalsFromMovedSpellToPile(int $spellNumber)
    {
        $crystalsToMove = CrystalsOnSpells::getCrystalsOnSpell($spellNumber);
        CrystalsOnSpells::removeAllCrystalsOnSpell($spellNumber);
        PlayerCrystals::moveCrystalsFromSpellsToPile($crystalsToMove);
    }

    function actExchangeWithSpellPool_CancelElementDestinationChoice()
    {
        $activePlayerId = $this->getActivePlayerId();
        $this->debug("Player cancelled their element destination choice. player id: $activePlayerId");
        $this->gamestate->nextState('cancel');
    }

    function actPlacePowerCrystal(int $spellNumber)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $spell = self::getSpellByNumber($spellNumber);
        if (!CrystalsOnSpells::canPutCrystalsOnSpell($spell)) {
            throw new BgaUserException("You can't place more crystals on this spell");
        }
        if (PlayerCrystals::getCrystalsPerPlayer()[$currentPlayerId] < 1) {
            throw new BgaUserException("You don't have any crystals to place");
        }
        $this->debug("Player $currentPlayerId is placing a power crystal on Spell number: $spellNumber");
        CrystalsOnSpells::putCrystalOnSpell($spellNumber);
        PlayerCrystals::moveFromPlayerPileToSpells($currentPlayerId, 1);
        Notifications::notifyPlayerPlacedPowerCrystal($currentPlayerId, $spell);
        $this->gamestate->setPlayerNonMultiactive($currentPlayerId, 'checkRoundEnd');
    }

    function actDontPlacePowerCrystal()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player $currentPlayerId decided to not place crystal");
        $this->gamestate->setPlayerNonMultiactive($currentPlayerId, 'checkRoundEnd');
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Actions for extra input collection before Scoring
    ////////////
    /**
     * Selects a spell as a target of Spell 13. Half of the points of the selected spell will be added to the player's score.
     * Selected spell must be a part of current player's board.
     */
    function actPickSpellToGetHalfThePoints(int $spellNumber)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player $currentPlayerId picked a Spell to get half the points. Spell number: $spellNumber");
        ScoringExtraInput::rememberSpellToGetHalfThePoints($currentPlayerId, $spellNumber);
        $this->gamestate->nextState('spellPicked');
    }

    function actDontPickSpellToGetHalfThePoints()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player $currentPlayerId decided to not pick a Spell to get half the points");
        ScoringExtraInput::rememberSpellToGetHalfThePointsNotPicked($currentPlayerId);
        $this->gamestate->nextState('spellNotPicked');
    }

    /**
     * @param array<int, string> $virtualElements, map of spell number to element. Max 2 items in the array,
     * as Spell 24 is limited to providing up to 2 virtual element sources.
     * Selected spells must be part of current player's board.
     * Player can chose to not pick any virtual element sources. Then the input array will be empty
     */
    function actPickVirtualElementSources(array $virtualElements)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player $currentPlayerId picked Virtual Element sources");
        if (empty($virtualElements)) {
            ScoringExtraInput::rememberVirtualElementSourcesNotPicked($currentPlayerId);
        } else {
            ScoringExtraInput::rememberVirtualElementSources($currentPlayerId, $virtualElements);
        }
        $this->gamestate->nextState('sourcesPicked');
    }

    /**
     * Selects a spell to copy its scoring activation. Selected spell can be a part of any board, but
     * it must have SCORING activation type.
     */
    function actPickSpellWithScoringActivationToCopy(int $spellNumber)
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player $currentPlayerId picked a Spell to copy. Spell number: $spellNumber");
        ScoringExtraInput::rememberSpellToCopy($currentPlayerId, $spellNumber);
        $this->gamestate->nextState('spellPicked');
    }

    function actDontPickSpellWithScoringActivationToCopy()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player $currentPlayerId decided to not pick a Spell to copy");
        ScoringExtraInput::rememberSpellToCopyNotPicked($currentPlayerId);
        $this->gamestate->nextState('spellNotPicked');
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state arguments
    ////////////

    function argPickVirtualElementSources()
    {
        $activePlayerId = $this->getActivePlayerId();
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        return [
            'virtualElements' => $elementumGameLogic->getVirtualElementSourcesFor($activePlayerId)
        ];
    }


    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    ////////////


    function st_prepareCurrentRound()
    {
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $currentRound = $elementumGameLogic->incrementAndGetCurrentRound();
        $this->trace("=========== Preparing round " . $currentRound);
        if ($elementumGameLogic->isGameOver()) {
            $this->gamestate->nextState('scoring');
        } else {
            $elementumGameLogic->prepareCurrentRound();
            Notifications::notifyPlayersAboutNewRound($currentRound);
            Notifications::notifyPlayersAboutNewHandOfSpells($elementumGameLogic);
            $this->gamestate->nextState('playersDraft');
        }
    }

    function st_playersDraft()
    {
        $this->gamestate->setAllPlayersMultiactive();
        $this->gamestate->initializePrivateStateForAllActivePlayers();
    }

    function st_placeSpellsOnBoards()
    {
        $logic = ElementumGameLogic::restoreFromDB();
        $spellsPlayedPerPlayerFromSpellPool = $logic->resolveAndPlaySpellPoolChoices();
        $spellsPlayedPerPlayerFromHand = $logic->playPickedSpells();
        $logic->clearPlayerChoices();
        /**
         * @var array<int, int> $allSpellsPlayedThisTurn
         */
        $allSpellsPlayedThisTurn = $spellsPlayedPerPlayerFromSpellPool + $spellsPlayedPerPlayerFromHand;
        ImmediateEffectsResolution::rememberImmediateSpellsPlayedThisTurn($allSpellsPlayedThisTurn);
        $this->gamestate->nextState('resolveImmediateEffects');
    }

    function st_immediateEffectsResolution()
    {
        $this->debug("Resolving immediate effects of spells");
        $resolver = ImmediateEffectsResolution::loadResolver();
        $resolver->resolveEffectsThatDontNeedPlayerInput();
        if ($resolver->noImmediateEffectsLeftToResolve()) {
            $this->gamestate->nextState('placingPowerCrystals');
        } else {
            $resolver->setupGameStateForNextImmediateEffect();
        }
    }

    function st_checkRoundEndAndPassSpells()
    {
        $this->debug("Checking if the round has ended");
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        if ($elementumGameLogic->havePlayersPlayedAllTheirSpells()) {
            $this->gamestate->nextState('nextRound');
        } else {
            if ($elementumGameLogic->wasExtraTurnSpellPlayed()) {
                Notifications::notifyAboutExtraTurn();
                PlayTwoSpellsEffectContext::clear();
                $this->gamestate->nextState('extraTurn');
            } else {
                $spellPassingOrder = $this->getSpellPassingOrder();
                $elementumGameLogic->passSpells($spellPassingOrder);
                Notifications::notifyPlayersAboutNewHandOfSpells($elementumGameLogic);
                $this->gamestate->nextState('passHand');
            }
        }
    }

    function st_copyImmediateSpell_checkIfThereIsSpellToCopy()
    {
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $this->debug("Checking if there are any immediate spells to copy");
        if ($elementumGameLogic->areThereAnyImmediateSpellsOnPlayerBoardsOrSpellPool()) {
            $this->debug("There are immediate spells to copy");
            return;
        }
        Notifications::notifyPlayerAboutNoSpellsToCopy($this->getActivePlayerId());
        ImmediateEffectsResolution::spellResolvedFor($this->getActivePlayerId());
        $this->gamestate->nextState('noSpellToCopy');
    }

    private function getSpellPassingOrder()
    {
        $spellPassingOrder = $this->getNextPlayerTable();
        //TODO: in the future consider the direction of passing the spells
        // removing item with key 0 if present, as it is just the info about first player, we don't use it for passing spells
        // TODO: remember that there is a card with immediate activation that changes the order of passing spells
        if (array_key_exists(0, $spellPassingOrder)) {
            unset($spellPassingOrder[0]);
        }
        return $spellPassingOrder;
    }

    function stScoringCheckExtraInputNeeded()
    {
        $this->debug("Checking if any extra input is needed for scoring");
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $playerBoards = $elementumGameLogic->getPlayerBoards();
        $scoringExtraInput = ScoringExtraInput::loadUnhandledSpells($playerBoards);
        if ($scoringExtraInput->areThereAnyUnhandledSpells()) {
            $scoringExtraInput->setupGameStateForNextExtraInputCollection();
        } else {
            $this->gamestate->nextState('noExtraInputNeeded');
        }
    }

    function stScoring()
    {
        $this->debug("Scoring");
        Scoring::calculateScores();
        $score = Scoring::getScores();
        Notifications::notifyPlayersAboutScore($score);
        $this->gamestate->nextState('endGame');
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Zombie
    ////////////
    /**
     * This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
     * You can do whatever you want in order to make sure the turn of this player ends appropriately
     * (ex: pass).
     *
     * Important: your zombie code will be called when the player leaves the game. This action is triggered
     * from the main site and propagated to the gameserver from a server, not from a browser.
     * As a consequence, there is no current player associated to this action. In your zombieTurn function,
     * you must _never_ use `getCurrentPlayerId()` or `getCurrentPlayerName()`, otherwise it will fail with a
     * "Not logged" error message.
     *
     * @param array{ type: string, name: string } $state
     * @param int $active_player
     * @return void
     */
    function zombieTurn(array $state, int $active_player): void
    {
        $statename = $state['name'];
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState("zombiePass");
                    break;
            }
            return;
        }
        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive($active_player, '');
            return;
        }
        throw new feException("Zombie mode not supported at this game state: " . $statename);
    }

    ///////////////////////////////////////////////////////////////////////////////////:
    ////////// DB upgrade
    //////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    function upgradeTableDb($from_version)
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345

        // Example:
        //        if( $from_version <= 1404301345 )
        //        {
        //            // ! important ! Use DBPREFIX_<table_name> for all tables
        //
        //            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
        //            $this->applyDbUpgradeToAllDB( $sql );
        //        }
        //        if( $from_version <= 1405061421 )
        //        {
        //            // ! important ! Use DBPREFIX_<table_name> for all tables
        //
        //            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
        //            $this->applyDbUpgradeToAllDB( $sql );
        //        }
        //        // Please add your future database scheme changes here
        //
        //


    }
}
