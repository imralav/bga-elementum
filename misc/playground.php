<?php
$board = [
    'fire' => array()
];

$spells = array(5, 6);
echo "Initial board: ";
var_dump($spells);
echo "Is \$spells associative? ";
var_dump(isAssoc($spells));

$spellNumberToDestroy = 5;
$nextSpells = array_values(array_filter($spells, function ($spellNumberOnBoard) use ($spellNumberToDestroy) {
    return $spellNumberOnBoard !== $spellNumberToDestroy;
}));
echo "After update board: ";
var_dump($nextSpells);
echo "Is \$spells associative? ";
var_dump(isAssoc($nextSpells));




function isAssoc(array $arr)
{
    if (array() === $arr) return false;
    return array_keys($arr) !== range(0, count($arr) - 1);
}
