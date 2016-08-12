/* globals Phaser: true */
window.onerror = function() { alert(JSON.stringify(arguments)); };

function temp(a) { alert(JSON.stringify(a)); }

var game,                   // Main game object
    fs = require('fs'),     // Filesystem reader
    bg,                     // Level backgound
    map,                    // Level map
    player,                 // Player sprite
    layer,                  // Main map layer
    button,                 // Main game button (SPACEBAR)
    jumpTimer = 0,          // Timer for jumping
    gameOver = false,       // If game is over
    gameOverSprite,         // Sprite that shows up on game over screen
    coins,                  // Coins group
    spikes,                 // Spikes group
    score = 0,              // Current score
    levels,                 // Number of levels
    levelEnd,               // X coordinate of the level ending
    currentLevel;           // Current level index

window.onload = function() {
    game = new Phaser.Game(640, 480, Phaser.AUTO, 'VESA', {
        preload: preload,
        create: create,
        update: update,
        render: render
    }, true);
};
