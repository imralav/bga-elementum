<?php

namespace Elementum;

require_once('Crystals.php');
require_once('PlayerBoard.php');
require_once('PlayerMoveChoices/PickedSpells.php');
require_once('PlayerMoveChoices/DraftChoices.php');
require_once('PlayerMoveChoices/SpellPoolChoiceResolver.php');
require_once('Notifications.php');
require_once('Decks.php');
require_once('Players.php');
require_once('ImmediateEffectsResolution.php');

use Elementum;
use Elementum\Decks;
use Elementum\PlayerMoveChoices\DraftChoices;
use Elementum\PlayerMoveChoices\PickedSpells;
use Elementum\PlayerMoveChoices\SpellPoolChoiceResolver;
use Elementum\PlayerMoveChoices\SpellPoolChoiceResolverInput;
use Elementum\Players;

class ElementumGameLogic
{
    const ROUNDS_FOR_4_PLAYERS = 2;
    const ROUNDS_FOR_2_OR_3_PLAYERS = 3;

    private Decks $decks;
    /**
     * @var array<int,PlayerBoard> indexed by player id
     */
    private array $playerBoards;

    private function __construct() {}

    public function getCurrentRound()
    {
        return Elementum::get()->getGameStateValue('currentRound');
    }

    public function incrementAndGetCurrentRound()
    {
        $currentRound = $this->getCurrentRound();
        $currentRound++;
        Elementum::get()->setGameStateValue('currentRound', $currentRound);
        return $currentRound;
    }

    public static function restoreFromDB(): ElementumGameLogic
    {
        $instance = new ElementumGameLogic();
        $instance->createSpellsAndElementSourcesDecks();
        $instance->restorePlayerBoards();
        return $instance;
    }

    public static function init2PlayerGame()
    {
        $instance = new ElementumGameLogic();
        $instance->createSpellsAndElementSourcesDecks();
        $instance->createCrystalsPile();
        $instance->setFirstRound();
        $spellsFor2PlayerGame = $instance->exludeSpellsFor2PlayerGame(self::getBasicSpells());
        // $instance->decks->populateSpellsDeckWith($spellsFor2PlayerGame);
        //TODO: tymczasowo same immediate, póki się nimi zajmuję
        $extraCounter = 0;
        $allImmediateSpellsPlusSomeExtra = array_filter($spellsFor2PlayerGame, function ($spell) use (&$extraCounter) {
            if (!$spell->immediate && $extraCounter < 6) {
                $extraCounter++;
                return true;
            }
            return $spell->immediate;
        });
        $instance->decks->populateSpellsDeckWith($allImmediateSpellsPlusSomeExtra);
        $instance->decks->shuffleSpellsInTheDeck();
        $instance->decks->drawElementSources();
        $instance->decks->drawSpellPool();
        $instance->dealOutCrystalsToPlayers();
        $instance->createPlayerBoards();
        return $instance;
    }

    private function createSpellsAndElementSourcesDecks()
    {
        $this->decks = new Decks();
    }

    private function createCrystalsPile()
    {
        Crystals::initNewPile();
    }

    private function setFirstRound()
    {
        Elementum::get()->setGameStateValue('currentRound', 0);
    }


    private static function getBasicSpells()
    {
        return Elementum::get()->basicSpells;
    }

    private function exludeSpellsFor2PlayerGame(array $spells)
    {
        $spellsToExclude = Elementum::get()->spellsExcludedIn2PlayerGame;
        return array_filter($spells, function ($spell) use ($spellsToExclude) {
            return !in_array($spell->number, $spellsToExclude);
        });
    }

    private function dealOutCrystalsToPlayers()
    {
        $players = $this->getPlayers();
        foreach ($players as $player) {
            Crystals::dealInitialCrystalsTo($player['player_id']);
        }
    }

    private function createPlayerBoards()
    {
        $playerInfos = $this->getPlayers();
        foreach ($playerInfos as $playerInfo) {
            $playerNo = $playerInfo['player_no'];
            $elementSources = $this->getElementSourcesByPlayerNo($playerNo);
            $playerId = $playerInfo['player_id'];
            PlayerBoard::init($playerId, $elementSources);
        }
    }

