var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("cookbook/common", ["require", "exports", "dojo", "ebg/core/common"], function (require, exports, dojo) {
    "use strict";
    var CommonMixin = function (Base) { return (function (_super) {
        __extends(Common, _super);
        function Common() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Common.prototype.attachToNewParentNoDestroy = function (mobile_in, new_parent_in, relation, place_position) {
            var mobile = $(mobile_in);
            var new_parent = $(new_parent_in);
            if (!mobile || !new_parent) {
                console.error("attachToNewParentNoDestroy: mobile or new_parent was not found on dom.", mobile_in, new_parent_in);
                return { l: NaN, t: NaN, w: NaN, h: NaN };
            }
            var src = dojo.position(mobile);
            if (place_position)
                mobile.style.position = place_position;
            dojo.place(mobile, new_parent, relation);
            mobile.offsetTop;
            var tgt = dojo.position(mobile);
            var box = dojo.marginBox(mobile);
            var cbox = dojo.contentBox(mobile);
            if (!box.t || !box.l || !box.w || !box.h || !cbox.w || !cbox.h) {
                console.error("attachToNewParentNoDestroy: box or cbox has an undefined value (t-l-w-h). This should not happen.", box, cbox);
                return box;
            }
            var left = box.l + src.x - tgt.x;
            var top = box.t + src.y - tgt.y;
            mobile.style.position = "absolute";
            mobile.style.left = left + "px";
            mobile.style.top = top + "px";
            box.l += box.w - cbox.w;
            box.t += box.h - cbox.h;
            mobile.offsetTop;
            return box;
        };
        Common.prototype.ajaxAction = function (action, args, callback, ajax_method) {
            if (!this.checkAction(action))
                return false;
            if (!args)
                args = {};
            if (!args.lock)
                args.lock = true;
            this.ajaxcall("/".concat(this.game_name, "/").concat(this.game_name, "/").concat(action, ".html"), args, this, function () { }, callback, ajax_method);
            return true;
        };
        Common.prototype.subscribeNotif = function (event, callback) {
            return dojo.subscribe(event, this, callback);
        };
        Common.prototype.addImageActionButton = function (id, label, method, destination, blinking, color, tooltip) {
            if (!color)
                color = "gray";
            this.addActionButton(id, label, method, destination, blinking, color);
            var div = $(id);
            if (div === null) {
                console.error("addImageActionButton: id was not found on dom", id);
                return null;
            }
            if (!(div instanceof HTMLElement)) {
                console.error("addImageActionButton: id was not an HTMLElement", id, div);
                return null;
            }
            dojo.style(div, "border", "none");
            dojo.addClass(div, "shadow bgaimagebutton");
            if (tooltip) {
                dojo.attr(div, "title", tooltip);
            }
            return div;
        };
        Common.prototype.isReadOnly = function () {
            return this.isSpectator || typeof g_replayFrom !== 'undefined' || g_archive_mode;
        };
        Common.prototype.scrollIntoViewAfter = function (target, delay) {
            if (this.instantaneousMode)
                return;
            var target_div = $(target);
            if (target_div === null) {
                console.error("scrollIntoViewAfter: target was not found on dom", target);
                return;
            }
            if (typeof g_replayFrom != "undefined" || !delay || delay <= 0) {
                target_div.scrollIntoView();
                return;
            }
            setTimeout(function () {
                target_div.scrollIntoView({ behavior: "smooth", block: "center" });
            }, delay);
        };
        Common.prototype.divYou = function () {
            return this.divColoredPlayer(this.player_id, __("lang_mainsite", "You"));
        };
        Common.prototype.divColoredPlayer = function (player_id, text) {
            var player = this.gamedatas.players[player_id];
            if (player === undefined)
                return "--unknown player--";
            return "<span style=\"color:".concat(player.color, ";background-color:#").concat(player.color_back, ";\">").concat(text !== null && text !== void 0 ? text : player.name, "</span>");
        };
        Common.prototype.setMainTitle = function (html) {
            $('pagemaintitletext').innerHTML = html;
        };
        Common.prototype.setDescriptionOnMyTurn = function (description) {
            this.gamedatas.gamestate.descriptionmyturn = description;
            var tpl = dojo.clone(this.gamedatas.gamestate.args);
            if (tpl === null)
                tpl = {};
            if (this.isCurrentPlayerActive() && description !== null)
                tpl.you = this.divYou();
            var title = this.format_string_recursive(description, tpl);
            this.setMainTitle(title !== null && title !== void 0 ? title : '');
        };
        Common.prototype.addPreferenceListener = function (callback) {
            var _this = this;
            dojo.query('.preference_control').on('change', function (e) {
                var _a;
                var target = e.target;
                if (!(target instanceof HTMLSelectElement)) {
                    console.error("Preference control class is not a valid element to be listening to events from. The target of the event does not have an id.", e.target);
                    return;
                }
                var match = (_a = target.id.match(/^preference_[cf]ontrol_(\d+)$/)) === null || _a === void 0 ? void 0 : _a[1];
                if (!match)
                    return;
                var matchId = parseInt(match);
                if (isNaN(matchId)) {
                    console.error("Preference control id was not a valid number.", match);
                    return;
                }
                var pref = _this.prefs[matchId];
                if (!pref) {
                    console.warn("Preference was changed but somehow the preference id was not found.", matchId, _this.prefs);
                    return;
                }
                var value = target.value;
                if (!pref.values[value]) {
                    console.warn("Preference value was changed but somehow the value is not a valid value.", value, pref.values);
                }
                pref.value = value;
                callback(matchId);
            });
        };
        return Common;
    }(Base)); };
    return CommonMixin;
});
define("src/client/spells/elementum.types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/client/spells/Spell", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/client/common/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getIconForElement = exports.doAfter = void 0;
    function doAfter(millins, action) {
        setTimeout(action, millins);
    }
    exports.doAfter = doAfter;
    function getIconForElement(element) {
        switch (element) {
            case "fire":
                return "🔥";
            case "water":
                return "💦";
            case "earth":
                return "🌍";
            case "air":
                return "💨";
            case "universal":
                return "☀";
            default:
                throw new Error("Unknown element: ".concat(element));
        }
    }
    exports.getIconForElement = getIconForElement;
});
define("src/client/common/Templates", ["require", "exports", "bgagame/elementum", "src/client/common/utils"], function (require, exports, elementum_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Templates = void 0;
    var Templates = (function () {
        function Templates() {
        }
        Templates.spell = function (spell) {
            return elementum_1.Elementum.getInstance().format_block("jstpl_spell", {
                spellNumber: spell.number,
                spellSummaryData: "".concat((0, utils_1.getIconForElement)(spell.element), " ").concat(spell.number, ": ").concat(spell.name, "\n(").concat(spell.spellActivation === "immediate" ? "immediate" : "passive", ")\n"),
                effect: JSON.stringify(spell.effect, null, 2),
                empoweredEffect: spell.empoweredEffect
                    ? JSON.stringify(spell.empoweredEffect, null, 2)
                    : "none",
                element: spell.element,
            });
        };
        Templates.playerBoard = function (playerId, playerName) {
            return elementum_1.Elementum.getInstance().format_block("jstpl_player_board_container", { playerId: playerId, playerName: playerName });
        };
        Templates.idOfPlayerBoard = function (playerId) {
            return "player-board-".concat(playerId);
        };
        Templates.idOfSpell = function (spell) {
            return Templates.idOfSpellByNumber(spell.number);
        };
        Templates.idOfSpellByNumber = function (spellNumber) {
            return "spell_".concat(spellNumber);
        };
        Templates.idOfSpellColumn = function (playerId, element) {
            return "spells-column-".concat(playerId, "-").concat(element);
        };
        Templates.idOfElementSource = function (playerId, element) {
            return "element-source-".concat(playerId, "-").concat(element);
        };
        Templates.textBeforeCancelButton = function (text) {
            return "<span id=\"text-before-cancel-button\">".concat(text, "</span>");
        };
        Templates.gameInfoPanel = function () {
            return "<div id=\"game-info-panel\" class=\"player-board\">\n              <span>Current round: <span id=\"current-round\">0</span>/<span id=\"total-rounds\">3</span></span>\n            </div>";
        };
        return Templates;
    }());
    exports.Templates = Templates;
});
define("src/client/common/variation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomVariation = void 0;
    function randomVariation(from, variation) {
        return from + Math.random() * (2 * variation) - variation;
    }
    exports.randomVariation = randomVariation;
});
define("src/client/gui/Crystals", ["require", "exports", "ebg/zone", "src/client/common/utils"], function (require, exports, Zone, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Crystals = void 0;
    var Crystals = (function () {
        function Crystals(amountOfCrystalsInPile, amountOfCrystalsPerPlayer, core) {
            this.amountOfCrystalsPerPlayer = amountOfCrystalsPerPlayer;
            this.core = core;
            this.crystalsPilesPerPlayer = {};
            this.allCrystalsAmount = 0;
            this.allCrystalsAmount =
                amountOfCrystalsInPile +
                    +Object.values(amountOfCrystalsPerPlayer)
                        .map(function (a) { return +a; })
                        .reduce(function (a, b) { return a + b; }, 0);
        }
        Crystals.prototype.putCrystalsOnBoardAndInPlayerPanels = function () {
            this.createCrystalsPileAndAddInitialCrystals();
            this.createCrystalsForPlayers();
        };
        Crystals.prototype.createCrystalsPileAndAddInitialCrystals = function () {
            this.createMainPile();
            this.addInitialCrystals();
        };
        Crystals.prototype.createMainPile = function () {
            var crystalsPile = $(Crystals.CRYSTALS_PILE_ID);
            this.crystalsPile = { zone: new Zone(), element: crystalsPile };
            this.crystalsPile.zone.create(this.core, crystalsPile, Crystals.CRYSTAL_SIZE, Crystals.CRYSTAL_SIZE);
        };
        Crystals.prototype.addInitialCrystals = function () {
            for (var i = 0; i < this.allCrystalsAmount; i++) {
                var id = this.createCrystalElement(i).id;
                this.crystalsPile.zone.placeInZone(id, 1);
            }
        };
        Crystals.prototype.createCrystalElement = function (id) {
            var element = this.core.format_block("jstpl_crystal", { id: id });
            return dojo.place(element, Crystals.CRYSTALS_PILE_ID);
        };
        Crystals.prototype.createCrystalsForPlayers = function () {
            console.log("Creating crystals for players");
            this.addCrystalsPilesToPlayerPanels();
            this.dealInitialCrystalsToEachPlayer();
        };
        Crystals.prototype.addCrystalsPilesToPlayerPanels = function () {
            var _this = this;
            Object.keys(this.amountOfCrystalsPerPlayer).forEach(function (playerId) {
                _this.createCrystalsPileForPlayer(playerId);
            });
        };
        Crystals.prototype.createCrystalsPileForPlayer = function (playerId) {
            var crystalsPile = this.core.format_block("jstpl_crystals_pile_on_player_panel", { playerId: playerId });
            var pileInDom = dojo.place(crystalsPile, "player_board_".concat(playerId));
            var crystalsPileZone = new Zone();
            crystalsPileZone.create(this.core, pileInDom, Crystals.CRYSTAL_SIZE, Crystals.CRYSTAL_SIZE);
            this.crystalsPilesPerPlayer[playerId] = {
                zone: crystalsPileZone,
                element: pileInDom,
            };
            return crystalsPile;
        };
        Crystals.prototype.dealInitialCrystalsToEachPlayer = function () {
            var _this = this;
            var _a;
            var _loop_1 = function (playerId) {
                var amount = +((_a = this_1.amountOfCrystalsPerPlayer[playerId]) !== null && _a !== void 0 ? _a : 0);
                for (var i = 0; i < amount; i++) {
                    (0, utils_2.doAfter)(1000 * (2 + i), function () {
                        return _this.moveCrystalFromPileToPlayer(playerId);
                    });
                }
            };
            var this_1 = this;
            for (var _i = 0, _b = Object.keys(this.amountOfCrystalsPerPlayer); _i < _b.length; _i++) {
                var playerId = _b[_i];
                _loop_1(playerId);
            }
        };
        Crystals.prototype.moveCrystalFromPileToPlayer = function (playerId) {
            var id = this.getIdOfFirstCrystalInPile();
            var crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId];
            this.crystalsPile.zone.removeFromZone(id, false, crystalsPileOfPlayer.element.id);
            this.crystalsPilesPerPlayer[playerId].zone.placeInZone(id, 1);
        };
        Crystals.prototype.getIdOfFirstCrystalInPile = function () {
            var crystal = this.crystalsPile.element.childNodes[0];
            return crystal.id;
        };
        Crystals.prototype.moveCrystalsFromPlayerToPile = function (playerId, amount) {
            var _this = this;
            for (var i = 0; i < amount; i++) {
                (0, utils_2.doAfter)(1000 * (2 + i), function () { return _this.moveCrystalFromPlayerToPile(playerId); });
            }
        };
        Crystals.prototype.moveCrystalFromPlayerToPile = function (playerId) {
            var id = this.getIdOfFirstCrystalInPlayerPile(playerId);
            var crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId];
            crystalsPileOfPlayer.zone.removeFromZone(id, false, Crystals.CRYSTALS_PILE_ID);
            this.crystalsPile.zone.placeInZone(id, 1);
        };
        Crystals.prototype.getIdOfFirstCrystalInPlayerPile = function (playerId) {
            var crystal = this.crystalsPilesPerPlayer[playerId].element
                .childNodes[0];
            return crystal.id;
        };
        Crystals.prototype.moveCrystalFromAllPlayersToPile = function () {
            for (var _i = 0, _a = Object.keys(this.crystalsPilesPerPlayer); _i < _a.length; _i++) {
                var playerId = _a[_i];
                this.moveCrystalFromPlayerToPile(playerId);
            }
        };
        Crystals.CRYSTALS_PILE_ID = "main-crystals-pile";
        Crystals.CRYSTAL_SIZE = 16;
        return Crystals;
    }());
    exports.Crystals = Crystals;
});
define("src/client/gui/GameInfoPanel", ["require", "exports", "src/client/common/Templates", "ebg/counter"], function (require, exports, Templates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameInfoPanel = void 0;
    var GameInfoPanel = (function () {
        function GameInfoPanel() {
        }
        GameInfoPanel.init = function () {
            dojo.place(Templates_1.Templates.gameInfoPanel(), "player_boards", "first");
            this.currentRoundCounter.create("current-round");
        };
        GameInfoPanel.updateCurrentRound = function (round) {
            this.currentRoundCounter.toValue(round);
        };
        GameInfoPanel.GAME_INFO_PANEL_ID = "game-info-panel";
        GameInfoPanel.currentRoundCounter = new ebg.counter();
        return GameInfoPanel;
    }());
    exports.GameInfoPanel = GameInfoPanel;
});
define("src/client/gui/PlayerBoard", ["require", "exports", "src/client/common/utils", "src/client/common/Templates"], function (require, exports, utils_3, Templates_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayerBoard = void 0;
    var PlayerBoard = (function () {
        function PlayerBoard(playerId, playerBoard, core) {
            this.playerId = playerId;
            this.playerBoard = playerBoard;
            this.core = core;
            this.elementSourceClickHandlers = [];
            this.elementSourceClickListeners = [];
            this.spellClickHandlers = [];
            this.spellClickListeners = [];
            this.createPlayerBoard();
        }
        PlayerBoard.prototype.createPlayerBoard = function () {
            this.createPlayerBoardContainer();
            this.createPlayerBoardColumns();
        };
        PlayerBoard.prototype.createPlayerBoardContainer = function () {
            var playerName = this.core.gamedatas.players[+this.playerId].name;
            var playerBoardContainer = Templates_2.Templates.playerBoard(this.playerId, playerName);
            dojo.place(playerBoardContainer, "board");
        };
        PlayerBoard.prototype.createPlayerBoardColumns = function () {
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                this.createPlayerBoardColumn(element);
                this.putElementSourceAsFirstElementInColumn(element);
                this.putSpellsInColumn(this.playerBoard.board[element], element);
            }
        };
        PlayerBoard.prototype.createPlayerBoardColumn = function (element) {
            var elementColumn = this.core.format_block("jstpl_spells_column", {
                playerId: this.playerId,
                element: element,
            });
            dojo.place(elementColumn, "player-board-container-".concat(this.playerId));
        };
        PlayerBoard.prototype.putElementSourceAsFirstElementInColumn = function (element) {
            var elementSource = this.core.format_block("jstpl_element_source", {
                element: element,
                playerId: this.playerId,
                icon: (0, utils_3.getIconForElement)(element),
            });
            dojo.place(elementSource, this.getIdOfElementColumnForCurrentPlayer(element));
        };
        PlayerBoard.prototype.makeElementSourcesClickable = function () {
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                var elementSourceNode = document.getElementById(Templates_2.Templates.idOfElementSource(this.playerId, element));
                this.makeElementSourceClickable(elementSourceNode);
            }
        };
        PlayerBoard.prototype.makeElementSourcesNotClickable = function () {
            this.disconnectAndClearClickHandlers();
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                var elementSourceNode = document.getElementById(Templates_2.Templates.idOfElementSource(this.playerId, element));
                dojo.removeClass(elementSourceNode, "clickable");
            }
        };
        PlayerBoard.prototype.disconnectAndClearClickHandlers = function () {
            this.elementSourceClickHandlers.forEach(function (handler) {
                dojo.disconnect(handler);
            });
            this.elementSourceClickHandlers = [];
        };
        PlayerBoard.prototype.makeElementSourceClickable = function (elementSourceNode) {
            dojo.addClass(elementSourceNode, "clickable");
            this.registerClickHandlerOn(elementSourceNode);
        };
        PlayerBoard.prototype.registerClickHandlerOn = function (elementSourceNode) {
            var _this = this;
            var handler = dojo.connect(elementSourceNode, "onclick", function (evt) {
                _this.elementSourceClickListeners.forEach(function (listener) {
                    var element = _this.pickElementSourceFromEvent(evt);
                    listener(_this.playerId, element);
                });
            });
            this.elementSourceClickHandlers.push(handler);
        };
        PlayerBoard.prototype.pickElementSourceFromEvent = function (evt) {
            var htmlElement = evt.target;
            var id = htmlElement.id;
            var element = id.split("-")[3];
            return element;
        };
        PlayerBoard.prototype.getIdOfElementColumnForCurrentPlayer = function (element) {
            return "spells-column-".concat(this.playerId, "-").concat(element);
        };
        PlayerBoard.prototype.putSpellsInColumn = function (spellNumber, element) {
            for (var _i = 0, spellNumber_1 = spellNumber; _i < spellNumber_1.length; _i++) {
                var spell = spellNumber_1[_i];
                this.putSpellOnBoard(spell, element);
            }
        };
        PlayerBoard.prototype.putSpellOnBoard = function (spellNumber, element) {
            var spellTemplate = Templates_2.Templates.spell(this.core.getSpellByNumber(spellNumber));
            dojo.place(spellTemplate, this.getIdOfElementColumnForCurrentPlayer(element));
        };
        PlayerBoard.prototype.whenElementSourceClicked = function (listener) {
            this.elementSourceClickListeners.push(listener);
        };
        PlayerBoard.prototype.markAsCurrentPlayer = function () {
            dojo.addClass(Templates_2.Templates.idOfPlayerBoard(this.playerId), "current");
        };
        PlayerBoard.prototype.makeSpellsClickable = function () {
            var _this = this;
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                var columnId = this.getIdOfElementColumnForCurrentPlayer(element);
                document.querySelectorAll("#".concat(columnId, " .spell")).forEach(function (spellNode) {
                    _this.makeSpellClickable(spellNode);
                });
            }
        };
        PlayerBoard.prototype.makeSpellClickable = function (spellNode) {
            dojo.addClass(spellNode, "clickable");
            this.registerSpellClickHandlerOn(spellNode);
        };
        PlayerBoard.prototype.registerSpellClickHandlerOn = function (spellNode) {
            var _this = this;
            var handler = dojo.connect(spellNode, "onclick", function (evt) {
                _this.spellClickListeners.forEach(function (listener) {
                    var spell = _this.pickSpellFromEvent(evt);
                    listener(_this.playerId, spell, spell.element);
                });
            });
            this.spellClickHandlers.push(handler);
        };
        PlayerBoard.prototype.pickSpellFromEvent = function (evt) {
            var htmlElement = evt.target;
            var id = htmlElement.id;
            var spellNumber = id.split("_")[1];
            return this.core.getSpellByNumber(+spellNumber);
        };
        PlayerBoard.prototype.whenSpellClicked = function (onSpellOnBoardClicked) {
            this.spellClickListeners.push(onSpellOnBoardClicked);
        };
        PlayerBoard.prototype.makeSpellsNotClickable = function () {
            this.spellClickHandlers.forEach(function (handler) {
                dojo.disconnect(handler);
            });
            this.spellClickHandlers = [];
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                var columnId = this.getIdOfElementColumnForCurrentPlayer(element);
                document.querySelectorAll("#".concat(columnId, " .spell")).forEach(function (spellNode) {
                    dojo.removeClass(spellNode, "clickable");
                });
            }
        };
        PlayerBoard.prototype.removeSpell = function (spell) {
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                var columnSpells = this.playerBoard.board[element];
                var spellIndex = columnSpells.indexOf(spell.number);
                if (spellIndex !== -1) {
                    columnSpells.splice(spellIndex, 1);
                    dojo.destroy(Templates_2.Templates.idOfSpell(spell));
                }
            }
        };
        return PlayerBoard;
    }());
    exports.PlayerBoard = PlayerBoard;
});
define("src/client/gui/Spells", ["require", "exports", "src/client/common/Templates"], function (require, exports, Templates_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Spells = void 0;
    var Spells = (function () {
        function Spells(containerId, spells, gui) {
            this.containerId = containerId;
            this.spells = spells;
            this.gui = gui;
            this.spellClickHandlers = [];
            this.spellClickedListeners = [];
            this.addSpellsToDOMAndMakeThenClickable(spells);
        }
        Spells.prototype.clearSpells = function () {
            this.makeAllSpellsUnClickable();
            dojo.empty(this.containerId);
            this.spells = [];
            this.spellClickHandlers.forEach(function (handler) { return dojo.disconnect(handler); });
            this.spellClickHandlers = [];
        };
        Spells.prototype.makeSpellUnClickable = function (spell) {
            dojo.removeClass(spell, "clickable");
        };
        Spells.prototype.makeAllSpellsUnClickable = function () {
            var _this = this;
            this.forEachSpellInDom(function (spell) { return _this.makeSpellUnClickable(spell); });
        };
        Spells.prototype.addSpellsToDOMAndMakeThenClickable = function (spells) {
            for (var _i = 0, spells_1 = spells; _i < spells_1.length; _i++) {
                var spell = spells_1[_i];
                var spellBlock = Templates_3.Templates.spell(spell);
                dojo.place(spellBlock, this.containerId);
            }
            this.makeSpellsClickable();
        };
        Spells.prototype.whenSpellClicked = function (onSpellClicked) {
            this.spellClickedListeners.push(onSpellClicked);
        };
        Spells.prototype.makeSpellsClickable = function () {
            var _this = this;
            this.forEachSpellInDom(function (spell) {
                _this.makeSpellNodeClickable(spell);
            });
        };
        Spells.prototype.makeSpellNodeClickable = function (spell) {
            var _this = this;
            dojo.addClass(spell, "clickable");
            var handler = dojo.connect(spell, "onclick", function (evt) {
                _this.pickSpellFromEvent(evt).then(function (spell) {
                    _this.spellClickedListeners.forEach(function (listener) { return listener(spell); });
                });
            });
            this.spellClickHandlers.push(handler);
        };
        Spells.prototype.forEachSpellInDom = function (callback) {
            dojo
                .query("#".concat(this.containerId, " div.spell"))
                .forEach(function (spell) { return callback(spell); });
        };
        Spells.prototype.pickSpellFromEvent = function (evt) {
            this.pickedSpellElement = evt.target;
            var spellNumber = this.spellNumberFromElementId(this.pickedSpellElement.id);
            if (spellNumber) {
                dojo.stopEvent(evt);
                console.log("Picking spell from event", spellNumber);
                var spell = this.getSpellByNumber(+spellNumber);
                if (spell) {
                    return Promise.resolve(spell);
                }
                else {
                    return Promise.reject("Couldn't find spell with number " + spellNumber);
                }
            }
            else {
                return Promise.reject("Couldn't find spell");
            }
        };
        Spells.prototype.spellNumberFromElementId = function (elementId) {
            return +elementId.split("_")[1];
        };
        Spells.prototype.getSpellByNumber = function (spellNumber) {
            return this.spells.find(function (spell) { return spell.number === spellNumber; });
        };
        Spells.prototype.pickSpell = function (spellNumber) {
            this.pickedSpellElement = $("spell_".concat(spellNumber));
            if (this.pickedSpellElement) {
                this.gui.selectSpell(spellNumber);
            }
        };
        Spells.prototype.unpickSpell = function () {
            if (this.pickedSpellElement) {
                this.gui.deselectSpell(this.spellNumberFromElementId(this.pickedSpellElement.id));
                this.pickedSpellElement = undefined;
            }
        };
        Spells.prototype.removeSpell = function (spell) {
            var spellElement = $("spell_".concat(spell.number));
            if (spellElement) {
                dojo.destroy(spellElement);
            }
            else {
                console.error("Couldn't find spell with number", spell.number);
            }
            this.spells = this.spells.filter(function (s) { return s.number !== spell.number; });
        };
        Spells.prototype.replaceSpells = function (spells) {
            dojo.empty(this.containerId);
            this.spells = spells;
            this.addSpellsToDOMAndMakeThenClickable(spells);
        };
        Spells.prototype.addSpell = function (spell) {
            this.spells.push(spell);
            var spellNode = $(Templates_3.Templates.idOfSpell(spell));
            if (!spellNode) {
                return;
            }
            this.makeSpellNodeClickable(spellNode);
        };
        return Spells;
    }());
    exports.Spells = Spells;
});
define("src/client/gui/animations", ["require", "exports", "src/client/common/Templates"], function (require, exports, Templates_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spawnSpellOnBoard = exports.despawnSpell = exports.despawnElement = exports.moveElementOnAnimationSurface = void 0;
    function cloneOnAnimationSurface(idOfElementToClone, postfix) {
        var _a;
        var elementToClone = $(idOfElementToClone);
        if (!elementToClone) {
            console.error("Element to clone not found", idOfElementToClone);
            return;
        }
        var animationSurface = $("animation-surface");
        if (!animationSurface) {
            console.error("Animation surface not found");
            return;
        }
        var parent = elementToClone.parentNode;
        var elementRectangle = elementToClone.getBoundingClientRect();
        var centerY = elementRectangle.y + elementRectangle.height / 2;
        var centerX = elementRectangle.x + elementRectangle.width / 2;
        var newId = elementToClone.id + postfix;
        var existingElementByNewId = $(newId);
        (_a = existingElementByNewId === null || existingElementByNewId === void 0 ? void 0 : existingElementByNewId.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(existingElementByNewId);
        var clone = elementToClone.cloneNode(true);
        clone.id = newId;
        var fullmatrix = "";
        while (parent != animationSurface.parentNode && parent != null) {
            var styleOfParent = window.getComputedStyle(parent);
            var transformationMatrixOfParent = styleOfParent.transform;
            if (transformationMatrixOfParent &&
                transformationMatrixOfParent != "none") {
                fullmatrix += " " + transformationMatrixOfParent;
            }
            parent = parent.parentNode;
        }
        animationSurface.appendChild(clone);
        var cloneRect = clone.getBoundingClientRect();
        var offsetY = centerY - cloneRect.height / 2 - cloneRect.y;
        var offsetX = centerX - cloneRect.width / 2 - cloneRect.x;
        clone.style.left = offsetX + "px";
        clone.style.top = offsetY + "px";
        clone.style.transform = fullmatrix;
        clone.style.position = "absolute";
        return clone;
    }
    function moveElementOnAnimationSurface(elementToMoveId, newParentId, durationInMs) {
        var _a;
        if (durationInMs === void 0) { durationInMs = 1000; }
        var elementToMove = $(elementToMoveId);
        var newParent = $(newParentId);
        var clone = cloneOnAnimationSurface(elementToMove.id, "_animated");
        if (!clone) {
            return Promise.reject("Clone not found");
        }
        elementToMove.style.opacity = "0.1";
        newParent.appendChild(elementToMove);
        var temporaryDestinationElement = cloneOnAnimationSurface(elementToMove.id, "_animation_destination");
        if (!temporaryDestinationElement) {
            console.error("Destination not found");
            return Promise.reject("Destination not found");
        }
        clone.style.position = "absolute";
        clone.style.transitionDuration = durationInMs + "ms";
        clone.style.left = temporaryDestinationElement.style.left;
        clone.style.top = temporaryDestinationElement.style.top;
        clone.style.transform = temporaryDestinationElement.style.transform;
        (_a = temporaryDestinationElement.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(temporaryDestinationElement);
        return new Promise(function (resolve) {
            setTimeout(function () {
                elementToMove.style.removeProperty("opacity");
                if (clone && clone.parentNode)
                    clone.parentNode.removeChild(clone);
                resolve();
            }, durationInMs);
        });
    }
    exports.moveElementOnAnimationSurface = moveElementOnAnimationSurface;
    function despawnElement(elementId, durationInMs) {
        if (durationInMs === void 0) { durationInMs = 2000; }
        return moveElementOnAnimationSurface(elementId, "cards-spawn-point", durationInMs);
    }
    exports.despawnElement = despawnElement;
    function despawnSpell(spellNumber, durationInMs) {
        if (durationInMs === void 0) { durationInMs = 2000; }
        var spellNodeId = Templates_4.Templates.idOfSpellByNumber(spellNumber);
        return despawnElement(spellNodeId, durationInMs);
    }
    exports.despawnSpell = despawnSpell;
    function spawnSpellOnBoard(spell) {
        var spellTemplate = Templates_4.Templates.spell(spell);
        return dojo.place(spellTemplate, "cards-spawn-point");
    }
    exports.spawnSpellOnBoard = spawnSpellOnBoard;
});
define("src/client/gui/ElementumGameInterface", ["require", "exports", "src/client/common/Templates", "src/client/common/variation", "src/client/gui/Crystals", "src/client/gui/GameInfoPanel", "src/client/gui/PlayerBoard", "src/client/gui/Spells", "src/client/gui/animations"], function (require, exports, Templates_5, variation_1, Crystals_1, GameInfoPanel_1, PlayerBoard_1, Spells_1, animations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ElementumGameInterface = void 0;
    var ElementumGameInterface = (function () {
        function ElementumGameInterface(spellPool, playerHand, crystals, core, playerBoards) {
            this.crystals = crystals;
            this.core = core;
            this.animationDurationInMs = 1000;
            this.playerBoards = {};
            this.buildSpellPool(spellPool);
            this.buildPlayerHand(playerHand);
            this.crystals.putCrystalsOnBoardAndInPlayerPanels();
            this.buildPlayerBoards(playerBoards);
            this.makeCurrentPlayerBoardFirst();
            GameInfoPanel_1.GameInfoPanel.init();
        }
        ElementumGameInterface.init = function (input) {
            var gui = new ElementumGameInterface(input.spellPool, input.playerHand, new Crystals_1.Crystals(input.crystalsInPile, input.crystalsPerPlayer, input.core), input.core, input.playerBoards);
            if (input.pickedSpell) {
                gui.playerHand.pickSpell(input.pickedSpell);
            }
            return gui;
        };
        ElementumGameInterface.prototype.whenSpellOnHandClicked = function (onSpellClicked) {
            this.playerHand.whenSpellClicked(onSpellClicked);
        };
        ElementumGameInterface.prototype.whenSpellPoolClicked = function (onSpellClicked) {
            this.spellPool.whenSpellClicked(onSpellClicked);
        };
        ElementumGameInterface.prototype.whenSpellOnBoardClicked = function (onSpellOnBoardClicked) {
            Object.values(this.playerBoards).forEach(function (playerBoard) {
                playerBoard.whenSpellClicked(onSpellOnBoardClicked);
            });
        };
        ElementumGameInterface.prototype.whenElementSourceClickedOnCurrentPlayer = function (onElementClicked) {
            this.playerBoards[this.core.getCurrentPlayerId()].whenElementSourceClicked(onElementClicked);
        };
        ElementumGameInterface.prototype.buildSpellPool = function (spellPool) {
            this.spellPool = new Spells_1.Spells("spell-pool", spellPool, this);
        };
        ElementumGameInterface.prototype.buildPlayerHand = function (playerHand) {
            this.playerHand = new Spells_1.Spells("current-player-hand", playerHand, this);
        };
        ElementumGameInterface.prototype.buildPlayerBoards = function (playerBoards) {
            var _this = this;
            this.playerBoards = Object.entries(playerBoards).reduce(function (acc, _a) {
                var playerId = _a[0], playerBoard = _a[1];
                acc[playerId] = new PlayerBoard_1.PlayerBoard(playerId, playerBoard, _this.core);
                return acc;
            }, {});
        };
        ElementumGameInterface.prototype.makeCurrentPlayerBoardFirst = function () {
            var currentPlayerId = this.core.getCurrentPlayerId();
            var currentPlayerBoard = this.playerBoards[currentPlayerId];
            if (currentPlayerBoard) {
                currentPlayerBoard.markAsCurrentPlayer();
            }
        };
        ElementumGameInterface.prototype.putSpellOnBoard = function (playerId, spell, column) {
            if (!this.spellExistsOnBoard(spell)) {
                (0, animations_1.spawnSpellOnBoard)(spell);
            }
            var columnId = Templates_5.Templates.idOfSpellColumn(playerId, column !== null && column !== void 0 ? column : spell.element);
            var spellId = Templates_5.Templates.idOfSpell(spell);
            this.deselectSpell(spell.number);
            (0, animations_1.moveElementOnAnimationSurface)(spellId, columnId, this.animationDurationInMs);
        };
        ElementumGameInterface.prototype.spellExistsOnBoard = function (spell) {
            return !!$(Templates_5.Templates.idOfSpell(spell));
        };
        ElementumGameInterface.prototype.replaceHand = function (hand) {
            var _this = this;
            this.moveEachSpellToSpawnPointAndDestroy().then(function () {
                _this.playerHand.clearSpells();
                _this.spawnSpellsAndAddToHand(hand);
            });
        };
        ElementumGameInterface.prototype.moveEachSpellToSpawnPointAndDestroy = function () {
            var _this = this;
            var promises = [];
            this.playerHand.forEachSpellInDom(function (spell) {
                promises.push((0, animations_1.despawnElement)(spell.id, (0, variation_1.randomVariation)(_this.animationDurationInMs, 500)).then(function () {
                    dojo.destroy(spell);
                }));
            });
            return Promise.all(promises);
        };
        ElementumGameInterface.prototype.spawnSpellsAndAddToHand = function (hand) {
            var _this = this;
            hand.forEach(function (spell) {
                if (!_this.spellExistsOnBoard(spell)) {
                    (0, animations_1.spawnSpellOnBoard)(spell);
                }
                (0, animations_1.moveElementOnAnimationSurface)(Templates_5.Templates.idOfSpell(spell), _this.playerHand.containerId, (0, variation_1.randomVariation)(_this.animationDurationInMs, 500)).then(function () {
                    _this.playerHand.addSpell(spell);
                });
            });
        };
        ElementumGameInterface.prototype.pickSpellOnHand = function (spellNumber) {
            this.playerHand.pickSpell(spellNumber);
        };
        ElementumGameInterface.prototype.unpickSpellOnHand = function () {
            this.playerHand.unpickSpell();
        };
        ElementumGameInterface.prototype.pickSpellOnSpellPool = function (spellNumber) {
            this.spellPool.pickSpell(spellNumber);
        };
        ElementumGameInterface.prototype.unpickSpellOnSpellPool = function () {
            this.spellPool.unpickSpell();
        };
        ElementumGameInterface.prototype.putSpellInSpellPool = function (spellNumber) {
            var spell = this.core.getSpellByNumber(spellNumber);
            if (!this.spellExistsOnBoard(spell)) {
                (0, animations_1.spawnSpellOnBoard)(spell);
            }
            var containerId = "spell-pool";
            var spellId = Templates_5.Templates.idOfSpell(spell);
            this.deselectSpell(spell.number);
            (0, animations_1.moveElementOnAnimationSurface)(spellId, containerId, this.animationDurationInMs);
            this.spellPool.addSpell(spell);
        };
        ElementumGameInterface.prototype.removeSpellInSpellPool = function (spellNumber) {
            this.spellPool.removeSpell(this.core.getSpellByNumber(spellNumber));
        };
        ElementumGameInterface.prototype.selectSpell = function (spellNumber) {
            var pickedSpellElement = $("spell_".concat(spellNumber));
            if (pickedSpellElement) {
                dojo.addClass(pickedSpellElement, "picked");
            }
            else {
                console.error("Couldn't find spell with number", spellNumber);
            }
        };
        ElementumGameInterface.prototype.deselectSpell = function (spellNumber) {
            var pickedSpellElement = $("spell_".concat(spellNumber));
            if (pickedSpellElement) {
                dojo.removeClass(pickedSpellElement, "picked");
            }
        };
        ElementumGameInterface.prototype.makeElementSourcesClickableForCurrentPlayer = function () {
            this.playerBoards[this.core.getCurrentPlayerId()].makeElementSourcesClickable();
        };
        ElementumGameInterface.prototype.makeElementSourcesNotClickableForCurrentPlayer = function () {
            this.playerBoards[this.core.getCurrentPlayerId()].makeElementSourcesNotClickable();
        };
        ElementumGameInterface.prototype.makeSpellsClickableOnAllBoardsBesidesCurrentPlayer = function () {
            var _this = this;
            var currentPlayerId = this.core.getCurrentPlayerId().toString();
            Object.keys(this.playerBoards)
                .filter(function (playerId) { return playerId !== currentPlayerId; })
                .forEach(function (playerId) {
                _this.playerBoards[playerId].makeSpellsClickable();
            });
        };
        ElementumGameInterface.prototype.makeSpellsUnclickableOnAllBoards = function () {
            Object.values(this.playerBoards).forEach(function (playerBoard) {
                playerBoard.makeSpellsNotClickable();
            });
        };
        ElementumGameInterface.prototype.destroySpellOnBoard = function (victimPlayerId, spellNumber) {
            var spell = this.core.getSpellByNumber(spellNumber);
            var playerBoard = this.playerBoards[victimPlayerId];
            (0, animations_1.despawnSpell)(spellNumber, this.animationDurationInMs).then(function () {
                playerBoard.removeSpell(spell);
            });
        };
        return ElementumGameInterface;
    }());
    exports.ElementumGameInterface = ElementumGameInterface;
});
define("src/client/states/State", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/client/states/NoopState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopState = void 0;
    var NoopState = (function () {
        function NoopState() {
        }
        NoopState.prototype.onEnter = function () { };
        NoopState.prototype.onUpdateActionButtons = function (args) { };
        NoopState.prototype.spellOnHandClicked = function (spell) { };
        NoopState.prototype.spellOnBoardClicked = function (playerId, spell, element) { };
        NoopState.prototype.spellOnSpellPoolClicked = function (spell) { };
        NoopState.prototype.elementSourceClicked = function (playerId, element) { };
        NoopState.prototype.onLeave = function () { };
        return NoopState;
    }());
    exports.NoopState = NoopState;
});
define("src/client/ActionsAPI", ["require", "exports", "bgagame/elementum"], function (require, exports, elementum_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionsAPI = void 0;
    var ActionsAPI = (function () {
        function ActionsAPI() {
        }
        ActionsAPI.pickSpell = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPickSpell", { spellNumber: spellNumber })
                            .catch(function () {
                            throw new Error("Error picking spell");
                        })];
                });
            });
        };
        ActionsAPI.cancelSpellChoice = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actCancelSpellChoice")
                            .catch(function () {
                            throw new Error("Error cancelling spell choice");
                        })];
                });
            });
        };
        ActionsAPI.playSpell = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPlaySpell")
                            .catch(function () {
                            throw new Error("Error playing spell");
                        })];
                });
            });
        };
        ActionsAPI.useSpellPool = function (spellFromPoolNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actUseSpellPool", { spellFromPoolNumber: spellFromPoolNumber })
                            .catch(function () {
                            throw new Error("Error using spell pool");
                        })];
                });
            });
        };
        ActionsAPI.cancelDraftChoice = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performPossibleAction("actCancelDraftChoice")
                            .catch(function () {
                            throw new Error("Error cancelling draft choice");
                        })];
                });
            });
        };
        ActionsAPI.useElementSource = function (element) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPickTargetElement", { element: element })
                            .catch(function () {
                            throw new Error("Error using element source");
                        })];
                });
            });
        };
        ActionsAPI.destroyTarget = function (spellNumber, victimPlayerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actSelectDestroyTarget", {
                            spellNumber: spellNumber,
                            victimPlayerId: victimPlayerId,
                        })
                            .catch(function () {
                            throw new Error("Error destroying target");
                        })];
                });
            });
        };
        return ActionsAPI;
    }());
    exports.ActionsAPI = ActionsAPI;
});
define("src/client/states/PickSpellState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_1, NoopState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PickSpellState = void 0;
    var PickSpellState = (function (_super) {
        __extends(PickSpellState, _super);
        function PickSpellState(gui) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            return _this;
        }
        PickSpellState.prototype.spellOnHandClicked = function (spell) {
            var _this = this;
            console.log("Spell clicked", spell);
            ActionsAPI_1.ActionsAPI.pickSpell(spell.number)
                .then(function () {
                console.log("Picking spell", spell.number);
                _this.gui.pickSpellOnHand(spell.number);
            })
                .catch(function (error) {
                console.error("Error picking spell", error);
            });
        };
        return PickSpellState;
    }(NoopState_1.NoopState));
    exports.PickSpellState = PickSpellState;
});
define("src/client/states/SpellDestinationChoiceState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_2, NoopState_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpellDestinationChoiceState = void 0;
    var SpellDestinationChoiceState = (function (_super) {
        __extends(SpellDestinationChoiceState, _super);
        function SpellDestinationChoiceState(elementum, gui) {
            var _this = _super.call(this) || this;
            _this.elementum = elementum;
            _this.gui = gui;
            return _this;
        }
        SpellDestinationChoiceState.prototype.onEnter = function () {
            this.elementum.setTextBeforeCancelButton(_(" to pick a Spell from the Spell Pool."));
        };
        SpellDestinationChoiceState.prototype.onUpdateActionButtons = function (args) {
            var _this = this;
            this.elementum.addActionButton("playSpellBtn", _("Play the Spell on your board"), function () { return ActionsAPI_2.ActionsAPI.playSpell(); });
            this.elementum.addCancelButton(_("Cancel"), function () {
                ActionsAPI_2.ActionsAPI.cancelSpellChoice().then(function () {
                    _this.gui.unpickSpellOnHand();
                });
            });
        };
        SpellDestinationChoiceState.prototype.spellOnSpellPoolClicked = function (spell) {
            var _this = this;
            console.log("Spell pool clicked", spell);
            ActionsAPI_2.ActionsAPI.useSpellPool(spell.number)
                .then(function () {
                console.log("Picking spell on pool", spell.number);
                _this.gui.pickSpellOnSpellPool(spell.number);
            })
                .catch(function (error) {
                console.error("Error picking spell pool", error);
            });
        };
        SpellDestinationChoiceState.prototype.onLeave = function () {
            this.elementum.clearTextAfterGeneralActions();
        };
        return SpellDestinationChoiceState;
    }(NoopState_2.NoopState));
    exports.SpellDestinationChoiceState = SpellDestinationChoiceState;
});
define("src/client/Notifications", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onNotification = void 0;
    function onNotification(notificationName) {
        return {
            do: function (callback) {
                dojo.subscribe(notificationName, null, callback);
            },
        };
    }
    exports.onNotification = onNotification;
});
define("src/client/states/PlayersDraftState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_3, NoopState_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayersDraftState = void 0;
    var PlayersDraftState = (function (_super) {
        __extends(PlayersDraftState, _super);
        function PlayersDraftState(elementum, gui) {
            var _this = _super.call(this) || this;
            _this.elementum = elementum;
            _this.gui = gui;
            return _this;
        }
        PlayersDraftState.prototype.onUpdateActionButtons = function () {
            var _this = this;
            this.elementum.addCancelButton(_("Cancel"), function () {
                return ActionsAPI_3.ActionsAPI.cancelDraftChoice().then(function () {
                    _this.gui.unpickSpellOnHand();
                    _this.gui.unpickSpellOnSpellPool();
                });
            });
        };
        return PlayersDraftState;
    }(NoopState_3.NoopState));
    exports.PlayersDraftState = PlayersDraftState;
});
define("src/client/states/UniversalElementDestinationChoiceState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_4, NoopState_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UniversalElementDestinationChoiceState = void 0;
    var UniversalElementDestinationChoiceState = (function (_super) {
        __extends(UniversalElementDestinationChoiceState, _super);
        function UniversalElementDestinationChoiceState(gui) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            return _this;
        }
        UniversalElementDestinationChoiceState.prototype.onEnter = function () {
            this.gui.makeElementSourcesClickableForCurrentPlayer();
        };
        UniversalElementDestinationChoiceState.prototype.onLeave = function () {
            this.gui.makeElementSourcesNotClickableForCurrentPlayer();
        };
        UniversalElementDestinationChoiceState.prototype.elementSourceClicked = function (playerId, element) {
            console.log("Element source clicked", element);
            ActionsAPI_4.ActionsAPI.useElementSource(element)
                .then(function () {
                console.log("Picking element source", element);
            })
                .catch(function (error) {
                console.error("Error picking element source", error);
            });
        };
        return UniversalElementDestinationChoiceState;
    }(NoopState_4.NoopState));
    exports.UniversalElementDestinationChoiceState = UniversalElementDestinationChoiceState;
});
define("src/client/gui/Announcement", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.announce = void 0;
    function announce(message, durationInMs) {
        if (durationInMs === void 0) { durationInMs = 1000; }
        var announcementElement = document.getElementById("announcement");
        if (!announcementElement) {
            console.error("Could not find announcement element");
            return Promise.reject();
        }
        announcementElement.innerText = message;
        announcementElement.classList.add("visible");
        var promise = new Promise(function (resolve) {
            setTimeout(function () {
                announcementElement.classList.remove("visible");
                resolve();
            }, durationInMs);
        });
        return promise;
    }
    exports.announce = announce;
});
define("src/client/states/DestroyTargetSelectionState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_5, NoopState_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DestroyTargetSelectionState = void 0;
    var DestroyTargetSelectionState = (function (_super) {
        __extends(DestroyTargetSelectionState, _super);
        function DestroyTargetSelectionState(gui) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            return _this;
        }
        DestroyTargetSelectionState.prototype.onEnter = function () {
            this.gui.makeSpellsClickableOnAllBoardsBesidesCurrentPlayer();
        };
        DestroyTargetSelectionState.prototype.spellOnBoardClicked = function (playerId, spell, element) {
            ActionsAPI_5.ActionsAPI.destroyTarget(spell.number, playerId)
                .then(function () {
                console.log("Destroying target", spell.number, playerId, element);
            })
                .catch(function (error) {
                console.error("Error destroying target", error);
            });
        };
        DestroyTargetSelectionState.prototype.onLeave = function () {
            this.gui.makeSpellsUnclickableOnAllBoards();
        };
        return DestroyTargetSelectionState;
    }(NoopState_5.NoopState));
    exports.DestroyTargetSelectionState = DestroyTargetSelectionState;
});
define("bgagame/elementum", ["require", "exports", "ebg/core/gamegui", "cookbook/common", "src/client/gui/ElementumGameInterface", "src/client/states/NoopState", "src/client/states/PickSpellState", "src/client/states/SpellDestinationChoiceState", "src/client/common/Templates", "src/client/Notifications", "src/client/states/PlayersDraftState", "src/client/gui/GameInfoPanel", "src/client/states/UniversalElementDestinationChoiceState", "src/client/gui/Announcement", "src/client/states/DestroyTargetSelectionState"], function (require, exports, Gamegui, CommonMixer, ElementumGameInterface_1, NoopState_6, PickSpellState_1, SpellDestinationChoiceState_1, Templates_6, Notifications_1, PlayersDraftState_1, GameInfoPanel_2, UniversalElementDestinationChoiceState_1, Announcement_1, DestroyTargetSelectionState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Elementum = void 0;
    var Elementum = (function (_super) {
        __extends(Elementum, _super);
        function Elementum() {
            var _this = _super.call(this) || this;
            _this.allSpells = [];
            _this.states = {};
            Elementum.instance = _this;
            return _this;
        }
        Elementum.getInstance = function () {
            return Elementum.instance;
        };
        Elementum.prototype.setup = function (gamedatas) {
            var _this = this;
            console.log("Starting game setup");
            this.setupNotifications();
            console.log("Full gamedatas", gamedatas);
            this.allSpells = gamedatas.allSpells;
            this.gui = ElementumGameInterface_1.ElementumGameInterface.init({
                spellPool: Object.values(gamedatas.spellPool),
                playerHand: Object.values(gamedatas.currentPlayerHand),
                pickedSpell: gamedatas.pickedSpell,
                crystalsInPile: gamedatas.crystalsInPile,
                crystalsPerPlayer: gamedatas.crystalsPerPlayer,
                playerBoards: gamedatas.playerBoards,
                core: this,
            });
            this.gui.whenSpellOnHandClicked(function (spell) {
                _this.getCurrentState().spellOnHandClicked(spell);
            });
            this.gui.whenSpellOnBoardClicked(function (playerId, spell, element) {
                _this.getCurrentState().spellOnBoardClicked(playerId, spell, element);
            });
            this.gui.whenSpellPoolClicked(function (spell) {
                _this.getCurrentState().spellOnSpellPoolClicked(spell);
            });
            this.gui.whenElementSourceClickedOnCurrentPlayer(function (playerId, element) {
                _this.getCurrentState().elementSourceClicked(playerId, element);
            });
            this.createStates();
            GameInfoPanel_2.GameInfoPanel.updateCurrentRound(gamedatas.currentRound);
            (0, Announcement_1.announce)("Current round: " + gamedatas.currentRound + "/3", 2000);
        };
        Elementum.prototype.getCurrentStateName = function () {
            var _a;
            return (((_a = this.gamedatas.gamestate.private_state) === null || _a === void 0 ? void 0 : _a.name) ||
                this.gamedatas.gamestate.name ||
                "noop");
        };
        Elementum.prototype.getCurrentState = function () {
            return this.getStateByName(this.getCurrentStateName());
        };
        Elementum.prototype.createStates = function () {
            this.states = {
                spellChoice: new PickSpellState_1.PickSpellState(this.gui),
                spellDestinationChoice: new SpellDestinationChoiceState_1.SpellDestinationChoiceState(this, this.gui),
                playersDraft: new PlayersDraftState_1.PlayersDraftState(this, this.gui),
                noop: new NoopState_6.NoopState(),
                universalElementSpellDestination: new UniversalElementDestinationChoiceState_1.UniversalElementDestinationChoiceState(this.gui),
                destroyTargetSelection: new DestroyTargetSelectionState_1.DestroyTargetSelectionState(this.gui),
            };
        };
        Elementum.prototype.getStateByName = function (stateName) {
            var _a;
            return (_a = this.states[stateName]) !== null && _a !== void 0 ? _a : this.states.noop;
        };
        Elementum.prototype.getSpellByNumber = function (spellNumber) {
            return this.allSpells[spellNumber - 1];
        };
        Elementum.prototype.onEnteringState = function (stateName, args) {
            console.log("Entering state: " + stateName);
            this.setStateBasedOnName(stateName);
        };
        Elementum.prototype.setStateBasedOnName = function (stateName) {
            this.getStateByName(stateName).onEnter();
        };
        Elementum.prototype.setTextBeforeCancelButton = function (text) {
            dojo.place(Templates_6.Templates.textBeforeCancelButton(text), "cancel", "before");
        };
        Elementum.prototype.onLeavingState = function (stateName) {
            console.log("Leaving state: " + stateName);
            this.getStateByName(stateName).onLeave();
        };
        Elementum.prototype.clearTextAfterGeneralActions = function () {
            dojo.destroy("text-before-cancel-button");
        };
        Elementum.prototype.onUpdateActionButtons = function (stateName, args) {
            console.log("onUpdateActionButtons: " + stateName, args);
            this.getStateByName(stateName).onUpdateActionButtons(args);
        };
        Elementum.prototype.addCancelButton = function (text, onClick) {
            this.addActionButton("cancel", text, onClick, undefined, false, "red");
        };
        Elementum.prototype.setupNotifications = function () {
            var _this = this;
            (0, Notifications_1.onNotification)("spellPlayedOnBoard").do(function (notification) {
                var playerId = notification.args.player_id;
                var spell = notification.args.spell;
                var element = notification.args.element;
                _this.gui.putSpellOnBoard(playerId, spell, element);
            });
            (0, Notifications_1.onNotification)("newHand").do(function (notification) {
                _this.gui.replaceHand(notification.args.newHand);
            });
            (0, Notifications_1.onNotification)("newSpellPoolCard").do(function (notification) {
                var newSpellNumber = notification.args
                    .newSpellNumber;
                _this.gui.putSpellInSpellPool(newSpellNumber);
            });
            (0, Notifications_1.onNotification)("youPaidCrystalForSpellPool").do(function (notification) {
                _this.gui.crystals.moveCrystalFromPlayerToPile(_this.getCurrentPlayerId().toString());
            });
            (0, Notifications_1.onNotification)("otherPlayerPaidCrystalForSpellPool").do(function (notification) {
                _this.gui.crystals.moveCrystalFromPlayerToPile(notification.args.playerId);
            });
            (0, Notifications_1.onNotification)("newRound").do(function (notification) {
                var round = notification.args.round;
                GameInfoPanel_2.GameInfoPanel.updateCurrentRound(round);
                (0, Announcement_1.announce)("Round " + round + " started", 2000);
            });
            (0, Notifications_1.onNotification)("elementPicked").do(function () {
                _this.gui.makeElementSourcesNotClickableForCurrentPlayer();
            });
            (0, Notifications_1.onNotification)("playerTookCrystal").do(function (notification) {
                var playerId = notification.args.playerId;
                _this.gui.crystals.moveCrystalFromPileToPlayer(playerId);
            });
            (0, Notifications_1.onNotification)("everyoneLostCrystal").do(function () {
                _this.gui.crystals.moveCrystalFromAllPlayersToPile();
            });
            (0, Notifications_1.onNotification)("playerDestroyedSpell").do(function (notification) {
                console.log("Spell destroyed", notification.args);
                var victimPlayerId = notification.args.victimPlayerId;
                var spellNumber = notification.args.spellNumber;
                _this.gui.destroySpellOnBoard(victimPlayerId, spellNumber);
            });
        };
        Elementum.prototype.performAction = function (action, args) {
            return this.performActionInternal(action, args, false);
        };
        Elementum.prototype.performActionInternal = function (action, args, checkPossible) {
            var _this = this;
            if (!args) {
                args = {};
            }
            args.lock = true;
            var checkMethod = checkPossible
                ? this.checkPossibleActions
                : this.checkAction;
            if (!checkMethod.call(this, action)) {
                return Promise.reject();
            }
            return new Promise(function (resolve, reject) {
                _this.ajaxcall("/" + _this.game_name + "/" + _this.game_name + "/" + action + ".html", args, _this, function (_) { }, function (error) {
                    if (error) {
                        console.error("Error performing action", action, args);
                        reject();
                    }
                    else {
                        resolve();
                    }
                });
            });
        };
        Elementum.prototype.performPossibleAction = function (action, args) {
            return this.performActionInternal(action, args, true);
        };
        return Elementum;
    }(CommonMixer(Gamegui)));
    exports.Elementum = Elementum;
    dojo.setObject("bgagame.elementum", Elementum);
});
