<?php


namespace Elementum;

use Elementum;
use Elementum\Spells\Spell;
use InvalidArgumentException;

class CrystalsOnSpells
{

    private const CRYSTALS_ON_SPELLS_KEY = 'crystalsOnSpells';

    public static function canPutCrystalsOnSpell(Spell $spell): bool
    {
        if ($spell->crystalSlots == 0) {
            return false;
        }
        $currentCrystalsOnSpell = self::getCrystalsOnSpell($spell->number);
        return $currentCrystalsOnSpell < $spell->crystalSlots;
    }

    public static function getCrystalsOnSpell(int $spellNumber): int
    {
        $spellsOnCrystals = self::getCrystalsOnSpells();
        return $spellsOnCrystals[$spellNumber] ?? 0;
    }

    /**
     * @return array<int, int> [spellNumber => amount]
     */
    public static function getCrystalsOnSpells()
    {
        $crystalsOnSpells = Elementum::get()->globals->get(self::CRYSTALS_ON_SPELLS_KEY);
        if ($crystalsOnSpells === null) {
            self::initiateEmptyCrystalsOnSpells();
            return [];
        }
        return $crystalsOnSpells;
    }

    private static function initiateEmptyCrystalsOnSpells()
    {
        Elementum::get()->globals->set(self::CRYSTALS_ON_SPELLS_KEY, []);
    }

    public static function putCrystalOnSpell(int $spellNumber)
    {
        $crystalsOnSpells = self::getCrystalsOnSpells();
        $crystalsOnSpells[$spellNumber] = self::getCrystalsOnSpell($spellNumber) + 1;
        self::putCrystalsOnSpells($crystalsOnSpells);
    }

    /**
     * @param array<int,int> [spellNumber => amount]
     */
    public static function putCrystalsOnSpells(array $spellNumbers)
    {
        foreach ($spellNumbers as $spellNumber => $amount) {
            if (!is_int($spellNumber) || !is_int($amount)) {
                throw new InvalidArgumentException('Array must be an associative array of int to int');
            }
        }
        $crystalsOnSpells = self::getCrystalsOnSpells();
        foreach ($spellNumbers as $spellNumber => $amount) {
            $crystalsOnSpells[$spellNumber] = $amount;
        }
        Elementum::get()->globals->set(self::CRYSTALS_ON_SPELLS_KEY, $crystalsOnSpells);
    }

    public static function removeAllCrystalsOnSpell(int $spellNumber)
    {
        $crystalsOnSpells = self::getCrystalsOnSpells();
        unset($crystalsOnSpells[$spellNumber]);
        self::putCrystalsOnSpells($crystalsOnSpells);
    }

    public static function removeAllCrystalsFromSpell(int $spellNumber)
    {
        $crystalsOnSpells = self::getCrystalsOnSpells();
        $crystalsOnSpells[$spellNumber] = 0;
        self::putCrystalsOnSpells($crystalsOnSpells);
    }
}
