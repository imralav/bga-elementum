<?php

namespace Elementum\PlayerMoveChoices;

// require_once('DraftChoices.php');

use Elementum;
use Elementum\PlayerBoardSummary;

class SpellPoolChoiceResolverInput
{
    /**
     * @var array<int, DraftChoice> Map from Player ID to DraftChoice
     */
    private array $draftChoices;

    /**
     * @param array<int, int> $playerCrystals
     * @param array<int, PlayerBoardSummary> $playerBoardSummaries
     * @param array<int, DraftChoice> $draftChoices
     */

    /**
     * @var array<int, int> Map from Player ID to amount of crystals
     */
    private array $playerCrystals;

    /**
     * @var array<int, PlayerBoardSummary> Map from Player ID to PlayerBoardSummary
     */
    private array $playerBoardSummaries;

    /**
     * @param array<int, int> $playerCrystals
     * @param array<int, PlayerBoardSummary> $playerBoardSummaries
     * @param array<DraftChoice> $draftChoices
     */
    public function __construct(array $draftChoices, array $playerBoardSummaries, array $playerCrystals)
    {
        $this->playerCrystals = $playerCrystals;
        $this->playerBoardSummaries = $playerBoardSummaries;
        $this->draftChoices = $draftChoices;
    }

    /**
     * Get the map from Player ID to amount of crystals
     *
     * @return array<int, int>
     */
    public function getPlayerCrystals(): array
    {
        return $this->playerCrystals;
    }

    /**
     * Get the map from Player ID to PlayerBoardSummary
     *
     * @return array<int, PlayerBoardSummary>
     */
    public function getPlayerBoardSummaries(): array
    {
        return $this->playerBoardSummaries;
    }

    /**
     * Get the map from Player ID to DraftChoice
     *
     * @return array<int, DraftChoice>
     */
    public function getDraftChoices(): array
    {
        return $this->draftChoices;
    }
}

class SpellPoolChoiceResolutionResult
{
    private array $playersThatGetToUseSpellPool;
    private array $playersThatDidntGetToUseSpellPool;

    /**
     * @param int[] $playersThatGetToUseSpellPool
     * @param int[] $playersThatDidntGetToUseSpellPool
     */
    public function __construct($playersThatGetToUseSpellPool, $playersThatDidntGetToUseSpellPool)
    {
        $this->playersThatGetToUseSpellPool = $playersThatGetToUseSpellPool;
        $this->playersThatDidntGetToUseSpellPool = $playersThatDidntGetToUseSpellPool;
    }

    public static function empty(): self
    {
        return new self([], []);
    }

    /**
     * An array of Player IDs that can use the spell from the spell pool they selected.
     *
     * @var int[]
     */
    public function getPlayersThatGetToUseSpellPool()
    {
        return $this->playersThatGetToUseSpellPool;
    }

    /**
     * An array of Player IDs that can't use the spell from the spell pool they selected.
     * There could be two reasons:
     * 1. Someone else also selected the same spell and had more spells of given element already or had more crystals
     * 2. Someone else also selected the same spell and had exactly the same amount of spells of given element and crystals
     *
     * @var int[]
     */
    public function getPlayersThatDidntGetToUseSpellPool()
    {
        return $this->playersThatDidntGetToUseSpellPool;
    }

    /**
     * Add a player to the list of players that get to use the spell pool.
     *
     * @param int $playerId
     * @return self
     */
    public function withPlayerThatGetsToUseSpellPool(int $playerId): self
    {
        $newPlayersThatGetToUseSpellPool = $this->playersThatGetToUseSpellPool;
        $newPlayersThatGetToUseSpellPool[] = $playerId;
        return new self($newPlayersThatGetToUseSpellPool, $this->playersThatDidntGetToUseSpellPool);
    }

    /**
     * Add a player to the list of players that didn't get to use the spell pool.
     *
     * @param int $playerId
     * @return self
     */
    public function withPlayerThatDidntGetToUseSpellPool(int $playerId): self
    {
        $newPlayersThatDidntGetToUseSpellPool = $this->playersThatDidntGetToUseSpellPool;
        $newPlayersThatDidntGetToUseSpellPool[] = $playerId;
        return new self($this->playersThatGetToUseSpellPool, $newPlayersThatDidntGetToUseSpellPool);
    }

    /**
     * Add multiple players to the list of players that get to use the spell pool.
     *
     * @param int[] $playerIds
     * @return self
     */
    public function withPlayersThatGetToUseSpellPool(array $playerIds): self
    {
        $newPlayersThatGetToUseSpellPool = array_merge($this->playersThatGetToUseSpellPool, $playerIds);
        return new self($newPlayersThatGetToUseSpellPool, $this->playersThatDidntGetToUseSpellPool);
    }

    /**
     * Add multiple players to the list of players that didn't get to use the spell pool.
     *
     * @param int[] $playerIds
     * @return self
     */
    public function withPlayersThatDidntGetToUseSpellPool(array $playerIds): self
    {
        $newPlayersThatDidntGetToUseSpellPool = array_merge($this->playersThatDidntGetToUseSpellPool, $playerIds);
        return new self($this->playersThatGetToUseSpellPool, $newPlayersThatDidntGetToUseSpellPool);
    }

    /**
     * Combine this result with another SpellPoolChoiceResolutionResult.
     *
     * @param SpellPoolChoiceResolutionResult $other
     * @return self
     */
    public function combineWith(SpellPoolChoiceResolutionResult $other): self
    {
        $combinedPlayersThatGetToUseSpellPool = array_merge($this->playersThatGetToUseSpellPool, $other->getPlayersThatGetToUseSpellPool());
        $combinedPlayersThatDidntGetToUseSpellPool = array_merge($this->playersThatDidntGetToUseSpellPool, $other->getPlayersThatDidntGetToUseSpellPool());
        return new self($combinedPlayersThatGetToUseSpellPool, $combinedPlayersThatDidntGetToUseSpellPool);
    }
}

