Acquire
=======


The project
-----------

We will be implementing the board game [Acquire][] using native Web
technologies like WebSockets and Web Components.

  [Acquire]: https://en.wikipedia.org/wiki/Acquire

Specifically, we will implement a server in Node.js and clients in HTML5 and
JavaScript, which will communicate over WebSockets. The game will be played
with a board displayed on one device and each player’s hand on their own device
(for example, the board can be on an iPad and each player can have an Android
phone which will display their inventory and hand).

This is a project for our Fundamentals of Networking class.


The rules
---------

(from the [Acquire][] page on Wikipedia, licensed under [CC BY-SA 3.0][cc])

  [cc]: https://creativecommons.org/licenses/by-sa/3.0/

### Setup

At the beginning of the game, each player receives $6000 in cash. Each player
draws a tile and places it on the board. The player whose tile is in the
topmost row (closest to row A) goes first. If more than one player selects a
tile in that row, then the player whose tile is in the leftmost column (closest
to 1) goes first. All players place these tiles on the board. Then, starting
with the first player, each player draws six tiles.

### Play of the game

A turn consists of three steps:

1.  placing a tile
2.  buying stock
3.  drawing a replacement tile

Tile placement falls in one of four categories. The tile placed could be an
orphan, adjacent to no other tile on the board. The tile could create a new
chain of tiles, and the player who placed it on the board would have the
opportunity to found a new chain. The tile could increase the length of an
existing chain already on the board. Or the tile could link two chains,
causing a merger of two or more chains. Since there are only seven hotel
chains in the game, placing a tile that would create an eighth chain is
not permitted.

When a player founds a chain, he receives one free share of stock in that
chain. If, however, there are no shares left when the chain is founded,
then the founding player does not receive the free share.

Chains are deemed “safe” if they have 11 or more links; placing a tile
that would cause such a chain to be acquired by a larger chain is also
not permitted.

After a player places a tile, and the results of that placement have been
handled, he may purchase up to three shares of stock. A player may only
purchase shares of stock in chains that have already been founded. The price
of a share depends on the size of the chain, according to a chart that lists
prices according to size. A player may purchase shares in one, two, or three
existing chains (assuming at least three chains are currently in play), in any
combination up to a total of three shares.

Finally, the player replaces the tile he played, ensuring that he has six tiles
at the end of his turn.

### Growing and merging chains

A chain is a conglomeration of tiles that are linked to each other orthogonally
but not diagonally. For example, adjacent to square 5F are squares 4F, 6F, 5E,
and 5G, but not 6E or 4G. If there is a tile in 5F, then placing either tile
4F or 5G would result in founding a new hotel chain. A chain grows when a
player increases the length of a chain. Suppose a chain consists of squares
8D, 8E, and 8F. Playing tile 9F would add to the length of the chain. Playing
tile 9C would not.

Chains merge when a player places the tile that eliminates the empty space
between them. Suppose there is a chain at 1A, 2A, 3A, and 4A, along with
another chain at 6A and 7A. Placing tile 5A would cause these two chains to
merge. When a merger occurs, the larger hotel chain always acquires the smaller
hotel chain. That is, the hotel chain with more tiles will continue to exist
and now grows to include the smaller hotel chain (after bonuses have been
calculated according to the steps outlined below). If a tile is placed between
two hotel chains of the same size, the individual player who places the tile
decides which hotel chain remains on the board and which is acquired. In this
situation, there are a number of strategic reasons why an individual player
might select one hotel chain over another to be the one that remains on the
board. However, often it is most advantageous for the player selecting to
choose to let the more expensive chains remain on the board (and trade in
their stock of the less expensive chain at the 2-to-1 ratio described below).

### Mergers

The merger is the mechanism by which the players compete. Mergers yield bonuses
for the two shareholders who hold, respectively, the largest and second-largest
interests in a chain. Mergers also give each player who holds any interest at
all in a chain a chance to sell his stock or to trade it in for shares of the
acquiring chain. A merger takes place in three steps:

