<?php

namespace Elementum\Spells;

use Elementum\Elements;
use Elementum\Empowerment;
use Elementum\SpellEffects\EmpoweredSpellEffect;
use Elementum\SpellEffects\SpellEffect;
use Elementum\Utils\Logger;

enum SpellActivation: string
{
    case IMMEDIATE = 'immediate';
    case PASSIVE = 'passive';
    case SCORING = 'scoring';
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

    public function canBeEmpowered()
    {
        return $this->empoweredEffect !== null;
    }

    public function hasEffectOfType(string $effectType)
    {
        return $this->effect->type === $effectType;
    }

    public function hasEmpoweredEffectOfType(string $effectType)
    {
        return $this->canBeEmpowered() && $this->empoweredEffect->effect->type === $effectType;
    }

    public function calculateScore(ScoringContext $context): int
    {
        Logger::debug("Calculating score for spell {$this->number}");
        $spellIsEmpowered = Empowerment::isSpellEmpowered($this);
        if ($spellIsEmpowered) {
            return $this->calculateScoreIncludingEmpoweredEffect($context);
        } else {
            return $this->effect->calculateScore($context);
        }
    }

    private function calculateScoreIncludingEmpoweredEffect(ScoringContext $context): int
    {
        $scoreFromEmpoweredEffect = $this->empoweredEffect->effect->calculateScore($context);
        if ($this->empoweredEffect->additive) {
            $scoreFromEffect = $this->effect->calculateScore($context);
            return $scoreFromEffect + $scoreFromEmpoweredEffect;
        } else {
            return $scoreFromEmpoweredEffect;
        }
    }

    /**
     * Each Spell belongs to one of the Elements, but some effects might cause a Spell to have multiple Elements.
     */
    public function getAmountOfElements()
    {
        $isEmpowered = Empowerment::isSpellEmpowered($this);
        if ($isEmpowered) {
            $isQuadrupleEffect = $this->empoweredEffect->effect->type === QUADRUPLE_SYMBOL_SPELL_EFFECT_TYPE;
            if ($isQuadrupleEffect) {
                return 4;
            }
        }
        $isDoubleElementEffect = $this->effect->type === DOUBLE_SYMBOL_SPELL_EFFECT_TYPE;
        if ($isDoubleElementEffect) {
            return 2;
        }
        return 1;
    }
}
