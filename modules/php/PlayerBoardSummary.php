<?php

namespace Elementum;

class PlayerBoardSummary
{
    private int $fireCount;
    private int $waterCount;
    private int $earthCount;
    private int $airCount;

    public function __construct(int $fireCount, int $waterCount, int $earthCount, int $airCount)
    {
        $this->fireCount = $fireCount;
        $this->waterCount = $waterCount;
        $this->earthCount = $earthCount;
        $this->airCount = $airCount;
    }

    public function getFireCount(): int
    {
        return $this->fireCount;
    }

    public function getWaterCount(): int
    {
        return $this->waterCount;
    }

    public function getEarthCount(): int
    {
        return $this->earthCount;
    }

    public function getAirCount(): int
    {
        return $this->airCount;
    }

    public function getCount(string $element): int
    {
        return $this->{$element . 'Count'};
    }

    public static function empty()
    {
        return new PlayerBoardSummary(0, 0, 0, 0);
    }
}
