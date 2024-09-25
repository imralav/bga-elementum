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
                spellSummaryData: "".concat(spell.number, ": ").concat(spell.name, "\n(").concat((0, utils_1.getIconForElement)(spell.element), ")"),
                element: spell.element,
            });
        };
        Templates.idOfSpell = function (spell) {
            return "spell_".concat(spell.number);
        };
        Templates.idOfSpellColumn = function (playerId, element) {
            return "spells-column-".concat(playerId, "-").concat(element);
        };
        Templates.textBeforeCancelButton = function (text) {
            return "<span id=\"text-before-cancel-button\">".concat(text, "</span>");
        };
        return Templates;
    }());
    exports.Templates = Templates;
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
        Crystals.CRYSTALS_PILE_ID = "main-crystals-pile";
        Crystals.CRYSTAL_SIZE = 16;
        return Crystals;
    }());
    exports.Crystals = Crystals;
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
        function Spells(containerId, spells, gui) {
            this.containerId = containerId;
            this.spells = spells;
            this.gui = gui;
            this.spellClickHandlers = [];
            this.spellClickedListeners = [];
            this.addSpellsToDOMAndMakeThenClickable(spells);
        }
        Spells.prototype.addSpellsToDOMAndMakeThenClickable = function (spells) {
            for (var _i = 0, spells_2 = spells; _i < spells_2.length; _i++) {
                var spell = spells_2[_i];
                var spellBlock = Templates_2.Templates.spell(spell);
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
            var spellNode = $(Templates_2.Templates.idOfSpell(spell));
            if (!spellNode) {
                return;
            }
            this.makeSpellNodeClickable(spellNode);
        };
        return Spells;
    }());
    exports.Spells = Spells;
});
define("src/client/gui/animations", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.moveElementOnAnimationSurface = exports.cloneOnAnimationSurface = void 0;
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
        while (parent != animationSurface.parentNode &&
            parent != null &&
            parent != document) {
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
    exports.cloneOnAnimationSurface = cloneOnAnimationSurface;
    function moveElementOnAnimationSurface(elementToMoveId, newParentId, durationInMs) {
        var _a;
        if (durationInMs === void 0) { durationInMs = 1000; }
        var elementToMove = $(elementToMoveId);
        var newParent = $(newParentId);
        console.log("Cloning mobile object");
        var clone = cloneOnAnimationSurface(elementToMove.id, "_animated");
        if (!clone) {
            console.error("Clone not found");
            return Promise.reject("Clone not found");
        }
        console.log("Making it opaque");
        elementToMove.style.opacity = "0.25";
        console.log("Adding the original to new parent");
        newParent.appendChild(elementToMove);
        console.log("Cloning mobile object when it's already in new place, to have destination coordinates");
        var temporaryDestinationElement = cloneOnAnimationSurface(elementToMove.id, "_animation_destination");
        if (!temporaryDestinationElement) {
            console.error("Destination not found");
            return Promise.reject("Destination not found");
        }
        console.log("Transitioning the clone to where the second clone is pointing");
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
});
define("src/client/gui/ElementumGameInterface", ["require", "exports", "src/client/common/Templates", "src/client/gui/Crystals", "src/client/gui/PlayerBoard", "src/client/gui/Spells", "src/client/gui/animations"], function (require, exports, Templates_3, Crystals_1, PlayerBoard_1, Spells_1, animations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ElementumGameInterface = void 0;
    var ElementumGameInterface = (function () {
        function ElementumGameInterface(spellPool, playerHand, crystals, core, playerBoards) {
            this.crystals = crystals;
            this.core = core;
            this.animationDurationInMs = 2000;
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
            this.spellPool = new Spells_1.Spells("spell-pool", spellPool, this);
        };
        ElementumGameInterface.prototype.buildPlayerHand = function (playerHand) {
            this.playerHand = new Spells_1.Spells("current-player-hand", playerHand, this);
        };
        ElementumGameInterface.prototype.buildPlayerBoards = function (playerBoards) {
            var _this = this;
            Object.entries(playerBoards).map(function (_a) {
                var playerId = _a[0], playerBoard = _a[1];
                new PlayerBoard_1.PlayerBoard(playerId, playerBoard, _this.core);
            });
        };
        ElementumGameInterface.prototype.putSpellOnBoard = function (playerId, spell) {
            if (!this.spellExistsOnBoard(spell)) {
                this.spawnSpellOnBoard(spell);
            }
            var columnId = Templates_3.Templates.idOfSpellColumn(playerId, spell.element);
            var spellId = Templates_3.Templates.idOfSpell(spell);
            this.deselectSpell(spell.number);
            (0, animations_1.moveElementOnAnimationSurface)(spellId, columnId, this.animationDurationInMs);
        };
        ElementumGameInterface.prototype.spellExistsOnBoard = function (spell) {
            return !!$(Templates_3.Templates.idOfSpell(spell));
        };
        ElementumGameInterface.prototype.spawnSpellOnBoard = function (spell) {
            var spellTemplate = Templates_3.Templates.spell(spell);
            return dojo.place(spellTemplate, "cards-spawn-point");
        };
        ElementumGameInterface.prototype.replaceHand = function (hand) {
            this.playerHand.replaceSpells(hand);
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
                this.spawnSpellOnBoard(spell);
            }
            var containerId = "spell-pool";
            var spellId = Templates_3.Templates.idOfSpell(spell);
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
        NoopState.prototype.spellClicked = function (spell) { };
        NoopState.prototype.spellOnSpellPoolClicked = function (spell) { };
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
        PickSpellState.prototype.spellClicked = function (spell) {
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
define("bgagame/elementum", ["require", "exports", "ebg/core/gamegui", "cookbook/common", "src/client/gui/ElementumGameInterface", "src/client/states/NoopState", "src/client/states/PickSpellState", "src/client/states/SpellDestinationChoiceState", "src/client/common/Templates", "src/client/Notifications", "src/client/states/PlayersDraftState", "ebg/counter"], function (require, exports, Gamegui, CommonMixer, ElementumGameInterface_1, NoopState_4, PickSpellState_1, SpellDestinationChoiceState_1, Templates_4, Notifications_1, PlayersDraftState_1) {
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
                _this.getCurrentState().spellClicked(spell);
            });
            this.gui.whenSpellPoolClicked(function (spell) {
                _this.getCurrentState().spellOnSpellPoolClicked(spell);
            });
            this.createStates();
        };
        Elementum.prototype.getCurrentStateName = function () {
            return (this.gamedatas.gamestate.private_state.name ||
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
                noop: new NoopState_4.NoopState(),
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
            dojo.place(Templates_4.Templates.textBeforeCancelButton(text), "cancel", "before");
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
                console.log("Spell played on board notification", notification);
                var playerId = notification.args.player_id;
                var spell = notification.args.spell;
                _this.gui.putSpellOnBoard(playerId, spell);
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
