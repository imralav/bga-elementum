<?php

namespace Elementum\Spells;

use Elementum\SpellEffects\EmpoweredSpellEffect;
use Elementum\SpellEffects\SpellEffect;

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
    public bool $immediate = false;
    private function __construct(int $number, string $name, string $element, SpellEffect $effect, ?EmpoweredSpellEffect $empoweredEffect, bool $immediate)
    {
        $this->number = $number;
        $this->name = $name;
        $this->element = $element;
        $this->effect = $effect;
        $this->empoweredEffect = $empoweredEffect;
        $this->immediate = $immediate;
    }

    public static function createWithEmpoweredEffects(int $number, string $name, string $element, SpellEffect $effect, EmpoweredSpellEffect $empoweredEffect, bool $immediate)
    {
        return new Spell($number, $name, $element, $effect, $empoweredEffect, $immediate);
    }

    public static function create(int $number, string $name, string $element, SpellEffect $effect, bool $immediate)
    {
        return new Spell($number, $name, $element, $effect, null, $immediate);
    }
}
