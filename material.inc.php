<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Elementum implementation : © <Your name here> <Your email address here>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * Elementum game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

require_once('modules/php/Elements.php');
require_once('modules/php/Spells/Spell.php');
require_once('modules/php/Spells/SpellEffects.php');

use Elementum\Elements;
use Elementum\SpellEffects\AddFromSpellPoolSpellEffect;
use Elementum\SpellEffects\AnyAdjacencySpellEffect;
use Elementum\SpellEffects\ChangeDraftOrderOrWinADrawSpellEffect;
use Elementum\SpellEffects\CollectionSpellEffect;
use Elementum\SpellEffects\CopyImmediateSpellSpellEffect;
use Elementum\SpellEffects\CopyNonImmediateSpellSpellEffect;
use Elementum\SpellEffects\CrushCrystalsSpellEffect;
use Elementum\SpellEffects\DestroySpellEffect;
use Elementum\SpellEffects\DoubleSymbolEffect;
use Elementum\SpellEffects\EachPairEffect;
use Elementum\SpellEffects\EachSymbolEffect;
use Elementum\SpellEffects\EachTripleOfSameElementSpellEffect;
use Elementum\SpellEffects\ElementumFromOtherSpellEffect;
use Elementum\SpellEffects\EmpoweredSpellEffect;
use Elementum\SpellEffects\ExchangeWithSpellPoolSpellEffect;
use Elementum\SpellEffects\FlatPointsSpellEffect;
use Elementum\SpellEffects\FullAdjacencySpellEffect;
use Elementum\SpellEffects\MostFullRowsSpellEffect;
use Elementum\SpellEffects\MajorityEffect;
use Elementum\SpellEffects\MostIncompleteRowsSpellEffect;
use Elementum\SpellEffects\OverloadEffect;
use Elementum\SpellEffects\PlayTwoSpellsSpellEffect;
use Elementum\SpellEffects\PowerInCrystalsSpellEffect;
use Elementum\SpellEffects\QuadrupleSymbolEffect;
use Elementum\SpellEffects\ResistanceSpellEffect;
use Elementum\SpellEffects\SetOf4ElementsSpellEffect;
use Elementum\SpellEffects\SurroundingEffect;
use Elementum\SpellEffects\TakeCrystalEffect;
use Elementum\SpellEffects\VirtualElementSourcesSpellEffect;
use Elementum\Spells\Spell;
use Elementum\Spells\SpellActivation;

if (!defined('ELEMENTUM_SPELLS')) {
  define('ELEMENTUM_SPELLS', true);
}

$this->spellsExcludedIn2PlayerGame = array(
  2,
  9,
  13,
  15,
  22,
  23,
  28,
  37,
  38,
  41,
  50,
  51
);

