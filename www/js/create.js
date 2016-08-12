/* globals Phaser: true */
var collision = [
    [ 123, 100, 101, 106 ],
    [ 674, 675, 676, 677, 678, 679, 170, 171, 172, 173, 174, 175, 422, 423, 424, 425, 426, 427, 688, 689, 690, 691, 692, 693 ]
],
    coinsID = [ 162, 918 ];
function create () {
    createPhysics();
    button = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    createLevel(1);
}
function createPhysics() {
    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Set gravity
    game.physics.arcade.gravity.y = 500;
}
function createLevel(id) {
    currentLevel = id;
    createBackground(id);
    createMap(id);
    createPlayer();
    createGameOver();
    createCoins();
    createSpikes();
    createPortal();
}
function createBackground(id) {
    bg = game.add.tileSprite(0, 0, 640, 480, 'image-background' + id);
    bg.fixedToCamera = true;
}
function createMap(id) {
    // Adding tilemap
    map = game.add.tilemap('level-' + id);
    for(var i = 0; i < levels; ++i)
        map.addTilesetImage('tileset' + (i + 1), 'image-tileset' + (i + 1));
    // Creating map layer
    layer = map.createLayer('level');
    layer.resizeWorld();
    // Setting map collision
    map.setCollision(collision[currentLevel - 1]);
}
function createPlayer() {
    // Create player
    player = game.add.sprite(13, 18, 'guy');
    // Add player animation
    player.animations.add('run', [0, 1, 2, 3], 10, true);
    // Make the camera follow player
    game.camera.follow(player);
    // Enable physics on player
    game.physics.enable(player, Phaser.Physics.ARCADE);
    // Set player start position
    var start = map.objects.other[0];
    player.position.x = start.x;
    player.position.y = start.y;
    player.body.velocity.x = 100 * currentLevel;
}
function createGameOver() {
    gameOverSprite = game.add.sprite(411, 92, 'image-gameover');
    gameOverSprite.alpha = 0;
}
function createCoins() {
    coins = game.add.group();
    coins.enableBody = true;
    map.createFromObjects('coins', coinsID[currentLevel - 1], 'coin', 0, true, false, coins);
    coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
    coins.forEach(function(c){ c.body.allowGravity = false; });
}
function createSpikes() {
    spikes = game.add.group();
    spikes.enableBody = true;
    map.createFromObjects('spikes', 192, 'spike', 0, true, false, spikes);
    spikes.forEach(function(s){ s.body.allowGravity = false; });
}
function createPortal() {
    levelEnd = map.objects.other[1].x;
}
