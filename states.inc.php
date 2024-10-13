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
 * states.inc.php
 *
 * Elementum game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: $this->checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!


$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array("" => 2)
    ),

    2 => array(
        "name" => "prepareCurrentRound",
        "description" => "Giving cards to players depending on amount of players and current round",
        "type" => "game",
        "action" => "st_prepareCurrentRound",
        "transitions" => array("playersDraft" => 3, 'scoring' => 8,)
    ),

    3 => array(
        "name" => "playersDraft",
        "description" => clienttranslate('Waiting for all players to make their draft choice.'),
        "descriptionmyturn" => clienttranslate('waiting for other players to make their draft choice.'),
        "type" => "multipleactiveplayer",
        "initialprivate" => 31,
        "action" => "st_playersDraft",
        "possibleactions" => ["actCancelDraftChoice"],
        "transitions" => ['everyPlayerMadeTheirChoice' => 4]
    ),

    31 => array(
        "name" => "spellChoice",
        "descriptionmyturn" => clienttranslate('${you} must pick a Spell from your hand.'),
        "type" => "private",
        "possibleactions" => ["actPickSpell"],
        "transitions" => ['pickSpell' => 32]
    ),

    32 => array(
        "name" => "spellDestinationChoice",
        "descriptionmyturn" => clienttranslate('${you} must choose what to do with your picked Spell.'),
        "type" => "private",
        "possibleactions" => ["actCancelSpellChoice", "actPlaySpell", "actUseSpellPool"],
        "transitions" => ['cancelSpellChoice' => 31, 'chooseUniversalElementDestination' => 33]
    ),

    33 => array(
        "name" => "universalElementSpellDestination",
        "descriptionmyturn" => clienttranslate('${you} must choose where to put your Universal Element Spell.'),
        "type" => "private",
        "possibleactions" => ["actCancelDestinationChoice", "actPickTargetElement"],
        "transitions" => ['cancelDestinationChoice' => 32]
    ),

    4 => array(
        "name" => "placeSpellsOnBoards",
        "description" => "Placing picked spells on players boards and resolving immediate effects",
        "type" => "game",
        "action" => "st_placeSpellsOnBoards",
        "transitions" => ['resolveImmediateEffects' => 5]
    ),

    5 => array(
        "name" => "immediateEffectsResolution",
        "description" => "Resolving immediate effects of spells",
        "type" => "game",
        "action" => "st_immediateEffectsResolution",
        "transitions" => ['placingPowerCrystals' => 6, 'destroyTargetSelection' => 51, 'addFromSpellPool' => 52, 'copyImmediateSpell' => 54, 'exchangeWithSpellPool' => 55, 'playTwoSpells' => 3]
    ),

    //////////////////////////////////////////////////////////////////////////////
    /////////// immediate effect: destroy target
    ///////////
    51 => array(
        "name" => "destroyTargetSelection",
        "description" => clienttranslate('${actplayer} is selecting a Spell to destroy'),
        "descriptionmyturn" => clienttranslate('${you} must select a Spell to destroy'),
        "type" => "activeplayer",
        "possibleactions" => ["actSelectDestroyTarget"],
        "transitions" => ['destroyTargetSelected' => 5]
    ),


    //////////////////////////////////////////////////////////////////////////////
    /////////// immediate effect: add from spell pool
    ///////////
    52 => array(
        "name" => "addFromSpellPool_spellSelection",
        "description" => clienttranslate('${actplayer} is selecting a Spell from the Spell Pool'),
        "descriptionmyturn" => clienttranslate('${you} must select a Spell from the Spell Pool'),
        "type" => "activeplayer",
        "possibleactions" => ["actAddFromSpellPool_SelectSpell"],
        "transitions" => ['spellPoolSpellSelected' => 5, 'universalSpellSelection' => 53]
    ),

    53 => array(
        "name" => "addFromSpellPool_universalElementSpellDestination",
        "description" => clienttranslate('${actplayer} is selecting where to put Universal Spell'),
        "descriptionmyturn" => clienttranslate('${you} must select where to put Universal Spell'),
        "type" => "activeplayer",
        "possibleactions" => ["actAddFromSpellPool_PickTargetElement", "actAddFromSpellPool_CancelDestinationChoice"],
        "transitions" => ['universalSpellDestination' => 5, 'cancel' => 52]
    ),

    //////////////////////////////////////////////////////////////////////////////
    /////////// immediate effect: copy immediate spell
    ///////////
    54 => array(
        "name" => "copyImmediateSpell_spellSelection",
        "description" => clienttranslate('${actplayer} is selecting a Spell to copy'),
        "descriptionmyturn" => clienttranslate('${you} must select a Spell to copy'),
        "type" => "activeplayer",
        "action" => "st_copyImmediateSpell_checkIfThereIsSpellToCopy",
        "possibleactions" => ["actCopyImmediateSpell_selectSpell"],
        "transitions" => ['spellCopied' => 5, 'noSpellToCopy' => 5]
    ),

    ///////////////////////////////////////////////////////////////////////////////
    /////////// immediate effect: exchange with spell pool
    ///////////
    55 => array(
        "name" => "exchangeWithSpellPool_spellOnBoardSelection",
        "description" => clienttranslate('${actplayer} is selecting a Spell to exchange with the Spell Pool'),
        "descriptionmyturn" => clienttranslate('${you} must select a Spell to exchange with the Spell Pool'),
        "type" => "activeplayer",
        "possibleactions" => ["actExchangeWithSpellPool_SelectSpellOnBoard"],
        "transitions" => ['spellOnBoardSelected' => 56]
    ),

    56 => array(
        "name" => "exchangeWithSpellPool_spellFromSpellPoolSelection",
        "description" => clienttranslate('${actplayer} is selecting a Spell from Spell Pool'),
        "descriptionmyturn" => clienttranslate('${you} must select a Spell from Spell Pool'),
        "type" => "activeplayer",
        "possibleactions" => ["actExchangeWithSpellPool_SelectSpellFromPool", "actExchangeWithSpellPool_CancelSpellOnBoardChoice"],
        "transitions" => ['spellsExchanged' => 5, 'universalSpellDestination' => 57, 'cancel' => 55]
    ),

    57 => array(
        "name" => "exchangeWithSpellPool_universalElementSpellDestination",
        "description" => clienttranslate('${actplayer} is selecting where to put Universal Spell'),
        "descriptionmyturn" => clienttranslate('${you} must select where to put Universal Spell'),
        "type" => "activeplayer",
        "possibleactions" => ["actExchangeWithSpellPool_PickTargetElement", "actExchangeWithSpellPool_CancelElementDestinationChoice"],
        "transitions" => ['spellsExchanged' => 5, 'cancel' => 56]
    ),

    //////////////////////////////////////////////////////////////////////////////
    6 => array(
        "name" => "placingPowerCrystals",
        "description" => clienttranslate("Players are placing power crystals on their spells"),
        "descriptionmyturn" => clienttranslate('${you} must place a Power Crystal on your Spell or '),
        "type" => "multipleactiveplayer",
        "action" => "stMakeEveryoneActive",
        "possibleactions" => ["actPlacePowerCrystal", "actDontPlacePowerCrystal"],
        "transitions" => ['checkRoundEnd' => 7]
    ),

    7 => array(
        "name" => "checkRoundEndAndPassSpells",
        "description" => clienttranslate("Checking if the round has ended and passing spells to continue draft"),
        "type" => "game",
        "action" => "st_checkRoundEndAndPassSpells",
        "transitions" => ['passHand' => 3, 'nextRound' => 2]
    ),

    8 => array(
        "name" => "scoring",
        "description" => "End scoring of the game",
        "type" => "game",
        "action" => "st_scoring",
        "transitions" => ['end' => 99]
    ),

    /*
    Examples:
    
    2 => array(
        "name" => "nextPlayer",
        "description" => '',
        "type" => "game",
        "action" => "stNextPlayer",
        "updateGameProgression" => true,   
        "transitions" => array( "endGame" => 99, "nextPlayer" => 10 )
    ),
    
    10 => array(
        "name" => "playerTurn",
        "description" => clienttranslate('${actplayer} must play a card or pass'),
        "descriptionmyturn" => clienttranslate('${you} must play a card or pass'),
        "type" => "activeplayer",
        "possibleactions" => array( "playCard", "pass" ),
        "transitions" => array( "playCard" => 2, "pass" => 2 )
    ), 

*/

    // Final state.
    // Please do not modify (and do not overload action/args methods).
    99 => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )

);
