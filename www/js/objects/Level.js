/* globals Phaser: true */

/**
 * Class containing all information about a level
 * @class Level
 * @constructor
 * @param {Number} id ID of the level
 */
function Level(id) {

    /**
     * ID of the level. Set to index of the level in the levels array, but
     * enlarged by 1
     * @property id
     * @type {Number}
     */
    this.id = id;

    this._createBackground();
    this._createMap();

    /**
     * X coordinate of the level ending
     * @property end
     * @type {Number}
     */
    this.end = this.map.objects.other[1].x;

    this._createCoins();
    this._createSpikes();
    this._setupVisibility(false);
}

/**
 * Creates the level background
 * @method _createBackground
 * @private
 */
Level.prototype._createBackground = function() {
    /**
     * Background of the level
     * @property bg
     * @type {Phaser.TileSprite}
     */
    this.bg = game.add.tileSprite(0, 0, 640, 480, 'image-background' + this.id);
    this.bg.fixedToCamera = true;
    this.bg.visible = false;
};

/**
 * Creates the level map
 * @method _createMap
 * @private
 */
Level.prototype._createMap = function() {
    /**
     * Level map
     * @property map
     * @type {Phaser.Tilemap}
     */
    this.map = game.add.tilemap('level-' + this.id);
    for(var i = 0; i < Game._scene.levels.length; ++i) {
        this.map.addTilesetImage('tileset' + (i + 1), 'image-tileset' + (i + 1));
    }

    /**
     * Map main layer
     * @property layer
     * @type {Phaser.TilemapLayer}
     */
    this.layer = this.map.createLayer('level');
    this.layer.visible = false;
    // Extracting tileset data
    var collision = [];
    this.map.tilesets.forEach(function(el) {
        var properties = el.tileProperties;
        for(var prop in properties) {
            if(properties.hasOwnProperty(prop)) {
                var number = Number(prop) + el.firstgid,
                    tile = properties[prop];
                if(tile.passable === "0") {
                    collision.push(number);
                } else if(tile.coin === "1") {
                    this._coinID = number;
                } else if(tile.spike === "1") {
                    this._spikeID = number;
                }
            }
        }
    }, this);
    this.map.setCollision(collision);
};

/**
 * Creates coins on the level
 * @method _createCoins
 * @private
 */
Level.prototype._createCoins = function() {
    /**
     * Coins on the current level
     * @property coins
     * @type {Phaser.Group}
     */
    this.coins = game.add.group();
    this.coins.enableBody = true;
};

/**
 * Creates spikes on the level
 * @method _createSpikes
 * @private
 */
Level.prototype._createSpikes = function() {
    /**
     * Spikes on the level
     * @property spikes
     * @type {Phaser.Group}
     */
    this.spikes = game.add.group();
    this.spikes.enableBody = true;
};

/**
 * Setups the level
 * @method setup
 */
Level.prototype.setup = function() {
    this.layer.resizeWorld();
    this._setupVisibility(true);
    this._setupPlayer();
    this._setupCoins();
    this._setupSpikes();
};

/**
 * Setups the player position and velocity
 * @method _setupPlayer
 * @private
 */
Level.prototype._setupPlayer = function() {
    var start = this.map.objects.other[0];
    Game._scene.player.position.x = start.x;
    Game._scene.player.position.y = start.y;
    Game._scene.player.body.velocity.x = 100 + ((this.id - 1) * 50);
    Game._scene.player.body.velocity.y = 0;
};

/**
 * Setups the visibility of level objects
 * @method _setupVisibility
 * @param {Boolean} opt The value to set the visibility to
 * @private
 */
Level.prototype._setupVisibility = function(opt) {
    this.bg.visible = opt;
    this.layer.visible = opt;
    this.coins.visible = opt;
    this.spikes.visible = opt;
};

/**
 * Setups coins on the map
 * @method _setupCoins
 * @private
 */
Level.prototype._setupCoins = function() {
    this.map.createFromObjects('coins', this._coinID, 'coin', 0, true, false, this.coins);
    this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
    this.coins.forEach(function(c) { c.body.allowGravity = false; });
};

/**
 * Setups spikes on the map
 * @method _setupSpikes
 * @private
 */
Level.prototype._setupSpikes = function() {
    this.map.createFromObjects('spikes', this._spikeID, 'spike', 0, true, false, this.spikes);
    this.spikes.forEach(function(s) { s.body.allowGravity = false; });
};

/**
 * Unloads the level when it needs to switch
 * @method unload
 */
Level.prototype.unload = function() {
    this._setupVisibility(false);
    this._unloadObjects();
};

/**
 * Unloads spikes and coins
 * @method _unloadObjects
 * @private
 */
Level.prototype._unloadObjects = function() {
    this.coins.destroy(true, true);
    this.spikes.destroy(true, true);
};

/**
 * Updates the level
 * @method update
 */
Level.prototype.update = function() {
    this._updateAnimation();
    this._updateEnd();
};

/**
 * Updates animation of the level objects
 * @method _updateAnimation
 * @private
 */
Level.prototype._updateAnimation = function() {
    this.coins.callAll('animations.play', 'animations', 'spin');
    Game._scene.player.animations.play('run');
};

/**
 * Checks if the player reached the end of the level
 * @method _updateEnd
 * @private
 */
Level.prototype._updateEnd = function() {
    if(Game._scene.player.x > this.end) {
        if(this.id === Game._scene.levels.length) {
            Game._scene.win();
        } else {
            Game._scene.changeLevel(this.id + 1);
        }
    }
};
