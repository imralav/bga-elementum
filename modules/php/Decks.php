<?php

namespace Elementum;

use Elementum;

/**
 * Class wrapping BGA's Deck component into main Spell decks (main deck, spell pool, player hands) and Element Sources.
 * Recognizes both {@link Elementum\Spells\Spell} and technical term of Card from the BGA's Deck.
 */
class Decks
{
    private $cards;
    private $elementSources;

    public function __construct()
    {
        $this->cards = $this->getNewDeck();
        $this->cards->init("card");
        $this->elementSources = $this->getNewDeck();
        $this->elementSources->init("elementSources");
    }

    private function getNewDeck()
    {
        return Elementum::get()->getDeck();
    }

    public function populateSpellsDeckWith(array $spells)
    {
        $spellsToSave = [];
        foreach ($spells as $spell) {
            $spellsToSave[] = array('type' => $spell->number, 'type_arg' => 0, 'nbr' => 1);
        }
        $this->cards->createCards($spellsToSave, 'deck');
    }

    public function shuffleSpellsInTheDeck()
    {
        $this->cards->shuffle('deck');
    }

    public function drawElementSources()
    {
        $elementSourcesToSave = [];
        foreach (Elements::ALL_REGULAR_ELEMENTS as $element) {
            $elementSourcesToSave[] = array('type' => $element, 'type_arg' => 0, 'nbr' => 1);
        }
        $this->elementSources->createCards($elementSourcesToSave, 'elementSources');
        $this->elementSources->shuffle('elementSources');
        //we now have 4 element sources in random order. This is the order used for first and third player
        //second player and fourth player will have reversed order
    }

    public function drawSpellPool()
    {
        $this->cards->pickCardsForLocation(3, 'deck', 'spellPool');
    }

    public function getElementSources()
    {
        return $this->elementSources->getCardsInLocation('elementSources');
    }

    public function getAmountOfSpellsLeftInDeck()
    {
        return $this->cards->countCardInLocation('deck');
    }

    public function getAllSpellsInDeck()
    {
        return $this->mapCardsToSpells($this->cards->getCardsInLocation('deck'));
    }

    public function getHandOf($playerId)
    {
        //as Card, need to convert to spells
        $playerHand = $this->cards->getCardsInLocation('hand', $playerId);
        return $this->mapCardsToSpells($playerHand);
    }

    public function doesPlayerHaveSpellInHand($playerId, $spellNumber)
    {
        $hand = $this->getHandOf($playerId);
        return array_reduce($hand, function ($carry, $spell) use ($spellNumber) {
            return $carry || $spell->number === $spellNumber;
        }, false);
    }

    private function mapCardsToSpells($cards): array
    {
        return array_map(function ($card) {
            $spellNumber = $card['type'];
            return Elementum::get()->getSpellByNumber($spellNumber);
        }, $cards);
    }

    public function getSpellPool()
    {
        return $this->mapCardsToSpells($this->cards->getCardsInLocation('spellPool'));
    }

    public function giveCardsFromDeckToPlayer(int $playerId, int $amount)
    {
        $this->cards->pickCards($amount, 'deck', $playerId);
    }

    public function findCardInSpellPool(int $spellNumber)
    {
        $cards = $this->cards->getCardsOfTypeInLocation($spellNumber, null, 'spellPool');
        return !empty($cards) ? array_shift($cards) : null;
    }

    public function findCardInPlayerHand(int $spellNumber, int $playerId)
    {
        $cardsInPlayerHand = $this->cards->getCardsOfTypeInLocation($spellNumber, null, 'hand', $playerId);
        return !empty($cardsInPlayerHand) ? array_shift($cardsInPlayerHand) : null;
    }

    public function playCardFromSpellPool(int $pickedSpellNumber, int $spellPoolSpellNumber, int $playerId)
    {
        $cardFromSpellPool = $this->findCardInSpellPool($spellPoolSpellNumber);
        $cardFromHand = $this->findCardInPlayerHand($pickedSpellNumber, $playerId);
        $this->cards->moveCard($cardFromSpellPool['id'], 'board', $playerId);
        $this->cards->moveCard($cardFromHand['id'], 'spellPool');
    }

    public function swapCardsBetweenPlayerBoardAndSpellPool(int $pickedSpellNumber, int $spellPoolSpellNumber, int $playerId)
    {
        $cardFromSpellPool = $this->findCardInSpellPool($spellPoolSpellNumber);
        $cardFromBoard = $this->findCardInPlayerBoard($pickedSpellNumber, $playerId);
        $this->cards->moveCard($cardFromSpellPool['id'], 'board', $playerId);
        $this->cards->moveCard($cardFromBoard['id'], 'spellPool');
    }

    public function playCardFromHand(int $spellNumber, int $playerId)
    {
        $cardFromHand = $this->findCardInPlayerHand($spellNumber, $playerId);
        $this->cards->moveCard($cardFromHand['id'], 'board', $playerId);
    }

    public function passSpells(array $spellPassingOrder)
    {
        $hands = [];
        foreach ($spellPassingOrder as $playerId => $nextPlayerId) {
            $hands[$playerId] = $this->cards->getCardsInLocation('hand', $playerId);
        }
        foreach ($spellPassingOrder as $playerId => $nextPlayerId) {
            $cardIds = array_map(function ($card) {
                return $card['id'];
            }, $hands[$playerId]);
            $this->cards->moveCards($cardIds, 'hand', $nextPlayerId);
        }
    }

    public function discardSpell(int $spellNumber, int $playerId)
    {
        $card = $this->findCardInPlayerBoard($spellNumber, $playerId);
        $this->cards->moveCard($card['id'], 'discard');
    }

    private function findCardInPlayerBoard(int $spellNumber, int $playerId)
    {
        $cardsInPlayerBoard = $this->cards->getCardsOfTypeInLocation($spellNumber, null, 'board', $playerId);
        return !empty($cardsInPlayerBoard) ? array_shift($cardsInPlayerBoard) : null;
    }

    public function addSpellFromPool(int $playerId, int $spellNumber)
    {
        $card = $this->findCardInSpellPool($spellNumber);
        $this->cards->moveCard($card['id'], 'board', $playerId);
    }

    public function getAllSpellsOnAllPlayerBoards()
    {
        $cards = $this->cards->getCardsInLocation('board');
        return $this->mapCardsToSpells($cards);
    }
}
