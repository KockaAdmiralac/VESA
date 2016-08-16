function Preloader() { throw new Error("Cannot initialize a static class!"); }

/**
 * Filesystem controller
 * @property _fs
 * @private
 * @todo Property type?
 */
Preloader._fs = require('fs');

/**
 * For preloading resources
 * @method preload
 */
Preloader.init = function() {
    this._preloadImages();
    this._preloadLevels();
    this._preloadSprites();
};

/**
 * Fetches all files from a folder
 * @method _readAssetFolder
 * @param {String} type Type of the asset folder to read
 * @return {Array} Listing of files from the folder
 */
Preloader._readAssetFolder = function(type) {
    return this._fs.readdirSync('www/assets/' + type);
};

/**
 * Preloads images
 * @method _preloadImages
 * @private
 */
Preloader._preloadImages = function() {
    var images = this._readAssetFolder('img');
    game.load.images(images.map(function(el) {
        return "image-" + el.substring(0, el.lastIndexOf("."));
    }), images.map(function getAssetFileName(name, type) {
        return 'assets/' + (typeof type === "string" ? type : "img") + "/" + name;
    }));
};

/**
 * Preloads tilemaps and creates the level array
 * @method _preloadLevels
 * @private
 */
Preloader._preloadLevels = function() {
    /**
     * Number of levels
     * @property levelsNum
     * @type {Number}
     */
    this.levelsNum = this._readAssetFolder('maps').length;
    for(var i = 1; i <= this.levelsNum; ++i) {
        game.load.tilemap('level-' + i, 'assets/maps/map' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
    }
};

/**
 * Preloads sprites used in game
 * @method _preloadSprites
 * @private
 */
Preloader._preloadSprites = function() {
    game.load.spritesheet('guy', 'assets/sprites/guy.png', 13, 18);
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 16, 16);
    game.load.spritesheet('spike', 'assets/sprites/spike.png', 12, 12);
};
