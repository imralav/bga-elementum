<?php

require_once('./mocks/bga.php');
require_once('../../modules/php/PlayerMoveChoices/SpellPoolChoiceResolver.php');
require_once('../../modules/php/PlayerMoveChoices/DraftChoices.php');
require_once('../../modules/php/PlayerBoardSummary.php');

use Elementum\PlayerBoardSummary;
use Elementum\PlayerMoveChoices\DraftChoice;
use Elementum\PlayerMoveChoices\SpellPoolChoiceResolver;
use Elementum\PlayerMoveChoices\SpellPoolChoiceResolverInput;


class Elementum
{
    public array $allSpells;
    function __construct()
    {
        include '../../material.inc.php';
    }
    public function getSpellByNumber($spellNumber)
    {
        return $this->allSpells[$spellNumber - 1];
    }
}

class SpellPoolChoiceResolverTest
{
    private const PLAYER_1_ID = 1;
    private const PLAYER_2_ID = 2;
    private const PLAYER_3_ID = 3;

    private static $WITH_1_FIRE_SPELL;
    private static $WITH_2_FIRE_SPELLS;

    public static function init()
    {
        self::$WITH_1_FIRE_SPELL = new PlayerBoardSummary(1, 0, 0, 0);
        self::$WITH_2_FIRE_SPELLS = new PlayerBoardSummary(2, 0, 0, 0);
    }

    public function shouldReturnEmptyResultsOnEmptyInput()
    {
        $input = new SpellPoolChoiceResolverInput([], [], []);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 0, 'Expected empty results, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 0, 'Expected empty results, got ' . json_encode($results));
    }

