<?php

namespace Elementum;

require_once('PlayerBoardSummary.php');

use Elementum;
use Elementum\Spells\Spell;
use Elementum\PlayerBoardSummary;

class PlayerBoard extends  \APP_DbObject
{
    private $playerId;
    public array $elementSources;
    /**
     * @var array<string, int[]> a map from Element to a list of Spell Numbers
     */
    public array $board;

    /**
     * @param string $playerId
     * @param array<string> $elementSources
     * @param array<string, int[]> $board
     */
    private function __construct($playerId, $elementSources, $board)
    {
        $this->playerId = $playerId;
        $this->elementSources = $elementSources;
        $this->board = $board;
    }

    /**
     * @param string $playerId
     * @param array<string> $elementSources
     */
    public static function init($playerId, $elementSources)
    {
        $board = array_fill_keys($elementSources, array());
        $instance = new PlayerBoard($playerId, $elementSources, $board);
        $instance->insert();
        return $instance;
    }

    private function insert()
    {
        $sql = "INSERT INTO playerBoards (player_id, elementSources, board) VALUES ('{$this->playerId}', '" . json_encode($this->elementSources) . "', '" . json_encode($this->board) . "')";
        Elementum::get()->DbQuery($sql);
    }

    public static function restoreFromDB($playerId)
    {
        $sql = "SELECT elementSources, board FROM playerBoards WHERE player_id = '{$playerId}'";
        $result = Elementum::get()->getObjectFromDB($sql);
        $elementSources =  json_decode($result['elementSources'], true);
        $board = json_decode($result['board'], true);
        return new PlayerBoard($playerId, $elementSources, $board);
    }

    public function getAmountOfElement(string $element)
    {
        if (isset($this->board[$element])) {
            return count($this->board[$element]);
        } else {
            return 0;
        }
    }

    public function putSpellOnBoard(Spell $spell)
    {
        $this->putSpellOnBoardAtElement($spell->number, $spell->element);
    }

    public function putSpellOnBoardAtElement(int $spellNumber, string $element)
    {
        $this->board[$element][] = $spellNumber;
        Elementum::get()->dump("====================Adding to player board", $this->board);
        $this->update();
    }

    private function update()
    {
        $sql = "UPDATE playerBoards SET board = '" . json_encode($this->board) . "' WHERE player_id = '{$this->playerId}'";
        Elementum::get()->DbQuery($sql);
    }

    public function summary()
    {
        $fireCount = $this->getAmountOfElement('fire');
        $waterCount = $this->getAmountOfElement('water');
        $earthCount = $this->getAmountOfElement('earth');
        $airCount = $this->getAmountOfElement('air');
        return new PlayerBoardSummary($fireCount, $waterCount, $earthCount, $airCount);
    }

    public function destroySpell(int $spellNumberToDestroy)
    {
        foreach ($this->board as $element => $spells) {
            $this->board[$element] = array_values(array_filter($spells, function ($spellNumberOnBoard) use ($spellNumberToDestroy) {
                return $spellNumberOnBoard !== $spellNumberToDestroy;
            }));
        }
        $this->update();
    }
}
