/*
DeckOfIllusions
Automates the Deck of Illusions wondrous item for D&D 5e games on Roll20

On Github:	https://github.com/blawson69
Contact me: https://app.roll20.net/users/1781274/ben-l

Like this script? Become a patron:
    https://www.patreon.com/benscripts
*/

var DeckOfIllusions = DeckOfIllusions || (function () {
    'use strict';

    //---- INFO ----//

    var version = '1.1',
        debugMode = true,
        styles = {
            box:  'background-color: #fff; border: 1px solid #000; padding: 8px 10px; border-radius: 6px; margin-left: -40px; margin-right: 0px;',
            title: 'padding: 0 0 10px 0; color: ##591209; font-size: 1.5em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            button: 'background-color: #000; border-width: 0px; border-radius: 5px; padding: 5px 8px; color: #fff; text-align: center;',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #591209; text-decoration: underline;',
            buttonWrapper: 'text-align: center; margin: 10px 0; clear: both;',
            cardName: 'padding: 12px 0; color: ##591209; font-size: 2em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            code: 'font-family: "Courier New", Courier, monospace;',
            icon: 'width: 48px; height: 48px; white-space: nowrap; margin-right: 10px; text-align: center;',
            accent: 'padding: 6px 12px; color: #c00; font-size: 1em; border: 1px solid #c00;'
        },
        defaultCards = [
            {name: "Ace of Hearts", illusion: "A Red Dragon", tokens: ["Red Dragon"]},
            {name: "King of Hearts", illusion: "A Knight and Four Guards", tokens: ["Knght", "Guard", "Guard", "Guard", "Guard"]},
            {name: "Queen of Hearts", illusion: "A Succubus or an Incubus", tokens: ["Succubus", "Incubus"]},
            {name: "Jack of Hearts", illusion: "A Druid", tokens: ["Druid"]},
            {name: "Ten of Hearts", illusion: "A Cloud Giant", tokens: ["Cloud Giant"]},
            {name: "Nine of Hearts", illusion: "An Ettin", tokens: ["Ettin"]},
            {name: "Eight of Hearts", illusion: "A Bugbear", tokens: ["Bugbear"]},
            {name: "Two of Hearts", illusion: "A Goblin", tokens: ["Goblin"]},
            {name: "Ace of Diamonds", illusion: "A Beholder", tokens: ["Beholder"]},
            {name: "King of Diamonds", illusion: "An Archmage and Mage Apprentice", tokens: ["Archmage", "Mage Apprentice"]},
            {name: "Queen of Diamonds", illusion: "A Night Hag", tokens: ["Night Hag"]},
            {name: "Jack of Diamonds", illusion: "An Assassin", tokens: ["Assassin"]},
            {name: "Ten of Diamonds", illusion: "A Fire Giant", tokens: ["Fire Giant"]},
            {name: "Nine of Diamonds", illusion: "An Ogre Mage", tokens: ["Ogre Mage"]},
            {name: "Eight of Diamonds", illusion: "A Gnoll", tokens: ["Gnoll"]},
            {name: "Two of Diamonds", illusion: "A Kobold", tokens: ["Kobold"]},
            {name: "Ace of Spades", illusion: "A Lich", tokens: ["Lich"]},
            {name: "King of Spades", illusion: "A Priest and Two Acolytes", tokens: ["Priest", "Acolyte", "Acolyte"]},
            {name: "Queen of Spades", illusion: "A Medusa", tokens: ["Medusa"]},
            {name: "Jack of Spades", illusion: "A Veteran", tokens: ["Veteran"]},
            {name: "Ten of Spades", illusion: "A Frost Giant", tokens: ["Frost Giant"]},
            {name: "Nine of Spades", illusion: "A Troll", tokens: ["Troll"]},
            {name: "Eight of Spades", illusion: "A Hobgoblin", tokens: ["Hobgoblin"]},
            {name: "Two of Spades", illusion: "A Goblin", tokens: ["Goblin"]},
            {name: "Ace of Clubs", illusion: "An Iron Golem", tokens: ["Iron Golem"]},
            {name: "King of Clubs", illusion: "A Bandit Captain and Three Bandits", tokens: ["Bandit Captain", "Bandit", "Bandit", "Bandit"]},
            {name: "Queen of Clubs", illusion: "An Erinyes", tokens: ["Erinyes"]},
            {name: "Jack of Clubs", illusion: "A Berserker", tokens: ["Berserker"]},
            {name: "Ten of Clubs", illusion: "A Hill Giant", tokens: ["Hill Giant"]},
            {name: "Nine of Clubs", illusion: "An Ogre", tokens: ["Ogre"]},
            {name: "Eight of Clubs", illusion: "An Orc", tokens: ["Orc"]},
            {name: "Two of Clubs", illusion: "A Kobold", tokens: ["Kobold"]},
            {name: "Joker 1", illusion: "The Deck's Owner", tokens: ["Deck's Owner"]},
            {name: "Joker 2", illusion: "The Deck's Owner", tokens: ["Deck's Owner"]}
        ],
        deck_description = "<p>An illusory creature appears real, of the appropriate size, and behaves as if it were a real creature (as presented in the Monster Manual), except that it can do no harm. While you are within 120 feet of the illusory creature and can see it, you can use an action to move it magically anywhere within 30 feet of its card. Any physical interaction with the illusory creature reveals it to be an Illusion, because Objects pass through it. Someone who uses an action to visually inspect the creature identifies it as illusory with a successful DC 15 Intelligence (Investigation) check. The creature then appears translucent.</p><p>The Illusion lasts until its card is moved or the Illusion is dispelled. When the Illusion ends, the image on its card disappears, and that card can't be used again.",

    checkInstall = function () {
        if (!_.has(state, 'DeckOfIllusions')) state['DeckOfIllusions'] = state['DeckOfIllusions'] || {};
        if (typeof state['DeckOfIllusions'].cards == 'undefined') state['DeckOfIllusions'].cards = defaultCards;
        if (typeof state['DeckOfIllusions'].illusions == 'undefined') state['DeckOfIllusions'].illusions = [];
        if (typeof state['DeckOfIllusions'].showCard == 'undefined') state['DeckOfIllusions'].showCard = false;
        if (typeof state['DeckOfIllusions'].randomRotate == 'undefined') state['DeckOfIllusions'].randomRotate = true;
        if (typeof state['DeckOfIllusions'].cards[0] != 'undefined' && typeof state['DeckOfIllusions'].cards[0].tokens == 'undefined') upgradeCards();
        state['DeckOfIllusions'].cards = _.shuffle(state['DeckOfIllusions'].cards);
        log('--> DeckOfIllusions v' + version + ' <-- Initialized. There are ' + _.size(state['DeckOfIllusions'].cards) + ' cards remaining in the deck.');
        if (debugMode) {
			var d = new Date();
			showDialog('Debug Mode', 'Deck of Illusions v' + version + ' loaded at ' + d.toLocaleTimeString() + '<br><a style=\'' + styles.textButton + '\' href="!doi config">Show config</a>', 'GM');
		}
    },

    //----- INPUT HANDLER -----//

    handleInput = function (msg) {
        if (msg.type == 'api' && msg.content.startsWith('!doi')) {
			var parms = msg.content.split(/\s+/i);
			if (parms[1]) {
				switch (parms[1]) {
					case 'draw':
                        commandDraw(msg);
						break;
                    case 'info':
                        commandInfo(msg);
                        break;
                    case 'deck-character':
						if (playerIsGM(msg.playerid)) commandCreateDeckChar(msg);
						break;
                    case 'set-illusion':
						if (playerIsGM(msg.playerid)) commandSetIllusion(msg);
						break;
                    case 'illusions-list':
						if (playerIsGM(msg.playerid)) commandBeingsList(msg);
						break;
					case 'import':
						if (playerIsGM(msg.playerid)) commandImport(msg);
						break;
					case 'export':
						if (playerIsGM(msg.playerid)) commandExport(msg);
						break;
					case 'config':
						if (playerIsGM(msg.playerid)) commandConfig(msg);
						break;
                    default:
                        if (playerIsGM(msg.playerid)) commandConfig(msg);
                        else commandInfo(msg);
				}
			} else {
                if (playerIsGM(msg.playerid)) commandConfig(msg);
                else commandInfo(msg);
			}
		}
    },

    commandDraw = function (msg) {
        if (!msg.selected || !msg.selected.length) {
            showDialog('Deck of Illusions', 'No tokens are selected!', msg.who);
			return;
		}

        var token = getObj(msg.selected[0]._type, msg.selected[0]._id);
        if (token && token.get('represents') !== '') {
            var char = getObj('character', token.get('represents'));
            if (char && isDeckChar(token.get('represents'))) {
                var message = '';
                if (_.size(state['DeckOfIllusions'].cards) > 0) {
                    message += getAttrByName(char.get('id'), 'doi_owner', 'current') + ' draws a random card from the <b>Deck of Illusions</b>...<br><br>';
                    var tmpDeck = state['DeckOfIllusions'].cards;
                    var random_card = (_.size(state['DeckOfIllusions'].cards) == 1) ? tmpDeck[0] : tmpDeck[randomInteger(_.size(tmpDeck)-1)];
                    createIllusion(token, random_card, msg.playerid);
                    state['DeckOfIllusions'].cards = _.reject(tmpDeck, function (card) { return card.name == random_card.name; });

                    message += 'The ' + ( (state['DeckOfIllusions'].showCard) ? '<i>' + random_card.name + '</i>' : 'card' )
                    + ' lands on the ground. There appears the illusion of...<br>';
                    message += '<div style=\'text-align: center; ' + styles.cardName + '\'>' + random_card.illusion + '</div>';
                    showDialog('', message);
                } else {
                    message += getAttrByName(char.get('id'), 'doi_owner', 'current') + ', there are no more cards in your <b>Deck of Illusions!</b>';
                    showDialog('Oops!', message);
                }

            } else showDialog('Error', 'The selected token does not represent a Deck of Illusions character.', msg.who);
        } else showDialog('Error', 'The selected token does not represent a character.', msg.who);
    },

    commandInfo = function(msg) {
        var message = '<p>The <b>Deck of Illusions</b> is a set of up to 34 cards. When a card is drawn at random and thrown to the ground within 30 feet of you, an illusion of one or more creatures forms and remains until dispelled.</p>' + deck_description;
        showDialog('Deck of Illusions', message, msg.who);
    },

    commandConfig = function (msg, deck_msg = '') {
        var message = '', parms = msg.content.trim().split(/\s*\-\-/i);
        if (deck_msg != '') deck_msg = '<p style="' + styles.accent + '">' + deck_msg + '</p>';
        if (parms[1]) {
            if (parms[1] == 'reset-deck') {
                state['DeckOfIllusions'].cards = _.shuffle(defaultCards);
                deck_msg = '<p style="' + styles.accent + '">The Deck of Illusions has been reset.</p>';
            }
            if (parms[1] == 'found') {
                if (_.size(state['DeckOfIllusions'].cards) == 34) {
                    var missing = randomInteger(20)-1;
                    if (missing > 0) {
                        var tmpDeck = state['DeckOfIllusions'].cards;
                        for (var x = 0; x < missing; x++) {
                            var tmpCard = tmpDeck[randomInteger(_.size(tmpDeck)-1)];
                            var tmpDeck = _.reject(tmpDeck, function (card) { return card.name == tmpCard.name; });
                        }
                        state['DeckOfIllusions'].cards = tmpDeck;
                    }
                    deck_msg = '<p style="' + styles.accent + '">' + missing + ' cards have been removed from the Deck of Illusions.</p>';
                } else {
                    deck_msg = '<p style="' + styles.accent + '">There was already fewer than 34 cards in the Deck. <b>No cards</b> were removed.</p>';
                }
            }
            if (parms[1] == 'toggle-face') state['DeckOfIllusions'].showCard = !state['DeckOfIllusions'].showCard;
            if (parms[1] == 'toggle-name') state['DeckOfIllusions'].showTokenName = !state['DeckOfIllusions'].showTokenName;
            if (parms[1] == 'toggle-rotate') state['DeckOfIllusions'].randomRotate = !state['DeckOfIllusions'].randomRotate;
        }

        message += deck_msg + 'The Deck of Illusions currently contains <b>' + _.size(state['DeckOfIllusions'].cards) + '</b> cards.';
        message += '<div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!doi config --reset-deck" title="Reset the Deck to all 34 cards.">Reset Deck</a> &nbsp; <a style="';
        message += styles.button + '" href="!doi config --found" title="Randomly remove 1d20-1 cards from the full Deck if found">Found Deck</a></div>';

        message += '<hr style="margin: 4px 12px 8px;"><div style=\'' + styles.title + '\'>Deck Character</div>';
        if (!checkDeckCharExistence()) {
            message += 'A Deck Character is required for placing a randomly thrown card on the VTT. Place a token to represent the Deck on the map and <b>name it for the character who owns the Deck</b>. With the token selected, click the button below.<div style="' + styles.buttonWrapper;
            message += '"><a style="' + styles.button + '" href="!doi deck-character">Create Deck Character</a></div>';
        } else {
            message += 'A Deck Character has already been created. If you wish to re-create it, delete the current one and return to the config menu.';
        }

        message += '<hr style="margin: 4px 12px 8px;"><div style=\'' + styles.title + '\'>Options</div>';
        message += 'You are currently <b>' + (state['DeckOfIllusions'].showCard ? 'showing' : 'hiding') + '</b> the names of the cards as they are drawn. <a style="' + styles.textButton + '" href="!doi config --toggle-face">' + (state['DeckOfIllusions'].showCard ? 'Hide' : 'Show') + '</a><br><br>';
        message += 'You <b>' + (state['DeckOfIllusions'].randomRotate ? 'allow' : 'don\'t allow') + '</b> the tokens to be rotated randomly on generation. <a style="' + styles.textButton + '" href="!doi config --toggle-rotate">Turn ' + (state['DeckOfIllusions'].randomRotate ? 'Off' : 'On') + '</a>';

        message += '<hr style="margin: 4px 12px 8px;"><div style=\'' + styles.title + '\'>Illusion Tokens</div>';
        message += 'View and create Illusion Tokens for each illusory being that can be generated by the Deck.<div style="' + styles.buttonWrapper;
        message += '"><a style="' + styles.button + '" href="!doi illusions-list">View Illusions</a></div>';

        message += '<hr style="margin: 4px 12px 8px;"><div style=\'' + styles.title + '\'>Import/Export</div>';
        message += 'To bring your Illusion Tokens from this game into another, you may export them into a handout which can then be transferred to another game.<br><br>';
        message += 'To import effects into this game, make sure there exists a "DOI: Illusion Tokens" handout in the proper format.';
        message += '<div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!doi import">Import Illusions</a> &nbsp; <a style="' + styles.button + '" href="!doi export">Export Illusions</a></div>';

        message += '<p>See the <a style="' + styles.textButton + '" href="https://github.com/blawson69/DeckOfIllusions">documentation</a> for complete instructions.</p>';

        showDialog('Config Menu', message, 'GM');
    },

    // Create Deck Character from selected token
    commandCreateDeckChar = function (msg) {
        if (!msg.selected || _.size(msg.selected) != 1) {
			//showDialog('Deck Character Error', 'You must have one token selected!', 'GM');
            commandConfig(msg, 'You must have only one token selected!');
			return;
		}
        if (checkDeckCharExistence()) {
			//showDialog('Deck Character Error', 'You have already created a Deck Character!', 'GM');
            commandConfig(msg, 'You have already created a Deck Character!');
			return;
		}

        var token = getObj(msg.selected[0]._type, msg.selected[0]._id);
        if (token && token.get('represents') == '') {
            var char = createObj("character", {name: 'Deck of Illusions', avatar: token.get('imgsrc')});
            char.set({bio: '<h2>Introduction</h2><p>I am a <b>Deck of Illusions</b>, a set of up to 34 magical cards. When a card is drawn at random from the deck and thrown to the ground within 30 feet of you, an illusion of one or more creatures forms over the Thrown card and remains until dispelled.</p>' + deck_description + '<h2>How to Use</h2><p>Just drag me from the Journal to the map and place me where you wish to throw a random card. Make sure I\'m still selected and click the "Draw Card" token action button. You can use "Help" to have the description above whispered to you in chat.</p>'});

            var menu = createObj("ability", { name: 'Draw Card', characterid: char.get('id'), action: '!doi draw', istokenaction: true });
            var help = createObj("ability", { name: 'Help', characterid: char.get('id'), action: '!doi help', istokenaction: true });

            var owners = getControllersFromCharName(token.get('name'));
            if (_.size(owners) != 0 && !_.find(owners, function (x) { return x == 'all'; })) char.set({inplayerjournals: owners.join(), controlledby: owners.join()});
            var tag = createObj("attribute", {characterid: char.get('id'), name: 'doi_owner', current: token.get('name')});

            token.set({represents: char.get('id'), name: 'Deck of Illusions', showname: false, showplayers_name: false, showplayers_bar1: false, showplayers_bar2: false, showplayers_bar3: false, playersedit_bar1: false, playersedit_bar2: false, playersedit_bar3: false, light_otherplayers: false});
            setDefaultTokenForCharacter(char, token);

            //showDialog('Deck Character Created', 'A Deck character has been successfully created with the selected token.<div style="' + styles.buttonWrapper + '"><a style="' + styles.button + '" href="!doi config">&#9668; Back</a></div>', 'GM');
            commandConfig(msg, 'A Deck Character has been created with the selected token.');
        } else {
            //showDialog('Deck Character Error', 'Invalid token! Make sure your token does not already represent a character. Try again.', 'GM');
            commandConfig(msg, '<b>Invalid token!</b> Your token cannot already represent a character.');
        }
    },

    getControllersFromCharName = function (name) {
        var allChars = findObjs({type: 'character', archived: false}, {caseInsensitive: true});
        var char = _.find(allChars, function (x) { return x.get('name').toLowerCase().search(name.toLowerCase()) > -1; });
        if (char) {
            return char.get('controlledby').split(',');
        } else {
            return false;
        }
    },

    checkDeckCharExistence = function () {
        var allChars = findObjs({type: 'character', archived: false}, {caseInsensitive: true});
        var doi = _.find(allChars, function (char) {
            var char_id = char.get('id');
            var tag = findObjs({type: 'attribute', characterid: char_id, name: 'doi_owner'})[0];
            if (tag && char.get('name') == 'Deck of Illusions') return true;
            else return false;
        });
        if (doi) return true;
        else return false;
    },

    isDeckChar = function (char_id) {
        var char = getObj('character', char_id);
        if (char) {
            var tag = findObjs({type: 'attribute', characterid: char_id, name: 'doi_owner'})[0];
            if (tag && char.get('name') == 'Deck of Illusions') return true;
            else return false;
        } else return false;
    },

    // Add an illusion graphic to the collection for the specified being
    commandSetIllusion = function (msg) {
		if (!msg.selected || _.size(msg.selected) != 1) {
			showDialog('Illusion Error', 'The incorrect number of tokens are selected!', 'GM');
			return;
		}

        var name = msg.content.split('|');
        if (name[1]) name = name[1].trim();
        var legal_names = _.uniq(_.flatten(_.pluck(defaultCards, 'tokens')));
        if (!_.find(legal_names, function (x) { return x == name; })) {
            showDialog('Illusion Error', 'A valid name was not set on the selected token!', 'GM');
            return;
        }

        var token = getObj(msg.selected[0]._type, msg.selected[0]._id), illusion = {};
        if (token && isValidSrc(token.get('imgsrc'))) {
            illusion.name = name;
            illusion.imgsrc = token.get('imgsrc').replace(/\w+\.png/, 'thumb.png');
            illusion.width = token.get('width');
            illusion.height = token.get('height');
            illusion.flipv = (token.get('flipv') || token.get('flipv') == 'true');
            illusion.fliph = (token.get('fliph') || token.get('fliph') == 'true');
            state['DeckOfIllusions'].illusions = _.reject(state['DeckOfIllusions'].illusions, function (x) { return x.name == illusion.name; });
            state['DeckOfIllusions'].illusions.push(illusion);
            showDialog('Illusion Complete', 'Illusion token for "' + illusion.name + '" has been successfully created.', 'GM');
            commandBeingsList(msg);
        } else {
            showDialog('Illusion Error', 'Invalid token! You may only use graphics you have uploaded to your library. For more information, view the <a style="' + styles.textButton + '" href="https://github.com/blawson69/cardEffects">documentation</a>.', 'GM');
        }
	},

    // Generate list of illusory beings for setting tokens
    commandBeingsList = function (msg) {
        var beings = _.uniq(_.flatten(_.pluck(defaultCards, 'tokens')));
        var message = '<table style="border: 0; width: 100%;" cellpadding="0" cellspacing="2">';

        _.each(beings, function (being) {
            var illusion = _.find(state['DeckOfIllusions'].illusions, function (x) { return x.name == being; });
            var icon = (illusion) ? '<img src="' + illusion.imgsrc + '" style="width: 48px; height: 48px;">' : ' -- ';
            message += '<tr><td style="width: 58px;"><div style="' + styles.icon + '">' + icon + '</div></td>';
            message += '<td style="width: 100%;">' + being + '</td>';
            message += '<td style="text-align: center; white-space: nowrap; padding: 2px;"><a style="' + styles.button + '" href="!doi set-illusion name|' + being + '" title="Set selected token as ' + being + '">Set</a></td>';
            message += '</tr>';
        });

        message += '<tr><td colspan="3" style="text-align: center; padding: 2px;"><a style="' + styles.button + '" href="!doi config">&#9668; Back</a></td></tr>';
        message += '</table>';
        showDialog('Illusion Tokens', message, 'GM');
    },

    // Find Illusion Tokens according to the drawn card
    createIllusion = function (target, card, player_id) {
        if (target && card) {
            var tokens = card.tokens;

            // Accomodate the one card that is "or" not "and"
            if (card.name == 'Queen of Hearts') tokens = [card.tokens[randomInteger(2) - 1]];

            var base_illusion = _.find(state['DeckOfIllusions'].illusions, function (x) { return x.name == tokens[0]; });
            if (base_illusion && typeof base_illusion.imgsrc != 'undefined' && base_illusion.imgsrc != '') {
                var top = target.get('top');
                var left = target.get('left');
                var base_token = placeIllusionToken(base_illusion, top, left, player_id, true);
                if (base_token) {
                    // Reset center coordinates if offset was needed
                     top = base_token.get('top');
                     left = base_token.get('left');
                }

                // place any extra beings
                if (_.size(tokens) > 1) {
                    tokens.shift();
                    var page = getObj('page', Campaign().get("playerpageid"));
                    var unit = page.get('snapping_increment') * 70;
                    var count = 0, places = [{top: top, left: (left + unit)}, {top: (top + unit), left: left}, {top: top, left: (left - unit)}, {top: (top - unit), left: left}];
                    _.each(tokens, function (token) {
                        var xtra_illusion = _.find(state['DeckOfIllusions'].illusions, function (x) { return x.name == token; });
                        if (xtra_illusion && typeof xtra_illusion.imgsrc != 'undefined' && xtra_illusion.imgsrc != '')
                        placeIllusionToken(xtra_illusion, places[count].top, places[count].left, player_id);
                        count++;
                    });
                }
            }
        }
    },

    // Places the indicated Illusion Token on the map
    placeIllusionToken = function (being, top, left, player_id, offset = false) {
        var page = getObj('page', Campaign().get("playerpageid"));
        var cell_width = page.get('snapping_increment') * 70; //pixels per unit
        var page_width = page.get('width') * cell_width; // pixel width of page
        var page_height = page.get('height') * cell_width; // pixel height of page
        top = Math.round(top); left = Math.round(left);

        // base illusion needs to be offset from sides of map to accomodate possible extra beings
        if (offset) {
            if (top <= Math.ceil(cell_width / 2)) top += cell_width; // set 2 units down from top
            if (left <= Math.ceil(cell_width / 2)) left += cell_width; // set 2 units over from left
            if (top >= page_height - Math.floor(cell_width / 2)) top -= cell_width; // set 2 units up from bottom
            if (left >= page_width - Math.floor(cell_width / 2)) left -= cell_width; // set 2 units over from right
        }

        var illusion_token = createObj("graphic", {pageid: page.get('id'), layer: 'objects', name: being.name, imgsrc: being.imgsrc, width: being.width, height: being.height, top: top, left: left, flipv: being.flipv, fliph: being.fliph, controlledby: player_id, playersedit_name: false, showname: false, showplayers_name: false, playersedit_bar1: false, playersedit_bar2: false, playersedit_bar3: false, playersedit_aura1: false, playersedit_aura2: false});
        if (state['DeckOfIllusions'].randomRotate) illusion_token.set({rotation: (randomInteger(8) * 45)});
        toFront(illusion_token);

        return illusion_token;
    },

    upgradeCards = function () {
        var tmpDeck = [];
        _.each(state['DeckOfIllusions'].cards, function (card) {
            tmpDeck.push(_.find(defaultCards, function (x) { return x.name == card.name; }));
        });
        state['DeckOfIllusions'].cards = tmpDeck;
    },

    commandExport = function () {
        showDialog('Export in Progress', 'Your Illusion Tokens are being exported...', 'GM');
        var parsedData, doiNote = findObjs({name: 'DOI: Illusion Tokens', type: 'handout'})[0];
        if (!doiNote) doiNote = createObj("handout", {name: 'DOI: Illusion Tokens'});
        if (doiNote) {
            parsedData = '';
            _.each(state['DeckOfIllusions'].illusions, function (item) {
                parsedData += '<p>' + item.name + '|' + item.width + '|' + item.height + '|' + item.imgsrc + '|' + item.flipv + '|' + item.fliph + '</p>';
            });
            doiNote.set({ notes: parsedData });
            //showDialog('Export Successful', 'Your Illusion Tokens have been successfully exported.', 'GM');
            setTimeout(function () {
                commandConfig({content: ''}, 'Your Illusion Tokens have been successfully exported.');
            }, 1500);
        }
    },

    commandImport = function (msg) {
        showDialog('Import in Progress', 'Your Illusion Tokens are being imported...', 'GM');
        var errs = [], message = '', args = msg.content.split(/\s*\-\-/i);
        var count = 0, doiNote = findObjs({name: 'DOI: Illusion Tokens', type: 'handout'})[0];

        if (doiNote) {
            doiNote.get('notes', function (notes) {
                var illusions = processHandout(notes);
                _.each(illusions, function (item) {
                    var illusion = item.split('|');
                    if (_.size(illusion) == 6) {
                        state['DeckOfIllusions'].illusions = _.reject(state['DeckOfIllusions'].illusions, function (x) { return x.name == illusion[0]; });
                        var beings = _.uniq(_.flatten(_.pluck(defaultCards, 'tokens')));
                        if (_.find(beings, function (x) { return x == illusion[0]; })) {
                            if (illusion[0] != '' && isNum(illusion[1]) && isNum(illusion[2]) && isValidSrc(illusion[3])) {
                                var flipv = (illusion[4].toLowerCase().trim() == 'true' || illusion[4].toLowerCase().trim() == 'false') ? illusion[4].toLowerCase().trim() : 'false';
                                var fliph = (illusion[5].toLowerCase().trim() == 'true' || illusion[5].toLowerCase().trim() == 'false') ? illusion[5].toLowerCase().trim() : 'false';
                                state['DeckOfIllusions'].illusions.push({name: illusion[0].trim(), width: Number(illusion[1]), height: Number(illusion[2]), imgsrc: illusion[3].trim(), flipv: flipv, fliph: fliph});
                                count++;
                            } else {
                                if (!isValidSrc(illusion[3])) errs.push('One or more image URLs reference items outside of your Roll20 library.');
                                if (!isNum(illusion[1]) || !isNum(illusion[2])) errs.push('One or more Numeric items either are not numbers or blank.');
                            }
                        } else {
                            errs.push('One or more items is not named for one of the available illusory beings.');
                        }
                    } else {
                        errs.push('One or more items do not contain all of the required elements.');
                    }
                });

                message += (count == 0) ? 'No Illusion Tokens have been imported.' : count + ' Illusion Tokens have been imported.';
                errs = _.unique(errs);
                if (_.size(errs) > 0) {
                    message += '<br><br>The following errors were encountered:<ul><li>' + errs.join('</li><li>') + '</li></ul>';
                }

                //showDialog('Import Results', message, 'GM');
                setTimeout(function () {
                    commandConfig({content: ''}, message);
                }, 1500);
            });
        } else {
            //showDialog('Import Error', 'A handout named "DOI: Illusion Tokens" was not found. Nothing to import.', 'GM');
            setTimeout(function () {
                commandConfig({content: ''}, 'A handout named "DOI: Illusion Tokens" was not found. Nothing to import.');
            }, 1500);
        }
    },

    // Returns whether or not a given imgsrc is valid
    isValidSrc = function (url) {
        // Valid = https://s3.amazonaws.com/files.d20.io/images/90111752/GDBao8Z1IvYvrSSbtHEU1g/thumb.png?1566690793
        var ir = /^.*d20\.io\/images\/.*\/(thumb|med|original|max)\.png\?\d+$/;
        return ir.test(url);
    },

    // Returns whether or not a string is actually a Number
    isNum = function (txt) {
        var nr = /^\d+$/;
        return nr.test(txt);
    },

    processHandout = function (notes = '') {
        var retval = [], text = notes.trim();
        text = text.replace(/<p[^>]*>/gi, '<p>').replace(/\n(<p>)?/gi, '</p><p>').replace(/<br>/gi, '</p><p>');
        text = text.replace(/<\/?(span|div|pre|img|code|b|i|h1|h2|h3|h4|h5|ol|ul|pre)[^>]*>/gi, '');
        if (text != '' && /<p>.*?<\/p>/g.test(text)) retval = text.match(/<p>.*?<\/p>/g).map( l => l.replace(/^<p>(.*?)<\/p>$/,'$1'));
        return retval;
    },

    showDialog = function (title, content, whisperTo = '') {
        var gm = /\(GM\)/i;
        if (whisperTo.length > 0) whisperTo = '/w ' + (gm.test(whisperTo) ? 'GM' : '"' + whisperTo + '"') + ' ';
        title = (title == '') ? '' : '<div style=\'' + styles.title + '\'>' + title + '</div>';
        var body = '<div style=\'' + styles.box + '\'>' + title + '<div>' + content + '</div></div>';
        sendChat('Deck of Illusions', whisperTo + body, null, {noarchive:true});
    },

    //---- PUBLIC FUNCTIONS ----//

    registerEventHandlers = function () {
		on('chat:message', handleInput);
	};

    return {
		checkInstall: checkInstall,
		registerEventHandlers: registerEventHandlers
	};
}());

on("ready", function () {
    DeckOfIllusions.checkInstall();
    DeckOfIllusions.registerEventHandlers();
});
