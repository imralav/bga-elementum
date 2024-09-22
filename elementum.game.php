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

use Elementum\Crystals;
use Elementum\PlayerMoveChoices\DraftChoices;
use Elementum\ElementumGameLogic;
use Elementum\Notifications;
use Elementum\PlayerMoveChoices\PickedSpells;
use \Bga\GameFramework\Actions\CheckAction;
use Elementum\Spells\Spell;

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
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
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

        /************ Start the game initialization *****/

        // Init global values with their initial values
        //$this->setGameStateInitialValue( 'my_first_global_variable', 0 );

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //$this->initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //$this->initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // TODO: setup the initial game situation here
        ElementumGameLogic::init2PlayerGame();
        $this->activeNextPlayer();
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

        $result = $this->getAllGameResults($result);
        return $result;
    }

    private function getAllGameResults($result)
    {
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $result['spellsLeftInDeck'] = $elementumGameLogic->getAmountOfSpellsLeftInDeck();
        $result['spellPool'] = $elementumGameLogic->getSpellPool();
        $result['crystalsPerPlayer'] = Crystals::getCrystalsPerPlayer();
        $result['crystalsInPile'] = Crystals::getAmountOfCrystalsOnPile();
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
        // TODO: compute and return the game progression

        return 0;
    }


    //////////////////////////////////////////////////////////////////////////////
    //////////// Utility functions
    ////////////    

    /**
     * @return \Elementum\Spells\Spell 
     */
    public static function getSpellByNumber($spellNumber)
    {
        return self::get()->allSpells[$spellNumber - 1];
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
        //TODO: dodać obsługę Universal Elementu i przejścia do statusu 33
        $currentPlayerId = $this->getCurrentPlayerId();
        $this->debug("Player played a Spell. Player id: $currentPlayerId");
        $pickedSpellNumber = PickedSpells::getPickedSpellOf($currentPlayerId);
        $pickedSpell = self::getSpellByNumber($pickedSpellNumber);
        DraftChoices::playPickedSpell($currentPlayerId);
        $this->notifyPlayer($currentPlayerId, 'spellPicked', 'You decided to play ${spellNumber}: ${spellName}', ['spellNumber' => $pickedSpellNumber, 'spellName' => $pickedSpell->name]);
        $this->finishDraftForPlayer($currentPlayerId);
    }

    private function finishDraftForPlayer(int $playerId)
    {
        $this->gamestate->unsetPrivateState($playerId);
        $this->gamestate->setPlayerNonMultiactive($playerId, 'everyPlayerMadeTheirChoice');
    }

    function actUseSpellPool(int $spellFromPoolNumber)
    {
        //TODO: dodać obsługę Universal Elementu i przejścia do statusu 33
        $currentPlayerId = $this->getCurrentPlayerId();
        $crystals = Crystals::getCrystalsFor($currentPlayerId);
        if ($crystals < 1) {
            throw new BgaUserException("You don't have enough crystals to use the Spell Pool");
        }
        $this->debug("Player decided to use spell pool. Spell number from the Pool: $spellFromPoolNumber, Player id: $currentPlayerId");
        $spellFromPool = self::getSpellByNumber($spellFromPoolNumber);
        $pickedSpellNumber = PickedSpells::getPickedSpellOf($currentPlayerId);
        $pickedSpell = self::getSpellByNumber($pickedSpellNumber);
        DraftChoices::useSpellPool($currentPlayerId, $spellFromPoolNumber);
        $this->notifyPlayer(
            $currentPlayerId,
            'spellPicked',
            'You decided to replace your ${pickedSpellNumber}:${pickedSpellName} with ${spellPoolSpellNumber}:${spellPoolSpellName} from the Spell Pool',
            [
                'pickedSpellNumber' => $pickedSpellNumber,
                'pickedSpellName' => $pickedSpell->name,
                'spellPoolSpellNumber' => $spellFromPoolNumber,
                'spellPoolSpellName' => $spellFromPool->name
            ]
        );
        $this->finishDraftForPlayer($currentPlayerId);
    }

    function actCancelSpellChoice()
    {
        $currentPlayerId = $this->getCurrentPlayerId();
        PickedSpells::cancelSpellPick($currentPlayerId);
        $this->debug("Player cancelled their spell choice. player id: $currentPlayerId");
        $this->gamestate->nextPrivateState($currentPlayerId, 'cancelSpellChoice');
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state arguments
    ////////////


    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    ////////////


    function st_prepareCurrentRound()
    {
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        $currentRound = $elementumGameLogic->getCurrentRound();
        $this->trace("=========== Preparing round " . $currentRound);
        if ($elementumGameLogic->isGameOver()) {
            //TODO: go to scoring state, for now let's just end the game
            $this->gamestate->nextState('gameEnd');
        } else {
            $elementumGameLogic->prepareCurrentRound();
            $this->notifyPlayersAboutNewHandOfSpells($elementumGameLogic);
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
        $logic->resolveAndPlaySpellPoolChoices();
        $logic->playPickedSpells();
        $logic->clearPlayerChoices();
        //3. TODO: rozwiązać natychmiastowe efekty (potrzebny dodatkowy input od gracza?)
        //4. TODO: przejście do statusu ustawiania power crystals
        //5. przejście do sprawdzenia rundy
        $this->gamestate->nextState('resolveImmediateEffects');
    }

    function st_immediateEffectsResolution()
    {
        $this->debug("Resolving immediate effects of spells");
        $this->gamestate->nextState('placingPowerCrystals');
    }

    function st_placingPowerCrystals()
    {
        //TODO: implement as another set of private states
        $this->debug("Placing power crystals on players boards");
        $this->gamestate->nextState('checkRoundEnd');
    }

    function st_checkRoundEndAndPassSpells()
    {
        $this->debug("Checking if the round has ended");
        $elementumGameLogic = ElementumGameLogic::restoreFromDB();
        if ($elementumGameLogic->havePlayersPlayedAllTheirSpells()) {
            $this->gamestate->nextState('nextRound');
        } else {
            if (!$elementumGameLogic->wasExtraTurnSpellPlayed()) {
                $spellPassingOrder = $this->getSpellPassingOrder();
                $elementumGameLogic->passSpells($spellPassingOrder);
                $this->notifyPlayersAboutNewHandOfSpells($elementumGameLogic);
            }
            $this->gamestate->nextState('nextDraft');
        }
    }

    private function getSpellPassingOrder()
    {
        $spellPassingOrder = $this->getNextPlayerTable();
        //TODO: in the future consider the direction of passing the spells
        // removing item with key 0 if present, as it is just the info about first player, we don't use it for passing spells
        if (array_key_exists(0, $spellPassingOrder)) {
            unset($spellPassingOrder[0]);
        }
        return $spellPassingOrder;
    }

    private function notifyPlayersAboutNewHandOfSpells($elementumGameLogic)
    {
        $players = $this->loadPlayersBasicInfos();
        foreach ($players as $player_id => $player) {
            $newHand = $elementumGameLogic->getHandOf($player_id);
            $newHand = array_values($newHand);
            Notifications::notifyPlayerAboutNewHand($newHand, $player_id);
        }
    }

    function st_scoring()
    {
        $this->debug("End scoring of the game");
        $this->gamestate->nextState('end');
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////// Zombie
    ////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn($state, $active_player)
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