1.  **Bonuses for majority and minority shareholders.** Each player counts his
    or her stock in the acquired chain. The player with the largest number of
    shares is the “majority” shareholder, and the player with the
    second-largest number of shares is the “minority” shareholder. If two
    players tie for majority, they will share both shareholder bonuses. If two
    players tie for minority, they will share the minority shareholder bonus.

    Suppose Festival is the chain being acquired. Alex owns 10 shares, Betty
    owns 8, and Carla owns 6. Alex is the majority shareholder, and Betty is
    the minority shareholder.

    Suppose now that Worldwide is the chain being acquired. Alex owns 8 shares,
    Betty owns 8 shares, and Carla owns 7. Alex and Betty would share the
    majority and minority bonuses, and Carla would get no bonus. If instead
    Betty and Carla both owned 7 shares, then Alex would keep the majority
    bonus for herself, while Betty and Carla would split the minority bonus.

2.  **Sell, trade, or hold shares.** Starting with the player who caused the
    merger to happen, each player may either sell his shares in the acquired
    chain, trade in two shares of the acquired chain for one share of the
    acquiring chain, or hold on to his shares of the acquired chain. Shares
    are sold at the same price as the current cost of one share of stock in
    the acquired chain. A player may trade in as many shares as he owns, but
    may not trade in one share of the acquired chain for half a share of the
    acquiring chain. If a player holds onto his stock, he runs the risk that
    the acquired chain may not reemerge before the game ends. If that happens,
    then he will be holding worthless stock at the end of the game.

3.  **Defunct chain.** The acquired chain then becomes defunct. It is eligible
    to be founded again if another player founds a chain again in a later turn.

If placing a tile causes three or four chains to merge, then the merger steps
are handled between the largest and second-largest chain, then with the
third-largest chain, and finally with the smallest chain.

### Rules issues

The rules allow any player to count the number of shares available in the bank.
However, the rules do not specify whether a player should hold his shares of
stock face up or face down. That is, the rules do not say whether one player
may ask another how many shares of stock he or she owns in a particular chain.
Whether this is public or private information should be agreed upon between
players before the game begins.

The current rules do not provide for a two-player game. However, the stock
market was used as a “third shareholder” in previous versions of the game.
By this rule, a tile is drawn whenever a merger is declared. The number on
the tile indicates how many shares the stock market owns in the company that
is being acquired. The players must compete with the market as well as with
each other in order to receive bonuses.

### Ending the game

Any player may declare the game over at any time during his turn if either of
two conditions is true: one chain has 41 or more tiles, or there is at least
one chain on the board and every chain on the board has 11 or more tiles. Upon
declaring the game over, the player is allowed to complete his turn (including
buying stock). Ending the game is optional - if he believes it is to his
advantage not to end the game, he may refrain from doing so. Once the game
ends, the minority and majority bonuses are paid to the minority and majority
holders in each of the remaining chains; each player sells his or her shares of
stock in each of the remaining chains; and the player with the most money wins.
Because ending the game is optional, and a player may not realize that he can
end it, it is unethical to say “good game”, or in any other way indicate that
the game could be ended, until after a player actually has ended the game.

### Corner cases

These conditions can be used to handle unusual situations.

1.  **Replacing permanently unplayable tiles** – Per 1999 rules, players
    can replace permanently unplayable tile (tiles that would merge safe
    corporations) at the end of their turn. You may continue to replace
    unplayable tiles (including new unplayable tiles that you draw) until
    you have six playable tiles or the tile stock is empty.

2.  **No playable tiles** – Per 2008 rules, a player that has no legal plays
    because all 6 tiles in his or her hand are unplayable may reveal his or her
    hand, set aside his or her unplayable tiles, and draw six new tiles at the
    beginning of his or her turn. Tiles set aside are discarded from the game.

3.  **Bank doesn’t have enough shares to allow everyone to trade in their
    shares** – first choice falls to person causing the merger, followed by
    other players in order around the table in the order of play.
