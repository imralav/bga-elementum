<?php

namespace Elementum;

use Elementum;
use Elementum\PlayerBoard;
use Elementum\SpellEffects\AnyAdjacencySpellEffect;
use Elementum\SpellEffects\FullAdjacencySpellEffect;
use Elementum\Spells\Spell;

class ElementSourceAndNeighbours
{
    /**
     * @var array<int> list of spell numbers
     */
    public array $currentElementSpellsNumbers;
    /**
     * @var array<int> list of spell numbers
     */
    private array $nextElementSpellsNumbers;
    /**
     * @var array<int> list of spell numbers
     */
    private array $previousElementSpellsNumbers;

    /**
     * @param array<int> $currentElementSpellsNumbers
     * @param array<int> $nextElementSpellsNumbers
     * @param array<int> $previousElementSpellsNumbers
     */
    public function __construct(array $currentElementSpellsNumbers, array $nextElementSpellsNumbers, array $previousElementSpellsNumbers)
    {
        $this->currentElementSpellsNumbers = $currentElementSpellsNumbers;
        $this->nextElementSpellsNumbers = $nextElementSpellsNumbers;
        $this->previousElementSpellsNumbers = $previousElementSpellsNumbers;
    }

    private function getElementOfPreviousSource(int $index): ?string
    {
        $spellNumber = $this->previousElementSpellsNumbers[$index] ?? null;
        if ($spellNumber === null) {
            return null;
        }
        return Elementum::get()->getSpellByNumber($spellNumber)->element;
    }

    private function getElementOfNextSource(int $index): ?string
    {
        $spellNumber = $this->nextElementSpellsNumbers[$index] ?? null;
        if ($spellNumber === null) {
            return null;
        }
        return Elementum::get()->getSpellByNumber($spellNumber)->element;
    }

    function elementHasNoMatchingNeighbour(string $element, int $index): bool
    {
        $leftNeighbour = $this->getElementOfPreviousSource($index);
        $rightNeighbour = $this->getElementOfNextSource($index);
        return $element !== $leftNeighbour && $element !== $rightNeighbour;
    }

    /**
     * @param callable(int, Spell): void $callback
     */
    function forEachSpellWithAdjacencyEffect(callable $callback): void
    {
        foreach ($this->currentElementSpellsNumbers as $index => $spellNumber) {
            $spell = Elementum::get()->getSpellByNumber($spellNumber);
            if (in_array($spell->effect->type, VirtualElementSourcesFinder::ADJACENCY_EFFECT_TYPES)) {
                Elementum::get()->dump("=============spell with adjacency effect", $spell);
                $callback($index, $spell);
            }
        }
    }
}

/**
 * Class responsible for finding virtual element sources in a given {@link PlayerBoard}.
 */
class VirtualElementSourcesFinder
{
    const ADJACENCY_EFFECT_TYPES = [ANY_ADJACENCY_SPELL_EFFECT_TYPE, FULL_ADJACENCY_SPELL_EFFECT_TYPE];

    private PlayerBoard $playerBoard;

    private function __construct(PlayerBoard $playerBoard)
    {
        $this->playerBoard = $playerBoard;
    }

    /**
     * @param callable(ElementSourceAndNeighbours): void $callback
     */
    private function forEachElementSource(callable $callback): void
    {
        $elementSources = $this->playerBoard->elementSources;
        foreach ($elementSources as $index => $elementSource) {
            $currentElementSource = $elementSource;
            $currentElementSpellsNumbers = $this->playerBoard->board[$currentElementSource];
            $nextElementSource = $elementSources[$index + 1] ?? $elementSources[0];
            $nextElementSpellsNumbers = $this->playerBoard->board[$nextElementSource];
            $previousElementSource = $elementSources[$index - 1] ?? $elementSources[count($elementSources) - 1];
            $previousElementSpellsNumbers = $this->playerBoard->board[$previousElementSource];
            $context = new ElementSourceAndNeighbours($currentElementSpellsNumbers, $nextElementSpellsNumbers, $previousElementSpellsNumbers);
            $callback($context);
        }
    }

    /**
     * @param PlayerBoard $playerBoard
     * @return array<int, array<string>> map of spell numbers to a list of elements that are not met with natural element sources, so they could be filled with virtual ones
     */
    public static function findIn(PlayerBoard $playerBoard)
    {
        /**
         * @var array<int, array<string>>
         */
        $virtualElementCandidates = [];
        Elementum::get()->debug("=============finding virtual element sources",);
        $finder = new VirtualElementSourcesFinder($playerBoard);
        $finder->forEachElementSource(function (ElementSourceAndNeighbours $context) use (&$virtualElementCandidates) {
            $context->forEachSpellWithAdjacencyEffect(function (int $index, Spell $spell) use (&$virtualElementCandidates, $context) {
                $elementsToCheck = self::extractElementsToCheckFrom($spell);
                $currentSpellCandidates = array();
                foreach ($elementsToCheck as $element) {
                    if ($context->elementHasNoMatchingNeighbour($element, $index)) {
                        $currentSpellCandidates[] = $element;
                    }
                }
                if (!empty($currentSpellCandidates)) {
                    Elementum::get()->dump("=============virtual element sources found", $currentSpellCandidates);
                    $virtualElementCandidates[$spell->number] = $currentSpellCandidates;
                }
            });
        });
        Elementum::get()->dump("=============virtual element sources found", $virtualElementCandidates);
        return $virtualElementCandidates;
    }

    private static function extractElementsToCheckFrom(Spell $spell): array
    {
        if ($spell->effect instanceof FullAdjacencySpellEffect) {
            return [$spell->effect->firstElement, $spell->effect->secondElement];
        }
        if ($spell->effect instanceof AnyAdjacencySpellEffect) {
            return [$spell->effect->element];
        }
        return [];
    }
}
