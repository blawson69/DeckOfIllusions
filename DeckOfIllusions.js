/*
DeckOfIllusions
Automates the Deck of Illusions wondrous item for D&D 5e games on Roll20

On Github:	https://github.com/blawson69
Contact me: https://app.roll20.net/users/1781274/ben-l
Like this script? Buy me a coffee: https://venmo.com/theBenLawson
*/

var DeckOfIllusions = DeckOfIllusions || (function () {
    'use strict';

    //---- INFO ----//

    var version = '0.1',
        debugMode = false,
        styles = {
            box:  'background-color: #fff; border: 1px solid #000; padding: 8px 10px; border-radius: 6px; margin-left: -40px; margin-right: 0px;',
            title: 'padding: 0 0 10px 0; color: ##591209; font-size: 1.5em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            button: 'background-color: #000; border-width: 0px; border-radius: 5px; padding: 5px 8px; color: #fff; text-align: center;',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #591209; text-decoration: underline;',
            cardName: 'padding: 12px 0; color: ##591209; font-size: 2em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            fullWidth: 'width: 100%; display: block; padding: 12px 0; text-align: center;',
            code: 'font-family: "Courier New", Courier, monospace;',
            accent: 'background-color: ##eaeaea;'
        },
        defaultCards = [
            {name: "Ace of Hearts", illusion: "A Red Dragon"},
            {name: "King of Hearts", illusion: "A Knight and Four Guards"},
            {name: "Queen of Hearts", illusion: "An Succubus or A Incubus"},
            {name: "Jack of Hearts", illusion: "A Druid"},
            {name: "Ten of Hearts", illusion: "A Cloud Giant"},
            {name: "Nine of Hearts", illusion: "An Ettin"},
            {name: "Eight of Hearts", illusion: "A Bugbear"},
            {name: "Two of Hearts", illusion: "A Goblin"},
            {name: "Ace of Diamonds", illusion: "A Beholder"},
            {name: "King of Diamonds", illusion: "An Archmage and Mage Apprentice"},
            {name: "Queen of Diamonds", illusion: "A Night Hag"},
            {name: "Jack of Diamonds", illusion: "An Assassin"},
            {name: "Ten of Diamonds", illusion: "A Fire Giant"},
            {name: "Nine of Diamonds", illusion: "An Ogre Mage"},
            {name: "Eight of Diamonds", illusion: "A Gnoll"},
            {name: "Two of Diamonds", illusion: "A Kobold"},
            {name: "Ace of Spades", illusion: "A Lich"},
            {name: "King of Spades", illusion: "A Priest and Two Acolytes"},
            {name: "Queen of Spades", illusion: "A Medusa"},
            {name: "Jack of Spades", illusion: "A Veteran"},
            {name: "Ten of Spades", illusion: "A Frost Giant"},
            {name: "Nine of Spades", illusion: "A Troll"},
            {name: "Eight of Spades", illusion: "A Hobgoblin"},
            {name: "Two of Spades", illusion: "A Goblin"},
            {name: "Ace of Clubs", illusion: "An Iron Golem"},
            {name: "King of Clubs", illusion: "A Bandit Captain and Three Bandits"},
            {name: "Queen of Clubs", illusion: "An Erinyes"},
            {name: "Jack of Clubs", illusion: "A Berserker"},
            {name: "Ten of Clubs", illusion: "A Hill Giant"},
            {name: "Nine of Clubs", illusion: "An Ogre"},
            {name: "Eight of Clubs", illusion: "An Orc"},
            {name: "Two of Clubs", illusion: "A Kobold"},
            {name: "Joker 1", illusion: "The Deck's Owner"},
            {name: "Joker 2", illusion: "The Deck's Owner"}
        ],

    checkInstall = function () {
        if (!_.has(state, 'DeckOfIllusions')) state['DeckOfIllusions'] = state['DeckOfIllusions'] || {};
        if (typeof state['DeckOfIllusions'].cards == 'undefined') state['DeckOfIllusions'].cards = defaultCards;
        if (typeof state['DeckOfIllusions'].showCard == 'undefined') state['DeckOfIllusions'].showCard = false;
        log('--> DeckOfIllusions v' + version + ' <-- Initialized. There are ' + _.size(state['DeckOfIllusions'].cards) + ' cards remaining in the deck.');
		if (debugMode) showDialog('', 'Deck of Illusions loaded', 'GM');
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
					case 'reset':
						if (playerIsGM(msg.playerid)) commandReset(msg);
						break;
                    case 'found':
						if (playerIsGM(msg.playerid)) commandFound(msg);
						break;
                    case 'card':
						if (playerIsGM(msg.playerid)) toggleCardShow(msg);
						break;
                    case 'info':
						commandInfo(msg);
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
            var character = getObj('character', token.get('represents'));
            if (character) {
                var message = '';
                if (_.size(state['DeckOfIllusions'].cards) > 0) {
                    message += character.get('name') + ' draws a random card from the <b>Deck of Illusions</b>...<br><br>';
                    var tmpDeck = state['DeckOfIllusions'].cards;
                    var tmpCard = (_.size(state['DeckOfIllusions'].cards) == 1) ? tmpDeck[0] : tmpDeck[randomInteger(_.size(tmpDeck)-1)];

                    message += 'The ' + ( (state['DeckOfIllusions'].showCard) ? '<i>' + tmpCard.name + '</i>' : 'card' )
                    + ' lands on the ground. There appears the illusion of...<br>';
                    message += '<div style=\'text-align: center; ' + styles.cardName + '\'>' + tmpCard.illusion + '</div>';

                    var tmpDeck = _.reject(tmpDeck, function(card){ return card.name == tmpCard.name; });
                    state['DeckOfIllusions'].cards = tmpDeck;
                    log('Size of Deck of Illusions after use: ' + _.size(state['DeckOfIllusions'].cards));

                    showDialog('', message);
                } else {
                    message += character.get('name') + ', there are no more cards in your <b>Deck of Illusions!</b>';
                    showDialog('Oops!', message);
                }

            } else showDialog('Error', 'Could not find the character represented by the selected token.', msg.who);
        } else showDialog('Error', 'The selected token does not represent a character.', msg.who);
    },

    commandInfo = function(msg) {
        var button = '<div style="' + styles.fullWidth + '"><a style="' + styles.button + '" href="!doi draw">Draw Random Card</a></div>';
        var message = 'The <b>Deck of Illusions</b> is a set of up to 34 cards. When a card is drawn at random and thrown to the ground within 30 feet of you, an illusion of one or more creatures forms and remains until dispelled. The illusory creature(s) look and act real but can do no harm.<br><br>For more detailed information see the <a style="' + styles.textButton + '" href="https://roll20.net/compendium/dnd5e/Deck%20of%20Illusions">compendium entry</a>.' + button;
        showDialog('Deck of Illusions', message, msg.who);
    },

    commandConfig = function (msg) {
        var message = 'The <a style="font-weight: bold;' + styles.textButton
        + '" href="https://roll20.net/compendium/dnd5e/Deck%20of%20Illusions">Deck of Illusions</a> currently contains <b>'
        + _.size(state['DeckOfIllusions'].cards) + '</b> cards.<br><br>'
        + '<table><tr><td style="vertical-align: top;"><a style="' + styles.button + '" href="!doi reset"><span style=\'' + styles.code
        + '\'>!doi reset</span></a></td><td>&nbsp;</td><td>Resets the Deck to all 34 cards. <i>This cannot be undone.</i></td></tr>'

        + '<tr><td style="vertical-align: top;' + styles.accent + '"><a style="' + styles.button + '" href="!doi found"><span style=\'' + styles.code
        + '\'>!doi&nbsp;found</span></a></td><td style="' + styles.accent + '">&nbsp;</td><td style="' + styles.accent
        + '">Randomly removes 1d20-1 cards from the full deck for discovery amongst treasure.</td></tr>'

        + '<tr><td style="vertical-align: top;"><a style="' + styles.button + '" href="!doi card"><span style=\'' + styles.code
        + '\'>!doi&nbsp;card</span></a></td><td>&nbsp;</td><td>Toggles the display of the card faces. They are currently set to '
        + (state['DeckOfIllusions'].showCard ? 'be shown' : 'be hidden') + '.</td></tr>'

        + '<tr><td style="vertical-align: top;' + styles.accent + '"><a style="' + styles.button + '" href="!doi info"><span style=\'' + styles.code
        + '\'>!doi&nbsp;info</span></a></td><td style="' + styles.accent + '">&nbsp;</td><td style="' + styles.accent
        + '">Shows a brief description of the Deck with a button to call the &quot;draw&quot; command (below).</td></tr>'

        + '<tr><td style="vertical-align: top;"><a style="' + styles.button + '" href="!doi draw"><span style=\'' + styles.code
        + '\'>!doi&nbsp;draw</span></a></td><td>&nbsp;</td><td>Draws a card at random, displays the result, and removes the card from the deck.</td></tr>'

        + '<tr><td style="vertical-align: top;' + styles.accent + '"><a style="' + styles.button + '" href="!doi config"><span style=\'' + styles.code
        + '\'>!doi&nbsp;config</span></a></td><td style="' + styles.accent + '">&nbsp;</td><td style="' + styles.accent
        + '">Shows this menu in chat. GM only.</td></tr></table>';
        showDialog('Config Menu', message, 'GM');
    },

    commandReset = function () {
        state['DeckOfIllusions'].cards = defaultCards;
        var button = '<div style="' + styles.fullWidth + '"><a style="' + styles.button + '" href="!doi config">&#9668; Back to Config</a></div>';
        var message = 'The Deck of Illusions has been reset. All 34 cards have been restored.' + button;
        log('Deck of Illusions reset to 34 cards.')
        showDialog('Reset Deck', message, 'GM');
    },

    commandFound = function (msg) {
        var message;
        var button = '<div style="' + styles.fullWidth + '"><a style="' + styles.button + '" href="!doi config">&#9668; Back to Config</a></div>';
        if (_.size(state['DeckOfIllusions'].cards) == 34) {
            var missing = randomInteger(20)-1;
            if (missing > 0) {
                var tmpDeck = state['DeckOfIllusions'].cards;
                for (var x = 0; x < missing; x++) {
                    var tmpCard = tmpDeck[randomInteger(_.size(tmpDeck)-1)];
                    var tmpDeck = _.reject(tmpDeck, function(card){ return card.name == tmpCard.name; });
                }
                state['DeckOfIllusions'].cards = tmpDeck;
            }
            log(missing + ' cards removed from Deck of Illusions. Deck now contains ' + _.size(state['DeckOfIllusions'].cards) + ' cards.');
            message = missing + ' random cards were removed from the Deck of Illusions, suitable for discovery amongst treasure.';
        } else {
            message = 'There was already less than the full Deck of Illusions. <b>No cards</b> were removed.';
        }
        showDialog('Create Treasure Deck', message+button, 'GM');
    },

    toggleCardShow = function () {
        state['DeckOfIllusions'].showCard = !state['DeckOfIllusions'].showCard;
        var button = '<div style="' + styles.fullWidth + '"><a style="' + styles.button + '" href="!doi config">&#9668; Back to Config</a></div>';
        var message = 'DeckOfIllusions will now ' + (state['DeckOfIllusions'].showCard ? 'show' : 'hide') + ' the card face when a card is drawn.';
        showDialog('Show Card Face', message+button, 'GM');
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
