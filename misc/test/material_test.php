<?php
class material_test
{
    public array $allSpells;
    function __construct()
    {
        include '../../material.inc.php';
    }

    function shouldHave55Spells()
    {
        assert(count($this->allSpells) == 55, "Expected 55 spells, got " . count($this->allSpells));
    }
}

$test = new material_test();
$test->shouldHave55Spells();
