/* globals Phaser: true */
function update() {
    if(gameOver) {
        if(button.isDown) retry();
        return;
    }
    updateAnimation();
    updateCollision();
    updateInput();
    updateEnd();
}
function updateInput() {
    if (button.isDown && player.body.onFloor() && game.time.now >= jumpTimer) {
        player.body.velocity.y = -200;
        jumpTimer = game.time.now + 100;
    }
}
function updateAnimation() {
    coins.callAll('animations.play', 'animations', 'spin');
    player.animations.play('run');
}
function updateCollision() {
    game.physics.arcade.collide(player, layer, checkEnd);
    game.physics.arcade.overlap(player, coins, collectCoin, null, this);
    game.physics.arcade.overlap(player, spikes, endGame, null, this);
    if(player.y > game.height) endGame();
}
function updateEnd() {
    if(player.x > levelEnd) {
        (currentLevel === levels ? win : createLevel)(currentLevel + 1);
    }
}
function checkEnd() { if(player.body.velocity.x === 0) endGame(); }
function collectCoin(tomato, coin) {
    ++score;
    coin.kill();
}
function endGame() {
    gameOver = true;
    player.body.velocity.x = 0;
    gameOverSprite.position.x = game.camera.x + 100;
    gameOverSprite.position.y = 100;
    game.add.tween(gameOverSprite).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
}
function retry() {
    gameOver = false;
    score = 0;
    createLevel(1);
}
function win() {
    // TODO: Implement
}
function render() {
    game.debug.text("Score: " + score, 20, 20);
}
