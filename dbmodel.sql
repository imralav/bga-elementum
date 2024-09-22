-- ------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- Elementum implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here
-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.
CREATE TABLE IF NOT EXISTS `card` (
    `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_type` varchar(16) NOT NULL,
    `card_type_arg` int(11) NOT NULL,
    `card_location` varchar(16) NOT NULL,
    `card_location_arg` int(11) NOT NULL,
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
CREATE TABLE IF NOT EXISTS `elementSources` (
    `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_type` varchar(16) NOT NULL,
    `card_type_arg` int(11) NOT NULL,
    `card_location` varchar(16) NOT NULL,
    `card_location_arg` int(11) NOT NULL,
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
CREATE TABLE IF NOT EXISTS `crystals` (
    `owner` varchar(16) NOT NULL,
    `amount` int(2) NOT NULL,
    PRIMARY KEY (`owner`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
CREATE TABLE IF NOT EXISTS `playerBoards` (
    `player_id` int(10) unsigned NOT NULL,
    `elementSources` varchar(30) NOT NULL,
    -- `element1Stack` varchar(28),
    -- `element2Stack` varchar(28),
    -- `element3Stack` varchar(28),
    -- `element4Stack` varchar(28),
    -- brackets give 2 chars, 1 char for each card, 1 char for comma, max 13 cards in a stack = 28 chars in total
    -- then, elementSources is 20 chars + 8 quotation marks + 2 square brackets, so 30 chars
    -- then, 4 stacks, so 4 * 28 = 112 chars
    -- 30 + 112 = 142 chars
    -- then we also need to add open and closing brackets, so 144 chars total
    `board` JSON NOT NULL,
    PRIMARY KEY (`player_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
CREATE TABLE IF NOT EXISTS `pickedSpells` (
    `player_id` int(10) unsigned NOT NULL,
    `spell_number` varchar(16) NOT NULL,
    PRIMARY KEY (`player_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
CREATE TABLE IF NOT EXISTS `draftChoice` (
    `player_id` int(10) unsigned NOT NULL,
    `choice` ENUM('play', 'useSpellPool'),
    `spell_pool_card_number` varchar(16) null,
    PRIMARY KEY (`player_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;