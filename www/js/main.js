/* globals Phaser: true, require: true */
window.onerror = function() { alert(JSON.stringify(arguments)); };

window.onload = function() {
    var game = new Phaser.Game(640, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render }, true),
        fs = require('fs'),
        bg, map, player, layer, keys, jumpTimer = 0, gameOver = false, gameOverSprite,
        coins, spikes;
    function temp(a) { alert(JSON.stringify(a)); }
    /*
     * =========================================================================
     * PRELOADING
     * =========================================================================
     */
    function preload () {
        preloadImages();
        game.load.tilemap('level-1', 'assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('guy', 'assets/sprites/guy.png', 13, 18);
        game.load.spritesheet('coin', 'assets/sprites/coin.png', 16, 16);
        game.load.spritesheet('spike', 'assets/sprites/spike.png', 12, 12);
    }
    function readAssetFolder(type) { return fs.readdirSync('www/assets/' + type); }
    function getAssetName(name, type) { return (typeof type === "string" ? type : "image") + "-" + name.substring(0, name.lastIndexOf(".")); }
    function getAssetFileName(name, type) { return 'assets/' + (typeof type === "string" ? type : "img") + "/" + name; }
    function preloadImages() {
        var images = readAssetFolder('img');
        game.load.images(images.map(getAssetName), images.map(getAssetFileName));
    }
    /*
     * =========================================================================
     * CREATING
     * =========================================================================
     */
    function create () {
        // Setting physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Creating background
        bg = game.add.tileSprite(0, 0, 800, 600, 'image-background');
        bg.fixedToCamera = true;
        // Creating map
        map = game.add.tilemap('level-1');
        map.addTilesetImage('tileset1', 'image-tileset1');
        // Creating map layer
        layer = map.createLayer('level');
        layer.resizeWorld();
        map.setCollision([ 123, 100, 101, 106 ]);
        // Setting gravity
        game.physics.arcade.gravity.y = 500;
        // Creating player
        player = game.add.sprite(13, 18, 'guy');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.animations.add('run', [0, 1, 2, 3], 10, true);
        player.body.position.y = 13;
        // Making camera follow the player
        game.camera.follow(player);
        // Creating input
        keys = game.input.keyboard.createCursorKeys();
        // Creating game over sprite
        gameOverSprite = game.add.sprite(411, 92, 'image-gameover');
        gameOverSprite.alpha = 0;
        // Creating coins
        coins = game.add.group();
        coins.enableBody = true;
        map.createFromObjects('coins', 162, 'coin', 0, true, false, coins);
        coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
        coins.forEach(function(c){ c.body.allowGravity = false; });
        // Creating spikes
        spikes = game.add.group();
        spikes.enableBody = true;
        map.createFromObjects('spikes', 192, 'spike', 0, true, false, spikes);
        spikes.forEach(function(s){ s.body.allowGravity = false; });
    }
    function update() {
        if(gameOver) return;
        coins.callAll('animations.play', 'animations', 'spin');
        player.body.velocity.x = 100;
        game.physics.arcade.collide(player, layer, checkEnd);
        game.physics.arcade.overlap(player, coins, collectCoin, null, this);
        game.physics.arcade.overlap(player, spikes, endGame, null, this);
        player.animations.play('run');
        if(keys.up.isDown && player.body.onFloor() && game.time.now >= jumpTimer) {
            player.body.velocity.y = -200;
            jumpTimer = game.time.now + 100;
        }
    }
    function checkEnd() { if(player.body.velocity.x === 0) endGame(); }
    function collectCoin(tomato, coin) { coin.kill(); }
    function endGame() {
        gameOver = true;
        player.body.velocity.x = 0;
        gameOverSprite.position.x = game.camera.x + 100;
        gameOverSprite.position.y = 100;
        game.add.tween(gameOverSprite).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
    function render() {
        // TODO: Implement
    }
};