    private function getElementSourcesByPlayerNo($playerNo)
    {
        $elementSources = $this->decks->getElementSources();
        $elementSources = array_values($elementSources);
        $elementSourceNames = array_map(function ($elementSource) {
            return $elementSource['type'];
        }, $elementSources);
        if ($playerNo % 2 === 0) {
            return array_reverse($elementSourceNames);
        }
        return $elementSourceNames;
    }

    private function restorePlayerBoards()
    {
        $this->playerBoards = array();
        $playerInfos = $this->getPlayers();
        foreach ($playerInfos as $playerInfo) {
            $playerId = $playerInfo['player_id'];
            $playerBoard = PlayerBoard::restoreFromDB($playerId);
            $this->playerBoards[$playerId] = $playerBoard;
        }
    }

    public function isGameOver()
    {
        //TODO: na czas testów scoring potrzebuję szybko kończyć grę
        return $this->getCurrentRound() > 1;
        // $numberOfPlayers = $this->getNumberOfPlayers();
        // if ($numberOfPlayers === 4) {
        //     return $this->getCurrentRound() > ElementumGameLogic::ROUNDS_FOR_4_PLAYERS;
        // }
        // return $this->getCurrentRound() > ElementumGameLogic::ROUNDS_FOR_2_OR_3_PLAYERS;
    }

    public function prepareCurrentRound()
    {
        $players = $this->getPlayers();
        $numberOfPlayers = count($players);
        $currentRound = $this->getCurrentRound();
        Elementum::get()->trace("=============================== PREPARING CURRENT ROUND");
        Elementum::get()->dump('Round:', $currentRound);
        Elementum::get()->dump('Number of players:', $numberOfPlayers);
        Elementum::get()->dump('Players', $players);
        if ($this->isGameOver()) {
            Elementum::get()->gamestate->nextState('scoring'); //TODO: move out of here, instead use return value to make decision outside
        }
        $cardsToGive = $this->getAmountOfCardsToGive($numberOfPlayers, $currentRound);
        foreach ($players as $player) {
            $this->decks->giveCardsFromDeckToPlayer($player['player_id'], $cardsToGive);
        }
    }

    private function getPlayers()
    {
        return Elementum::get()->loadPlayersBasicInfos();
    }

    private function getNumberOfPlayers()
    {
        return count($this->getPlayers());
    }

    private function getAmountOfCardsToGive(int $numberOfPlayers, int $currentRound)
    {
        switch ($numberOfPlayers) {
            case 2:
                return 6;
            case 3:
                switch ($currentRound) {
                    case 1:
                        return 6;
                    case 2:
                        return 5;
                    case 3:
                        return 5;
                }
            case 4:
                return 6;
        }
    }

    public function getPlayerBoards()
    {
        return $this->playerBoards;
    }

    public function hasEveryoneFinishedDraft()
    {
        $draftChoices = DraftChoices::getAllDraftChoices();
        $players = $this->getNumberOfPlayers();
        return count($draftChoices) === $players;
    }

    /**
     * @return array<int,int> index of what spell was played by which player
     */
    public function resolveAndPlaySpellPoolChoices()
    {
        Elementum::get()->debug('Resolving spell pool replacements');
        if (DraftChoices::hasNooneChosenToUseSpellPool()) {
            Elementum::get()->debug('Noone has chosen to use spell pool');
            return [];
        }
        $this->resolveSpellPoolConflicts();
        return $this->playSpellsWithSpellPoolReplacement();
    }

    private function resolveSpellPoolConflicts()
    {
        $choices = DraftChoices::getAllSpellPoolChoices();
        $playerBoardSummaries = $this->extractAllPlayerBoardSummaries($choices);
        $crystalsPerPlayer = Crystals::getCrystalsPerPlayer();
        $input = new SpellPoolChoiceResolverInput($choices, $playerBoardSummaries, $crystalsPerPlayer);
        $resolver = new SpellPoolChoiceResolver(Elementum::get());
        $result = $resolver->resolve($input);
        Elementum::get()->dump('Result of spell pool choice resolver', $result);
        //everyone not in $playersThatGetToUseSpellPool will have their spell pool choice denied and replaced with regular spell play
        foreach ($result->getPlayersThatDidntGetToUseSpellPool() as $playerId) {
            Notifications::notifyPlayersThatDidntGetToUseSpellPool($playerId);
            DraftChoices::cancelDraftChoice($playerId);
            DraftChoices::playPickedSpell($playerId);
        }
    }