class SpellPoolChoiceResolver
{
    private Elementum $elementum;

    public function __construct(Elementum $elementum)
    {
        $this->elementum = $elementum;
    }

    public function resolve(SpellPoolChoiceResolverInput $input): SpellPoolChoiceResolutionResult
    {
        $result = SpellPoolChoiceResolutionResult::empty();
        $groupedBySpellPoolChoice = self::getPlayersGroupedByTheirSpellPoolChoice($input->getDraftChoices());
        $spellsWithoutContest = array_filter($groupedBySpellPoolChoice, function ($playerIds) {
            return count($playerIds) <= 1;
        });
        foreach ($spellsWithoutContest as $playerIds) {
            $result = $result->withPlayersThatGetToUseSpellPool($playerIds);
        }
        $contestedSpells = array_filter($groupedBySpellPoolChoice, function ($playerIds) {
            return count($playerIds) > 1;
        });
        foreach ($contestedSpells as $spellNumber => $playerIds) {
            $subresult = self::resolveContestedSpell($spellNumber, $playerIds, $input->getPlayerBoardSummaries(), $input->getPlayerCrystals());
            $result = $result->combineWith($subresult);
        }
        return $result;
    }

    /**
     * Processes an array of DraftChoice objects and returns an associative array.
     *
     * @param DraftChoice[] $useSpellPoolChoices An array of DraftChoice objects.
     * @return array<int, int[]> An associative array where the key is an integer and the value is an array of integers.
     */
    private function getPlayersGroupedByTheirSpellPoolChoice(array $useSpellPoolChoices)
    {
        $grouped = array();
        foreach ($useSpellPoolChoices as $choice) {
            $selectedSpellNumber = $choice->getSpellPoolCardNumber();
            if (!array_key_exists($selectedSpellNumber, $grouped)) {
                $grouped[$selectedSpellNumber] = [];
            }
            $grouped[$selectedSpellNumber][] = $choice->getPlayerId();
        }
        return $grouped;
    }

    /**
     * @param int $spellNumber
     * @param int[] $playerIds
     * @param array<int,PlayerBoardSummary> $playerBoardSummaries
     * @param array<int, int[]> $playerCrystals
     */
    private function resolveContestedSpell(int $spellNumber, array $playerIds, array $playerBoardSummaries, array $playerCrystals): SpellPoolChoiceResolutionResult
    {
        $contestedSpell = $this->elementum->getSpellByNumber($spellNumber);
        $elementOfContestedSpell = $contestedSpell->element;
        usort($playerIds, function ($playerId1, $playerId2) use ($playerBoardSummaries, $elementOfContestedSpell, $playerCrystals) {
            $playerBoardSummary1 = $playerBoardSummaries[$playerId1] ?? PlayerBoardSummary::empty();
            $playerBoardSummary2 = $playerBoardSummaries[$playerId2] ?? PlayerBoardSummary::empty();
            $comparison = $playerBoardSummary2->getCount($elementOfContestedSpell) - $playerBoardSummary1->getCount($elementOfContestedSpell);
            if ($comparison != 0) {
                return $comparison;
            }
            $player1Crystals = $playerCrystals[$playerId1] ?? 0;
            $player2Crystals = $playerCrystals[$playerId2] ?? 0;
            $crystalsComparison = $player2Crystals - $player1Crystals;
            return $crystalsComparison;
        });
        if ($this->conflictWasResolved2($playerIds, $elementOfContestedSpell, $playerBoardSummaries, $playerCrystals)) {
            return SpellPoolChoiceResolutionResult::empty()->withPlayerThatGetsToUseSpellPool($playerIds[0])->withPlayersThatDidntGetToUseSpellPool(array_slice($playerIds, 1));
        } else {
            return SpellPoolChoiceResolutionResult::empty()->withPlayersThatDidntGetToUseSpellPool($playerIds);
        }
    }

    /**
     * Assumption: $sortedPlayerIds is properly sorted by spells on board for given elementOfContestedSpell$elementOfContestedSpell and crystals amount
     * Here we only need to make sure that first two players don't have the same amount of both spells and crystals.
     * If so, there is still a conflict and the resolution is to not allow any of them to use contestedSpell$contestedSpell pool.
     * @param array<int> $sortedPlayerIds
     * @param string $elementOfContestedSpell
     * @param array<int,PlayerBoardSummary> $playerBoards
     * @param array<int, int[]> $playerCrystals
     */
    private function conflictWasResolved2(array $sortedPlayerIds, string $elementOfContestedSpell, array $playerBoards, array $playerCrystals)
    {
        $playerBoardSummary1 = $playerBoards[$sortedPlayerIds[0]] ?? PlayerBoardSummary::empty();
        $playerBoardSummary2 = $playerBoards[$sortedPlayerIds[1]] ?? PlayerBoardSummary::empty();
        $player1Crystals = $playerCrystals[$sortedPlayerIds[0]] ?? 0;
        $player2Crystals = $playerCrystals[$sortedPlayerIds[1]] ?? 0;
        $sameAmountOfSpellsForBothPlayers = $playerBoardSummary1->getCount($elementOfContestedSpell) == $playerBoardSummary2->getCount($elementOfContestedSpell);
        $sameAmountOfCrystalsForBothPlayers = $player1Crystals == $player2Crystals;
        return !($sameAmountOfSpellsForBothPlayers && $sameAmountOfCrystalsForBothPlayers);
    }
}
