# DeckOfIllusions

This [Roll20](http://roll20.net/) script automates use of the Deck of Illusions wondrous item for D&D 5e games. By default it contains all 34 cards, but the deck can be configured to have randomly lost 1d20-1 cards (per the SRD rules) if the deck has been found amongst treasure. Each time a card is drawn and used, that card is removed from the deck. The deck may then be reset and used (found) again if desired.

## Deal

Typing `!doi deal` in the chat will randomly choose a card from the deck and display the name of the creature(s) for which an illusion is created. Due to the limitations of the API, this does not place any tokens on the VTT nor show an image in the chat, it merely tells the name of the creature(s). The GM will need to select tokens to represent the creature(s) conjured.

This card will then be removed from the current deck and cannot be redrawn until the deck is reset.

## Item Description

Sending `!doi info` in chat will display a short description of the Deck of Illusions with a link to the compendium entry.

## Card Faces

The SRD description of the Deck of Illusions suggests card equivalences with a standard deck of playing cards. These playing card faces may be displayed along with the corresponding creature(s) if desired but are not by default. To tell the script to display the card faces, send `!doi card` to toggle the display on and off. **GM only.**

## Found in Treasure

The SRD description of the Deck of Illusions says that 1d20-1 cards will be missing from Decks of Illusion found amongst a treasure horde. To accommodate this, send `!doi found` in chat to randomly remove 1d20-1 cards from the deck. Don't worry, this will only work with a full deck. **GM only.**

## Deck Resets

The Deck of Illusions can be reset back to the original 34 cards in case a different deck is found. Two decks cannot be used at once, however. **GM only.**

## Configuration

Send `!doi config` to chat to get a menu that tells how many cards remain in the Deck and provides buttons to perform the config functions above. **GM only.**
