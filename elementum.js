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
define("src/client/api/ActionsAPI", ["require", "exports", "bgagame/elementum"], function (require, exports, elementum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionsAPI = void 0;
    var ActionsAPI = (function () {
        function ActionsAPI() {
        }
        ActionsAPI.pickSpell = function (spellNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, elementum_1.Elementum.getInstance()
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
                    return [2, elementum_1.Elementum.getInstance()
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
                    return [2, elementum_1.Elementum.getInstance()
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
                    return [2, elementum_1.Elementum.getInstance()
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
                    return [2, elementum_1.Elementum.getInstance()
                            .performPossibleAction("actCancelDraftChoice")
                            .catch(function () {
                            throw new Error("Error cancelling draft choice");
                        })];
                });
            });
        };
        return ActionsAPI;
    }());
    exports.ActionsAPI = ActionsAPI;
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
define("src/client/gui/Crystals", ["require", "exports", "ebg/zone", "src/client/common/utils"], function (require, exports, Zone, utils_1) {
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
                    (0, utils_1.doAfter)(1000 * (2 + i), function () {
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
                (0, utils_1.doAfter)(1000 * (2 + i), function () { return _this.moveCrystalFromPlayerToPile(playerId); });
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
        Crystals.CRYSTALS_PILE_ID = "main-crystals-pile";
        Crystals.CRYSTAL_SIZE = 25;
        return Crystals;
    }());
    exports.Crystals = Crystals;
});
define("src/client/common/Templates", ["require", "exports", "bgagame/elementum", "src/client/common/utils"], function (require, exports, elementum_2, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Templates = void 0;
    var Templates = (function () {
        function Templates() {
        }
        Templates.spell = function (spell) {
            return elementum_2.Elementum.getInstance().format_block("jstpl_spell", {
                spellNumber: spell.number,
                spellSummaryData: "".concat(spell.number, ": ").concat(spell.name, "\n(").concat((0, utils_2.getIconForElement)(spell.element), ")"),
                element: spell.element,
            });
        };
        return Templates;
    }());
    exports.Templates = Templates;
});
define("src/client/gui/PlayerBoard", ["require", "exports", "src/client/common/utils", "src/client/common/Templates"], function (require, exports, utils_3, Templates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayerBoard = void 0;
    var PlayerBoard = (function () {
        function PlayerBoard(playerId, playerBoard, core) {
            this.playerId = playerId;
            this.playerBoard = playerBoard;
            this.core = core;
            this.createPlayerBoard();
        }
        PlayerBoard.prototype.createPlayerBoard = function () {
            this.createPlayerBoardContainer();
            this.createPlayerBoardColumns();
        };
        PlayerBoard.prototype.createPlayerBoardContainer = function () {
            var playerName = this.core.gamedatas.players[+this.playerId].name;
            var playerBoardContainer = this.core.format_block("jstpl_player_board_container", { playerId: this.playerId, playerName: playerName });
            dojo.place(playerBoardContainer, "board");
        };
        PlayerBoard.prototype.createPlayerBoardColumns = function () {
            for (var _i = 0, _a = this.playerBoard.elementSources; _i < _a.length; _i++) {
                var element = _a[_i];
                this.createPlayerBoardColumn(element);
                this.putElementSourceAsFirstElementInColumn(element);
                this.putSpellsInColumn(this.playerBoard.board[element]);
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
                icon: (0, utils_3.getIconForElement)(element),
            });
            dojo.place(elementSource, this.getIdOfElementColumnForCurrentPlayer(element));
        };
        PlayerBoard.prototype.getIdOfElementColumnForCurrentPlayer = function (element) {
            return "spells-column-".concat(this.playerId, "-").concat(element);
        };
        PlayerBoard.prototype.putSpellsInColumn = function (spells) {
            for (var _i = 0, spells_1 = spells; _i < spells_1.length; _i++) {
                var spell = spells_1[_i];
                this.putSpellOnBoard(spell);
            }
        };
        PlayerBoard.prototype.putSpellOnBoard = function (spell) {
            var spellTemplate = Templates_1.Templates.spell(spell);
            dojo.place(spellTemplate, this.getIdOfElementColumnForCurrentPlayer(spell.element));
        };
        return PlayerBoard;
    }());
    exports.PlayerBoard = PlayerBoard;
});
define("src/client/gui/Spells", ["require", "exports", "src/client/common/Templates"], function (require, exports, Templates_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Spells = void 0;
    var Spells = (function () {
        function Spells(containerId, spells) {
            this.containerId = containerId;
            this.spells = spells;
            this.spellClickHandlers = [];
            this.spellClickedListeners = [];
            this.addSpellsToDOMAndMakeThenClickable(containerId, spells);
        }
        Spells.prototype.addSpellsToDOMAndMakeThenClickable = function (containerId, spells) {
            for (var _i = 0, spells_2 = spells; _i < spells_2.length; _i++) {
                var spell = spells_2[_i];
                var spellBlock = Templates_2.Templates.spell(spell);
                dojo.place(spellBlock, containerId);
            }
            this.makeSpellsClickable();
        };
        Spells.prototype.whenSpellClicked = function (onSpellClicked) {
            this.spellClickedListeners.push(onSpellClicked);
        };
        Spells.prototype.makeSpellsClickable = function () {
            var _this = this;
            this.forEachSpellInDom(function (spell) {
                dojo.addClass(spell, "clickable");
                var handler = dojo.connect(spell, "onclick", function (evt) {
                    _this.pickSpellFromEvent(evt).then(function (spell) {
                        _this.spellClickedListeners.forEach(function (listener) { return listener(spell); });
                    });
                });
                _this.spellClickHandlers.push(handler);
            });
        };
        Spells.prototype.forEachSpellInDom = function (callback) {
            dojo
                .query("#".concat(this.containerId, " div.spell"))
                .forEach(function (spell) { return callback(spell); });
        };
        Spells.prototype.makeSpellsUnclickable = function () {
            this.spellClickHandlers.forEach(function (handler) { return dojo.disconnect(handler); });
            this.spellClickHandlers = [];
            this.forEachSpellInDom(function (spell) {
                dojo.removeClass(spell, "clickable");
            });
        };
        Spells.prototype.pickSpellFromEvent = function (evt) {
            this.pickedSpellElement = evt.target;
            var spellNumber = this.pickedSpellElement.id.split("_")[1];
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
        Spells.prototype.getSpellByNumber = function (spellNumber) {
            return this.spells.find(function (spell) { return spell.number === spellNumber; });
        };
        Spells.prototype.pickSpell = function (spellNumber) {
            this.pickedSpellElement = $("spell_".concat(spellNumber));
            if (this.pickedSpellElement) {
                dojo.addClass(this.pickedSpellElement, "picked");
            }
            else {
                console.error("Couldn't find spell with number", spellNumber);
            }
        };
        Spells.prototype.unpickSpell = function () {
            if (this.pickedSpellElement) {
                dojo.removeClass(this.pickedSpellElement, "picked");
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
        Spells.prototype.getIdOfSpellElement = function (spell) {
            return "spell_".concat(spell.number);
        };
        Spells.prototype.replaceSpells = function (spells) {
            dojo.empty(this.containerId);
            this.spells = spells;
            this.addSpellsToDOMAndMakeThenClickable(this.containerId, spells);
        };
        Spells.prototype.addSpell = function (spell) {
            this.spells.push(spell);
            var spellBlock = Templates_2.Templates.spell(spell);
            dojo.place(spellBlock, this.containerId);
            this.makeSpellsUnclickable();
            this.makeSpellsClickable();
        };
        return Spells;
    }());
    exports.Spells = Spells;
});
define("src/client/gui/ElementumGameInterface", ["require", "exports", "bgagame/elementum", "src/client/gui/Crystals", "src/client/gui/PlayerBoard", "src/client/gui/Spells"], function (require, exports, elementum_3, Crystals_1, PlayerBoard_1, Spells_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ElementumGameInterface = void 0;
    var ElementumGameInterface = (function () {
        function ElementumGameInterface(spellPool, playerHand, crystals, core, playerBoards) {
            this.crystals = crystals;
            this.core = core;
            this.buildSpellPool(spellPool);
            this.buildPlayerHand(playerHand);
            this.crystals.putCrystalsOnBoardAndInPlayerPanels();
            this.buildPlayerBoards(playerBoards);
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
        ElementumGameInterface.prototype.buildSpellPool = function (spellPool) {
            this.spellPool = new Spells_1.Spells("spell-pool", spellPool);
        };
        ElementumGameInterface.prototype.buildPlayerHand = function (playerHand) {
            this.playerHand = new Spells_1.Spells("current-player-hand", playerHand);
        };
        ElementumGameInterface.prototype.buildPlayerBoards = function (playerBoards) {
            var _this = this;
            this.playerBoards = Object.fromEntries(Object.entries(playerBoards).map(function (_a) {
                var playerId = _a[0], playerBoard = _a[1];
                return [playerId, new PlayerBoard_1.PlayerBoard(playerId, playerBoard, _this.core)];
            }));
        };
        ElementumGameInterface.prototype.moveSpellFromHandToBoard = function (playerId, spell) {
            var _this = this;
            var spellId = this.playerHand.getIdOfSpellElement(spell);
            var columnId = this.playerBoards[playerId].getIdOfElementColumnForCurrentPlayer(spell.element);
            var animationId = elementum_3.Elementum.getInstance().slideToObject(spellId, columnId, 20000, 1000);
            dojo.connect(animationId, "onEnd", function () {
                _this.playerHand.removeSpell(spell);
                _this.putSpellOnBoard(playerId, spell);
            });
            animationId.play();
        };
        ElementumGameInterface.prototype.putSpellOnBoard = function (playerId, spell) {
            this.playerBoards[playerId].putSpellOnBoard(spell);
        };
        ElementumGameInterface.prototype.replaceHand = function (hand) {
            this.playerHand.replaceSpells(hand);
        };
        ElementumGameInterface.prototype.pickSpell = function (spellNumber) {
            this.playerHand.pickSpell(spellNumber);
        };
        ElementumGameInterface.prototype.unpickSpell = function () {
            this.playerHand.unpickSpell();
        };
        ElementumGameInterface.prototype.pickSpellOnSpellPool = function (spellNumber) {
            this.spellPool.pickSpell(spellNumber);
        };
        ElementumGameInterface.prototype.unpickSpellOnSpellPool = function () {
            this.spellPool.unpickSpell();
        };
        ElementumGameInterface.prototype.putSpellInSpellPool = function (spellNumber) {
            this.spellPool.addSpell(this.core.getSpellByNumber(spellNumber));
        };
        ElementumGameInterface.prototype.removeSpellInSpellPool = function (spellNumber) {
            this.spellPool.removeSpell(this.core.getSpellByNumber(spellNumber));
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
        NoopState.prototype.spellClicked = function (spell) {
            console.log("NoopState.spellClicked", spell);
        };
        NoopState.prototype.spellOnSpellPoolClicked = function (spell) {
            console.log("NoopState.spellOnSpellPoolClicked", spell);
        };
        NoopState.prototype.onLeave = function () {
            console.log("NoopState.onLeave");
        };
        return NoopState;
    }());
    exports.NoopState = NoopState;
});
define("src/client/states/PickSpellState", ["require", "exports", "src/client/api/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_1, NoopState_1) {
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
        PickSpellState.prototype.spellClicked = function (spell) {
            var _this = this;
            console.log("Spell clicked", spell);
            ActionsAPI_1.ActionsAPI.pickSpell(spell.number)
                .then(function () {
                console.log("Picking spell", spell.number);
                _this.gui.pickSpell(spell.number);
            })
                .catch(function (error) {
                console.error("Error picking spell", error);
            });
        };
        return PickSpellState;
    }(NoopState_1.NoopState));
    exports.PickSpellState = PickSpellState;
});
define("src/client/states/SpellDestinationChoiceState", ["require", "exports", "src/client/api/ActionsAPI", "src/client/states/NoopState"], function (require, exports, ActionsAPI_2, NoopState_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpellDestinationChoiceState = void 0;
    var SpellDestinationChoiceState = (function (_super) {
        __extends(SpellDestinationChoiceState, _super);
        function SpellDestinationChoiceState(gui) {
            var _this = _super.call(this) || this;
            _this.gui = gui;
            return _this;
        }
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
        return SpellDestinationChoiceState;
    }(NoopState_2.NoopState));
    exports.SpellDestinationChoiceState = SpellDestinationChoiceState;
});
define("bgagame/elementum", ["require", "exports", "ebg/core/gamegui", "cookbook/common", "src/client/gui/ElementumGameInterface", "src/client/api/ActionsAPI", "src/client/states/NoopState", "src/client/states/PickSpellState", "src/client/states/SpellDestinationChoiceState", "ebg/counter"], function (require, exports, Gamegui, CommonMixer, ElementumGameInterface_1, ActionsAPI_3, NoopState_3, PickSpellState_1, SpellDestinationChoiceState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Elementum = void 0;
    var Elementum = (function (_super) {
        __extends(Elementum, _super);
        function Elementum() {
            var _this = _super.call(this) || this;
            _this.state = new NoopState_3.NoopState();
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
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
            }
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
                _this.state.spellClicked(spell);
            });
            this.gui.whenSpellPoolClicked(function (spell) {
                _this.state.spellOnSpellPoolClicked(spell);
            });
            console.log("Ending game setup");
            dojo.connect($("animation-test-button"), "onclick", function (event) {
                var animationId = _this.slideToObject("actor", "box2", 2000, 500);
                dojo.connect(animationId, "onEnd", function () {
                    _this.attachToNewParentNoDestroy("actor", "box2");
                });
                animationId.play();
            });
        };
        Elementum.prototype.getSpellByNumber = function (spellNumber) {
            return this.allSpells[spellNumber - 1];
        };
        Elementum.prototype.onEnteringState = function (stateName, args) {
            console.log("Entering state: " + stateName);
            this.setStateBasedOnName(stateName);
            switch (stateName) {
                case "spellDestinationChoice":
                    this.setTextBeforeCancelButton(_(", pick a Spell from the Spell Pool or "));
                    break;
            }
        };
        Elementum.prototype.setStateBasedOnName = function (stateName) {
            switch (stateName) {
                case "spellChoice":
                    this.state = new PickSpellState_1.PickSpellState(this.gui);
                    break;
                case "spellDestinationChoice":
                    this.state = new SpellDestinationChoiceState_1.SpellDestinationChoiceState(this.gui);
                    break;
                default:
                    this.state = new NoopState_3.NoopState();
            }
        };
        Elementum.prototype.setTextBeforeCancelButton = function (text) {
            console.log("Setting text after general actions", text);
            dojo.place("<span id=\"text-before-cancel-button\">".concat(text, "</span>"), "cancel", "before");
        };
        Elementum.prototype.onLeavingState = function (stateName) {
            console.log("Leaving state: " + stateName);
            this.state.onLeave();
            switch (stateName) {
                case "spellDestinationChoice":
                    this.clearTextAfterGeneralActions();
                    break;
            }
        };
        Elementum.prototype.clearTextAfterGeneralActions = function () {
            dojo.destroy("text-before-cancel-button");
        };
        Elementum.prototype.onUpdateActionButtons = function (stateName, args) {
            var _this = this;
            console.log("onUpdateActionButtons: " + stateName, args);
            switch (stateName) {
                case "spellDestinationChoice":
                    this.addActionButton("playSpellBtn", _("Play the Spell on your board"), function () { return ActionsAPI_3.ActionsAPI.playSpell(); });
                    this.addCancelButton(_("Cancel"), function () {
                        ActionsAPI_3.ActionsAPI.cancelSpellChoice().then(function () {
                            _this.gui.unpickSpell();
                        });
                    });
                    break;
                case "playersDraft":
                    this.addCancelButton(_("Cancel"), function () {
                        return ActionsAPI_3.ActionsAPI.cancelDraftChoice().then(function () {
                            _this.gui.unpickSpell();
                            _this.gui.unpickSpellOnSpellPool();
                        });
                    });
                    break;
            }
        };
        Elementum.prototype.addCancelButton = function (text, onClick) {
            this.addActionButton("cancel", text, onClick, undefined, false, "red");
        };
        Elementum.prototype.setupNotifications = function () {
            var _this = this;
            this.on("spellPlayedOnBoard").do(function (notification) {
                console.log("Spell played on board notification", notification);
                var playerId = notification.args.player_id;
                var spell = notification.args.spell;
                if (_this.isCurrentPlayer(playerId)) {
                    _this.gui.moveSpellFromHandToBoard(playerId, spell);
                }
                else {
                    _this.gui.putSpellOnBoard(playerId, spell);
                }
            });
            this.on("newHand").do(function (notification) {
                _this.gui.replaceHand(notification.args.newHand);
            });
            this.on("newSpellPoolCard").do(function (notification) {
                var newSpellNumber = notification.args
                    .newSpellNumber;
                var oldSpellNumber = notification.args
                    .oldSpellNumber;
                _this.gui.putSpellInSpellPool(newSpellNumber);
                _this.gui.removeSpellInSpellPool(oldSpellNumber);
            });
            this.on("youPaidCrystalForSpellPool").do(function (notification) {
                _this.gui.crystals.moveCrystalFromPlayerToPile(_this.getCurrentPlayerId().toString());
            });
            this.on("otherPlayerPaidCrystalForSpellPool").do(function (notification) {
                _this.gui.crystals.moveCrystalFromPlayerToPile(notification.args.playerId);
            });
        };
        Elementum.prototype.on = function (notificationName) {
            var _this = this;
            return {
                do: function (callback) {
                    dojo.subscribe(notificationName, _this, callback);
                },
            };
        };
        Elementum.prototype.isCurrentPlayer = function (playerId) {
            return +playerId === this.player_id;
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
