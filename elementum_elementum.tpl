{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- Elementum implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------
-->
<div id="cards-spawn-point"></div>
<div id="layout">
  <div id="spell-pool-and-current-player-hand">
    <div id="spell-pool-container" class="frame">
      <span>Spell pool</span>
      <div id="spell-pool"></div>
    </div>
    <div id="crystals-pile-container" class="frame">
      <span>Crystals</span>
      <div id="main-crystals-pile" class="crystals-pile"></div>
    </div>
    <div id="current-player-hand-container" class="frame">
      <span>Your hand</span>
      <div id="current-player-hand"></div>
    </div>
  </div>
  <div id="board"></div>
</div>
<div id="animation-surface"></div>

<script type="text/javascript">
  // Spells, element sources
  var jstpl_spell =
    '<div class="spell ${element}" id="spell_${spellNumber}"><pre>${spellSummaryData}</pre></div>';
  var jstpl_element_source =
    '<div class="spell element-source ${element}" id="element_source_${element}">${icon}</div>';

  // Crystals, Crystal piles - on board and on player panels
  var jstpl_crystal = '<div class="crystal" id="crystal-${id}"></div>';
  var jstpl_crystals_pile_on_player_panel =
    '<div class="crystals-pile frame" id="crystals-pile-${playerId}"></div>';

  // player boards
  //TODO: BGA silnik używa klas player-board, podmienić na coś customowego
  var jstpl_player_board_container =
    '<div class="player-board frame" id="player-board-${playerId}"><span>${playerName}\'s board</span><div class="player-board-container" id="player-board-container-${playerId}"></div></div>';
  var jstpl_spells_column =
    '<div class="spells-column ${element}" id="spells-column-${playerId}-${element}"></div>';
</script>

{OVERALL_GAME_FOOTER}
