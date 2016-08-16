/* globals Phaser: true */

/**
 * Constructor
 * @constructor
 * @throws {Error} when called
 */
function SceneGame() { Scene.call(this); }

SceneGame.prototype = Object.create(Scene.prototype);
SceneGame.prototype.constructor = SceneGame;

/**
 * Returns the self-method, binded to self
 * @method _method
 * @param {String} name The name of self-method
 */
SceneGame.prototype._method = function(name) {
    return this[name].bind(this);
};

/**
 * Creates scene objects
 * @method create
 */
SceneGame.prototype.create = function() {
    Scene.prototype.create.call(this);
    /**
     * Player score
     * @property score
     * @type {Number}
     */
    this.score = 0;

    /**
     * Timer when to stop the jump
     * @property jumpTimer
     * @type {Number}
     */
    this.jumpTimer = 0;

    /**
     * Array of {@link Level levels}
     * @property levels
     * @type {Array}
     */
    this.levels = new Array(Preloader.levelsNum);

    this._createInput();
    this._createPhysics();
    this._createLevels();
    this._createPlayer();
    this._createSceneGameOver();

    /**
     * Current level
     * @property level
     * @type {Level}
     */
    this.level = this.levels[0];
    this.level.setup();
};

SceneGame.prototype._createInput = function() {
    /**
     * Input button (SPACEBAR)
     * @property button
     * @type {Phaser.Key}
     */
    this.button = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addCallbacks(this, null, null, this._onPress);
};

SceneGame.prototype._onPress = function() {
    if(this.gameOver) {
        this.retry();
    }
};

/**
 * Initializes physics in game
 * @method _createPhysics
 * @private
 */
SceneGame.prototype._createPhysics = function() {
    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Set gravity
    game.physics.arcade.gravity.y = 500;
};

/**
 * Initializes the player instance and variables associated with it
 * @method _createPlayer
 * @private
 */
SceneGame.prototype._createPlayer = function() {
    /**
     * Instance of the player
     * @property player
     * @type {Phaser.Sprite}
     */
    this.player = game.add.sprite(13, 18, 'guy');
    // Add player animation
    this.player.animations.add('run', [0, 1, 2, 3], 10, true);
    // Make the camera follow player
    game.camera.follow(this.player);
    // Enable physics on player
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
};

/**
 * Creates the game over sprite and assigns a tween to it
 * @method _createSceneGameOver
 * @private
 */
SceneGame.prototype._createSceneGameOver = function() {
    /**
     * Sprite shown on game over
     * @property gameOverSprite
     * @type {Phaser.Sprite}
     */
    this.gameOverSprite = game.add.sprite(411, 92, 'image-gameover');
    this.gameOverSprite.alpha = 0;

    /**
     * Help text on retrying
     * @property retryText
     * @type {Phaser.Text}
     */
    this.retryText = game.add.text(300, 10, "Press any key except for spacebar to retry", {
        font: "16px Tahoma",
        fill: "white"
    });
    this.retryText.visible = false;
    // TODO: Dirty
    this.retryText.bringToTop();
};

/**
 * Initializes levels and sets up the first level
 * @method _createLevels
 * @private
 */
SceneGame.prototype._createLevels = function() {
    for(var i = 0; i < this.levels.length; ++i) {
        this.levels[i] = new Level(i + 1);
    }
};

/**
 * Method called on every game frame
 * @method update
 */
SceneGame.prototype.update = function() {
    if(this.gameOver) return;
    this._updateCollision();
    this._updateInput();
    this.level.update();
};

/**
 * Updates collision on the level
 * @method _updateCollision
 * @private
 */
SceneGame.prototype._updateCollision = function() {
    game.physics.arcade.collide(this.player, this.level.layer, this._method('checkEnd'));
    game.physics.arcade.overlap(this.player, this.level.coins,this._method('collectCoin'), null, this);
    game.physics.arcade.overlap(this.player, this.level.spikes, this._method('endSceneGame'), null, this);
    if(this.player.y > game.height) {
        this.endSceneGame();
    }
};

/**
 * Updates player's jump based on the spacebar button state
 * @method _updateInput
 * @private
 */
SceneGame.prototype._updateInput = function() {
    if(this.button.isDown && this.player.body.onFloor() && game.time.now >= this.jumpTimer) {
        this.player.body.velocity.y = -200;
        this.jumpTimer = game.time.now + 100;
    }
};

/**
 * Retries the game
 * @method retry
 */
SceneGame.prototype.retry = function() {
    this.gameOver = false;
    this.gameOverTween.stop();
    this.gameOverSprite.visible = false;
    this.gameOverSprite.alpha = 0;
    this.retryText.visible = false;
    this.score = 0;
    this.changeLevel(1);
};

/**
 * Checks if player has stopped running
 * @method checkEnd
 */
SceneGame.prototype.checkEnd = function() {
    if(this.player.body.velocity.x === 0) {
        this.endSceneGame();
    }
};

/**
 * Called when a coin and player collide
 * @method collectCoin
 * @param {Phaser.Sprite} potato Useless reference to the player
 * @param {Phaser.Sprite} coin Reference to the coin being collected
 */
SceneGame.prototype.collectCoin = function(potato, coin) {
    ++this.score;
    coin.kill();
};

/**
 * Called when player dies (not literally)
 * @method endSceneGame
 */
SceneGame.prototype.endSceneGame = function() {
    this.gameOver = true;
    this.gameOverSprite.visible = true;
    this.player.body.velocity.x = 0;
    /**
     * Tween affecting the game over sprite
     * @property gameOverTween
     * @type {Phaser.Tween}
     */
    this.gameOverTween = game.add.tween(this.gameOverSprite).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    this.gameOverTween.onComplete.add(this._tweenComplete, this);
    this.gameOverSprite.position.x = game.camera.x + 100;
    this.gameOverSprite.position.y = 100;
};

SceneGame.prototype._tweenComplete = function() {
    this.retryText.visible = true;
};

/**
 * Changes the current level
 * @method changeLevel
 * @param {Number} id The ID of the level to change to
 */
SceneGame.prototype.changeLevel = function(id) {
    this.level.unload();
    this.level = this.levels[id - 1];
    this.level.setup();
};

/**
 * Called when game is won
 * @method win
 * @todo Implement!
 */
SceneGame.prototype.win = function() {
    temp("Yay");
};

/**
 * Called every frame to render game objects
 * @method render
 */
SceneGame.prototype.render = function() {
    game.debug.text("Score: " + this.score, 20, 20);
};

/**
 * Gets the game's main methods
 * @method getMainMethods
 * @return {Object} Object containing main methods
 */
SceneGame.prototype.getMainMethods = function() {
    return {
        preload: this._method('preload'),
        create: this._method('create'),
        update: this._method('update'),
        render: this._method('render')
    };
};
