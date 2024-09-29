<?php

namespace Elementum;

use Elementum;
use Elementum\Spells\Spell;
use Elementum\Player;

class Notifications
{
    public static function notifyPlayerPlayedSpellOnBoard(Spell $spell, int $playerId, string $element)
    {
        $playerName = Elementum::get()->loadPlayersBasicInfos()[$playerId]['player_name'];
        Elementum::get()->notifyAllPlayers('spellPlayedOnBoard', clienttranslate('${player_name} played ${spell_name} on their board'), array(
            'player_name' => $playerName,
            'player_id' => $playerId,
            'spell_name' => $spell->name,
            'spell' => $spell,
            'element' => $element
        ));
    }

    public static function notifyPlayerThatGetsToUseSpellPool($playerId)
    {
        Elementum::get()->notifyPlayer($playerId, 'playerGetsToUseSpellPool', clienttranslate('You get to use the card from the Spell Pool that you\'ve chosen.'), []);
    }

    public static function notifyPlayersThatDidntGetToUseSpellPool(array $playerIds)
    {
        foreach ($playerIds as $playerId) {
            Elementum::get()->notifyPlayer($playerId, 'playerDidntGetToUseSpellPool', clienttranslate('You can\'t play the Spell from the Spell Pool, because someone else with stronger board also picked it. Your Spell will be played on your board instead.'), []);
        }
    }

    /**
     * @param int $playerThatPaid
     * @param array<int|string,\Elementum\Player> $otherPlayers
     */
    public static function notifyPlayerPaidCrystalForUsingSpellPool($playerThatPaid, array $otherPlayers)
    {
        Elementum::get()->dump('playerThatPaid', $playerThatPaid);
        Elementum::get()->dump('otherPlayers', $otherPlayers);
        Elementum::get()->notifyPlayer($playerThatPaid, 'youPaidCrystalForSpellPool', clienttranslate('You paid a crystal to play a Spell from the Spell pool.'), array());
        foreach ($otherPlayers as $player) {
            Elementum::get()->notifyPlayer($player->getPlayerId(), 'otherPlayerPaidCrystalForSpellPool', clienttranslate('Another player paid a crystal to play a Spell from the Spell pool.'), ['playerId' => $playerThatPaid]);
        }
    }

    public static function notifyPlayerAboutNewHand(array $hand, int $playerId)
    {
        Elementum::get()->notifyPlayer($playerId, 'newHand', 'Your new hand of spells has arrived!', ['newHand' => $hand]);
    }

    public static function notifyAboutNewSpellPoolCard(Spell $oldSpell, Spell $newSpell)
    {
        Elementum::get()->notifyAllPlayers('newSpellPoolCard', 'A new card has been added to the Spell Pool: ${oldSpellNumber}: ${oldSpellName} has been replaced with ${newSpellNumber}: ${newSpellName}', ['oldSpellNumber' => $oldSpell->number, 'oldSpellName' => $oldSpell->name, 'newSpellNumber' => $newSpell->number, 'newSpellName' => $newSpell->name]);
    }

    public static function notifyPlayersAboutNewRound(int $round)
    {
        Elementum::get()->notifyAllPlayers('newRound', 'A new round has started: ${round}', ['round' => $round]);
    }

    public static function notifyPlayerReplacingSpellPoolCard(Spell $pickedSpell, Spell $spellFromPool, int $playerId)
    {
        Elementum::get()->notifyPlayer(
            $playerId,
            'spellPicked',
            'You decided to replace your ${pickedSpellNumber}:${pickedSpellName} with ${spellPoolSpellNumber}:${spellPoolSpellName} from the Spell Pool',
            [
                'pickedSpellNumber' => $pickedSpell->number,
                'pickedSpellName' => $pickedSpell->name,
                'spellPoolSpellNumber' => $spellFromPool->number,
                'spellPoolSpellName' => $spellFromPool->name
            ]
        );
    }

    public static function notifyPlayerPickedAnElement(int $playerId, string $element)
    {
        Elementum::get()->notifyPlayer($playerId, 'elementPicked', 'You picked the ${element} element.', ['element' => $element]);
    }

    /*******************************************************
     *                                                     *
     *            immediate spell resolution               *
     *                                                     *
     *******************************************************/
    public static function notifyPlayerTookCrystal(int $playerId)
    {
        $name = Elementum::get()->getPlayerNameById($playerId);
        Elementum::get()->notifyAllPlayers('playerTookCrystal', '${playerName} took a Crystal', ['playerName' => $name, 'playerId' => $playerId]);
    }

    public static function notifyEveryoneLostCrystal()
    {
        Elementum::get()->notifyAllPlayers('everyoneLostCrystal', 'Everyone lost a Crystal', []);
    }
}