    /**
     * @return array<int,PlayerBoardSummary>
     */
    private function extractAllPlayerBoardSummaries()
    {
        $playerBoardSummaries = [];
        foreach ($this->playerBoards as $playerId => $playerBoard) {
            $playerBoardSummaries[$playerId] = $playerBoard->summary();
        }
        return $playerBoardSummaries;
    }

    /**
     * @return array<int,int> index of what spell was played by which player
     */
    private function playSpellsWithSpellPoolReplacement()
    {
        $spellsPlayedPerPlayer = [];
        $spellPoolChoices = DraftChoices::getAllSpellPoolChoices();
        foreach ($spellPoolChoices as $choice) {
            $playerId = $choice->getPlayerId();
            $pickedSpell = PickedSpells::getPickedSpellOf($playerId);
            $spellPoolCardNumber = $choice->getSpellPoolCardNumber();
            $this->decks->replaceCardInSpellPoolAndPlayerBoard($pickedSpell, $spellPoolCardNumber, $playerId);
            $spell = Elementum::get()->getSpellByNumber($spellPoolCardNumber);
            $playerBoard = $this->playerBoards[$playerId];
            $targetElement = $choice->getTargetElementForUniversalSpell() ?? $spell->element;
            $playerBoard->putSpellOnBoardAtElement($spell, $targetElement);
            $spellsPlayedPerPlayer[$playerId] = $spell->number;
            Crystals::decrementFor($playerId);
            Notifications::notifyPlayerPaidCrystalForUsingSpellPool($playerId, Players::getAllPlayersBesides($playerId));
            Notifications::notifyPlayerPlayedSpellOnBoard($spell, $playerId, $targetElement);
            Notifications::notifyPlayerThatGetsToUseSpellPool($playerId);
            Notifications::notifyAboutNewSpellPoolCard($spell, Elementum::get()->getSpellByNumber($pickedSpell));
        }
        return $spellsPlayedPerPlayer;
    }


    /**
     * @return array<int,int> index of what spell was played by which player
     */
    public function playPickedSpells()
    {
        $spellsPlayedPerPlayer = [];
        $playSpellChoices = DraftChoices::getAllThatChoseToPlaySpell();
        foreach ($playSpellChoices as $choice) {
            $playerId = $choice->getPlayerId();
            $spellNumber = PickedSpells::getPickedSpellOf($playerId);
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            $targetElement = $choice->getTargetElementForUniversalSpell() ?? $spell->element;
            $this->decks->playCardFromHand($spellNumber, $playerId);
            $playerBoard = $this->playerBoards[$playerId];
            $playerBoard->putSpellOnBoardAtElement($spell, $targetElement);
            $spellsPlayedPerPlayer[$playerId] = $spell->number;
            Notifications::notifyPlayerPlayedSpellOnBoard($spell, $playerId, $targetElement);
        }
        return $spellsPlayedPerPlayer;
    }

    public function getAmountOfSpellsLeftInDeck()
    {
        return $this->decks->getAmountOfSpellsLeftInDeck();
    }

    public function getHandOf($playerId)
    {
        return $this->decks->getHandOf($playerId);
    }

    public function getSpellPool()
    {
        return $this->decks->getSpellPool();
    }

    public function doesPlayerHaveSpellInHand($playerId, $spellNumber)
    {
        return $this->decks->doesPlayerHaveSpellInHand($playerId, $spellNumber);
    }

    public function havePlayersPlayedAllTheirSpells()
    {
        $players = $this->getPlayers();
        foreach ($players as $player) {
            $playerId = $player['player_id'];
            $hand = $this->getHandOf($playerId);
            if (count($hand) > 0) {
                return false;
            }
        }
        return true;
    }

    public function clearPlayerChoices()
    {
        DraftChoices::cancelAllDraftChoices();
        PickedSpells::cancelAllSpellPicks();
    }

    public function wasExtraTurnSpellPlayed()
    {
        //TODO: nie wiem jeszcze jak to poimplementować na razie placeholder
        return false;
    }

    public function passSpells(array $spellPassingOrder)
    {
        $this->decks->passSpells($spellPassingOrder);
    }
}
