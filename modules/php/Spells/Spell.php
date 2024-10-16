<?php

namespace Elementum\Spells;

use Elementum\Elements;
use Elementum\SpellEffects\EmpoweredSpellEffect;
use Elementum\SpellEffects\SpellEffect;

enum SpellActivation: string
{
    case IMMEDIATE = 'immediate';
    case PASSIVE = 'passive';
    //TODO: consider including scoring and specials that happen all the time
}

class Spell
{
    /**
     * Identifier, used to uniquely identify each Spell
     */
    public int $number;
    public string $name;
    public string $element;
    public SpellEffect $effect;
    public ?EmpoweredSpellEffect $empoweredEffect;
    public int $crystalSlots = 0;
    public SpellActivation $spellActivation;
    private function __construct(int $number, string $name, string $element, SpellEffect $effect, ?EmpoweredSpellEffect $empoweredEffect, int $crystalSlots, SpellActivation $spellActivation)
    {
        $this->number = $number;
        $this->name = $name;
        $this->element = $element;
        $this->effect = $effect;
        $this->empoweredEffect = $empoweredEffect;
        $this->spellActivation = $spellActivation;
        $this->crystalSlots = $crystalSlots;
    }

    public static function createWithEmpoweredEffects(int $number, string $name, string $element, SpellEffect $effect, EmpoweredSpellEffect $empoweredEffect, int $crystalSlots, SpellActivation $spellActivation)
    {
        return new Spell($number, $name, $element, $effect, $empoweredEffect, $crystalSlots, $spellActivation);
    }

    public static function create(int $number, string $name, string $element, SpellEffect $effect, SpellActivation $spellActivation, int $crystalSlots = 0): Spell
    {
        return new Spell($number, $name, $element, $effect, null, $crystalSlots, $spellActivation);
    }

    public function isUniversalElement(): bool
    {
        return $this->element === Elements::UNIVERSAL;
    }

    public function isImmediate()
    {
        return $this->spellActivation === SpellActivation::IMMEDIATE;
    }
}