//same set of spells repeats every 13 spells
//each set has different main element and elements in effects
//each set also has some unique spells 
$this->basicSpells = array(
  //fire spells
  Spell::createWithEmpoweredEffects(
    1,
    'Colligit',
    Elements::FIRE,
    new EachSymbolEffect(Elements::WATER, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::WATER, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    2,
    'Colligit',
    Elements::FIRE,
    new EachSymbolEffect(Elements::EARTH, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::EARTH, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    3,
    'Collatio',
    Elements::FIRE,
    new EachPairEffect(Elements::WATER, Elements::AIR, 2),
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    4,
    'Vicinari',
    Elements::FIRE,
    new FullAdjacencySpellEffect(Elements::EARTH, Elements::AIR, 5),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(8)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    5,
    'Propter',
    Elements::FIRE,
    new AnyAdjacencySpellEffect(Elements::AIR, 3),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(6)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    6,
    'Praestantia',
    Elements::FIRE,
    new MajorityEffect(Elements::EARTH, 6),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(10)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    7,
    'Ambientia',
    Elements::FIRE,
    new SurroundingEffect(-1, 3, 5),
    EmpoweredSpellEffect::exclusive(new SurroundingEffect(1, 6, 9)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    8,
    'Duplex',
    Elements::FIRE,
    new DoubleSymbolEffect(Elements::FIRE),
    EmpoweredSpellEffect::exclusive(new QuadrupleSymbolEffect(Elements::FIRE)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    9,
    'Lapis Vires',
    Elements::FIRE,
    new TakeCrystalEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    10,
    'Eversor',
    Elements::FIRE,
    new DestroySpellEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    11,
    'Vitium',
    Elements::FIRE,
    new CrushCrystalsSpellEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    12,
    'Vir Dives',
    Elements::FIRE,
    new CollectionSpellEffect(Elements::EARTH, Elements::AIR, 3, 5, 9),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    13,
    'Commodum',
    Elements::FIRE,
    new ElementumFromOtherSpellEffect(0.5),
    SpellActivation::PASSIVE
  ),

  //earth spells
  Spell::createWithEmpoweredEffects(
    14,
    'Colligit',
    Elements::EARTH,
    new EachSymbolEffect(Elements::AIR, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::AIR, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    15,
    'Colligit',
    Elements::EARTH,
    new EachSymbolEffect(Elements::FIRE, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::FIRE, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    16,
    'Collatio',
    Elements::EARTH,
    new EachPairEffect(Elements::WATER, Elements::FIRE, 2),
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    17,
    'Vicinari',
    Elements::EARTH,
    new FullAdjacencySpellEffect(Elements::WATER, Elements::FIRE, 5),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(8)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    18,
    'Propter',
    Elements::EARTH,
    new AnyAdjacencySpellEffect(Elements::WATER, 3),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(6)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    19,
    'Praestantia',
    Elements::EARTH,
    new MajorityEffect(Elements::FIRE, 6),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(10)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    20,
    'Ambientia',
    Elements::EARTH,
    new SurroundingEffect(-1, 3, 5),
    EmpoweredSpellEffect::exclusive(new SurroundingEffect(1, 6, 9)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    21,
    'Duplex',
    Elements::EARTH,
    new DoubleSymbolEffect(Elements::EARTH),
    EmpoweredSpellEffect::exclusive(new QuadrupleSymbolEffect(Elements::EARTH)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    22,
    'Lapis Vires',
    Elements::EARTH,
    new TakeCrystalEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    23,
    'Multus',
    Elements::EARTH,
    new SetOf4ElementsSpellEffect(2),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    24,
    'Qui Fieri',
    Elements::EARTH,
    new VirtualElementSourcesSpellEffect(2),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    25,
    'Vir Dives',
    Elements::EARTH,
    new CollectionSpellEffect(Elements::FIRE, Elements::AIR, 3, 5, 9),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    26,
    'Induratus',
    Elements::EARTH,
    new ResistanceSpellEffect(),
    SpellActivation::PASSIVE
  ),

  //water spells
  Spell::createWithEmpoweredEffects(
    27,
    'Colligit',
    Elements::WATER,
    new EachSymbolEffect(Elements::EARTH, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::EARTH, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    28,
    'Colligit',
    Elements::WATER,
    new EachSymbolEffect(Elements::AIR, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::AIR, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    29,
    'Collatio',
    Elements::WATER,
    new EachPairEffect(Elements::EARTH, Elements::AIR, 2),
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    30,
    'Vicinari',
    Elements::WATER,
    new FullAdjacencySpellEffect(Elements::FIRE, Elements::AIR, 5),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(8)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    31,
    'Propter',
    Elements::WATER,
    new AnyAdjacencySpellEffect(Elements::FIRE, 3),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(6)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    32,
    'Praestantia',
    Elements::WATER,
    new MajorityEffect(Elements::AIR, 6),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(10)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    33,
    'Ambientia',
    Elements::WATER,
    new SurroundingEffect(-1, 3, 5),
    EmpoweredSpellEffect::exclusive(new SurroundingEffect(1, 6, 9)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    34,
    'Duplex',
    Elements::WATER,
    new DoubleSymbolEffect(Elements::WATER),
    EmpoweredSpellEffect::exclusive(new QuadrupleSymbolEffect(Elements::WATER)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    35,
    'Lapis Vires',
    Elements::WATER,
    new TakeCrystalEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    36,
    'SPECULUM',
    Elements::WATER,
    new CopyImmediateSpellSpellEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    37,
    'Rectus',
    Elements::WATER,
    new MostFullRowsSpellEffect(6),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    38,
    'Imitari',
    Elements::WATER,
    new CopyNonImmediateSpellSpellEffect(),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    39,
    'Acervus',
    Elements::WATER,
    new PowerInCrystalsSpellEffect(2, 7, 13),
    SpellActivation::PASSIVE,
    3
  ),

  //air spells
  Spell::createWithEmpoweredEffects(
    40,
    'Colligit',
    Elements::AIR,
    new EachSymbolEffect(Elements::FIRE, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::FIRE, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    41,
    'Colligit',
    Elements::AIR,
    new EachSymbolEffect(Elements::WATER, 1),
    EmpoweredSpellEffect::additive(new EachTripleOfSameElementSpellEffect(Elements::WATER, 2)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    42,
    'Collatio',
    Elements::AIR,
    new EachPairEffect(Elements::FIRE, Elements::EARTH, 2),
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    43,
    'Vicinari',
    Elements::AIR,
    new FullAdjacencySpellEffect(Elements::EARTH, Elements::WATER, 5),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(8)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    44,
    'Propter',
    Elements::AIR,
    new AnyAdjacencySpellEffect(Elements::EARTH, 3),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(6)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    45,
    'Praestantia',
    Elements::AIR,
    new MajorityEffect(Elements::WATER, 6),
    EmpoweredSpellEffect::additive(new FlatPointsSpellEffect(10)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    46,
    'Ambientia',
    Elements::AIR,
    new SurroundingEffect(-1, 3, 5),
    EmpoweredSpellEffect::exclusive(new SurroundingEffect(1, 6, 9)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::createWithEmpoweredEffects(
    47,
    'Duplex',
    Elements::AIR,
    new DoubleSymbolEffect(Elements::AIR),
    EmpoweredSpellEffect::exclusive(new QuadrupleSymbolEffect(Elements::AIR)),
    1,
    SpellActivation::PASSIVE
  ),
  Spell::create(
    48,
    'Lapis Vires',
    Elements::AIR,
    new TakeCrystalEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    49,
    'Mutare',
    Elements::AIR,
    new ExchangeWithSpellPoolSpellEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    50,
    'Iniquus',
    Elements::AIR,
    new MostIncompleteRowsSpellEffect(6),
    SpellActivation::PASSIVE
  ),
  Spell::create(
    51,
    'Bifarius',
    Elements::AIR,
    new ChangeDraftOrderOrWinADrawSpellEffect(),
    SpellActivation::IMMEDIATE //special case, it's immediate and then also counts during scoring
  ),
  Spell::create(
    52,
    'Acervus',
    Elements::AIR,
    new PowerInCrystalsSpellEffect(2, 7, 13),
    SpellActivation::PASSIVE,
    3
  ),

  //other spells
  Spell::create(
    53,
    'Velocitatis',
    Elements::UNIVERSAL,
    new PlayTwoSpellsSpellEffect(),
    SpellActivation::IMMEDIATE
  ),
  Spell::create(
    54,
    'ADDITICIUS',
    Elements::UNIVERSAL,
    new AddFromSpellPoolSpellEffect(),
    SpellActivation::IMMEDIATE
  )
);

$this->overloadSpell =
  Spell::create(
    55,
    'SUOERIACIO',
    Elements::OVERLOAD,
    new OverloadEffect(5),
    SpellActivation::IMMEDIATE
  );

$this->allSpells = array_merge($this->basicSpells, array($this->overloadSpell));
