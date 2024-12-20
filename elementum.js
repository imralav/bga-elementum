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
define("cookbook/common", ["require", "exports", "dojo"], function (require, exports, dojo) {
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
        Common.prototype.onScriptError = function (error, url, line) {
            if (this.page_is_unloading)
                return;
            console.error("Script error:", error);
            _super.prototype.onScriptError.call(this, error, url, line);
        };
        Common.prototype.showError = function (log, args) {
            if (args === void 0) { args = {}; }
            args['you'] = this.divYou();
            var message = this.format_string_recursive(log, args);
            this.showMessage(message, "error");
            console.error(message);
        };
        Common.prototype.getPlayerColor = function (player_id) {
            var _a, _b;
            return (_b = (_a = this.gamedatas.players[player_id]) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : null;
        };
        Common.prototype.getPlayerName = function (player_id) {
            var _a, _b;
            return (_b = (_a = this.gamedatas.players[player_id]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
        };
        Common.prototype.getPlayerFromColor = function (color) {
            for (var id in this.gamedatas.players) {
                var player = this.gamedatas.players[id];
                if ((player === null || player === void 0 ? void 0 : player.color) === color)
                    return player;
            }
            return null;
        };
        Common.prototype.getPlayerFromName = function (name) {
            for (var id in this.gamedatas.players) {
                var player = this.gamedatas.players[id];
                if ((player === null || player === void 0 ? void 0 : player.name) === name)
                    return player;
            }
            return null;
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
                spellSummaryData: "".concat((0, utils_1.getIconForElement)(spell.element), " ").concat(spell.number, ": ").concat(spell.name, "\n(").concat(spell.spellActivation, ")(C:").concat(spell.crystalSlots, ")\n"),
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
        Templates.idOfCrystalsForSpell = function (spellNumber) {
            return Templates.idOfSpellByNumber(spellNumber) + "_crystals";
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
        Templates.virtualElementSourcesContainer = function () {
            return "<div class=\"virtual-element-sources-container\"></div>";
        };
        Templates.virtualElementSource = function (element) {
            return "<div class=\"virtual-element-source ".concat(element, "\">\n              ").concat((0, utils_1.getIconForElement)(element), "\n            </div>");
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
define("src/client/gui/Crystals", ["require", "exports", "ebg/zone", "src/client/common/utils", "src/client/common/Templates"], function (require, exports, Zone, utils_2, Templates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Crystals = void 0;
    var Crystals = (function () {
        function Crystals(amountOfCrystalsInPile, amountOfCrystalsPerPlayer, crystalsPerSpell, core) {
            this.amountOfCrystalsPerPlayer = amountOfCrystalsPerPlayer;
            this.crystalsPerSpell = crystalsPerSpell;
            this.core = core;
            this.crystalsPilesPerPlayer = {};
            this.crystalsPilesPerSpell = {};
            this.allCrystalsAmount = 0;
            var amountOfCrystalsInPlayerPiles = +Object.values(amountOfCrystalsPerPlayer)
                .map(function (a) { return +a; })
                .reduce(function (a, b) { return a + b; }, 0);
            var amountOfCrystalsOnSpells = +Object.values(crystalsPerSpell)
                .map(function (a) { return +a; })
                .reduce(function (a, b) { return a + b; }, 0);
            this.allCrystalsAmount =
                amountOfCrystalsInPile +
                    amountOfCrystalsInPlayerPiles +
                    amountOfCrystalsOnSpells;
        }
        Crystals.prototype.putCrystalsOnBoardAndInPlayerPanels = function () {
            this.createMainCrystalsPileAndAddInitialCrystals();
            this.createCrystalsForPlayers();
        };
        Crystals.prototype.putCrystalsOnSpells = function () {
            var _this = this;
            Object.keys(this.crystalsPerSpell).forEach(function (spellNumber) {
                var _a;
                _this.createCrystalPileForSpell(+spellNumber);
                var amount = +((_a = _this.crystalsPerSpell[+spellNumber]) !== null && _a !== void 0 ? _a : 0);
                for (var i = 0; i < amount; i++) {
                    (0, utils_2.doAfter)(1000 * (2 + i), function () {
                        return _this.moveCrystalFromPileToSpell(+spellNumber);
                    });
                }
            });
        };
        Crystals.prototype.createCrystalPileForSpell = function (spellNumber) {
            var crystalsPile = Templates_1.Templates.idOfCrystalsForSpell(spellNumber);
            if (!$(crystalsPile)) {
                console.error("Element not found", crystalsPile);
                return;
            }
            var pileInDom = $(crystalsPile);
            var crystalsPileZone = new Zone();
            crystalsPileZone.create(this.core, pileInDom, Crystals.CRYSTAL_SIZE, Crystals.CRYSTAL_SIZE);
            this.crystalsPilesPerSpell[spellNumber] = {
                zone: crystalsPileZone,
                element: pileInDom,
            };
        };
        Crystals.prototype.moveCrystalFromPileToSpell = function (spellNumber) {
            var id = this.getIdOfFirstCrystalInPile();
            var crystalsPileOfSpell = this.crystalsPilesPerSpell[spellNumber];
            this.crystalsPile.zone.removeFromZone(id, false, crystalsPileOfSpell.element.id);
            crystalsPileOfSpell.zone.placeInZone(id, 1);
        };
        Crystals.prototype.createMainCrystalsPileAndAddInitialCrystals = function () {
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
            this.moveCristal(id).from(this.crystalsPile).to(crystalsPileOfPlayer);
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
            this.moveCristal(id).from(crystalsPileOfPlayer).to(this.crystalsPile);
        };
        Crystals.prototype.getIdOfFirstCrystalInPlayerPile = function (playerId) {
            var crystal = this.crystalsPilesPerPlayer[playerId].element
                .childNodes[0];
            return crystal.id;
        };
        Crystals.prototype.moveCrystalFromAllPlayersToPile = function () {
            for (var _i = 0, _a = Object.keys(this.crystalsPilesPerPlayer); _i < _a.length; _i++) {
                var playerId = _a[_i];
                if (this.crystalsPilesPerPlayer[playerId].element.childNodes.length > 0) {
                    this.moveCrystalFromPlayerToPile(playerId);
                }
            }
        };
        Crystals.prototype.moveCrystalFromPlayerToSpell = function (playerId, spellNumber) {
            var crystalId = this.getIdOfFirstCrystalInPlayerPile(playerId);
            var crystalsPileOfPlayer = this.crystalsPilesPerPlayer[playerId];
            if (!this.crystalsPileOnSpellExists(spellNumber)) {
                this.createCrystalPileForSpell(spellNumber);
            }
            var spellCrystalsPile = this.crystalsPilesPerSpell[spellNumber];
            this.moveCristal(crystalId)
                .from(crystalsPileOfPlayer)
                .to(spellCrystalsPile);
        };
        Crystals.prototype.moveCristal = function (crystalId) {
            return {
                from: function (from) { return ({
                    to: function (to) {
                        from.zone.removeFromZone(crystalId, false, to.element.id);
                        to.zone.placeInZone(crystalId, 1);
                    },
                }); },
            };
        };
        Crystals.prototype.crystalsPileOnSpellExists = function (spellNumber) {
            return !!this.crystalsPilesPerSpell[spellNumber];
        };
        Crystals.prototype.moveCrystalFromSpellToPile = function (spellNumber) {
            var id = this.getIdOfFirstCrystalOnSpell(spellNumber);
            var crystalsPileOfSpell = this.crystalsPilesPerSpell[spellNumber];
            crystalsPileOfSpell.zone.removeFromZone(id, false, this.crystalsPile.element.id);
            this.crystalsPile.zone.placeInZone(id, 1);
        };
        Crystals.prototype.getIdOfFirstCrystalOnSpell = function (spellNumber) {
            var crystal = this.crystalsPilesPerSpell[spellNumber].element
                .childNodes[0];
            return crystal.id;
        };
        Crystals.prototype.moveAllCrystalsFromSpellToPile = function (spellNumber) {
            var _this = this;
            var _a;
            var amount = (_a = this.crystalsPerSpell[spellNumber]) !== null && _a !== void 0 ? _a : 0;
            for (var i = 0; i < amount; i++) {
                (0, utils_2.doAfter)(1000 * (2 + i), function () {
                    return _this.moveCrystalFromSpellToPile(spellNumber);
                });
            }
        };
        Crystals.CRYSTALS_PILE_ID = "main-crystals-pile";
        Crystals.CRYSTAL_SIZE = 16;
        return Crystals;
    }());
    exports.Crystals = Crystals;
});
define("src/client/gui/GameInfoPanel", ["require", "exports", "src/client/common/Templates", "ebg/counter"], function (require, exports, Templates_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameInfoPanel = void 0;
    var GameInfoPanel = (function () {
        function GameInfoPanel() {
        }
        GameInfoPanel.init = function () {
            dojo.place(Templates_2.Templates.gameInfoPanel(), "player_boards", "first");
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
define("src/client/gui/PlayerBoard", ["require", "exports", "src/client/common/utils", "src/client/common/Templates"], function (require, exports, utils_3, Templates_3) {
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
            var playerBoardContainer = Templates_3.Templates.playerBoard(this.playerId, playerName);
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
                var elementSourceNode = document.getElementById(Templates_3.Templates.idOfElementSource(this.playerId, element));
                this.makeElementSourceClickable(elementSourceNode);
            }
        };
        PlayerBoard.prototype.makeElementSourcesNotClickable = function () {
            this.disconnectAndClearClickHandlers();
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                var elementSourceNode = document.getElementById(Templates_3.Templates.idOfElementSource(this.playerId, element));
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
            var spellTemplate = Templates_3.Templates.spell(this.core.getSpellByNumber(spellNumber));
            dojo.place(spellTemplate, this.getIdOfElementColumnForCurrentPlayer(element));
        };
        PlayerBoard.prototype.whenElementSourceClicked = function (listener) {
            this.elementSourceClickListeners.push(listener);
        };
        PlayerBoard.prototype.markAsCurrentPlayer = function () {
            dojo.addClass(Templates_3.Templates.idOfPlayerBoard(this.playerId), "current");
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
                    dojo.destroy(Templates_3.Templates.idOfSpell(spell));
                }
            }
        };
        return PlayerBoard;
    }());
    exports.PlayerBoard = PlayerBoard;
});
define("src/client/gui/Spells", ["require", "exports", "src/client/common/Templates"], function (require, exports, Templates_4) {
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
                var spellBlock = Templates_4.Templates.spell(spell);
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
            var spellNode = $(Templates_4.Templates.idOfSpell(spell));
            if (!spellNode) {
                return;
            }
            this.makeSpellNodeClickable(spellNode);
        };
        return Spells;
    }());
    exports.Spells = Spells;
});
define("src/client/gui/animations", ["require", "exports", "src/client/common/Templates"], function (require, exports, Templates_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spawnSpellOnBoard = exports.despawnSpell = exports.despawnElement = exports.moveElementOnAnimationSurface = exports.DEFAULT_ANIMATION_DURATION = void 0;
    exports.DEFAULT_ANIMATION_DURATION = 2000;
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
        if (durationInMs === void 0) { durationInMs = exports.DEFAULT_ANIMATION_DURATION / 2; }
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
        if (durationInMs === void 0) { durationInMs = exports.DEFAULT_ANIMATION_DURATION; }
        return moveElementOnAnimationSurface(elementId, "cards-spawn-point", durationInMs);
    }
    exports.despawnElement = despawnElement;
    function despawnSpell(spellNumber, durationInMs) {
        if (durationInMs === void 0) { durationInMs = exports.DEFAULT_ANIMATION_DURATION; }
        var spellNodeId = Templates_5.Templates.idOfSpellByNumber(spellNumber);
        return despawnElement(spellNodeId, durationInMs);
    }
    exports.despawnSpell = despawnSpell;
    function spawnSpellOnBoard(spell) {
        var spellTemplate = Templates_5.Templates.spell(spell);
        return dojo.place(spellTemplate, "cards-spawn-point");
    }
    exports.spawnSpellOnBoard = spawnSpellOnBoard;
});
define("src/client/gui/ElementumGameInterface", ["require", "exports", "src/client/common/Templates", "src/client/common/variation", "src/client/gui/Crystals", "src/client/gui/GameInfoPanel", "src/client/gui/PlayerBoard", "src/client/gui/Spells", "src/client/gui/animations"], function (require, exports, Templates_6, variation_1, Crystals_1, GameInfoPanel_1, PlayerBoard_1, Spells_1, animations_1) {
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
            this.crystals.putCrystalsOnSpells();
            GameInfoPanel_1.GameInfoPanel.init();
        }
        ElementumGameInterface.init = function (input) {
            var gui = new ElementumGameInterface(input.spellPool, input.playerHand, new Crystals_1.Crystals(input.crystalsInPile, input.crystalsPerPlayer, input.crystalsPerSpell, input.core), input.core, input.playerBoards);
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
            var columnId = Templates_6.Templates.idOfSpellColumn(playerId, column !== null && column !== void 0 ? column : spell.element);
            var spellId = Templates_6.Templates.idOfSpell(spell);
            this.deselectSpell(spell.number);
            (0, animations_1.moveElementOnAnimationSurface)(spellId, columnId, this.animationDurationInMs);
        };
        ElementumGameInterface.prototype.spellExistsOnBoard = function (spell) {
            return !!$(Templates_6.Templates.idOfSpell(spell));
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
                (0, animations_1.moveElementOnAnimationSurface)(Templates_6.Templates.idOfSpell(spell), _this.playerHand.containerId, (0, variation_1.randomVariation)(_this.animationDurationInMs, 500)).then(function () {
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
            var spellId = Templates_6.Templates.idOfSpell(spell);
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
        ElementumGameInterface.prototype.makeSpellsClickableOnAllBoards = function () {
            Object.values(this.playerBoards).forEach(function (playerBoard) {
                playerBoard.makeSpellsClickable();
            });
        };
        ElementumGameInterface.prototype.makeSpellsNotClickableOnAllBoards = function () {
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
        ElementumGameInterface.prototype.makeSpellsClickableOnCurrentPlayersBoard = function () {
            this.playerBoards[this.core.getCurrentPlayerId()].makeSpellsClickable();
        };
        ElementumGameInterface.prototype.makeSpellsNotClickableOnCurrentPlayersBoard = function () {
            this.playerBoards[this.core.getCurrentPlayerId()].makeSpellsNotClickable();
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
        NoopState.prototype.onEnter = function (args) { };
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
        ActionsAPI.actAddFromSpellPool_SelectSpell = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actAddFromSpellPool_SelectSpell", {
                            spellNumber: spellNumber,
                        })
                            .catch(function () {
                            throw new Error("Error using spell pool");
                        })];
                });
            });
        };
        ActionsAPI.actAddFromSpellPool_PickTargetElement = function (element) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actAddFromSpellPool_PickTargetElement", { element: element })
                            .catch(function () {
                            throw new Error("Error using element source");
                        })];
                });
            });
        };
        ActionsAPI.actAddFromSpellPool_CancelDestinationChoice = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actAddFromSpellPool_CancelDestinationChoice")
                            .catch(function () {
                            throw new Error("Error cancelling draft choice");
                        })];
                });
            });
        };
        ActionsAPI.actCopyImmediateSpell_selectSpell = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actCopyImmediateSpell_selectSpell", {
                            spellNumber: spellNumber,
                        })
                            .catch(function () {
                            throw new Error("Error copying immediate spell");
                        })];
                });
            });
        };
        ActionsAPI.actExchangeWithSpellPool_SelectSpellOnBoard = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actExchangeWithSpellPool_SelectSpellOnBoard", {
                            spellNumber: spellNumber,
                        })
                            .catch(function () {
                            throw new Error("Error exchanging with spell pool");
                        })];
                });
            });
        };
        ActionsAPI.actExchangeWithSpellPool_CancelSpellOnBoardChoice = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actExchangeWithSpellPool_CancelSpellOnBoardChoice")
                            .catch(function () {
                            throw new Error("Error cancelling exchange with spell pool");
                        })];
                });
            });
        };
        ActionsAPI.actExchangeWithSpellPool_SelectSpellFromPool = function (spellNumberFromPool) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actExchangeWithSpellPool_SelectSpellFromPool", {
                            spellNumberFromPool: spellNumberFromPool,
                        })
                            .catch(function () {
                            throw new Error("Error exchanging with spell pool");
                        })];
                });
            });
        };
        ActionsAPI.actExchangeWithSpellPool_CancelElementDestinationChoice = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actExchangeWithSpellPool_CancelElementDestinationChoice")
                            .catch(function () {
                            throw new Error("Error cancelling exchange with spell pool");
                        })];
                });
            });
        };
        ActionsAPI.actExchangeWithSpellPool_PickTargetElement = function (element) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actExchangeWithSpellPool_PickTargetElement", { element: element })
                            .catch(function () {
                            throw new Error("Error using element source");
                        })];
                });
            });
        };
        ActionsAPI.actDontPlacePowerCrystal = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actDontPlacePowerCrystal")
                            .catch(function () {
                            throw new Error("Error cancelling crystal placement");
                        })];
                });
            });
        };
        ActionsAPI.actPlacePowerCrystal = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPlacePowerCrystal", { spellNumber: spellNumber })
                            .catch(function () {
                            throw new Error("Error placing power crystal");
                        })];
                });
            });
        };
        ActionsAPI.dontPickVirtualElementSources = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPickVirtualElementSources", {
                            virtualElements: JSON.stringify({}),
                        })
                            .catch(function () {
                            throw new Error("Error cancelling virtual element sources");
                        })];
                });
            });
        };
        ActionsAPI.actPickVirtualElementSources = function (virtualElements) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPickVirtualElementSources", {
                            virtualElements: JSON.stringify(virtualElements),
                        })
                            .catch(function () {
                            throw new Error("Error picking virtual element sources");
                        })];
                });
            });
        };
        ActionsAPI.actPickSpellToGetHalfThePoints = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPickSpellToGetHalfThePoints", { spellNumber: spellNumber })
                            .catch(function () {
                            throw new Error("Error picking spell to get half the points");
                        })];
                });
            });
        };
        ActionsAPI.actDontPickSpellToGetHalfThePoints = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actDontPickSpellToGetHalfThePoints")
                            .catch(function () {
                            throw new Error("Error cancelling spell choice");
                        })];
                });
            });
        };
        ActionsAPI.actPickSpellWithScoringActivationToCopy = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actPickSpellWithScoringActivationToCopy", {
                            spellNumber: spellNumber,
                        })
                            .catch(function () {
                            throw new Error("Error picking spell to get half the points");
                        })];
                });
            });
        };
        ActionsAPI.actDontPickSpellWithScoringActivationToCopy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_2.Elementum.getInstance()
                            .performAction("actDontPickSpellWithScoringActivationToCopy")
                            .catch(function () {
                            throw new Error("Error cancelling spell choice");
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
define("src/client/gui/Announcement", ["require", "exports", "src/client/gui/animations"], function (require, exports, animations_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.announce = void 0;
    function announce(message, durationInMs) {
        if (durationInMs === void 0) { durationInMs = animations_2.DEFAULT_ANIMATION_DURATION; }
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
            this.gui.makeSpellsNotClickableOnAllBoards();
        };
        return DestroyTargetSelectionState;
    }(NoopState_5.NoopState));
    exports.DestroyTargetSelectionState = DestroyTargetSelectionState;
});
define("src/client/states/AddFromSpellPoolSpellSelectionState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_6, NoopState_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddFromSpellPoolSpellSelectionState = void 0;
    var AddFromSpellPoolSpellSelectionState = (function (_super) {
        __extends(AddFromSpellPoolSpellSelectionState, _super);
        function AddFromSpellPoolSpellSelectionState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AddFromSpellPoolSpellSelectionState.prototype.spellOnSpellPoolClicked = function (spell) {
            console.log("Spell pool clicked", spell);
            ActionsAPI_6.ActionsAPI.actAddFromSpellPool_SelectSpell(spell.number)
                .then(function () {
                console.log("Picking spell on pool", spell.number);
            })
                .catch(function (error) {
                console.error("Error picking spell pool", error);
            });
        };
        return AddFromSpellPoolSpellSelectionState;
    }(NoopState_6.NoopState));
    exports.AddFromSpellPoolSpellSelectionState = AddFromSpellPoolSpellSelectionState;
});
define("src/client/states/ExchangeWithSpellPoolUniversalElementSpellDestinationState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_7, NoopState_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExchangeWithSpellPoolUniversalElementSpellDestinationState = void 0;
    var ExchangeWithSpellPoolUniversalElementSpellDestinationState = (function (_super) {
        __extends(ExchangeWithSpellPoolUniversalElementSpellDestinationState, _super);
        function ExchangeWithSpellPoolUniversalElementSpellDestinationState(gui, elementum) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            _this.elementum = elementum;
            return _this;
        }
        ExchangeWithSpellPoolUniversalElementSpellDestinationState.prototype.onEnter = function () {
            this.gui.makeElementSourcesClickableForCurrentPlayer();
        };
        ExchangeWithSpellPoolUniversalElementSpellDestinationState.prototype.onLeave = function () {
            this.gui.makeElementSourcesNotClickableForCurrentPlayer();
        };
        ExchangeWithSpellPoolUniversalElementSpellDestinationState.prototype.onUpdateActionButtons = function (args) {
            this.elementum.addCancelButton(_("Cancel"), function () {
                return ActionsAPI_7.ActionsAPI.actExchangeWithSpellPool_CancelElementDestinationChoice();
            });
        };
        ExchangeWithSpellPoolUniversalElementSpellDestinationState.prototype.elementSourceClicked = function (playerId, element) {
            console.log("Element source clicked", element);
            ActionsAPI_7.ActionsAPI.actExchangeWithSpellPool_PickTargetElement(element)
                .then(function () {
                console.log("Picking element source", element);
            })
                .catch(function (error) {
                console.error("Error picking element source", error);
            });
        };
        return ExchangeWithSpellPoolUniversalElementSpellDestinationState;
    }(NoopState_7.NoopState));
    exports.ExchangeWithSpellPoolUniversalElementSpellDestinationState = ExchangeWithSpellPoolUniversalElementSpellDestinationState;
});
define("src/client/states/CopyImmediateSpellSelectionState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_8, NoopState_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CopyImmediateSpellSelectionState = void 0;
    var CopyImmediateSpellSelectionState = (function (_super) {
        __extends(CopyImmediateSpellSelectionState, _super);
        function CopyImmediateSpellSelectionState(gui) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            return _this;
        }
        CopyImmediateSpellSelectionState.prototype.onEnter = function () {
            this.gui.makeSpellsClickableOnAllBoards();
        };
        CopyImmediateSpellSelectionState.prototype.spellOnBoardClicked = function (playerId, spell, element) {
            ActionsAPI_8.ActionsAPI.actCopyImmediateSpell_selectSpell(spell.number)
                .then(function () {
                console.log("Selected spell", spell);
            })
                .catch(function (error) {
                console.error("Error selecting spell", error);
            });
        };
        CopyImmediateSpellSelectionState.prototype.spellOnSpellPoolClicked = function (spell) {
            ActionsAPI_8.ActionsAPI.actCopyImmediateSpell_selectSpell(spell.number)
                .then(function () {
                console.log("Selected spell", spell);
            })
                .catch(function (error) {
                console.error("Error selecting spell", error);
            });
        };
        CopyImmediateSpellSelectionState.prototype.onLeave = function () {
            this.gui.makeSpellsNotClickableOnAllBoards();
        };
        return CopyImmediateSpellSelectionState;
    }(NoopState_8.NoopState));
    exports.CopyImmediateSpellSelectionState = CopyImmediateSpellSelectionState;
});
define("src/client/states/ExchangeWithSpellPoolSpellOnBoardSelectionState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_9, NoopState_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExchangeWithSpellPoolSpellOnBoardSelectionState = void 0;
    var ExchangeWithSpellPoolSpellOnBoardSelectionState = (function (_super) {
        __extends(ExchangeWithSpellPoolSpellOnBoardSelectionState, _super);
        function ExchangeWithSpellPoolSpellOnBoardSelectionState(gui) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            return _this;
        }
        ExchangeWithSpellPoolSpellOnBoardSelectionState.prototype.onEnter = function () {
            this.gui.makeSpellsClickableOnCurrentPlayersBoard();
        };
        ExchangeWithSpellPoolSpellOnBoardSelectionState.prototype.spellOnBoardClicked = function (playerId, spell, element) {
            var _this = this;
            ActionsAPI_9.ActionsAPI.actExchangeWithSpellPool_SelectSpellOnBoard(spell.number)
                .then(function () {
                console.log("Selected spell", spell);
                _this.gui.selectSpell(spell.number);
            })
                .catch(function (error) {
                console.error("Error selecting spell", error);
            });
        };
        ExchangeWithSpellPoolSpellOnBoardSelectionState.prototype.onLeave = function () {
            this.gui.makeSpellsNotClickableOnCurrentPlayersBoard();
        };
        return ExchangeWithSpellPoolSpellOnBoardSelectionState;
    }(NoopState_9.NoopState));
    exports.ExchangeWithSpellPoolSpellOnBoardSelectionState = ExchangeWithSpellPoolSpellOnBoardSelectionState;
});
define("src/client/states/ExchangeWithSpellPoolSpellFromPoolSelectionState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_10, NoopState_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExchangeWithSpellPoolSpellFromPoolSelectionState = void 0;
    var ExchangeWithSpellPoolSpellFromPoolSelectionState = (function (_super) {
        __extends(ExchangeWithSpellPoolSpellFromPoolSelectionState, _super);
        function ExchangeWithSpellPoolSpellFromPoolSelectionState(elementum) {
            var _this = _super.call(this) || this;
            _this.elementum = elementum;
            return _this;
        }
        ExchangeWithSpellPoolSpellFromPoolSelectionState.prototype.onUpdateActionButtons = function (args) {
            this.elementum.addCancelButton(_("Cancel"), function () {
                ActionsAPI_10.ActionsAPI.actExchangeWithSpellPool_CancelSpellOnBoardChoice();
            });
        };
        ExchangeWithSpellPoolSpellFromPoolSelectionState.prototype.spellOnSpellPoolClicked = function (spell) {
            ActionsAPI_10.ActionsAPI.actExchangeWithSpellPool_SelectSpellFromPool(spell.number)
                .then(function () {
                console.log("Selected spell", spell);
            })
                .catch(function (error) {
                console.error("Error selecting spell", error);
            });
        };
        return ExchangeWithSpellPoolSpellFromPoolSelectionState;
    }(NoopState_10.NoopState));
    exports.ExchangeWithSpellPoolSpellFromPoolSelectionState = ExchangeWithSpellPoolSpellFromPoolSelectionState;
});
define("src/client/states/PlacingPowerCrystalsState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_11, NoopState_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlacingPowerCrystalsState = void 0;
    var PlacingPowerCrystalsState = (function (_super) {
        __extends(PlacingPowerCrystalsState, _super);
        function PlacingPowerCrystalsState(gui, elementum) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            _this.elementum = elementum;
            return _this;
        }
        PlacingPowerCrystalsState.prototype.onEnter = function () {
            this.gui.makeSpellsClickableOnCurrentPlayersBoard();
        };
        PlacingPowerCrystalsState.prototype.spellOnBoardClicked = function (playerId, spell, element) {
            ActionsAPI_11.ActionsAPI.actPlacePowerCrystal(spell.number)
                .then(function () {
                console.log("Placed power crystal");
            })
                .catch(function (error) {
                console.error("Failed to place power crystal", error);
            });
        };
        PlacingPowerCrystalsState.prototype.onUpdateActionButtons = function (args) {
            this.elementum.addCancelButton(_("Cancel"), function () {
                ActionsAPI_11.ActionsAPI.actDontPlacePowerCrystal()
                    .then(function () {
                    console.log("Cancelled crystal placement");
                })
                    .catch(function (error) {
                    console.error("Failed to cancel crystal placement", error);
                });
            });
        };
        return PlacingPowerCrystalsState;
    }(NoopState_11.NoopState));
    exports.PlacingPowerCrystalsState = PlacingPowerCrystalsState;
});
define("src/client/states/AddFromSpellPoolUniversalElementSpellDestinationState copy", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_12, NoopState_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddFromSpellPoolUniversalElementSpellDestinationState = void 0;
    var AddFromSpellPoolUniversalElementSpellDestinationState = (function (_super) {
        __extends(AddFromSpellPoolUniversalElementSpellDestinationState, _super);
        function AddFromSpellPoolUniversalElementSpellDestinationState(gui, elementum) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            _this.elementum = elementum;
            return _this;
        }
        AddFromSpellPoolUniversalElementSpellDestinationState.prototype.onEnter = function () {
            this.gui.makeElementSourcesClickableForCurrentPlayer();
        };
        AddFromSpellPoolUniversalElementSpellDestinationState.prototype.onLeave = function () {
            this.gui.makeElementSourcesNotClickableForCurrentPlayer();
        };
        AddFromSpellPoolUniversalElementSpellDestinationState.prototype.onUpdateActionButtons = function (args) {
            var _this = this;
            this.elementum.addCancelButton(_("Cancel"), function () {
                return ActionsAPI_12.ActionsAPI.actAddFromSpellPool_CancelDestinationChoice().then(function () {
                    _this.gui.unpickSpellOnSpellPool();
                });
            });
        };
        AddFromSpellPoolUniversalElementSpellDestinationState.prototype.elementSourceClicked = function (playerId, element) {
            console.log("Element source clicked", element);
            ActionsAPI_12.ActionsAPI.actAddFromSpellPool_PickTargetElement(element)
                .then(function () {
                console.log("Picking element source", element);
            })
                .catch(function (error) {
                console.error("Error picking element source", error);
            });
        };
        return AddFromSpellPoolUniversalElementSpellDestinationState;
    }(NoopState_12.NoopState));
    exports.AddFromSpellPoolUniversalElementSpellDestinationState = AddFromSpellPoolUniversalElementSpellDestinationState;
});
define("src/client/states/SelectedVirtualElementSourcesTracker", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectedVirtualElementSourcesTracker = void 0;
    var SelectedVirtualElementSourcesTracker = (function () {
        function SelectedVirtualElementSourcesTracker() {
            this.virtualElements = {};
        }
        SelectedVirtualElementSourcesTracker.startTracking = function () {
            return new SelectedVirtualElementSourcesTracker();
        };
        SelectedVirtualElementSourcesTracker.prototype.canSelectMoreElements = function () {
            return (this.getAmountOfSelectedElements() <
                SelectedVirtualElementSourcesTracker.MAX_ELEMENTS);
        };
        SelectedVirtualElementSourcesTracker.prototype.getAmountOfSelectedElements = function () {
            return Object.values(this.virtualElements).reduce(function (acc, elements) { return acc + elements.length; }, 0);
        };
        SelectedVirtualElementSourcesTracker.prototype.select = function (spellNumber, element) {
            if (!this.virtualElements[spellNumber]) {
                this.virtualElements[spellNumber] = [];
            }
            this.virtualElements[spellNumber].push(element);
        };
        SelectedVirtualElementSourcesTracker.prototype.deselect = function (spellNumber, element) {
            if (!this.virtualElements[spellNumber]) {
                return;
            }
            var index = this.virtualElements[spellNumber].indexOf(element);
            if (index !== -1) {
                this.virtualElements[spellNumber].splice(index, 1);
            }
        };
        SelectedVirtualElementSourcesTracker.prototype.isSelected = function (spellNumber, element) {
            return (this.virtualElements[spellNumber] &&
                this.virtualElements[spellNumber].includes(element));
        };
        SelectedVirtualElementSourcesTracker.prototype.clear = function () {
            this.virtualElements = {};
        };
        SelectedVirtualElementSourcesTracker.prototype.getSelectedElements = function () {
            return this.virtualElements;
        };
        SelectedVirtualElementSourcesTracker.MAX_ELEMENTS = 2;
        return SelectedVirtualElementSourcesTracker;
    }());
    exports.SelectedVirtualElementSourcesTracker = SelectedVirtualElementSourcesTracker;
});
define("src/client/gui/VirtualElementSources", ["require", "exports", "src/client/common/Templates", "src/client/states/SelectedVirtualElementSourcesTracker"], function (require, exports, Templates_7, SelectedVirtualElementSourcesTracker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VirtualElementSources = void 0;
    var VirtualElementSources = (function () {
        function VirtualElementSources(virtualElementSourcesCandidates) {
            this.virtualElementSourcesCandidates = virtualElementSourcesCandidates;
            this.tracker = SelectedVirtualElementSourcesTracker_1.SelectedVirtualElementSourcesTracker.startTracking();
            this.handles = [];
        }
        VirtualElementSources.prototype.showVirtualElementSourcesAndMakeThemClickable = function () {
            var _this = this;
            var _loop_2 = function (spellNumber) {
                var elements = this_2.virtualElementSourcesCandidates[spellNumber];
                if (!elements) {
                    return "continue";
                }
                var spellElementId = Templates_7.Templates.idOfSpellByNumber(+spellNumber);
                var containerTemplate = Templates_7.Templates.virtualElementSourcesContainer();
                var containerElement = dojo.place(containerTemplate, spellElementId);
                var _loop_3 = function (element) {
                    var virtualElementTemplate = Templates_7.Templates.virtualElementSource(element);
                    var virtualElementElement = dojo.place(virtualElementTemplate, containerElement);
                    var clickHandle = dojo.connect(virtualElementElement, "onclick", function () {
                        if (_this.tracker.isSelected(+spellNumber, element)) {
                            _this.tracker.deselect(+spellNumber, element);
                            dojo.removeClass(virtualElementElement, "selected");
                        }
                        else if (_this.tracker.canSelectMoreElements()) {
                            dojo.addClass(virtualElementElement, "selected");
                            _this.tracker.select(+spellNumber, element);
                        }
                    });
                    this_2.handles.push(clickHandle);
                };
                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                    var element = elements_1[_i];
                    _loop_3(element);
                }
            };
            var this_2 = this;
            for (var spellNumber in this.virtualElementSourcesCandidates) {
                _loop_2(spellNumber);
            }
        };
        VirtualElementSources.prototype.getSelectedElements = function () {
            return this.tracker.getSelectedElements();
        };
        VirtualElementSources.prototype.hideVirtualElementSources = function () {
            this.tracker.clear();
            this.handles.forEach(function (handle) { return dojo.disconnect(handle); });
            this.destroyVirtualElementCandidatesContainers();
        };
        VirtualElementSources.prototype.destroyVirtualElementCandidatesContainers = function () {
            dojo
                .query(".virtual-element-sources-container")
                .forEach(function (node) { return dojo.destroy(node); });
        };
        return VirtualElementSources;
    }());
    exports.VirtualElementSources = VirtualElementSources;
});
define("src/client/states/PickVirtualElementSourcesState", ["require", "exports", "src/client/ActionsAPI", "src/client/gui/VirtualElementSources", "src/client/states/NoopState"], function (require, exports, ActionsAPI_13, VirtualElementSources_1, NoopState_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PickVirtualElementSourcesState = void 0;
    var PickVirtualElementSourcesState = (function (_super) {
        __extends(PickVirtualElementSourcesState, _super);
        function PickVirtualElementSourcesState(elementum) {
            var _this = _super.call(this) || this;
            _this.elementum = elementum;
            return _this;
        }
        PickVirtualElementSourcesState.prototype.onEnter = function (args) {
            if (!args.args) {
                console.error("No args provided to PickVirtualElementSourcesState");
            }
            var virtualElements = args.args.virtualElements;
            console.log("Picking virtual elements with args", virtualElements);
            this.virtualElementSources = new VirtualElementSources_1.VirtualElementSources(virtualElements);
            this.virtualElementSources.showVirtualElementSourcesAndMakeThemClickable();
        };
        PickVirtualElementSourcesState.prototype.onUpdateActionButtons = function () {
            var _this = this;
            if (!this.elementum.isCurrentPlayerActive()) {
                return;
            }
            this.elementum.addActionButton("confirm", _("Pick selected virtual element sources"), function () {
                var _a, _b;
                var selectedElements = (_b = (_a = _this.virtualElementSources) === null || _a === void 0 ? void 0 : _a.getSelectedElements()) !== null && _b !== void 0 ? _b : {};
                console.log("Picking virtual element sources", selectedElements);
                ActionsAPI_13.ActionsAPI.actPickVirtualElementSources(selectedElements).then(function () {
                    console.log("picked virtual elements");
                });
            }, undefined, false, "blue");
            this.elementum.addCancelButton(_("Don't pick any virtual element sources"), function () {
                ActionsAPI_13.ActionsAPI.dontPickVirtualElementSources().then(function () { });
            });
        };
        PickVirtualElementSourcesState.prototype.onLeave = function () {
            var _a;
            (_a = this.virtualElementSources) === null || _a === void 0 ? void 0 : _a.hideVirtualElementSources();
            this.virtualElementSources = undefined;
        };
        return PickVirtualElementSourcesState;
    }(NoopState_13.NoopState));
    exports.PickVirtualElementSourcesState = PickVirtualElementSourcesState;
});
define("src/client/states/PickSpellToGetHalfThePointsState", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_14, NoopState_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PickSpellToGetHalfThePointsState = void 0;
    var PickSpellToGetHalfThePointsState = (function (_super) {
        __extends(PickSpellToGetHalfThePointsState, _super);
        function PickSpellToGetHalfThePointsState(gui, elementum) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            _this.elementum = elementum;
            return _this;
        }
        PickSpellToGetHalfThePointsState.prototype.onEnter = function () {
            console.log("PickSpellToGetHalfThePointsState");
            this.gui.makeSpellsClickableOnCurrentPlayersBoard();
        };
        PickSpellToGetHalfThePointsState.prototype.onUpdateActionButtons = function (args) {
            if (!this.elementum.isCurrentPlayerActive()) {
                return;
            }
            this.elementum.addCancelButton(_("Don't pick any spell"), function () {
                ActionsAPI_14.ActionsAPI.actDontPickSpellToGetHalfThePoints().then(function () {
                    console.log("Cancelled spell choice");
                });
            });
        };
        PickSpellToGetHalfThePointsState.prototype.spellOnBoardClicked = function (playerId, spell, element) {
            if (+playerId != +this.elementum.getActivePlayerId()) {
                return;
            }
            console.log("Picking spell to get half the points", spell, element);
            ActionsAPI_14.ActionsAPI.actPickSpellToGetHalfThePoints(spell.number).then(function () {
                console.log("Picked spell to get half the points");
            }, function () {
                console.error("Failed to pick spell to get half the points");
            });
        };
        PickSpellToGetHalfThePointsState.prototype.onLeave = function () {
            console.log("PickSpellToGetHalfThePointsState");
            this.gui.makeSpellsNotClickableOnCurrentPlayersBoard();
        };
        return PickSpellToGetHalfThePointsState;
    }(NoopState_14.NoopState));
    exports.PickSpellToGetHalfThePointsState = PickSpellToGetHalfThePointsState;
});
define("src/client/states/AnnounceOnEnterState", ["require", "exports", "src/client/gui/Announcement", "src/client/states/NoopState"], function (require, exports, Announcement_1, NoopState_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnnounceOnEnterState = void 0;
    var AnnounceOnEnterState = (function (_super) {
        __extends(AnnounceOnEnterState, _super);
        function AnnounceOnEnterState(message, limit) {
            if (limit === void 0) { limit = 1; }
            var _this = _super.call(this) || this;
            _this.message = message;
            _this.limit = limit;
            _this.announcementCounter = 0;
            return _this;
        }
        AnnounceOnEnterState.prototype.onEnter = function () {
            console.log("AnnounceOnEnterState");
            if (this.canAnnounce()) {
                this.announceAndIncrementCounter(this.message);
            }
        };
        AnnounceOnEnterState.prototype.canAnnounce = function () {
            return this.announcementCounter < this.limit;
        };
        AnnounceOnEnterState.prototype.announceAndIncrementCounter = function (message) {
            (0, Announcement_1.announce)(message);
            this.announcementCounter++;
        };
        return AnnounceOnEnterState;
    }(NoopState_15.NoopState));
    exports.AnnounceOnEnterState = AnnounceOnEnterState;
});
define("src/client/states/PickSpellWithScoringActivationToCopy", ["require", "exports", "src/client/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_15, NoopState_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PickSpellWithScoringActivationToCopyState = void 0;
    var PickSpellWithScoringActivationToCopyState = (function (_super) {
        __extends(PickSpellWithScoringActivationToCopyState, _super);
        function PickSpellWithScoringActivationToCopyState(gui, elementum) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            _this.elementum = elementum;
            return _this;
        }
        PickSpellWithScoringActivationToCopyState.prototype.onEnter = function () {
            console.log("pickSpellWithScoringActivationToCopy");
            this.gui.makeSpellsClickableOnAllBoards();
        };
        PickSpellWithScoringActivationToCopyState.prototype.onUpdateActionButtons = function (args) {
            if (!this.elementum.isCurrentPlayerActive()) {
                return;
            }
            this.elementum.addCancelButton(_("Don't pick any spell"), function () {
                ActionsAPI_15.ActionsAPI.actDontPickSpellWithScoringActivationToCopy().then(function () {
                    console.log("Cancelled spell choice");
                });
            });
        };
        PickSpellWithScoringActivationToCopyState.prototype.spellOnBoardClicked = function (playerId, spell, element) {
            console.log("Picking spell to", spell, element);
            ActionsAPI_15.ActionsAPI.actPickSpellWithScoringActivationToCopy(spell.number).then(function () {
                console.log("Picked spell");
            }, function () {
                console.error("Failed to pick spell");
            });
        };
        PickSpellWithScoringActivationToCopyState.prototype.onLeave = function () {
            console.log("PickSpellWithScoringActivationToCopyState");
            this.gui.makeSpellsNotClickableOnAllBoards();
        };
        return PickSpellWithScoringActivationToCopyState;
    }(NoopState_16.NoopState));
    exports.PickSpellWithScoringActivationToCopyState = PickSpellWithScoringActivationToCopyState;
});
define("bgagame/elementum", ["require", "exports", "ebg/core/gamegui", "cookbook/common", "src/client/gui/ElementumGameInterface", "src/client/states/NoopState", "src/client/states/PickSpellState", "src/client/states/SpellDestinationChoiceState", "src/client/common/Templates", "src/client/Notifications", "src/client/states/PlayersDraftState", "src/client/gui/GameInfoPanel", "src/client/states/UniversalElementDestinationChoiceState", "src/client/gui/Announcement", "src/client/states/DestroyTargetSelectionState", "src/client/states/AddFromSpellPoolSpellSelectionState", "src/client/states/ExchangeWithSpellPoolUniversalElementSpellDestinationState", "src/client/states/CopyImmediateSpellSelectionState", "src/client/states/ExchangeWithSpellPoolSpellOnBoardSelectionState", "src/client/states/ExchangeWithSpellPoolSpellFromPoolSelectionState", "src/client/states/PlacingPowerCrystalsState", "src/client/states/AddFromSpellPoolUniversalElementSpellDestinationState copy", "src/client/states/PickVirtualElementSourcesState", "src/client/states/PickSpellToGetHalfThePointsState", "src/client/states/AnnounceOnEnterState", "src/client/states/PickSpellWithScoringActivationToCopy"], function (require, exports, Gamegui, CommonMixer, ElementumGameInterface_1, NoopState_17, PickSpellState_1, SpellDestinationChoiceState_1, Templates_8, Notifications_1, PlayersDraftState_1, GameInfoPanel_2, UniversalElementDestinationChoiceState_1, Announcement_2, DestroyTargetSelectionState_1, AddFromSpellPoolSpellSelectionState_1, ExchangeWithSpellPoolUniversalElementSpellDestinationState_1, CopyImmediateSpellSelectionState_1, ExchangeWithSpellPoolSpellOnBoardSelectionState_1, ExchangeWithSpellPoolSpellFromPoolSelectionState_1, PlacingPowerCrystalsState_1, AddFromSpellPoolUniversalElementSpellDestinationState_copy_1, PickVirtualElementSourcesState_1, PickSpellToGetHalfThePointsState_1, AnnounceOnEnterState_1, PickSpellWithScoringActivationToCopy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Elementum = void 0;
    var Elementum = (function (_super) {
        __extends(Elementum, _super);
        function Elementum() {
            var _this = _super.call(this) || this;
            _this.allSpells = [];
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
                crystalsPerSpell: gamedatas.crystalsPerSpell,
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
            (0, Announcement_2.announce)("Current round: " + gamedatas.currentRound + "/3");
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
                noop: new NoopState_17.NoopState(),
                universalElementSpellDestination: new UniversalElementDestinationChoiceState_1.UniversalElementDestinationChoiceState(this.gui),
                destroyTargetSelection: new DestroyTargetSelectionState_1.DestroyTargetSelectionState(this.gui),
                addFromSpellPool_spellSelection: new AddFromSpellPoolSpellSelectionState_1.AddFromSpellPoolSpellSelectionState(),
                addFromSpellPool_universalElementSpellDestination: new AddFromSpellPoolUniversalElementSpellDestinationState_copy_1.AddFromSpellPoolUniversalElementSpellDestinationState(this.gui, this),
                copyImmediateSpell_spellSelection: new CopyImmediateSpellSelectionState_1.CopyImmediateSpellSelectionState(this.gui),
                exchangeWithSpellPool_spellOnBoardSelection: new ExchangeWithSpellPoolSpellOnBoardSelectionState_1.ExchangeWithSpellPoolSpellOnBoardSelectionState(this.gui),
                exchangeWithSpellPool_spellFromSpellPoolSelection: new ExchangeWithSpellPoolSpellFromPoolSelectionState_1.ExchangeWithSpellPoolSpellFromPoolSelectionState(this),
                exchangeWithSpellPool_universalElementSpellDestination: new ExchangeWithSpellPoolUniversalElementSpellDestinationState_1.ExchangeWithSpellPoolUniversalElementSpellDestinationState(this.gui, this),
                placingPowerCrystals: new PlacingPowerCrystalsState_1.PlacingPowerCrystalsState(this.gui, this),
                pickVirtualElementSources: new PickVirtualElementSourcesState_1.PickVirtualElementSourcesState(this),
                pickSpellToGetHalfThePoints: new PickSpellToGetHalfThePointsState_1.PickSpellToGetHalfThePointsState(this.gui, this),
                scoringExtraInputCheck: new AnnounceOnEnterState_1.AnnounceOnEnterState(_("Collecting extra input before scoring")),
                pickSpellWithScoringActivationToCopy: new PickSpellWithScoringActivationToCopy_1.PickSpellWithScoringActivationToCopyState(this.gui, this),
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
            console.log("Entering state: ", stateName, args);
            this.setAndEnterStateBasedOnName(stateName, args);
        };
        Elementum.prototype.setAndEnterStateBasedOnName = function (stateName, args) {
            this.getStateByName(stateName).onEnter(args);
        };
        Elementum.prototype.setTextBeforeCancelButton = function (text) {
            dojo.place(Templates_8.Templates.textBeforeCancelButton(text), "cancel", "before");
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
                var _a = notification.args, playerId = _a.player_id, spell = _a.spell, element = _a.element;
                _this.gui.putSpellOnBoard(playerId, spell, element);
            });
            (0, Notifications_1.onNotification)("newHand").do(function (notification) {
                _this.gui.replaceHand(notification.args.newHand);
            });
            (0, Notifications_1.onNotification)("newSpellPoolCard").do(function (notification) {
                var newSpellNumber = notification.args.newSpellNumber;
                _this.gui.putSpellInSpellPool(newSpellNumber);
            });
            (0, Notifications_1.onNotification)("youPaidCrystalForSpellPool").do(function () {
                _this.gui.crystals.moveCrystalFromPlayerToPile(_this.getCurrentPlayerId().toString());
            });
            (0, Notifications_1.onNotification)("otherPlayerPaidCrystalForSpellPool").do(function (notification) {
                _this.gui.crystals.moveCrystalFromPlayerToPile(notification.args.playerId);
            });
            (0, Notifications_1.onNotification)("newRound").do(function (notification) {
                var round = notification.args.round;
                GameInfoPanel_2.GameInfoPanel.updateCurrentRound(round);
                (0, Announcement_2.announce)("Round " + round + " started");
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
                var _a = notification.args, victimPlayerId = _a.victimPlayerId, spellNumber = _a.spellNumber;
                _this.gui.destroySpellOnBoard(victimPlayerId, spellNumber);
            });
            (0, Notifications_1.onNotification)("playerAddedSpellFromPool").do(function (notification) {
                console.log("Spell added from spell pool", notification.args);
                var _a = notification.args, playerId = _a.playerId, spellNumber = _a.spellNumber, element = _a.element;
                var spell = _this.getSpellByNumber(spellNumber);
                _this.gui.putSpellOnBoard(playerId, spell, element);
            });
            (0, Notifications_1.onNotification)("exchangedSpellWithPool").do(function (notification) {
                console.log("Spell exchanged with pool", notification.args);
                var _a = notification.args, playerId = _a.playerId, spellNumber = _a.spellNumber, spellPoolNumber = _a.spellPoolNumber, element = _a.element;
                var spellFromPool = _this.getSpellByNumber(spellPoolNumber);
                _this.gui.crystals.moveAllCrystalsFromSpellToPile(spellNumber);
                _this.gui.putSpellOnBoard(playerId, spellFromPool, element);
                _this.gui.putSpellInSpellPool(spellNumber);
            });
            (0, Notifications_1.onNotification)("playerPlacedPowerCrystal").do(function (notification) {
                var _a = notification.args, playerId = _a.playerId, spellNumber = _a.spellNumber;
                _this.gui.crystals.moveCrystalFromPlayerToSpell(playerId, spellNumber);
            });
            (0, Notifications_1.onNotification)("extraTurn").do(function () {
                (0, Announcement_2.announce)("Extra turn! You can play another spell.");
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
