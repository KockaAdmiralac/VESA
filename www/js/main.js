/* globals Phaser: true, require: true */
window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render }, true),
        fs = require('fs');
    function preload () {
        var images = fs.readdirSync('www/img', null);
        game.load.images(images.map(function(el){ return el.substring(0, el.lastIndexOf(".")); }), images.map(function(el) { return 'img/' + el; }));
    }
    function create () {
        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
    function update() {
        // TODO: Implement
    }
    function render() {
        // TODO: Implement
    }
};