    public function shouldReturnProperResultsIfThereEachPlayerSelectedDifferentSpell()
    {
        $input = new SpellPoolChoiceResolverInput([self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1), self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 2)], [], []);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 0, 'Expected 0 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 2, 'Expected 2 players that get to use spell pool, got ' . json_encode($results));
    }

    public function shouldDenyAllPlayersIfTheyConflictAndHaveNoSpellsAndNoCrystals()
    {
        $input = new SpellPoolChoiceResolverInput([self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1), self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1)], [], []);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 0, 'Expected 0 players that get to use spell pool, got ' . json_encode($results));
    }

    public function shouldDenyAllPlayersIfTheyConflictAndHaveSameAmountOfSpellsInGivenColumnAndNoCrystals()
    {
        $input = new SpellPoolChoiceResolverInput(
            [self::PLAYER_1_ID => self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1), self::PLAYER_2_ID => self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1)],
            [self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS, self::PLAYER_2_ID => self::$WITH_2_FIRE_SPELLS],
            []
        );
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 0, 'Expected 0 players that get to use spell pool, got ' . json_encode($results));
    }

    public function shouldDenyAllPlayersIfTheyConflictAndHaveSameAmountOfSpellsInGivenColumnAndSameAmountOfCrystals()
    {
        $input = new SpellPoolChoiceResolverInput(
            [self::PLAYER_1_ID => self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1), self::PLAYER_2_ID => self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1)],
            [self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS, self::PLAYER_2_ID => self::$WITH_2_FIRE_SPELLS],
            [self::PLAYER_1_ID => 2, self::PLAYER_2_ID => 2]
        );
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 0, 'Expected 0 players that get to use spell pool, got ' . json_encode($results));
    }

    public function shouldLetOnePlayerPlaySpellIfItHasMoreCardsOfGivenElement()
    {
        $input = new SpellPoolChoiceResolverInput(
            [self::PLAYER_1_ID => self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1), self::PLAYER_2_ID => self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1)],
            [self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS, self::PLAYER_2_ID => self::$WITH_1_FIRE_SPELL],
            [self::PLAYER_1_ID => 2, self::PLAYER_2_ID => 2]
        );
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert($results->getPlayersThatGetToUseSpellPool() === [self::PLAYER_1_ID], 'Expected players that get to use spell pool to be [PLAYER_1_ID], got ' . json_encode($results->getPlayersThatGetToUseSpellPool()));
        assert($results->getPlayersThatDidntGetToUseSpellPool() === [self::PLAYER_2_ID], 'Expected players that didnt get to use spell pool to be [PLAYER_2_ID], got ' . json_encode($results->getPlayersThatDidntGetToUseSpellPool()));
    }

    public function shouldLetOnePlayerPlaySpellIfItHasMoreCrystals()
    {
        $input = new SpellPoolChoiceResolverInput(
            [self::PLAYER_1_ID => self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1), self::PLAYER_2_ID => self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1)],
            [self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS, self::PLAYER_2_ID => self::$WITH_2_FIRE_SPELLS],
            [self::PLAYER_1_ID => 2, self::PLAYER_2_ID => 1]
        );
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert($results->getPlayersThatGetToUseSpellPool() === [self::PLAYER_1_ID], 'Expected players that get to use spell pool to be [PLAYER_1_ID], got ' . json_encode($results->getPlayersThatGetToUseSpellPool()));
        assert($results->getPlayersThatDidntGetToUseSpellPool() === [self::PLAYER_2_ID], 'Expected players that didnt get to use spell pool to be [PLAYER_2_ID], got ' . json_encode($results->getPlayersThatDidntGetToUseSpellPool()));
    }

    public function shouldDenyAllPlayersIfTwoHaveSameCardsAndCrystalsAndThirdHasLessCards()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::PLAYER_1_ID => self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::PLAYER_2_ID => self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::PLAYER_3_ID => self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_2_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_3_ID => self::$WITH_1_FIRE_SPELL
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 1
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 3, 'Expected 3 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 0, 'Expected 0 players that get to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowThirdPlayerIfTheyHaveMoreCards()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_2_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_3_ID => self::$WITH_2_FIRE_SPELLS
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 1
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 1, 'Expected 1 player that gets to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowThirdPlayerIfTheyHaveMoreCrystals()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_2_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_3_ID => self::$WITH_1_FIRE_SPELL
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 2
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 1, 'Expected 1 player that gets to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowThirdPlayerIfTheyHaveMoreCardsAndCrystals()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_2_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_3_ID => self::$WITH_2_FIRE_SPELLS
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 2
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 1, 'Expected 1 player that gets to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowThirdPlayerIfTheyHaveMoreCards2()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_2_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_3_ID => self::$WITH_2_FIRE_SPELLS
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 1
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 1, 'Expected 1 player that gets to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowThirdPlayerIfTheyHaveMoreCrystals2()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_2_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_3_ID => self::$WITH_2_FIRE_SPELLS
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 2
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 1, 'Expected 1 player that gets to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowThirdPlayerIfTheyHaveMoreCrystalsAndOthersHaveSameCards()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 1)
        ], [
            self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_2_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_3_ID => self::$WITH_2_FIRE_SPELLS
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 2
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 2, 'Expected 2 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 1, 'Expected 1 player that gets to use spell pool, got ' . json_encode($results));
    }

    public function shouldAllowAllThreePlayersIfEveryonePickedSomethingElse()
    {
        $input = new SpellPoolChoiceResolverInput([
            self::playerChoosesSpellPoolCard(self::PLAYER_1_ID, 1),
            self::playerChoosesSpellPoolCard(self::PLAYER_2_ID, 2),
            self::playerChoosesSpellPoolCard(self::PLAYER_3_ID, 3)
        ], [
            self::PLAYER_1_ID => self::$WITH_2_FIRE_SPELLS,
            self::PLAYER_2_ID => self::$WITH_1_FIRE_SPELL,
            self::PLAYER_3_ID => self::$WITH_2_FIRE_SPELLS
        ], [
            self::PLAYER_1_ID => 1,
            self::PLAYER_2_ID => 1,
            self::PLAYER_3_ID => 0
        ]);
        $resolver = new SpellPoolChoiceResolver(new Elementum());
        $results = $resolver->resolve($input);
        assert(count($results->getPlayersThatDidntGetToUseSpellPool()) === 0, 'Expected 0 players that didnt get to use spell pool, got ' . json_encode($results));
        assert(count($results->getPlayersThatGetToUseSpellPool()) === 3, 'Expected 3 players that get to use spell pool, got ' . json_encode($results));
    }

    private static function playerChoosesSpellPoolCard($playerId, $spellPoolCardNumber)
    {
        return new DraftChoice($playerId, 'useSpellPool', $spellPoolCardNumber);
    }
}


SpellPoolChoiceResolverTest::init();
$test = new SpellPoolChoiceResolverTest();
$methods = get_class_methods($test);
foreach ($methods as $method) {
    if (strpos($method, 'should') === 0) {
        $test->$method();
        echo "$method passed\n";
    }
}
