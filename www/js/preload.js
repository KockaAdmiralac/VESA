/* globals Phaser: true */
function preload () {
    preloadImages();
    preloadLevels();
    preloadSprites();
}
function readAssetFolder(type) { return fs.readdirSync('www/assets/' + type); }
function preloadSprites() {
    game.load.spritesheet('guy', 'assets/sprites/guy.png', 13, 18);
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 16, 16);
    game.load.spritesheet('spike', 'assets/sprites/spike.png', 12, 12);
}
function preloadLevels() {
    levels = readAssetFolder('maps').length;
    for(var i = 1; i <= levels; ++i)
        game.load.tilemap('level-' + i, 'assets/maps/map' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
}
function preloadImages() {
    var images = readAssetFolder('img');
    game.load.images(images.map(function(el) { return "image-" + el.substring(0, el.lastIndexOf(".")); }), images.map(function getAssetFileName(name, type) { return 'assets/' + (typeof type === "string" ? type : "img") + "/" + name; }));
}
