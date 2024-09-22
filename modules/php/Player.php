<?php

namespace Elementum;

class Player
{
    private int $player_no;
    private int $player_id;
    private string $player_name;
    private string $player_color;

    public function __construct(int $player_no, int $player_id, string $player_name, string $player_color)
    {
        $this->player_no = $player_no;
        $this->player_id = $player_id;
        $this->player_name = $player_name;
        $this->player_color = $player_color;
    }

    public function getPlayerNo(): int
    {
        return $this->player_no;
    }

    public function getPlayerId(): int
    {
        return $this->player_id;
    }

    public function getPlayerName(): string
    {
        return $this->player_name;
    }

    public function getPlayerColor(): string
    {
        return $this->player_color;
    }
}
